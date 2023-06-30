<template>
<div class="Sidebar">

    <div class="head_ul">
        <div class="readmsg">
            <div>읽지 않은 메일</div>
            <div>{{ read }}</div> 
        </div>
        <div class="markmsg">
           <div>즐겨 찾기</div>  
           <div>{{ mark }}</div>
        </div>
    </div>

    <ul v-on:click="receivemsg"><img class="sidebar_icon" src="../assets/receivemsg.svg">받은 메시지    </ul><Br/>
    <ul v-on:click="addmsg"><img class="sidebar_icon" src="../assets/addmsg.svg">메세지 작성    </ul><Br/>
    <ul v-on:click="sendmsg"><img class="sidebar_icon" src="../assets/sendmsg.svg">보낸 메시지    </ul><Br/>
    <ul v-on:click="tempmsg"><img class="sidebar_icon" src="../assets/tempmsg.svg">임시 보관함    </ul><Br/>
    <ul v-on:click="delmsg"><img class="sidebar_icon" src="../assets/delmsg.svg">휴지통         </ul><Br/>
    
    

</div>
</template>



<script>



export default {
    name: 'SideBar',
    data() {
        return {
          read:0,
          mark:0
           }
    },
    created: function () {
        const self = this;
        let id = sessionStorage.getItem("loginId");
        self.$axios.get("http://localhost:8085/msg/sidebar/"+id)
            .then(function (res) {
                self.read = res.data.CountAllRead;
                self.mark = res.data.CountByMark;                        
            })
},
methods:{
    receivemsg(){
        this.$router.push({name:'ReceiveMsg'});
    },
    addmsg(){
        this.$router.push({name:'AddMsg'});
    },
    sendmsg(){
        this.$router.push({name:'SendMsg'});
    },
    tempmsg(){
        this.$router.push({name:'TempMsg'});
    },
    delmsg(){
        this.$router.push({name:'DelMsg'});
    }
    
}
}


</script>

<style scoped>

.SideBar{
    margin-top: 3%;
   
    
}

.sidebar_icon{
    width: 20px;
    height: 25px;
    margin-left: 3px;
    margin-right: 3px;
}
.head_ul{
    margin-top:30px ;
    margin-bottom: 15px;
    display:flex;

}

.readmsg{
    display: inline-block;
    width:50%;
    text-align: center;
}

.markmsg{
    display: inline-block;
    width:50%;
    text-align: center;
    
}

ul{
    margin-top:1%;
    margin-bottom: 1%;
}

</style>