<template>
    <div class="container">
        <h3>{{storeid  }} 재고 현황</h3>
        <table class="table table-light table-striped table-bordered">
            <tr>
                <th>제품 번호</th>
                <th>제품명</th>
                <th>제품 이미지</th>
                <th>재고 수</th>
                <th>제품 번호</th>
                <th>제품명</th>
                <th>제품 이미지</th>
                <th>재고 수</th>
            </tr>
        </table>
        <table class="table table-light table-striped table-bordered" >
            <tr v-for="(inventory, index) in inventorylist" :key="index" style="float:left; width:50%">
                <td style="width: 164px;">{{ inventory.productname.productnum }}</td>
                <td style="width: 116px;">{{ inventory.productname.productname }}</td>
                <td style="width: 201px;"><img v-bind:src="'http://localhost:8085/products/img/' + inventory.productname.productnum"></td>
                <td style="width: 127px;">{{ inventory.amount }}</td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    name: "StoreInventory",
    data() {
        return {
            inventorylist: [],
            storeid:sessionStorage.getItem('loginId')
        }
    },
    created: function () {
        const self = this
        self.$axios.get('http://localhost:8085/inventorys/'+self.storeid).then(function (res) {
            self.inventorylist = res.data.inventorylist
            console.log(res.data.inventorylist)
        })
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