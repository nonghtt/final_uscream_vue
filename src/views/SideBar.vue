<template>
<div class="Sidebar">

    <ul class="head_ul">
        <div>안읽은 메일 {{ read }}</div>
        <div>즐겨찾기 {{ mark }}</div>
    </ul>

    <ul>받은 메시지    </ul><Br/>
    <ul>메세지 작성    </ul><Br/>
    <ul>보낸 메시지    </ul><Br/>
    <ul>임시 보관함    </ul><Br/>
    <ul>휴지통         </ul><Br/>
    
    

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
}
}


</script>

<style scoped>

.SideBar{
    margin-top: 3%;
    padding-top: 0%;
}

.head_ul{
    margin-top:30px ;
}
.ul{
    margin-top:3%;
    margin-bottom: 3%;
}

</style>