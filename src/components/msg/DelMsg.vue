<template>
    <div class="sidebar_container">

        <SideBar />
    </div>
    <div class="container">

        <div class="topbar">
            <span>
                <h4> 휴지통 </h4>
            </span>
            <span>
                <h4> {{ count }} / {{ countall }} </h4>
            </span>

        </div>
        <div class="middlebar_container">
            <div class="middlebar">
                <input type="button" class="but f btncolor" value="메일 작성" v-on:click="addmsg()">
                <input type="button" class="but btncolor" value="영구삭제" v-on:click="delmsg()">
                <input type="button" class="but btncolor" value="즐찾" v-on:click="marklist()">
                <input type="button" class="but btncolor" value="읽음" v-on:click="readlist()">
                <input type="button" class="but e btncolor" value="비우기" v-on:click="delallmsg()">
            </div>
            <div class="searchbar">
                <form>
                    <input type="text" class="textbar" name="searchbar" placeholder="메일 검색" autocomplete="off">
                    <input type="submit" class="but f e btncolor" value="검색">
                </form>
            </div>
        </div>
        <div class="null_div" v-if="list == ''">메일이 없습니다.</div>
        <table v-else class="main">
            <tr v-for="(msg, index) in list" :key="index">

                <td class="check">
                    <input type="checkbox" class="checkbox_icon" v-model="checked[index]" @change="checklist(msg.msgnum)">
                    <img class="lcon" :src="markimg" v-if="msg.mark == 1" v-on:click="mark(msg.msgnum)">
                    <img class="lcon" :src="markimg2" v-else v-on:click="mark(msg.msgnum)">


                    <img class="lcon" :src="readimg" v-if="msg.readcheck == 1" v-on:click="read(msg.msgnum)">
                    <img class="lcon" :src="readimg2" v-else v-on:click="read(msg.msgnum)">

                </td>
                <td :class="{ 'bold': msg.readcheck === true}">{{ msg.sender.storeid }}</td>
                <td v-on:click="detail(msg.msgnum)" :class="{ 'bold': msg.readcheck === true}">{{ msg.title }}</td>
                <td :class="{ 'bold': msg.readcheck === true}">{{ msg.msgdate }}</td>
            </tr>
        </table>
    </div>
</template>
    
<script>
import SideBar from '@/views/SideBar.vue'
export default {
    name: "DelMsg",
    components: { SideBar },
    data() {
        return {
            list: [],
            countall: 0,
            count: 0,
            markimg: require("../../assets/staron.png"),
            markimg2: require("../../assets/starnomal.png"),
            readimg: require("../../assets/msgnoread.png"),
            readimg2: require("../../assets/msgread.png"),
            checkedmsg: [],
            checked: [],
            num: [],
            clickmsg: []
        }
    },
    created: function () {
        const self = this;
        let id = sessionStorage.getItem("loginId");
        self.$axios.get("http://localhost:8085/msg/del/" + id + "/" + id)
            .then(function (res) {
                self.list = res.data.msglist;
                self.count = res.data.countAllByDelAndReadMsg;
                self.countall = res.data.countAllByDelMsg;
            })
    },
    methods: {
        checklist() {
            this.checkedmsg = [];
            for (let i = 0; i < this.checked.length; i++) {
                if (this.checked[i]) {
                    this.checkedmsg.push({
                        num: this.list[i].msgnum
                    })
                }
            }
        },
        marklist() {

            const self = this;
            for (let i = 0; i < this.checkedmsg.length; i++) {
                const num = this.checkedmsg[i].num;
                self.$axios.patch("http://localhost:8085/msg/mark/check/" + num)
            }
            window.location.reload();
        },
        mark(num) {
            const self = this
            self.$axios.patch("http://localhost:8085/msg/mark/check/" + num)
            window.location.reload();
        },
        readlist() {
            const self = this;
            for (let i = 0; i < this.checkedmsg.length; i++) {
                const num = this.checkedmsg[i].num;
                self.$axios.patch("http://localhost:8085/msg/read/check/" + num)
            }
            window.location.reload();
        },
        read(num) {
            const self = this
            self.$axios.patch("http://localhost:8085/msg/read/check/" + num)
            window.location.reload();
        },
        delmsg() {
            const self = this
            for (let i = 0; i < this.checkedmsg.length; i++) {
                const num = this.checkedmsg[i].num;
                self.$axios.delete("http://localhost:8085/msg/del/" + num)
            }
            window.location.reload();
            self.$router.push({ name: 'DelMsg' })
        },

        detail(num) {
            const self = this
            self.$axios.patch("http://localhost:8085/msg/read/detail/check/" + num)
            self.$router.push({ name: 'DetailMsg', query: { 'num': num } })
        },
        addmsg() {
            this.$router.push({ name: 'AddMsg' });
        },
        delallmsg() {
            const self = this;
            let id = sessionStorage.getItem("loginId");
            let result = confirm("정말로 삭제하시겠습니까?");
        
        
            if (result) {
                self.$axios.delete("http://localhost:8085/msg/del/all/" + id)
                    .then(function (res) {
                        self.number = res.data.number;
                        self.flag = res.data.flag;

                        if (self.number == 0) {
                            alert("삭제할 메일이 없습니다.");
                        } else {
                            alert(self.number + "개의 메일 삭제");
                        }
                    })

            } else {
                alert("취소");
            }
            self.$router.push({ name: 'DelMsg' });
        }
    }
}
</script>
    
    
    
    
<style scoped>
.sidebar_container {
    display: inline-block;
    width: 300px;
    text-align: left;
    border-right: 1px solid black;
    background-color: whitesmoke;
    height: 770px;
}


h3 {
    font-size: large;
}

.container {
    margin: 5px 5px 5px 5px;
}

.topbar {
    text-align: center;
    margin-top: 2%;
    margin-bottom: 2%;

}

/* middlebar_container{
    
    
} */
.middlebar {
    display: inline-block;
    margin-bottom: 10px;
}

.searchbar {
    float: right;

    display: inline-block;
}

.null_div {
    margin-top: 20px;
    text-align: center;
    font-size: 25px;
}

.main {
    width: 100%;
    text-align: center;
}

table {
    border-radius: 6px;
}

tr {
    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

td {
    padding-top: 7px;
    padding-bottom: 12px;
}

td:nth-child(1) {
    width: 20%;
}

td:nth-child(2) {
    width: 15%;
    text-align: left;
}

td:nth-child(3) {
    width: 50%;
    text-align: left;
}

td:nth-child(4) {
    width: 15%;
}

.check {
    display: flex;
    align-items: center;
    width: 40px;
}


.lcon {
    width: 20px;
    height: 30px;
    margin-left: 20px;
    margin-right: 8px;
}

.checkbox_icon {
    zoom: 1.5;
}


.btncolor:hover{
  background-color: #04ac4e;
  color:#fefefe;
}
.btncolor{
    color:#fefefe;
    background-color: #03c75a;
    font-weight: 550 ;
    padding : 5px 10px;
    width : 100px;
}
.but {
    border:none;
    border-right: 2px solid rgba(0, 49, 9, 0.108);
}

.f{
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px; 
}

.e{
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px; 
}

.textbar{
    border-radius: 5px;
    width:250px;
    border-color: #EAEAEA;
}

.textbar:hover{
    border-color: black;
}
.bold {
  font-weight: bold;
}

</style>
    