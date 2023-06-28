<template>
<div class="container">

    <div class="topbar">
        <span>
            <h4>받은 메일함  </h4>
        </span>
        <span>
            <h4>  {{ count }}  / {{ countall }} </h4>
        </span>

        <span class="searchbar">
            <form>
                <input type="text" name="searchbar" placeholder="제목을 입력하세요" autocomplete="off">
                <input type="submit" value="검색">
            </form>
        </span>
        
    </div>
    <div class="middlebar">
        <input type="button" value="메일 보내기">
        <input type="button" value="휴지통으로">
        <input type="button" value="즐겨찾기">
    </div>
    <table class="main">
            <tr v-for="(msg, index) in list" :key="index">

                <td class="check">
                    <input type ="checkbox">
                    <img class="lcon" src="../../assets/uscreamlogo.png">
                    <img class="lcon" src="../../assets/uscreamlogo.png">
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
    name: "ReceiveMsg",
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
        self.$axios.get("http://localhost:8085/msg/"+id)
            .then(function (res) {

                
                self.list = res.data.msglist ;
               self.countall=res.data.CountByReceiver;
               self.count=res.data.CountByReceiverAndRead;
                

                
            })
}
}
</script>


<style scoped>
.container{
    margin: 5px 5px 5px 5px;
}

.topbar{
    display: flex;
    margin-top: 2%;
    margin-bottom: 4%;
    
}
.middlebar{
    text-align: right;
    margin-bottom: 10px;
}
.searchbar{
    margin-left: auto;
}

.main{
    width:100%;
    text-align: center;
}

td {
    padding-top: 5px;
    padding-bottom: 10px;
  }

td:nth-child(1) {
  width: 20%; 
}

td:nth-child(2) {
  width: 15%; 
}

td:nth-child(3) {
  width: 50%; 
}

td:nth-child(4) {
  width: 15%; 
}

.check{
    text-align: center;
    
}


.lcon {
    width: 30px;
    height: 50px;
    margin-left: 3px;
    margin-right: 3px;
}


</style>
