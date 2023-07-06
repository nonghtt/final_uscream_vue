<template>
    <div class="Sidebar">

        <div class="head_ul">
            <div class="readmsg">
                <div>읽지 않은 메일</div>
                <div>{{ read }}</div>
            </div>
            <div class="markmsg" v-on:click="markmsg()">
                <div>즐겨 찾기</div>
                <div>{{ mark }}</div>
            </div>
        </div>

        <div class="menu_bar">

   
        <ul v-on:click="receivemsg">
            <ul v-if="this.clickmsg[0] === 1" class="select_bar">
                <img class="sidebar_icon" src="../assets/receivemsgon.svg"><span class="select_menu">받은 메세지</span>
            </ul>
            <ul v-else class="select_bar">
                <img class="sidebar_icon" src="../assets/receivemsg.svg">받은 메시지
            </ul>
        </ul>
        <ul v-on:click="addmsg" >
            <ul v-if="this.clickmsg[1] === 1" class="select_bar">
                <img class="sidebar_icon" src="../assets/addmsgon.svg"><span class="select_menu">메시지 작성</span>
            </ul>
            <ul v-else class="select_bar">
                <img class="sidebar_icon" src="../assets/addmsg.svg">메시지 작성
            </ul>
        </ul>

        <ul v-on:click="sendmsg">
            <ul v-if="this.clickmsg[2] === 1" class="select_bar">
                <img class="sidebar_icon" src="../assets/sendmsgon.svg"><span class="select_menu">보낸 메시지</span>
            </ul>
            <ul v-else class="select_bar">
                <img class="sidebar_icon" src="../assets/sendmsg.svg">보낸 메시지
            </ul>
        </ul>

        <ul v-on:click="tempmsg">
            <ul v-if="this.clickmsg[3] === 1" class="select_bar">
                <img class="sidebar_icon" src="../assets/tempmsgon.svg"><span class="select_menu">임시보관</span>
            </ul>
            <ul v-else class="select_bar">
                <img class="sidebar_icon" src="../assets/tempmsg.svg"><span>임시보관</span>
            </ul>
        </ul>

        <ul v-on:click="delmsg">
            <ul v-if="this.clickmsg[4] === 1" class="select_bar">
                <img class="sidebar_icon" src="../assets/delmsgon.svg"><span class="select_menu">휴지통</span>
            </ul>
            <ul v-else class="select_bar">
                <img class="sidebar_icon" src="../assets/delmsg.svg">휴지통
            </ul>
        </ul>
    </div>
    </div>
</template>

<script>

export default {
    name: 'SideBar',
    data() {
        return {
            read: 0,
            mark: 0,
            clickmsg: [4]
        }
    },
    created: function () {
        const self = this;
        let id = sessionStorage.getItem("loginId");

        self.$axios.get("http://localhost:8085/msg/sidebar/" + id)
            .then(function (res) {
                self.read = res.data.countSideBarReadMsg;
                self.mark = res.data.countSideBarMarkMsg;
            })
    },
    methods: {

        receivemsg() {
            this.clickmsg = [];
            this.clickmsg[0] = 1;
            this.$router.push({ name: 'ReceiveMsg' });
        },
        addmsg() {
            this.clickmsg = [];
            this.clickmsg[1] = 1;
            this.$router.push({ name: 'AddMsg' });
        },
        sendmsg() {
            this.clickmsg = [];
            this.clickmsg[2] = 1;
            this.$router.push({ name: 'SendMsg' });
        },
        tempmsg() {
            this.clickmsg = [];
            this.clickmsg[3] = 1;
            this.$router.push({ name: 'TempMsg' });
        },
        delmsg() {
            this.clickmsg = [];
            this.clickmsg[4] = 1;
            this.$router.push({ name: 'DelMsg' });
        },
        markmsg() {
            this.clickmsg = [];
            this.$router.push({ name: 'MarkMsg' });
        }
    }
}


</script>

<style scoped>
/* .SideBar{
    margin-top: 3%;
   
    
} */

.sidebar_icon {
    width: 20px;
    height: 25px;
    margin-left: 3px;
    margin-right: 3px;
}

.head_ul {
    margin-top: 30px;
    margin-bottom: 15px;
    display: flex;

}

.readmsg {
    display: inline-block;
    width: 50%;
    text-align: center;
}

.markmsg {
    display: inline-block;
    width: 50%;
    text-align: center;

}

ul {
    margin-top: 1%;
    margin-bottom: 1%;
    
}

.menu_bar{
    text-align: middle;
}

.select_bar{
    height:30px;
    margin-top: 10px;
    margin-bottom: 10px
}
.select_bar:hover{
    background-color: rgb(199, 247, 196);
}
.select_menu{
    border-color:#04ac4e;
    color:#04ac4e;
    background-color: rgb(251, 253, 252);
}
</style>