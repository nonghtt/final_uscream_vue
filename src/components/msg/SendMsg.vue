<template>

    <div class="container">
    
        <div class="topbar">
            <span>
                <h4> 보낸 메일함  </h4>
            </span>
            <span>
                <h4>  {{ count }}  / {{ countall }} </h4>
            </span>
            
        </div>
    <div class="middlebar_container" style="border-bottom: 1px solid;">
    
            <div class="middlebar">
                <input type="button" value="메일 작성">
                <input type="button" value="휴지통으로">
             
            </div>    
            <div class="searchbar">
                <form>
                    <input type="text" name="searchbar" placeholder="메일 검색" autocomplete="off">
                    <input type="submit" value="검색">
                </form>
            </div>
    </div>
        <table class="main">
                <tr v-for="(msg, index) in list" :key="index">
    
                    <td class="check">
                        <input type ="checkbox" class="checkbox_icon" v-model="check[index]">
                        <img class="lcon" :src="markimg"  v-if="msg.mark==1" v-on:click="mark(msg.msgnum,msg.mark)">
                        <img class="lcon" :src="markimg2"  v-else v-on:click="mark(msg.msgnum,msg.mark)">
    
    
                        <img class="lcon" :src="readimg" v-if="msg.readcheck==1" v-on:click="read(msg.msgnum,msg.readcheck)">
                        <img class="lcon" :src="readimg2" v-else v-on:click="read(msg.msgnum,msg.readcheck)">
    
                    </td>
                    <td>{{ msg.sender.storeid }}</td>
                    <td v-on:click="detail(msg.msgnum)" >{{ msg.title }}</td>
                    <td>{{ msg.msgdate }}</td>
                   
                </tr>
        </table>
    </div>
    </template>
      
    <script>
    
    export default {
        name: "SendMsg",
        data() {
            return {
              list : [],
              check:[],
              countall: 0,
              count:0,
              markimg:require("../../assets/staron.png"),
              markimg2:require("../../assets/starnomal.png"),
              readimg:require("../../assets/msgread.png"),
              readimg2:require("../../assets/msgnoread.png"),
               }
        },
        created: function () {
            const self = this;
            let id = sessionStorage.getItem("loginId");
            self.$axios.get("http://localhost:8085/msg/sender/"+id)
                .then(function (res) {
                    
                    
                self.list = res.data.msglist ;
                self.countall=res.data.CountBySender;
                self.count=res.data.CountBySenderRead;
                })
    },
    methods:{
        mark(num,mark){
            const self = this 
            self.$axios.patch("http://localhost:8085/msg/mark/check/"+num)
            
            if(mark){
                    self.markimg=require("../../assets/staron.png")
            }else {
                self.markimg=require("../../assets/starnomal.png")
            }
            
            window.location.reload();
        },
        read(num,read){
            const self = this
            self.$axios.patch("http://localhost:8085/msg/read/check/"+num)
            if(read){
                    self.readimg=require("../../assets/msgread.png")
                }
    
            window.location.reload();
        },
        detail(num){
            const self= this
            self.$axios.patch("http://localhost:8085/msg/read/check/"+num)
            self.$router.push({name:'DetailMsg',query:{'num':num}})
    
    
            }
            }
        
        
        
    }
    </script>
      
     
    <style scoped>
    
    
    
    h3{
        font-size: large;
    }
    
    .container{
        margin: 5px 5px 5px 5px;
    }
    
    .topbar{
       text-align: center;
        margin-top: 2%;
        margin-bottom: 2%;
        
    }
    /* middlebar_container{
        
        
    } */
    .middlebar{
        display:inline-block;
        margin-bottom: 10px;
    }
    .searchbar{
        float:right;
    
        display: inline-block;
    }
    
    .main{
        width:100%;
        text-align: center;
    }
    
    table{
        border-radius:6px;
    }
    
    tr{
        border-bottom: 1px solid rgba(0,0,0,.1);
    }
    
    td {
        padding-top: 7px;
        padding-bottom: 12px;
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
    
    .check{
        display: flex;
        align-items: center;
        width:40px;
    }
    
    
    .lcon {
        width: 20px;
        height: 30px;
        margin-left: 20px;
        margin-right: 8px;
    }
    
    .checkbox_icon{
        zoom:1.5;
    }
    
    
    </style>
      