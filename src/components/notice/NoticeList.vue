<template>
    <div class="container">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span class="font-weight-bold">공지사항</span>
                <button v-if="accounttype === '1'" class="btn btn-primary btn-sm">
                    <router-link v-if="accounttype === '1'" class="btn btn-primary btn-sm"
                        :to="{ path: '/NoticeWriter' }">등록</router-link>
                </button>
            </div>

            <div class="card-body">
                <div class="row mb-3">
                    <div class="col">
                        <select class="form-select" v-model="schbox">
                            <option value="" disabled selected>검색조건</option>
                            <option value="noticenum">글번호</option>
                            <option value="category">분류</option>
                            <option value="title">제목</option>
                        </select>
                    </div>
                    <div class="col" v-if="schbox === 'category'">
                        <div class="input-group">
                            <select class="form-select" v-model="categoryVal">
                                <option value="1">칭찬</option>
                                <option value="2">불만</option>
                            </select>
                            <button type="button" class="btn btn-primary" @click="getBoardList">검색</button>
                        </div>
                    </div>
                    <div class="col" v-else>
                        <div class="input-group">
                            <input v-model="schVal" type="text" class="form-control" placeholder="검색어"
                                @keypress.enter.prevent="getBoardList" />
                            <button type="button" class="btn btn-primary" @click="getBoardList">검색</button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th style="text-align: center;">글번호</th>
                                    <th style="text-align: center;">분류</th>
                                    <th style="text-align: center;">제목</th>
                                    <th style="text-align: center;">작성일</th>
                                    <th style="text-align: center;">조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in displayedList" :key="item.noticenum" @click="detail(item)"
                                    style="cursor: pointer;">
                                    <td class="text-center">{{ item.noticenum }}</td>
                                    <td class="text-center">{{ getCategoryText(item.category) }}</td>
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
                                <button class="btn btn-primary" @click="prevPage" :disabled="currentPage === 1">이전</button>
                            </div>
                            <div class="col text-end">
                                <button class="btn btn-primary" @click="nextPage"
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
            categoryVal: "", // 추가: 칭찬/불만 선택값을 저장하기 위한 변수
            currentPage: 1, // 추가: 현재 페이지 번호
            itemsPerPage: 10, // 추가: 페이지 당 출력할 게시물 수
        };
    },
    created: function () {
        if (this.accounttype == 1) {
            this.getBoardList(); // 추가: 페이지가 생성될 때 공지사항 리스트를 가져옴
        } else if (this.accounttype == 2) {
            const self = this;
            self.$axios.get("http://localhost:8085/notices/" + parseInt(self.store)).then(function (res) {
                self.noticelist = res.data.list;
                console.log(res.data.list);
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
            this.$router.push({
                name: "NoticeDetail",
                query: {
                    noticenum: item.noticenum,
                    category: item.category,
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
                    case "category":
                        if (this.categoryVal !== "") {
                            if (this.categoryVal === "1" || this.categoryVal === "2") {
                                url += `/schctg/${this.categoryVal}`;
                            }
                        }
                        break;
                    case "title":
                        url += `/schtit/${this.schVal}`;
                        break;
                    default:
                        break;
                }
            } else if (this.schbox === "category" && this.categoryVal !== "") {
                url += `/schctg/${this.categoryVal}`;
            }

            console.log(url);

            const self = this;
            self.$axios.get(url).then(function (res) {
                if (res.data.list) {
                    self.noticelist = res.data.list;
                } else if (res.data.notice) {
                    self.noticelist = [res.data.notice];
                }
            });
        },
        getCategoryText(category) {
            if (category === 1) {
                return "칭찬";
            } else if (category === 2) {
                return "불만";
            }
            return "";
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
