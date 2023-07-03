<template>
     <div class="sidebar_container">

<SideBar />
</div>
    <div class="container">
        <div class="topbar">
                <p class="main">메일</p>
                <p>{{ 1 }}/</p>
                <p style="margin-left:0px ;">{{8}}</p>
                
            </div>
            <div class="middlebar">
                <input type="button" value="답장" v-on:click="replymsg(dto.msgnum)">
                <input type="button" value="휴지통" v-on:click="delmsg(dto.msgnum)">
            </div>
        <tabel>
            <tr><td></td><td><input type="text" v-model="dto.title" class="enter title" readonly></td></tr>
            <tr><td>보낸 사람</td><td><input type="text" class="enter" v-model="dto.sender.storeid" readonly></td></tr>
            <tr><td>받는 사람</td><td><input type="text" class="enter" v-model="dto.receiver.storeid" readonly></td></tr>
            <tr><td class="bottom">{{ dto.msgdate }}</td></tr>
            <tr><td colspan="2"><textarea rows="20" cols="30" v-model="dto.content"></textarea></td></tr>
        </tabel>

    </div>
</template>
    
    <script>
    import SideBar from '@/views/SideBar.vue'
    export default {
        name: "DetailMsg",
        components:{SideBar},
        data() {
            return {
            num:this.$route.query.num,
            countall: 0,
            count:0,
            id:sessionStorage.getItem("loginId"),
            dto:[]
            }
        },
        created: function () {
            const self = this
            let num = self.num; 

            self.$axios.get("http://localhost:8085/msg/detail/"+num)
            .then(function (res) {

            self.dto = res.data.msgdto ;
            // self.countall=res.data.CountByReceiver;
            // self.count=res.data.CountByReceiverAndRead;

            })
           

    },
    methods:{
        delmsg(num){
        const self= this
        self.$axios.patch("http://localhost:8085/msg/del/check/"+num)
        self.$router.push({name:'ReceiveMsg'})
         },
         replymsg(num){
            const self = this;

            self.$router.push({name:'ReplyMsg',query:{'num':num}})
         }
    }
}
    </script>
    
    
    
    <style scoped>


.sidebar_container{
    display: inline-block;
    width: 300px;
  text-align: left;
  border-right: 1px solid black;
  background-color: whitesmoke;
  height: 770px;
}



    .topbar{    
        display: flex;
        text-align: center;
    }
    p{
    text-align: center;
    margin:1% 1% 3% 0.5%; 
}
    .main{
        font-weight: bold;
        font-size: medium;
    }   

    .middlebar{
        padding-top: 1%;
        padding-bottom: 1%;
        width:1188px;
        margin-bottom: 1.5%;
        border-top: 1px solid rgba(0,0,0,.1);
        border-bottom: 1px solid rgba(0,0,0,.1);
    }
    td{
        font-weight: 600;
    }
    
    .title{
        font-weight: bold;
        font-size:20px;
       
    }
    .enter{
        display: inline-block;
        width: 1100px;
        border-top:none;
        border-left: none;
        border-right: none;
        padding-top:3px;
        border-bottom: 1px solid rgba(0,0,0,.1);
    }
    


    input[type=file]::file-selector-button {
  width: 100px;
  height: 30px;
  background: #fff;
  border: 1px solid rgb(77,77,77);
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background: rgb(77,77,77);
    color: #fff;
  }
}
   
textarea{
    margin-top: 2.5%;
    resize:none;
    width:100%;
}
    
    </style>
    