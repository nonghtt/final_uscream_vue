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
            </tr>
            <tr v-for="(order, index) in storeorder" :key="order.productnum.productnum" class="table table-light">
                <td v-if="order.productnum.orderble==true"><input type="checkbox" name="checked" v-model="checked[index]"
                        @change="checkedProduct"></td>
                <td v-else><input type="checkbox" name="checked" disabled></td>
                <td>{{ order.productnum.productnum }}</td>
                <td>{{ order.productnum.productname }}</td>
                <td class="table-default"><img v-bind:src="'http://localhost:8085/products/img/' + order.productnum.productnum"></td>
                <td>{{ order.productnum.cost }}</td>
                <td><input type="number" class="cnt" v-model="order.amount" @change="multiplecost(order.productnum, index,order.amount)" ></td>
               <!--  <td><input type="number" class="cnt" v-model="amount[index]" @change="multiplecost(product, index)"></td> -->
                <td>{{ order.ordercost }}</td>
                <td v-if="order.confirm == true">승인</td>
                <td v-if="order.confirm!=true">승인대기</td>
            </tr>

        </table>
        <button type ="button" v-if="accounttype ==1" @click="confrim">발주 승인</button>
        <button type ="button" v-if="accounttype ==2" @click="edit">수정</button>
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
            storeorder:[],
            checked:[],
            amount:[],
            ordercost:[],
            checkedproduct: [],
            accounttype : sessionStorage.getItem("accounttype")
        }
    },
    created: function () {
        const self = this
        self.$axios.get('http://localhost:8085/orders/detail/'+self.storeid+'/'+self.orderdate).
        then(function(res){
            self.storeorder = res.data.Storeorder
        })
    },
    methods:{
        checkedProduct() {
            
            this.checkedproduct = [];
            for (let i = 0; i < this.checked.length; i++) {
                if (this.checked[i]) {
                    this.checkedproduct.push({
                        store: this.storeid,
                        product: this.storeorder[i].productnum.productnum,
                        amount: this.amount[i],
                        ordercost: this.ordercost[i],
                    })
                } else {
                    this.updateCheckedProduct(i);
                }
            }
        },
        updateCheckedProduct(index) {
            if (!this.checked[index]) {
                const foundIndex = this.checkedproduct.findIndex(item => item.productnum === this.productlist[index].productnum);
                if (foundIndex !== -1) {
                    this.checkedproduct.splice(foundIndex, 1);
                }
            }
        },multiplecost(product, index,amount) {
            alert(product.cost)
            alert(index)
            alert(amount)
            this.ordercost[index] = product.cost * amount
            this.checked[index] = true
            this.checkedProduct();
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
</style>