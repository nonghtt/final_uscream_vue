<template>
    <div class="container">
        <h3>발주 현황</h3>
            <table>
                <tr>
                    <th>발주번호</th>
                    <th>제목</th>
                    <th>발주 총액</th>
                    <th>신청날짜</th>
                    <th>승인날짜</th>
                    <th>승인 여부</th>
                </tr>
                <tr v-for="(order,i) in orderlist" :key="i">
                    <td>{{ order.ORDERNUM }}</td>
                
                </tr>
                <td></td>
                <td></td>
            </table>
            <button type="button"><router-link to="/productorder">발주신청</router-link></button>
    </div>
</template>
<script>

export default{
    name: "OrderList",
    data(){
        return{
            orderlist:[]
        }
    },
    created: function(){
        const self = this
        self.$axios.get("http://localhost:8085/orders/orderlist").then(function(res){
            self.orderlist = res.data.orderlist
            console.log(self.orderlist)
        })
    }

}
</script>