<template>
    <div class="full_container">
    <div class="sidebar_container shadow">

        <SideBar />
    </div>
    <div class="container">

        <div class="topbar">
            <span>
                <h10 class="head_text"> 휴지통 </h10>
            </span>
            <span>
                <h10> {{ count }} / {{ countall }} </h10>
            </span>

        </div>
        <div class="middlebar_container">
            <div class="middlebar">
                <input type="button" class="but f btncolor" value="영구삭제" v-on:click="delmsg()">
                <input type="button" class="but btncolor" value="비우기" v-on:click="delallmsg()">
                <input type="button" class="but btncolor" value="즐겨찾기" v-on:click="marklist()">
                <input type="button" class="but e btncolor" value="읽음" v-on:click="readlist()">
            </div>
            <div class="searchbar">
                    <input type="text" class="textbar" name="searchbar" id="searchbar" placeholder="제목으로 검색" autocomplete="off">
                    <input type="button" class="but f e btncolor" value="검색" v-on:click="searchtitle()">
            </div>
        </div>
        <div class="null_div" v-if="list == ''">메일이 없습니다.</div>
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
                    <td :class="{'bold': msg.readcheck===true}">
                        <span v-if="msg.real===false">
                            {{ msg.sender.managername }}
                        </span>
                        <span v-else>
                            {{ msg.receiver.managername }}
                        </span>
                    </td>

                    <td v-on:click="detail(msg.msgnum)" :class="{ 'bold': msg.readcheck === true }" @mouseover="changeCursor">
                        <span :class="limited-title">{{ truncateTitle(msg.title, 30) }}</span>
                    </td>
                    <td :class="{ 'bold': msg.readcheck === true }">{{ msg.msgdate }}</td>
                </tr>
            </table>
        </div>
        <div class="pagination">
                <button :disabled="currentPage === 1" @click="prevPage">이전</button>
                <div v-for="(item,i) in pagearray" :key="i">
                    <button v-if="totalpages>i" :class="{ active: currentPage === item }" @click="goToPage(item)">
                        {{ item }}
                    </button>
                </div>
                <button :disabled="currentPage === totalPages" @click="nextPage">다음</button>
            </div>
    </div>
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
            clickmsg: [],
            currentPage: 1,
            pageSize: 15,
            title: '',
            maxLength: 20,
            pagearray: [1, 2, 3, 4, 5], 
           
            
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
        delmsg() {
            let result = confirm("정말로 삭제하시겠습니까?");
            const self = this
            if(result){
                for (let i = 0; i < this.checkedmsg.length; i++) {
                    const num = this.checkedmsg[i].num;
                    self.$axios.delete("http://localhost:8085/msg/del/" + num)
                }
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
        },

        searchtitle() {
            const self = this;
            self.title = document.getElementById("searchbar").value;
            let sender = sessionStorage.getItem("loginId");
            let receiver = sessionStorage.getItem("loginId"); 
            self.$axios.get("http://localhost:8085/msg/del/search/"+sender+"/"+receiver+"/"+self.title)
                .then(function (res) {
                    self.list = res.data.msglist;
                })
        },
   // 페이징 
   prevPage() {
            this.currentPage--;
            this.lookFivePage(this.currentPage)
        },
        nextPage() {
            this.currentPage++;
            this.lookFivePage(this.currentPage)
        },
        goToPage(pageNumber) {
            this.lookFivePage(pageNumber)
            this.currentPage = pageNumber;
        },

        lookFivePage(pageNumber) {
            if (pageNumber == 1 || pageNumber == 2) { 
                for (let i = 0; i < this.pagearray.length; i++) {
                    this.pagearray[i] = i + 1;
                }
            } else if (pageNumber == this.totalpages || pageNumber == (this.totalpages - 1)) {  
                for (let i = 0; i < this.pagearray.length; i++) {
                    this.pagearray[i] = this.totalpages - 4 + i;
                }
            } else {  
                if (pageNumber > 3) {
                    for (let i = 0; i < this.pagearray.length; i++) {
                        this.pagearray[i] = pageNumber - 2 + i;
                    }
                }
            }
        }
    }
}
</script>
    
   
<style scoped>
body {
    font-family: 'Noto Sans KR', sans-serif;
    background-color: rgb(255, 255, 254);
}


.full_container {
    display: flex;
}

.sidebar_container {
    display: inline-block;
    width: 220px;
    text-align: left;
    border-right: rgb(157, 157, 157);
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

.head_text {
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
    height: 35px;
}

td {
    padding-top: 7px;
    padding-bottom: 12px;
    font-size: 12.5px;
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
}
</style>