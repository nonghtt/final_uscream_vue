<template>
    <div class="full_container">
    <div class="sidebar_container shadow">
        <SideBar />
    </div>
    <div class="container">
        <div class="topbar">
            <span>
                <h10 class="head_text"> 보낸 메일함 </h10>
            </span>
            <span>
                <h10> {{ count }} / {{ countall }} </h10>
            </span>
        </div>
        <div class="middlebar_container" style="border-bottom: 1px solid;">
            <div class="middlebar">
                <input type="button" class="but f btncolor" value="휴지통으로" v-on:click="delmsg()">
                <input type="button" class="but btncolor" value="즐겨찾기" v-on:click="marklist()">
                <input type="button" class="but e btncolor" value="읽음" v-on:click="readlist()">
            </div>
            <div class="searchbar">
                <input type="text" class="textbar" name="searchbar" id="searchbar" placeholder="받은 사람으로 검색"
                    autocomplete="off">
                <input type="submit" class="but f e btncolor" value="검색" v-on:click="sendermsgsearch()">
            </div>
        </div>
        <div class="null_div" v-if="list==''">메일이 없습니다.</div>
        <div class="scroll">

            <table v-if="paginatedData.length > 0" class="main">
                <tr v-for="(msg, index) in paginatedData" :key="index">
                    <td class="check">
                        <input type="checkbox" class="checkbox_icon" v-model="checked[index]"
                            @change="checklist(msg.msgnum)">
                        <img class="lcon" :src="markimg" v-if="msg.mark == 1" v-on:click="mark(msg.msgnum)">
                        <img class="lcon" :src="markimg2" v-else v-on:click="mark(msg.msgnum)">
                        <img class="lcon" :src="readimg" v-if="msg.readcheck == 1" v-on:click="read(msg.msgnum)">
                        <img class="lcon" :src="readimg2" v-else v-on:click="read(msg.msgnum)">
                    </td>
                    <td :class="{ 'bold': msg.readcheck === true }">{{ msg.receiver.managername }}</td>
                    <td v-on:click="detail(msg.msgnum)" :class="{ 'bold': msg.readcheck === true }" @mouseover="changeCursor">
                        <span>{{ truncateTitle(msg.title, 30) }}</span>
                    </td>
                    <td :class="{ 'bold': msg.readcheck === true }">{{ msg.msgdate }}</td>
                </tr>
            </table>
        </div>
        <div class="pagination">
            <button :disabled="currentPage === 1" @click="prevPage">이전</button>
            <div v-for="pageNumber in totalPages" :key="pageNumber">
                <button :class="{ active: currentPage === pageNumber }" @click="goToPage(pageNumber)">{{ pageNumber}}</button>
            </div>
            <button :disabled="currentPage === totalPages" @click="nextPage">다음</button>
        </div>
    </div>
</div>
</template>
      
<script>
import SideBar from '@/views/SideBar.vue'
export default {
    name: "SendMsg",
    components: { SideBar },
    data() {
        return {
            list: [],
            check: [],
            countall: 0,
            count: 0,
            receiver:'',
            markimg: require("../../assets/staron.png"),
            markimg2: require("../../assets/starnomal.png"),
            readimg: require("../../assets/msgnoread.png"),
            readimg2: require("../../assets/msgread.png"),
            checkedmsg: [],
            checked: [],
            num: [],
            clickmsg: [],
            currentPage: 1,
            pageSize: 15,
            title:'',
            maxLength:30
        }
    },
    created: function () {
        const self = this;
        let id = sessionStorage.getItem("loginId");
        self.$axios.get("http://localhost:8085/msg/sender/" + id)
            .then(function (res) {
                console.log(res.data.msglist[0].msgnum);
                self.list = res.data.msglist;
                self.count = res.data.countByReadSendMsg;
                self.countall = res.data.countAllByReadSendMsg;
            })
    },
    computed: {
        totalPages() {
            return Math.ceil(this.list.length / this.pageSize);
        },
        paginatedData() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.list.slice(startIndex, endIndex);
        },
    },
    methods: {
        truncateTitle(title, maxLength) {
            const self= this;
                    if (self.title.length > maxLength) {
                        return title.substring(0, maxLength) + '...';
                    }
                    return title;
                },
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
        changeCursor() {
    
    event.target.style.cursor = 'pointer';
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
        detail(num) {
            const self = this
            self.$axios.patch("http://localhost:8085/msg/read/detail/check/" + num)
            self.$axios.get("http://localhost:8085/msg/detail/" + num)
                .then(function (res) {
                    //보낸 메세지에서 답장메세지를 선택한다면
                    if (res.data.msgdto.reply != 0) {
                        self.$router.push({ name: 'DetailMsg', query: { 'num': num, 're': 1 } })
                    } else {
                        self.$router.push({ name: 'DetailMsg', query: { 'num': num } })
                    }
                })
        },
        addmsg() {
            this.$router.push({ name: 'AddMsg' });
        },
        delmsg() {
            const self = this
            for (let i = 0; i < this.checkedmsg.length; i++) {
                const num = this.checkedmsg[i].num;
                self.$axios.patch("http://localhost:8085/msg/del/check/" + num)
            }
            self.$router.push({ name: 'DelMsg' })
        },
      async sendermsgsearch() {
            const self = this;
            let sender = sessionStorage.getItem("loginId")
            self.receiver = document.getElementById("searchbar").value


            await self.$axios.get("http://localhost:8085/store/manager/"+ self.receiver,{ params: { name: self.receiver} })
                        .then(res => {
                           self.receiver= res.data;
                        })
            self.$axios.get("http://localhost:8085/msg/sendermsg/" + sender + "/" + self.receiver)
                .then(function (res) {
                    self.list = res.data.msglist;
                })
        },
        prevPage() {
            this.currentPage--;
        },
        nextPage() {

            this.currentPage++;
        },
        goToPage(pageNumber) {
            this.currentPage = pageNumber;
        },
    }
}
</script>
 
<style scoped>

body {
  font-family:  'Noto Sans KR', sans-serif;
  background-color: rgb(255, 255, 254);
}


.full_container{
    display: flex;
}
.limited-title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        

.sidebar_container {
    display: inline-block;
    width: 220px;
    text-align: left;
    border-right:  rgb(157, 157, 157);
    background-color: rgb(255, 255, 254);
    height: 770px;
}


h3 {
    font-size: large;
}

.container {
    margin: 5px 5px 5px 5px;
    background-color: #fff;
}


.head_text{
    font-weight: bold;
}

.topbar {
    text-align: left;
    margin-top: 2%;
    margin-bottom: 2%;
}

.middlebar_container {
    border-bottom: 1px solid black;
}

.middlebar {
    display: inline-block;
    margin-bottom: 20px;
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

.scroll {
    overflow: scroll;
    height: 500px;
    overflow-x: hidden;
}

.scroll::-webkit-scrollbar {
    width: 10px;
}

.scroll::-webkit-scrollbar-track {
    background-color: #a9abab;
}

.scroll::-webkit-scrollbar-thumb {
    background-color: #03c75a;
}


.scroll::-webkit-scrollbar-thumb:hover {
    background-color: #04ac4e;
}

.pagination {


    display: flex;
    justify-content: center;
    align-items: center;

    text-align: center;
    margin-top: 10px;
}

.pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: #03c75a;
    color: #fefefe;
    border: none;
    border-radius: 5px;
    font-weight: 550;
}

.pagination button.active {
    background-color: #04ac4e;
}

.main {
    width: 100%;
    text-align: center;

}

/* .boldtext{
    font-weight: bold;
} */

table {
    border-radius: 6px;
}


tr {
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    height:35px;
}

td {
    padding-top: 7px;
    padding-bottom: 12px;
    font-size:12.5px;
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
    width: 15px;
    height: 20px;
    margin-left: 20px;
    margin-right: 8px;
}

.checkbox_icon {
    zoom: 1.5;
}

.btncolor:hover {
    background-color: #04ac4e;
    color: #fefefe;
}

.btncolor {
    color: #fefefe;
    background-color: #03c75a;
    font-weight: 550;
    padding: 5px 10px;
    width: 100px;
}

.but {
    border: none;
    border-right: 2px solid rgba(0, 49, 9, 0.108);
}

.f {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

.e {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.textbar {
    border-radius: 5px;
    width: 200px;
    border-color: #EAEAEA;
    margin-right: 5px;
}

.textbar:hover {
    border-color: black;
}

.bold {
    font-weight: bold;
}</style>