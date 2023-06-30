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
                <td v-if="order.productnum.orderble == true"><input type="checkbox" name="checked" v-model="checked[index]"
                        @change="checkedProduct"></td>
                <td v-else><input type="checkbox" name="checked" disabled></td>
                <td>{{ order.productnum.productnum }}</td>
                <td>{{ order.productnum.productname }}</td>
                <td class="table-default">
                    <img v-bind:src="'http://localhost:8085/products/img/' + order.productnum.productnum">
                </td>
                <td>{{ order.productnum.cost }}</td>
                <td>
                    <input type="number" class="cnt" id="cnt" :value="order.amount"
                        @input="updateAmount(order, index, $event.target.value)" :readonly="'true'">
                </td>
                <td>{{ order.ordercost }}</td>
                <td v-if="order.confirm == 1">승인</td>
                <td v-if="order.confirm == 0">승인대기</td>
                <td v-if="order.confirm == 2">반려</td>
                <td><button type="button" v-if="accounttype == 1 && order.confirm == 0" @click="rejectorder(index)"
                        class="rejectbtn">반려</button></td>
            </tr>

        </table>
        <button type="button" v-if="accounttype == 1 && storeorder[0].confirm == 0" v-on:click="confirmorder">발주 승인</button>
        <button type="button" v-if="accounttype == 2 && storeorder[0].confirm == 0 && clicked == 0"
            @click="changeedit">수정</button>
        <button type="button" v-if="accounttype == 2 && clicked == 1" @click="edit">수정</button>
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
            inventorylist: [],
            accounttype: sessionStorage.getItem("accounttype"),
            clicked: 0
        }
    },
    created: function () {
        const self = this
        self.$axios.get('http://localhost:8085/orders/detail/' + self.storeid + '/' + self.orderdate).
            then(function (res) {
                self.storeorder = res.data.Storeorder
            })
        self.$axios.get('http://localhost:8085/inventorys').then(function (res2) {
            self.inventorylist = res2.data.inventorylist
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
                let storeid = self.storeid
                let tempnum = self.checkedproduct[i].tempnum
                let productnum = self.checkedproduct[i].product
                let amount = self.checkedproduct[i].amount
                alert(tempnum)
                let num = 1
                self.$axios.patch('http://localhost:8085/orders/confirm/' + tempnum + '/' + num).then(function (res) {
                    console.log(res.status)
                })

                for (let j = 0; j < self.inventorylist.length; j++) {
                    if (productnum == self.inventorylist[j].productname.productnum) {
                        let inventorynum = self.inventorylist[j].inventorynum
                        self.$axios.patch('http://localhost:8085/inventorys/' + storeid + '/' + inventorynum + '/' + amount).then(function (res2) {
                            console.log(res2.status)
                        })
                    }
                }

            }
        },
        rejectorder(index) {
            const self = this
            let tempnum = self.storeorder[index].tempnum
            alert(tempnum)
            let num = 2
            self.$axios.patch('http://localhost:8085/orders/confirm/' + tempnum + '/' + num).then(function (res) {
                console.log(res.status)
            })
        }, updateAmount(order, index, value) {
            order.amount = value;
            this.calculateOrderCost(order, index);
        },
        calculateOrderCost(order, index) {
            order.ordercost = order.productnum.cost * order.amount;
            this.checked[index] = true
            this.checkedProduct();
        },
        changeedit() {
            alert("clicked")
            var inputs = document.querySelectorAll('input[type="number"]');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].readOnly = false;
                this.clicked = 1
            }
        },
        edit() {
            const self = this
            for (let i = 0; i < self.checkedproduct.length; i++) {
                let tempnum = self.checkedproduct[i].tempnum
                let amount = self.checkedproduct[i].amount
                let ordercost = self.checkedproduct[i].ordercost
                alert(tempnum)
                self.$axios.patch('http://localhost:8085/orders/edit/' + tempnum + '/' + amount + '/' + ordercost).then(function (res) {
                    console.log(res.status)
                })

            }
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

.rejectbtn {
    border: 1px solid gray;
    padding-top: 3px;
    padding-bottom: 3px;
}
</style>