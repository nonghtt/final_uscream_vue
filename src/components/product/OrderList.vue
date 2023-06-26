<template>
    <div class="container">
        <h3>발주 현황</h3>
            <table class="table table-light table-striped table-bordered">
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
                    <td>?</td>
                    <td>{{ order.TOTALCOST }}원</td>
                    <td>{{ order.ORDERDATE }}</td>
                    <td>{{ order.CONFIRMDATE }}</td>
                    <td>{{ order.CONFIRMCHECK }}</td>
                    <td><p ></p></td>
                
                </tr>
                
            </table>
            <button type="button"><router-link to="/productorder">발주신청</router-link></button>
    </div>
</template>
<script>

export default{
    name: "OrderList",
    data(){
        return{
            orderlist:[],
            title:[]
        }
    },
    created: function(){
        const self = this;
  self.$axios.get("http://localhost:8085/orders/orderlist").then(function(res) {
    self.orderlist = res.data.orderlist;
    console.log(self.orderlist);

   /*  let strs = res.data.orderlist;
    alert(res.data.orderlist);
    let titlelist = strs.split('#');
    alert(titlelist); */
  });
    },

}
</script>