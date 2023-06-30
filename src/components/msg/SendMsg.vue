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
    <div class="middlebar_container">
    
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
                        <input  style='zoom:1.5;' type ="checkbox" class="checkbox_icon">
                        <img class="lcon" src="../../assets/starnomal.png">
                        <img class="lcon" src="../../assets/msgnomal.png">
                    </td>
                    <td>{{ msg.sender.storeid }}</td>
                    <td>{{ msg.title }}</td>
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
              countall: 0,
              count:0
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
    middlebar_container{
        
    }
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
    
    
    </style>
    