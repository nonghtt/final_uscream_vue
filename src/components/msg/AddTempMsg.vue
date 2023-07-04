<template>
    <div class="sidebar_container">

<SideBar />
</div>
   <div class="container">
       <div class="topbar">
               <p class="main">메일 작성</p>
            
               
           </div>
           <div class="middlebar">
               <input type="button" value="작성하기" v-on:click="addmsg">
               <input type="button" value="휴지통으로" v-on:click="delmsg(num)">
           </div>
       <tabel>
           <tr><td>보내는 사람</td><td><input type="text" class="enter"  v-model="dto.sender.storeid" readonly></td></tr>
           <tr><td>받는 사람</td><td><input type="text" class="enter" v-model="dto.receiver.storeid"></td></tr>
           <tr><td>제목</td><td><input type="text" class="enter" v-model="dto.title"></td></tr>
           <tr><td>첨부</td><td><input type="file" id="file" class="enter" multiple='true' @change="fileUpload" ref="fileref"></td></tr>
           <tr><td colspan="2"><textarea rows="20" cols="30" v-model="dto.content"></textarea></td></tr>

       </tabel>


   </div>
</template>
   
   <script>
   import SideBar from '@/views/SideBar.vue'
   export default {
       name: "AddTempMsg",
       components: {SideBar},
       data() {
           return {
           num:this.$route.query.num,
           receiver:'',
           title:'',
           content:'',
           file:'',
           dto:''
           }
       },
       created: function () {
        const self = this;
        let num = self.num
        self.$axios.get("http://localhost:8085/msg/detail/"+num)
        .then(function (res) {
                self.dto = res.data.msgdto ;
                })
   },
   methods:{
       addmsg(){
           const self= this;
           let num = self.num;
           let form = new FormData();
           form.append('sender',self.dto.sender.storeid);
            form.append('receiver',self.dto.receiver.storeid);
            form.append('title',self.dto.title);
            form.append('content',self.dto.content);
           self.$axios.post("http://localhost:8085/msg",form, {headers: {"Content-Type": "multipart/form-data"}})
           self.$axios.delete("http://localhost:8085/msg/del/"+num)
           self.$router.push({name:'TempMsg'});
   },
   
   delmsg(num){
        const self= this
        
        if(self.dto.delcheck == false){
            self.$axios.patch("http://localhost:8085/msg/del/check/"+num)
        }else{
            self.$axios.delete("http://localhost:8085/msg/del/"+num)
        }
        self.$router.push({name:'ReceiveMsg'})
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
       font-weight: bold;
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
   