<template lang="">
    <div>
        가나다라마바사<br/><br/><br/>

        전체매장 리스트 뿌리고 정보 다뿌리는거?


    </div>
</template>
<script>
export default {
    data() {
        return{

        }
    },
    created:function(){

        const self = this;
        alert(1)
        self.$axios.get('http://localhost:8085/store/').then(function(res){
           let storelist = res.data.storelist
           alert(2)
           alert(storelist.storeid)

        })

    }   




}
</script>
<style lang="">
    
</style>