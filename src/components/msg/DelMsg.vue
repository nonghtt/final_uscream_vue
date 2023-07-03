<template>
     <div class="sidebar_container">

<SideBar />
</div>
    <div class="container">
    
        <div class="topbar">
            <span>
                <h4> 휴지통  </h4>
            </span>
            <span>
                <h4>  {{ count }}  / {{ countall }} </h4>
            </span>
            
        </div>
    <div class="middlebar_container">
    
            <div class="middlebar">
                <input type="button" value="메일 작성">
                <input type="button" value="영구 삭제">
                <input type="button" value="비우기">
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
                        <img class="lcon" src="../../assets/msgread.png">
                    </td>
                    <td>{{ msg.sender.storeid }}</td>
                    <td  v-on:click="detail(msg.msgnum)">{{ msg.title }}</td>
                    <td>{{ msg.msgdate }}</td>
                </tr>
    
        </table>
    </div>
    </template>
    
    <script>
    import SideBar from '@/views/SideBar.vue'
    export default {
        name: "DelMsg",
        components:{SideBar},
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
            self.$axios.get("http://localhost:8085/msg/del/"+id+"/"+id)
                .then(function (res) {
    
            
                self.list = res.data.msglist ;
                self.count=res.data.countAllByDelAndReadMsg;
                self.countall=res.data.countAllByDelMsg;
                    
                
                })
    },
    methods:{
        detail(num){
        const self= this
        self.$axios.patch("http://localhost:8085/msg/read/detail/check/"+num)
        self.$router.push({name:'DetailMsg',query:{'num':num}})


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
    