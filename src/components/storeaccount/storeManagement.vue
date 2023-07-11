<template lang="">



    <div>

        <th>매장아이디</th><th>매장이름</th><th>지점장 이름</th><th></th>


     <tr v-for="store in storelist" :key="store">
        <td>{{store.storeid}}</td><td>{{store.storename}}</td><td>{{store.managername}}</td><td></td>
     </tr>

    </div>
</template>
<script>
export default {
    data() {
        return{
            storelist:[]
        }
    },
    created:function(){

const self= this
        self.$axios.get('http://localhost:8085/store/accounttype/2').then(function(res){
          
            self.storelist = res.data.storelist
           
           

        })

    }   




}
</script>
<style lang="">
    
</style>