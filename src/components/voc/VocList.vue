<template>
            <div class="wrapper" style="padding: 40px;">
            <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span class="font-weight-bold">고객의소리</span>
                <button v-if="accounttype === '1'">
                <router-link v-if="accounttype === '1'" class="btn savebtn" :to="{ path: '/VocWriter' }">등록</router-link>
                </button>
            </div>

            <div class="card-body">
                <div class="row mb-3" style="display:flex; flex-direction: row; align-items:center">
                <div class="col-6">
                    <select class="form-select" v-model="schbox" style="width: 40%; margin-left: 176px; margin-top: 21px;">
                    <option value="" disabled selected>검색조건</option>
                    <option value="category">분류</option>
                    </select>
                </div>
                <div class="col">
                    <div class="input-group">
                    <template v-if="schbox === 'category'">
                        <select class="form-select" v-model="categoryVal">
                        <option value="1">칭찬</option>
                        <option value="2">불만</option>
                        </select>
                    </template>
                    <template v-else>
                        <input v-model="schVal" type="text" class="form-control" placeholder="검색어" @keypress.enter.prevent="getBoardList" style="height: 30%; margin-left: -168px;"/>
                    </template>
                    <button type="button" class="btn btncolor" @click="getBoardList">검색</button>
                    </div>
                </div>
                </div>
                <div class="row">
                <div class="col">
                    <table class="table">`
                            <thead>
                                <tr>
                                    <th style="text-align: center;">글번호</th>
                                    <th style="text-align: center;">분류</th>
                                    <th style="text-align: center;">제목</th>
                                    <th style="text-align: center;">작성일</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in displayedList" :key="item.vocnum" @click="detail(item)"
                                    style="cursor: pointer;">
                                    <td class="text-center">{{ item.vocnum }}</td>
                                    <td class="text-center">{{ getCategoryText(item.category) }}</td>
                                    <td class="text-center">{{ item.title }}</td>
                                    <td class="text-center">{{ formatDate(item.wdate) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col">
                            <div class="row">
                                <div class="col" style="padding-left: 61px; padding-bottom: 17px;">
                                    <button class="btn btncolor" @click="prevPage" :disabled="currentPage === 1">이전</button>
                                </div>
                                <div class="col text-end" style="padding-right: 61px; padding-bottom: 17px;">
                                    <button class="btn btncolor" @click="nextPage" :disabled="currentPage === totalPages">다음</button>
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
    name: "VocList",
    data() {
        return {
            voclist: [],
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
            self.$axios.get("http://localhost:8085/vocs").then(function (res) {
                if (res.data.list) {
                    self.voclist = res.data.list;
                } else if (res.data.voc) {
                    self.voclist = [res.data.voc];
                }
            });
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.voclist.length / this.itemsPerPage);
        },
        displayedList() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.voclist.slice(start, end);
        },
    },
    methods: {
        detail(item) {
            let name = '';
            if (this.accounttype == 1) {
                name = 'HeadVoc';
            } else if (this.accounttype == 2) {
                name = 'StoreVoc';
            }
            console.log(item.vocnum)

            this.$router.push({
                name,
                query: {
                    vocnum: item.vocnum,
                    category: item.category,
                    title: item.title,
                    wdate: item.wdate,
                },
            });
        },
        formatDate(dateString) {
            const formattedDate = dateString.substring(0, 10);
            return formattedDate;
        },
        getBoardList() {
            let url = "http://localhost:8085/vocs";

            if (this.schbox && this.schVal) {
                switch (this.schbox) {
                    case "vocnum":
                        url += `/schid/${this.schVal}`;
                        break;
                    case "category":
                        if (this.categoryVal !== "") {
                            url += `/schctg/${this.categoryVal}`;
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
                    self.voclist = res.data.list;
                } else if (res.data.voc) {
                    self.voclist = [res.data.voc];
                }
                // 최신순으로 정렬
                self.voclist.sort((a, b) => {
                    return new Date(b.wdate) - new Date(a.wdate);
                });
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
        changePage(page) {
            this.currentPage = page;
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
}

.savebtn {
    color: #595959;
    font-weight: bolder;
}

.wrapper {
    max-width: 1200px;
    margin: 0 auto;
    /* 가운데 정렬을 위한 설정 */
}

.form-control {
    height: 80px;
}

.input-group {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    margin-top: 21px;
    margin-right: 163px;
}
</style>

<style>
.form-select,
.input-group input:focus,
.input-group select:focus,
.input-group button:focus {
    outline: none !important;
    box-shadow: none !important;
}
</style>
