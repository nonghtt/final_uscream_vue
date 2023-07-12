<template>
    <div id="container">
        <h4>공지사항</h4>
        <div style="width: 100%">
            <div>
                <div class="container" style="padding: 24px;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="text-align: center;">글번호</th>
                                <th style="text-align: center;">제목</th>
                                <th style="text-align: center;">조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in noticelist" :key="item.noticenum" style="cursor: pointer;">
                                <td class="text-center">{{ item.noticenum }}</td>
                                <td class="text-center">{{ item.title }}</td>
                                <td class="text-center">{{ item.cnt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- 라우터 링크 넣어주세요~! -->
            <button class="btn" id="btncolor" @click="movePage('/NoticeList')"> 더보기 </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'IndexNotice',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            accounttype: sessionStorage.getItem("accounttype"),
            noticelist: [],
        }
    },
    created: function () {
        const self = this;
        self.$axios.get("http://localhost:8085/notices/three").then(function (res) {
            if (res.data.list) {
                
                //self.noticelist = res.data.list;
                //console.log(self.noticelist)

                let list = res.data.list;
                for(let i=0;i<list.length;i++){
                    if(list[i].title.length>40){
                        list[i].title = list[i].title.slice(0, 40) + ' ··· ';
                    }
                }

                self.noticelist = list;
            } else if (res.data.notice) {
                self.noticelist = [res.data.notice];
            }
        });

    },
    methods: {
        formatDate(dateString) {
            const formattedDate = dateString.substring(0, 10);
            return formattedDate;
        },
        getBoardList() {
            console.log(this.schbox, this.schVal);
            let url = "http://localhost:8085/notices/three";

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
        movePage(url) {
            this.$router.push(url);
        },
    },
};
</script>

<style scoped>
#container {
    margin: 10px 10px;
    text-align: center;
    overflow: hidden;
    /* 이 위는 바꾸지 마세요~ */
}

.content {
    margin-top: 5px;
    overflow: auto;
    max-height: 12em;
    /* 이 위는 바꾸지 마세요~ */
}

#btncolor:hover {
    background-color: #FFC67B;
    color: #595959
}

#btncolor {
    margin-top: 5px;
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
    border: none;
    padding: 5px 10px;
}
</style>