<template>
    <div class="sidebar_container">
        <SideBar />
    </div>
    <div class="container">
        <div class="topbar">
            <p class="main">메일</p>
            <p>{{ 1 }}/</p>
            <p style="margin-left:0px ;">{{ 8 }}</p>
        </div>
        <div class="middlebar">
            <input v-if="re == null" type="button" value="답장" v-on:click="replymsg(dto.msgnum)">
            <input type="button" value="휴지통" v-on:click="delmsg(dto.msgnum)">
        </div>
        <tabel>
            <tr>
                <td></td>
                <td><input type="text" v-model="dto.title" class="enter title" readonly></td>
            </tr>
            <tr>
                <td>보낸 사람</td>
                <td><input type="text" class="enter" v-model="dto.sender.storeid" readonly></td>
            </tr>
            <tr>
                <td>받는 사람</td>
                <td><input type="text" class="enter" v-model="dto.receiver.storeid" readonly></td>
            </tr>
            <tr v-if="dto.msgfile">
                <td>첨부 파일</td>
                <td v-on:click="down(dto.msgfile)" class="enter">{{ dto.msgfile }}</td>
            </tr>
            <tr>
                <td class="bottom">{{ dto.msgdate }}</td>
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
    name: "DetailMsg",
    components: { SideBar },
    data() {
        return {
            num: this.$route.query.num,
            re: this.$route.query.re,
            countall: 0,
            count: 0,
            id: sessionStorage.getItem("loginId"),
            dto: []
        }
    },
    created: function () {
        const self = this
        let num = self.num;
        self.$axios.get("http://localhost:8085/msg/detail/" + num)
            .then(function (res) {
                self.dto = res.data.msgdto;
            })
    },
    methods: {
        delmsg(num) {
            const self = this
            if (self.dto.delcheck == false) {
                self.$axios.patch("http://localhost:8085/msg/del/check/" + num)
            } else {
                self.$axios.delete("http://localhost:8085/msg/del/" + num)
            }
            self.$router.push({ name: 'ReceiveMsg' })
        },
        replymsg(num) {
            const self = this;
            self.$router.push({ name: 'ReplyMsg', query: { 'num': num } })
        },
        //gpt 작품 ㅜㅜ 
        down(name) {
            const fname = this.dto.msgfile;
            const url = `http://localhost:8085/msg/down/${fname}`;

            this.$axios({
                method: 'GET',
                url: url,
                responseType: 'blob',                             // axios를 사용해서 다운로드를 하려면 responseType을 꼭 blob로 설정해야 함.
            })
                .then(response => {
                    const blob = new Blob([response.data]);
                    const link = document.createElement('a');     // 다운로드를 하기 위해서 <a>태그 요소를 생성한다. 
                    link.href = window.URL.createObjectURL(blob); // 서버의 응답 데이터가 있는 상수 blob을 url로 변환해서 link변수의 href에 추가한다. (<a>)
                                                                  // 위의 과정을 통해 <a href="http://localhost:8085/msg/down/${fname}">이 생성된다.
                    link.setAttribute('download', name);          // name을 다운로드 속성에 넣는다. (다운로드 될 파일의 이름을 설정)
                    document.body.appendChild(link);              // 바디에 a태그가 들어간 요소를 추가
                    link.click();                                 // 클릭이 되고 이 과정에서 다운로드가 실행됨
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);        // 위 두 과정은 메모리 누수를 막기 위해 삭제 로직을 진행시킴.
                })
                .catch(error => {
                    console.error('파일 다운로드 실패:', error);
                });
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
    font-weight: 600;
}

.title {
    font-weight: bold;
    font-size: 20px;

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
}</style>
    