<template>
    <div class="sidebar_container">

        <SideBar />
    </div>
    <div class="container">
        <div class="topbar">
            <p class="main">메일 작성</p>
            <p>임시보관 메일</p>
            <p style="margin-left:0px;">{{ countall }}</p>
        </div>
        <div class="middlebar">
            <input type="button" class="but f btncolor" value="작성하기" v-on:click="addmsg">
            <input type="button" class="but e btncolor" value="임시보관" v-on:click="tempmsg">
        </div>
        <table>
            <tr>
                <td>보내는 사람</td>
                <td><input type="text" class="enter" v-model="sender" readonly></td>
            </tr>
            <tr>
                <td>받는 사람</td>
                <input type="text" class="enter" v-model="receiver" @blur="searchStoreId">
                <!-- <div v-if="searchResults.length > 0" class="search-results">
                    <span v-for="result in searchResults" :key="result.storeid" @click="selectStoreId(result.storeid)">
                        {{ result.storeid }}
                    </span>
                </div> -->
            </tr>
            <tr>
                <td>제목</td>
                <td><input type="text" class="enter" v-model="title"></td>
            </tr>
            <tr>
                <td>첨부</td>
                <td><input type="file" id="file" class="enter" multiple='true' @change="fileUpload" ref="fileref"></td>
            </tr>
            <tr>
                <td colspan="2"><textarea rows="20" cols="30" v-model="content"></textarea></td>
            </tr>
        </table>
    </div>
</template>
    
<script>
import SideBar from '@/views/SideBar.vue'
export default {
    name: "AddMsg",
    components: { SideBar },
    data() {
        return {
            countall: 0,
            sender: '',
            id: '',
            receiver: '',
            title: '',
            content: '',
            file: '',
            array: [],
            alertname: [],
            query: '',
            suggestions: [],
            searchResults: []
        }
    },
    created: function () {
        const self = this;
        let id = sessionStorage.getItem("loginId");
        self.$axios.get("http://localhost:8085/msg/temp/" + id)
            .then(function (res) {
                self.countall = res.data.countAllByTempMsg;
            })
        self.$axios.get("http://localhost:8085/msg/search/" + id)
            .then(function (res) {
                self.sender = res.data.dto.managername;
            })
    },
    methods: {
        fileUpload() {
            this.file = this.$refs.fileref.files[0];
        },
       async searchStoreId() {
            const self = this;
            const str_receiver = self.receiver.replace(/\s/g, '');
            self.array = str_receiver.split(",")                 //array에는 manager 이름이 갯수만큼있다.   
            self.searchResults=[];                               //storeid를 담을 배열변수
            
        
                for(var i=0;i<self.array.length;i++){

                   await self.$axios.get("http://localhost:8085/store/manager/" + self.array[i], { params: { name: self.array[i]} })
                        .then(res => {
                           
                            self.searchResults[i] = res.data; 

                            if(res.data=='전송오류'){
                                self.searchResults[i] = self.array[i]; 
                            }
                            
                        })
                        .catch(error => {
                            console.error('검색 중 오류 발생:', error);
                        });
                } 

        },
        async addmsg() {
            const self = this;
            this.alertname = [];                                    
            const name = [];                                                  
            
            
            for (var i = 0; i < self.searchResults.length; i++) {

                let form = new FormData();
                form.append('sender', sessionStorage.getItem("loginId"));
                form.append('receiver', self.searchResults[i]);           
                form.append('title', self.title);                  
                form.append('content', self.content);              
                if (self.file) {
                    form.append('mfile', self.file);
                }
                await self.$axios.post("http://localhost:8085/msg", form, { headers: { "Content-Type": "multipart/form-data" } })
                name[i] = self.searchResults[i];
            }

            for (var j = 0; j < name.length; j++) {
                const res = await self.$axios.get("http://localhost:8085/msg/search/" + name[j])    
            
                let dtoo = res.data.dto;
                if (dtoo == null) {
                    self.alertname.push(name[j]);
                }
            }
            if (self.alertname !='') {

                alert("["+self.alertname+"]"+ "  없는 사용자입니다.");  
            }
            self.$router.push({ name: 'SendMsg' });
        },




        tempmsg() {
            const str_receiver = this.receiver.replace(/\s/g, '');
            this.array = str_receiver.split(",")
            const self = this;
            let sender = sessionStorage.getItem("loginId");

            alert("receiver" + str_receiver)
            for (let i = 0; i < this.array.length; i++) {

                let form = new FormData();
                form.append('sender', sender);
                form.append('receiver', self.array[i]);
                form.append('title', self.title);
                form.append('content', self.content);
                if (self.file) {
                    form.append('mfile', self.file);
                }

                self.$axios.post("http://localhost:8085/msg/temp", form, { headers: { "Content-Type": "multipart/form-data" } })

            }


            self.$router.push({ name: 'ReceiveMsg' });

        },

        // selectStoreId(storeid) {
        //     const self = this;
        //     self.receiver = storeid;
        //     self.searchResults = [];
        // }

    }
}
</script>
    
    
    
<style scoped>
.sidebar_container {
    display: inline-block;
    width: 220px;
    text-align: left;
    border-right: 1px solid black;
    background-color: whitesmoke;
    height: 770px;
}


.topbar {
    display: flex;
    text-align: center;


}

p {
    text-align: center;
    margin: 1% 1% 3% 0.5%;
}

.main {
    font-weight: bold;
    font-size: medium;
}

.middlebar {
    padding-top: 1%;
    padding-bottom: 1%;
    width: 1188px;
    margin-bottom: 1.5%;
    border-top: 1px solid rgba(0, 0, 0, .1);
    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

td {
    font-weight: bold;
}

.enter {
    display: inline-block;
    width: 1100px;
    border-top: none;
    border-left: none;
    border-right: none;
    padding-top: 3px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

/* .enter:hover{
    border-color:#03c75a
} */



input[type=file]::file-selector-button {
    width: 100px;
    height: 30px;
    background: #fff;
    border: 1px solid rgb(77, 77, 77);
    border-radius: 10px;
    cursor: pointer;

    &:hover {
        background: rgb(77, 77, 77);
        color: #fff;
    }
}





textarea {
    margin-top: 2.5%;
    resize: none;
    width: 100%;
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

.search-results {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    padding: 5px;
}
</style>
    