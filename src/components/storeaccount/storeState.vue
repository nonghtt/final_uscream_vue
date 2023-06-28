<template lang="">
    <div>
        <div>지점현황</div>
        <tr class="storename"><th>지점이름</th><th>지점장이름</th></tr>
        <tr v-for="prod in list" :key="prod.num">
            <td><a v-on:click="detail(prod.storeid)">{{prod.storename}}</a></td>
            <td>{{prod.managername}}</td>
        </tr>
    </div>
</template>
<script>
export default {
    name: 'storeState',
    data(){
        return{
            loginId: null,
            list:[]
        }
    },
    created:function(){
        this.loginId = sessionStorage.getItem('loginId')
        const self = this;
        self.$axios.get('http://localhost:8085/store')//비동기 요청
        .then(function(res){
            if(res.status==200){
       
                self.list = res.data.storelist
       
            }else{
                alert('에러코드:' + res.status)
            }
        });
    },
    methods:{
        detail(storeid){
            this.$router.push({name:'storeDetail', query:{storeid:storeid}})
        }
    }
}
</script>
<style scoped>
    
</style>
