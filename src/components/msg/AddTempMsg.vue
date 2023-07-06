<template>
    <div class="sidebar_container">
        <SideBar />
    </div>
    <div class="container">
        <div class="topbar">
            <p class="main">메일 작성</p>
        </div>
        <div class="middlebar">
            <input type="button" class="but f btncolor" value="작성하기" v-on:click="addmsg">
            <input type="button" class="but e btncolor" value="휴지통으로" v-on:click="delmsg(num)">
        </div>
        <tabel>
            <tr>
                <td>보내는 사람</td>
                <td><input type="text" class="enter" v-model="dto.sender.storeid" readonly></td>
            </tr>
            <tr>
                <td>받는 사람</td>
                <td><input type="text" class="enter" v-model="dto.receiver.storeid"></td>
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
                <td colspan="2"><textarea rows="20" cols="30" v-model="dto.content"></textarea></td>
            </tr>
        </tabel>
    </div>
</template>
<script>
import SideBar from '@/views/SideBar.vue'
export default {
    name: "AddTempMsg",
    components: { SideBar },
    data() {
        return {
            num: this.$route.query.num,
            title: '',
            content: '',
            file: '',
            dto: [],
            array: [],
            alertname: []
        }
    },
    created: function () {
        const self = this;
        let num = self.num
        self.$axios.get("http://localhost:8085/msg/detail/" + num)
            .then(function (res) {
                self.dto = res.data.msgdto;
            })
    },
    methods: {
        fileUpload() {
            this.file = this.$refs.fileref.files[0];
        },
        async addmsg() {
            const self = this;
            const str_receiver = self.dto.receiver.storeid.replace(/\s/g, '');
            self.array = str_receiver.split(",")
            this.alertname = [];
            const name = [];
            let num = self.num;
            let form = new FormData();
            for (let i = 0; i < this.array.length; i++) {
                form.append('sender', self.dto.sender.storeid);
                form.append('receiver', self.array[i]);
                form.append('title', self.dto.title);
                form.append('content', self.dto.content);
                if (this.file) {
                    form.append('mfile', self.file);
                }
                self.$axios.post("http://localhost:8085/msg", form, { headers: { "Content-Type": "multipart/form-data" } })
                name[i] = self.array[i];
                self.$axios.delete("http://localhost:8085/msg/del/" + num)
            }
            for (var j = 0; j < name.length; j++) {

                const res = await self.$axios.get("http://localhost:8085/msg/search/" + name[j])
                let dtoo = res.data.dto;
                if (dtoo == null) {
                    self.alertname.push(name[j]);
                }
            }
            if (self.alertname != '') {
                alert(self.alertname + "라는 사용자는 없는 사용자입니다.");
            }
            self.$router.push({ name: 'TempMsg' });
        },
        delmsg(num) {
            const self = this
            if (self.dto.delcheck == false) {
                self.$axios.patch("http://localhost:8085/msg/del/check/" + num)
            } else {
                self.$axios.delete("http://localhost:8085/msg/del/" + num)
            }
            self.$router.push({ name: 'ReceiveMsg' })
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
   