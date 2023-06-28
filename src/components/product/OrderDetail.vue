<template>
    <div class="container">
        <h3>신청 내용</h3>
        <table class="table table-light table-striped table-bordered">
            <tr class="table-primary">
                <th>선택</th>
                <th>제품번호</th>
                <th>상품명</th>
                <th>상품 이미지</th>
                <th>상품 가격</th>
                <th>수량</th>
                <th>발주금액</th>
                <th>승인</th>
                <th>반려</th>
            </tr>
            <tr v-for="(order, index) in storeorder" :key="order.productnum.productnum" class="table table-light">
                <td v-if="order.productnum.orderble == true"><input type="checkbox" name="checked" v-model="checked[index]"
                        @change="checkedProduct"></td>
                <td v-else><input type="checkbox" name="checked" disabled></td>
                <td>{{ order.productnum.productnum }}</td>
                <td>{{ order.productnum.productname }}</td>
                <td class="table-default"><img
                        v-bind:src="'http://localhost:8085/products/img/' + order.productnum.productnum"></td>
                <td>{{ order.productnum.cost }}</td>
                <td><input type="number" class="cnt" v-model="order.amount"
                        @change="multiplecost(order.productnum, index, order.amount)"></td>
                <!--  <td><input type="number" class="cnt" v-model="amount[index]" @change="multiplecost(product, index)"></td> -->
                <td>{{ order.ordercost }}</td>
                <td v-if="order.confirm == 1">승인</td>
                <td v-if="order.confirm == 0">승인대기</td>
                <td v-if="order.confirm == 2">반려</td>
                <td><button type="button" v-if="accounttype ==1" @click="rejectorder(index)" class="rejectbtn">반려</button></td>
            </tr>

        </table>
        <button type="button" v-if="accounttype == 1" v-on:click="confirmorder">발주 승인</button>
        <button type="button" v-if="accounttype == 2" @click="edit">수정</button>
        {{ checkedproduct }}

    </div>
</template>
  
<script>
export default {
    name: "OrderDetail",
    data() {
        return {
            storeid: this.$route.query.storeid,
            orderdate: this.$route.query.orderdate,
            storeorder: [],
            checked: [],
            amount: [],
            ordercost: [],
            checkedproduct: [],
            accounttype: sessionStorage.getItem("accounttype")
        }
    },
    created: function () {
        const self = this
        self.$axios.get('http://localhost:8085/orders/detail/' + self.storeid + '/' + self.orderdate).
            then(function (res) {
                self.storeorder = res.data.Storeorder
            })
    },
    methods: {
        checkedProduct() {

            this.checkedproduct = [];
            for (let i = 0; i < this.checked.length; i++) {
                if (this.checked[i]) {
                    this.checkedproduct.push({
                        store: this.storeid,
                        tempnum: this.storeorder[i].tempnum,
                        product: this.storeorder[i].productnum.productnum,
                        amount: this.storeorder[i].amount,
                        ordercost: this.storeorder[i].ordercost,
                    })
                } else {
                    this.updateCheckedProduct(i);
                }
            }
        },
        updateCheckedProduct(index) {
            if (!this.checked[index]) {
                const foundIndex = this.checkedproduct.findIndex(item => item.product === this.storeorder[index].productnum.productnum);
                if (foundIndex !== -1) {
                    this.checkedproduct.splice(foundIndex, 1);
                }
            }
        },
        multiplecost(product, index, amount) {
            this.ordercost[index] = product.cost * amount;
        },
        confirmorder() {
            alert("click")
            const self = this
            for (let i = 0; i < self.checkedproduct.length; i++) {
                let tempnum = self.checkedproduct[i].tempnum
                alert(tempnum)
                let num = 1
                self.$axios.patch('http://localhost:8085/orders/confirm/' + tempnum + '/' + num).then(function (res) {
                    console.log(res.status)
                })
            }
        },
        rejectorder(index){
            const self = this
            let tempnum = self.storeorder[index].tempnum
                alert(tempnum)
                let num = 2
            self.$axios.patch('http://localhost:8085/orders/confirm/' + tempnum + '/' + num).then(function (res) {
                    console.log(res.status)
                })
        }
    }

}
</script>
<style scoped>
* {
    text-align: center;
    align-items: center;
}

img {
    width: 100px;
    height: 100px
}

td {
    padding-top: 10px
}

.cnt {
    width: 60px;
    height: 30px;
    border: 1px solid gray;
    text-align: center
}
.rejectbtn{
    border: 1px solid gray;
    padding-top: 3px;
    padding-bottom: 3px;
}
</style>