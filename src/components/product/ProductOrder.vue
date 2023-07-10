<template>
    <div class="container">
        <h3 style="margin-top: 20px;">발주 신청</h3>
        <table class="table table-light table-striped table-bordered">
            <tr class="table-primary">
                <th>선택</th>
                <th>제품번호</th>
                <th>상품명</th>
                <th>상품 이미지</th>
                <th>상품 가격</th>
                <th>수량</th>
                <th>발주금액</th>
            </tr>
            <tr v-for="(product, index) in productlist" :key="product.productnum" class="table table-light">
                <td v-if="product.orderble"><input type="checkbox" name="checked" v-model="checked[index]"
                        @change="checkedProduct"></td>
                <td v-else><input type="checkbox" name="checked" disabled></td>
                <td>{{ product.productnum }}</td>
                <td>{{ product.productname }}</td>
                <td class="table-default"><img v-bind:src="'http://localhost:8085/products/img/' + product.productnum"></td>
                <td>{{ product.cost }}</td>
                <td><input type="number" class="cnt" v-model="amount[index]" @change="multiplecost(product, index)"></td>
                <td>{{ ordercost[index] }}</td>
            </tr>

        </table>
        <button type="button" class="btn btn-info btncolor" v-on:click="add">발주</button>
        
    </div>
</template>
<script>
import router from '@/router';

export default {
    name: "ProductOrder",
    data() {
        return {
            productnum: '',
            checked: [],
            amount: [],
            productlist: [],
            ordercost: [],
            checkedproduct: []
        }
    },
    created: function () {
        const self = this;
        self.$axios.get("http://localhost:8085/products")
            .then(function (res) {
                self.productlist = res.data.list
            })
    }, methods: {
        multiplecost(product, index) {
            this.ordercost[index] = product.cost * this.amount[index]
            this.checked[index] = true
            this.checkedProduct();
        },
        checkedProduct() {
            let storeid = sessionStorage.getItem("loginId")
            this.checkedproduct = [];
            for (let i = 0; i < this.checked.length; i++) {
                if (this.checked[i]) {
                    this.checkedproduct.push({
                        store: storeid,
                        product: this.productlist[i].productnum,
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
        },
        add() {
            const self = this
            /* let formdata = new FormData(); */
            // formdata.append("dto", JSON.stringify(this.checkedproduct));
            // formdata.append("dto", this.checkedproduct);
            // alert(JSON.stringify(this.checkedproduct))

           /*  this.checkedproduct.forEach((element) => {
                alert(element);
                formdata.append("dto",JSON.stringify(element));
            }); */
            const requestData = JSON.stringify(this.checkedproduct);
            self.$axios.post("http://localhost:8085/orders", requestData, 
            {headers : {
                "Content-Type":'application/json'
            }})
            .then(function(res){
                alert(res.data.ordercnt+"개의 상품이 발주신청 되었습니다.")
                router.push('OrderList')
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
    border: 1px solid gray
}
.btncolor:hover{
  background-color: #FFC67B;
  color:#595959
}
.btncolor{
    margin: 20px 0 20px 0;
    width: 100px;
    color:#595959;
    background-color: #bee96d;
    font-weight: bolder ;
}
</style>