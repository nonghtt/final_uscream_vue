<template>
    <div class="container">
        <div class="card"
            style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0; width: 100%; margin: 0 auto;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 20px;">공지사항</span>
                <button type="button" v-if="accounttype == '1'" class="col">
                    <router-link class="writebtn" to="/NoticeWriter"
                        style="background-color: #8eb443; border-color:#8eb443;">등록</router-link>
                </button>
            </div>

            <div class="card-body">
                <div class="row mb-3">
                    <div class="col2">
                        <select class="form-select" v-model="schbox">
                            <option value="" disabled selected>검색조건</option>
                            <option value="noticelist">전체목록</option>
                            <option value="noticenum">글번호</option>
                            <option value="category">분류</option>
                            <option value="title">제목</option>
                        </select>
                    </div>
                    <div class="col3">
                        <input v-model="schVal" type="text" class="schText" placeholder="검색어" @keypress.enter.prevent="getBoardList" />
                    </div>
                    <div class="col2">
                        <button type="button" class="schbtn" @click="getBoardList">
                            검색
                        </button>
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
                                <tr v-for="item in noticelist" :key="item.noticenum" @click="detail(item)" style="cursor: pointer;">
                                    <td class="text-center">{{ item.noticenum }}</td>
                                    <td class="text-center">{{ item.category }}</td>
                                    <td class="text-center">{{ item.title }}</td>
                                    <td class="text-center">{{ formatDate(item.wdate) }}</td>
                                    <td class="text-center">{{ item.cnt }}</td>
                                </tr>

                            </tbody>
                        </table>
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
        };
    },
    created: function () {
        if (this.accounttype == 1) {
            this.getBoardList(); // 추가: 페이지가 생성될 때 공지사항 리스트를 가져옴
        } else if (this.accounttype == 2) {
            const self = this;
            self.$axios.get("http://localhost:8085/notices" + parseInt(self.store)).then(function (res) {
                self.noticelist = res.data.list;
                console.log(self.noticelist);
            });
        }
    },
    methods: {
        detail(item) {
            this.$router.push({
                name: "NoticeDetail",
                query: { storeid: item.storeid, noticedate: item.noticedate },
            });
        },
        formatDate(dateString) {
            const formattedDate = dateString.substring(0, 10);
            return formattedDate;
        },
        getBoardList() {
            let url = "http://localhost:8085/notices";

            if (this.schbox && this.schVal) {
                switch (this.schbox) {
                    case "noticenum":
                        url += `/schid/${this.schVal}`;
                        break;
                    case "category":
                        url += `/schctg/${this.schVal}`;
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
                if (res.data.list && self.schbox && self.schVal) {
                    self.noticelist = res.data.list;
                    //self.noticelist = res.data.list.filter((item) => item[self.schbox].toLowerCase().includes(self.schVal.toLowerCase()));
                } else if (res.data.list) {
                    self.noticelist = res.data.list;
                } else if (res.data.notice) {
                    self.noticelist = [res.data.notice];  // 단일 객체를 배열로 감싸서 할당
                }
            });
        },
    },
};
</script>

<style scoped>
.orderbtn {
    text-decoration: none;
    color: black;
}

* {
    text-align: center;
}
</style>
