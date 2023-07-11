<template>
    <div class="container ">
        <div class="row justify-content-end" style="margin: 10px 0 10px 0;" >
            <div class="col-4"></div>
            <div class="col-4 justify-content-start"><h3 style="margin-top: 10px ;">발주 현황</h3></div>
            <div class="col-4 justify-content-end" style="align-items: center; display: flex;"><button type="button" v-if="accounttype == 2" class="col1 btn btncolor"><router-link class="orderbtn"
                    to="/productorder">발주신청</router-link></button></div>
        </div>
        <table class="table table-light table-striped table-bordered">
            <tr>
                <th>발주번호</th>
                <th>제목</th>
                <th>발주 총액</th>
                <th>승인 금액</th>
                <th>신청날짜</th>
                <th>승인날짜</th>
                <th>처리 여부</th>
            </tr>
            <tr v-for="(order, i) in orderlist" :key="i">
                <td>{{ order.ORDERNUM }}</td>
                <td>
                    <div @click="detail(order.STORE, order.ORDERDATE)" style="margin-bottom: 0; background-color: none; cursor: pointer;">
                        {{ order.STORE }}의 {{ order.ORDERDATE }} 발주내역</div>
                </td>
                <td>{{ order.TOTALCOST }}원</td>
                <td v-if="order.ORDERCOST != 0">{{ order.ORDERCOST }}원</td>
                <td v-else-if="order.ORDERCOST == 0 && order.STATUS == '처리완료'">0원</td>
                <td v-else>처리중</td>



                <td>{{ order.ORDERDATE }}</td>
                <td v-if="order.CONFIRMDATE == null">처리중</td>
                <td v-if="order.CONFIRMDATE != null">{{ order.CONFIRMDATE }}</td>
                <td>{{ order.STATUS }}</td>
                <!--  <td v-if="order.CHECKCONFIRM == 0">승인 대기중</td>
                <td v-if="order.CHECKCONFIRM != 0">승인 완료</td> -->

            </tr>

        </table>

    </div>
</template>
<script>

export default {
    name: "OrderList",
    data() {
        return {
            lastorder:sessionStorage.getItem("lastorder"),
            orderlist: [],
            title: [],
            accounttype: sessionStorage.getItem("accounttype"),
            store: sessionStorage.getItem("loginId")
        }
    },
    created: function () {
        if (this.accounttype == 1) {
            const self = this;
            self.$axios.get("http://localhost:8085/orders/orderlist").then(function (res) {
                self.orderlist = res.data.orderlist;

            });
        } else if (this.accounttype == 2) {
            const self = this;
            self.$axios.get("http://localhost:8085/orders/orderlist/" + self.store).then(function (res) {
                self.orderlist = res.data.orderlist;
                console.log(self.orderlist)

            })
        }
    },
    methods: {
        detail(storeid, orderdate) {

            this.$router.push({
                name: 'OrderDetail',
                query: { storeid, orderdate }
            });
        }
    }
}
</script>
<style scoped>
.orderbtn {
    text-decoration: none;
    color: black
}

* {
    text-align: center;
}
.btncolor:hover{
  background-color: #FFC67B;
  color:#595959
}
.btncolor{
    
    height: 38px;
    color:#595959;
    background-color: #bee96d;
    font-weight: bolder ;
}
</style>