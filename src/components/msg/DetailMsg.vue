<template>
    <div class="container">
        <div class="topbar">
                <p class="main">메일</p>
                <p>{{ 1 }}/</p>
                <p style="margin-left:0px ;">{{8}}</p>
                
            </div>
            <div class="middlebar">
                <input type="button" value="답장">
                <input type="button" value="휴지통">
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
    
    export default {
        name: "DetailMsg",
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
      
    }
}
    </script>
    
    
    
    <style scoped>


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
    