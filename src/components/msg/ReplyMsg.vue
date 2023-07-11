<template>
    <div class="full_container">
    <div class="sidebar_container shadow">
        <SideBar />
    </div>
    <div class="container">
        <div class="topbar">
            <p class="main">답장 작성</p>
        </div>
        <div class="middlebar">
            <input type="button" class="but f btncolor" value="작성하기" v-on:click="addmsg">
            <input type="button" class="but e btncolor" value="임시보관" v-on:click="tempmsg">
        </div>
        <table>
            <tr>
                <td>보내는 사람</td>
                <td><input type="text" class="enter" v-model="dto.sender.storeid" readonly></td>
            </tr>
            <tr>
                <td>받는 사람</td>
                <td><input type="text" class="enter" v-model="dto.receiver.storeid" readonly></td>
            </tr>
            <tr>
                <td>제목</td>
                <td><input type="text" class="enter" v-model="dto.title"></td>
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
    </div>
</template>
    
<script>
import SideBar from '@/views/SideBar.vue'
export default {
    name: "ReplyMsg",
    components: { SideBar },
    data() {
        return {
            num: this.$route.query.num,
            id: sessionStorage.getItem("loginId"),
            file: '',
            dto: [],
            array: [],
            alertname: [],
            name:[],
            searchResults: []
        }
    },
    created: function () {
        const self = this
        let num = self.num
        self.$axios.get("http://localhost:8085/msg/reply/" + num)
            .then(function (res) {
                self.dto = res.data.msgdto;
                self.dto.title = "[Re: " + self.dto.title + " ]";
            })
    },
    methods: {
        fileUpload() {
            this.file = this.$refs.fileref.files[0];
        },
        
        async addmsg() {
            const self = this;
                                    
            if(self.dto.title==''|| self.dto.receiver.storeid==''){
                if(self.dto.title==''){
                    alert("제목을 입력해주세요.");
                }else{
                    alert("받는 사람을 입력해주세요.")
                }
            }else{

                let form = new FormData();
                form.append('sender', sessionStorage.getItem("loginId"));
                form.append('receiver', self.dto.receiver.storeid);           
                form.append('title', self.dto.title);                  
                form.append('content', self.content);              
                if (self.file) {
                    form.append('mfile', self.file);
                }
            
                await self.$axios.post("http://localhost:8085/msg", form, { headers: { "Content-Type": "multipart/form-data" } })
                
            

            
            self.$router.push({ name: 'SendMsg' });
            }
        },
        tempmsg() {
            const self =this;
            let form = new FormData();

            form.append('sender', sessionStorage.getItem("loginId"));
            form.append('receiver', self.dto.receiver.storeid);
            form.append('title', self.dto.title);
            form.append('content', self.content);
            if (self.file) {
                form.append('mfile', self.file);
            }
            self.$axios.post("http://localhost:8085/msg/temp", form, { headers: { "Content-Type": "multipart/form-data" } })
            this.$router.push({ name: 'SendMsg' });

        }
    }
}

</script>
    
    
    
<style scoped>
body {
  font-family:  'Noto Sans KR', sans-serif;
  background-color: rgb(255, 255, 254);
}
.sidebar_container {
    display: inline-block;
    width: 220px;
    text-align: left;
    border-right:  rgb(157, 157, 157);
    background-color: rgb(255, 255, 254);
    height: 770px;
}

.full_container{
    display: flex;
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

</style>
    