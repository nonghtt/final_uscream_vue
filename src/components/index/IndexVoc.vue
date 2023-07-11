<template>
    <div id="container">
        <h3>고객의 소리</h3>
        <div style="width:100%">
            <div v-if="accounttype == 1" class="content">
                <table class="table table-striped" v-if="voclist.length>0">
                    <thead>
                        <tr>
                            <th scope="col">분류</th>
                            <th scope="col">제목</th>
                            <th scope="col">작성 날짜</th>
                            <th scope="col">지점</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in voclist" :key="item.vocnum">
                            <td>{{ item.category }}</td>
                            <td>{{ item.title }}</td>
                            <td>{{ item.wdate }}</td>
                            <td>{{ item.storeid.storename }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-else id="vocnone">
                    <div id="vocnonecontent"> 
                        글이 존재하지 않습니다.
                    </div>
                   
                </div>
            </div>

            <div v-if="accounttype == 2" class="content">
                <table class="table table-striped" v-if="voclist.length>0">
                    <thead>
                        <tr>
                            <th scope="col">분류</th>
                            <th scope="col">제목</th>
                            <th scope="col">작성 날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in voclist" :key="item.vocnum">
                            <td>{{ item.category }}</td>
                            <td>{{ item.title }}</td>
                            <td>{{ item.wdate }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-else id="vocnone">
                    <div id="vocnonecontent"> 
                        글이 존재하지 않습니다.
                    </div>
                   
                </div>
            </div>

            <!-- 라우터 링크 넣어주세요~! -->
            <button class="btn" id="btncolor" @click="add">더보기</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'IndexVoc',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            accounttype: sessionStorage.getItem("accounttype"),
            voclist: [],
        }
    },
    created: function () {
        if(this.accounttype==1){
            this.getThree();
        } else {
            this.getThreeStoreid(this.id);
        }
    },
    methods: {
        getThree() {
            const self = this;
            self.$axios.get('http://localhost:8085/vocs/three')
                .then(function (res) {
                    if (res.status == 200 & res.data.flag) {
                        self.voclist = self.chageTime(res.data.list);
                    }
                })
        },
        getThreeStoreid(storeid){
            const self = this;
            self.$axios.get(`http://localhost:8085/vocs/three/${storeid}`)
                .then(function (res) {
                    if (res.status == 200 & res.data.flag) {
                        self.voclist = self.chageTime(res.data.list);
                    }
                })
        },
        chageTime(list) {
            for (let i = 0; i < list.length; i++) {
                list[i].wdate = list[i].wdate.slice(0, 10)
                if (list[i].category == 1) {
                    list[i].category = '칭찬';
                } else {
                    list[i].category = '불만';
                }
            }
            return list
        },
        add(){
            location.href='/VocList'        
        }
    }
}
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
    margin-top: 3px;
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
    border: none;
    padding: 5px 10px;

}

#vocnone{
    height: 23vh;
}

#vocnonecontent{
    padding-top:20px;
}
</style>