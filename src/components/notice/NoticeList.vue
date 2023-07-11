<template>
    <div class="wrapper" style="padding: 40px;">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span class="font-weight-bold">공지사항</span>
                <button v-if="accounttype === '1'" class="btn btncolor">
                    <router-link v-if="accounttype === '1'" class="btn btncolor"
                        :to="{ path: '/NoticeWriter' }">등록</router-link>
                </button>
            </div>

            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-6">
                        <select class="form-select" v-model="schbox" style="width: 40%; margin-left: 30px;">
                            <option value="" disabled selected>검색조건</option>
                            <option value="noticenum">글번호</option>
                            <option value="title">제목</option>
                        </select>
                    </div>
                    <div class="col">
                        <div class="input-group">
                            <input v-model="schVal" type="text" class="form-control " placeholder="검색어"
                                @keypress.enter.prevent="getBoardList" />
                            <button type="button" class="btn btncolor" @click="getBoardList">검색</button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th style="text-align: center;">글번호</th>
                                    <th style="text-align: center;">제목</th>
                                    <th style="text-align: center;">작성일</th>
                                    <th style="text-align: center;">조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in displayedList" :key="item.noticenum" @click="detail(item)"
                                    style="cursor: pointer;">
                                    <td class="text-center">{{ item.noticenum }}</td>
                                    <td class="text-center">{{ item.title }}</td>
                                    <td class="text-center">{{ formatDate(item.wdate) }}</td>
                                    <td class="text-center">{{ item.cnt }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col">
                        <div class="row">
                            <div class="col">
                                <button class="btn btncolor" @click="prevPage" :disabled="currentPage === 1">이전</button>
                            </div>
                            <div class="col text-end">
                                <button class="btn btncolor" @click="nextPage"
                                    :disabled="currentPage === totalPages">다음</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
export default {
    name: "NoticeList",
    data() {
        return {
            noticelist: [],
            dto: null,
            title: [],
            accounttype: sessionStorage.getItem("accounttype"),
            store: sessionStorage.getItem("loginId"),
            schbox: "", // 추가: 검색 조건 선택값을 저장하기 위한 변수
            schVal: "", // 추가: 검색어 입력값을 저장하기 위한 변수
            currentPage: 1, // 추가: 현재 페이지 번호
            itemsPerPage: 10, // 추가: 페이지 당 출력할 게시물 수
        };
    },
    created: function () {
        if (this.accounttype == 1) {
            this.getBoardList(); // 추가: 페이지가 생성될 때 공지사항 리스트를 가져옴
        } else if (this.accounttype == 2) {
            const self = this;
            self.$axios.get("http://localhost:8085/notices").then(function (res) {
                if (res.data.list) {
                    self.noticelist = res.data.list;
                } else if (res.data.notice) {
                    self.noticelist = [res.data.notice];
                }
            });
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.noticelist.length / this.itemsPerPage);
        },
        displayedList() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.noticelist.slice(start, end);
        },
    },
    methods: {
        detail(item) {
            let name = '';
            if (this.accounttype == 1) {
                name = 'HeadNotice';
            } else if (this.accounttype == 2) {
                name = 'StoreNotice';
            }
            this.$router.push({
                name,
                query: {
                    noticenum: item.noticenum,
                    title: item.title,
                    wdate: item.wdate,
                    cnt: item.cnt,
                },
            });
        },
        formatDate(dateString) {
            const formattedDate = dateString.substring(0, 10);
            return formattedDate;
        },
        getBoardList() {
            console.log(this.schbox, this.schVal);
            let url = "http://localhost:8085/notices";

            if (this.schbox && this.schVal) {
                switch (this.schbox) {
                    case "noticenum":
                        url += `/schid/${this.schVal}`;
                        break;
                    case "title":
                        url += `/schtit/${this.schVal}`;
                        break;
                    default:
                        break;
                }
            }
            console.log(url);
            const self = this;
            self.$axios.get(url).then(function (res) {
                if (res.data.list) {
                    self.noticelist = res.data.list;
                } else if (res.data.notice) {
                    self.noticelist = [res.data.notice];
                }
                // 최신순으로 정렬
                self.noticelist.sort((a, b) => {
                    return new Date(b.wdate) - new Date(a.wdate);
                });
            });
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
    },
};
</script>

<style scoped>
.btncolor:hover {
    background-color: #FFC67B;
    color: #595959;
}

.btncolor {
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
    margin-top: 5px;
    margin-bottom: 5px;
}
.wrapper {
    max-width: 1200px;
    margin: 0 auto; /* 가운데 정렬을 위한 설정 */
}

.form-control{
    height : 80%;
}
</style>
