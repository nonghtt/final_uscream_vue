<template lang="">
   

<!-- 본사에서 보는 지점의 현황에는 어떤 정보가 필요할까

현재 영업중인 지점에 관한 정보가 필요할텐데
지점명
지점장 이름
지점 전화번호
지점 주소
-->

<!-- 지점 현황에 필요한 절차 -->
<!-- 1. 지도 뿌리기 -->
<!-- 2. 위에 개점중인 리스트명(storename)으로 해서 목록뿌리기 -->
<!-- (2.1) 클릭하면 해당 지점으로 좌표이동 -->
<!-- (2.2) 인포테크? 점포관련 정보 띄울 수 있게-->




<!-- 리스트 데이터 뿌리는 코드  -->
        <!-- <div>
        <div>지점현황</div>
        <div class="storename">지점이름</div>
        <div v-for="prod in list" :key="prod.num">
            <a v-on:click="detail(prod.storeid)">{{prod.storename}}</a>
        </div>
    </div> -->
 
<!-- <div id="map" style="width:500px;height:400px;"></div> -->
   
    <!-- <div class="map" id="map" style="width:100%; height:100%;">
지도뿌릴거야~ </div> -->

<div class="bigbox">

<div class="box1">아웃라인1</div>
<div class="box2">아웃라인2</div>


<div>
    <div id="map"></div>
  </div>


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
        },    
    }
}
</script>


<style scoped>
.bigbox{
    position:flex;
}
    .box1{
        background-color: blanchedalmond;
        width:1200px;
        height:400px;
        margin:30px;

    }
    .box2{
        background-color: darkolivegreen;
        width:1200px;
        margin:30px;
   }
   
</style>