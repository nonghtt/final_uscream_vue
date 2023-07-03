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
           </div>
       <tabel>
           <tr><td>보내는 사람</td><td><input type="text" class="enter"  v-model="sender" readonly></td></tr>
           <tr><td>받는 사람</td><td><input type="text" class="enter" v-model="receiver"></td></tr>
           <tr><td>제목</td><td><input type="text" class="enter" v-model="title"></td></tr>
           <tr><td>첨부</td><td><input type="file" name="file" ref="msgfile" @change="selectmsgfile" class="enter" multiple='true'></td></tr>
           <tr><td colspan="2"><textarea rows="20" cols="30" v-model="content"></textarea></td></tr>

       </tabel>


   </div>
</template>
   
   <script>
   import SideBar from '@/views/SideBar.vue'
   export default {
       name: "AddMsg",
       components: {SideBar},
       data() {
           return {
           countall: 0,
           count:0,
           sender:sessionStorage.getItem("loginId"),
           id:'',
           receiver:'',
           title:'',
           content:'',
           file:''
           }
       },
       created: function () {
   },
   methods:{

       selectmsgfile(){
           for(let i=0;i<this.file.length;i++){
               this.file = this.$refs.msgfile.files[0]
           }
       },
       addmsg(){
           let form = new FormData();
           form.append('sender',this.sender);
           form.append('receiver',this.receiver);
           form.append('title',this.title);
           form.append('content',this.content);
           const self= this;
           self.$axios.post("http://localhost:8085/msg",form, {headers: {"Content-Type": "multipart/form-data"}})
           
           this.$router.push({name:'SendMsg'});
           
   },
   tempmsg(){

           let form = new FormData();
           form.append('sender',this.sender);
           form.append('receiver',this.receiver);
           form.append('title',this.title);
           form.append('content',this.content);
           const self= this;
           self.$axios.post("http://localhost:8085/msg/temp",form, {headers: {"Content-Type": "multipart/form-data"}})
           alert("성공");
           this.$router.push({name:'SendMsg'});
           
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
   