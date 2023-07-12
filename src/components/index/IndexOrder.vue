<template>
    <div id="container">
        <h4>발주</h4>
        <div style="width: 100%;height: 230px;  " v-if="orderlist != null">
            <table class="table table-light table-striped table-bordered" v-if="orderlist != null">
                <tr>
                    <th>발주번호</th>
                    <th>제목</th>
                    <th>발주 총액</th>
                    <th>신청날짜</th>
                    <th>처리 여부</th>
                </tr>
                <tr v-for="(order, i) in orderlist" :key="i">
                    <td>{{ order.ORDERNUM }}</td>
                    <td>
                        <div @click="detail(order.STORE, order.ORDERDATE)"
                            style="margin-bottom: 0; background-color: none; cursor: pointer;">
                            {{ order.STORE }}의 {{ order.ORDERDATE }} 발주내역</div>
                    </td>
                    <td>{{ order.TOTALCOST }}원</td>



                    <td>{{ order.ORDERDATE }}</td>
                    <td>{{ order.STATUS }}</td>
                    <!--  <td v-if="order.CHECKCONFIRM == 0">승인 대기중</td>
                <td v-if="order.CHECKCONFIRM != 0">승인 완료</td> -->

                </tr>
            </table>

            <router-link to="/orderlist">
            <button class="btn " id="btncolor">더보기</button>
        </router-link>
        </div>
        <div v-else>
            발주중인 상품이 없습니다
        </div>
    </div>
</template>

<script>
export default {
    name: 'IndexOrder',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            accounttype: sessionStorage.getItem("accounttype"),
            orderlist: [],
        }
    },
    created: function () {
        const self = this
        if (self.accounttype == 1) {
            self.$axios.get("http://localhost:8085/orders/notconfirm").then(function (res) {
                self.orderlist = res.data.orderlist
                console.log(self.orderlist)
            })
        } else {
            self.$axios.get("http://localhost:8085/orders/notconfirm/" + self.id).then(function (res) {
                self.orderlist = res.data.orderlist
                console.log(self.orderlist)
            })
        }

    }
}
</script>

<style scoped>
#container {
    margin: 10px 10px;
    text-align: center;
    overflow: hidden;
    
    
    /* 이 위는 바꾸지 마세요~ */
}

.content {
    margin-top: 5px;
    overflow: auto;
    max-height: 12em;
    /* 이 위는 바꾸지 마세요~ */
}

#btncolor:hover {
    background-color: #FFC67B;
    color: #595959
}

#btncolor {
    margin-top: 5px;
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
    border: none;
    padding: 5px 10px;
}
</style>