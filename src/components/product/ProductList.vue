<template>
    <div class="container">
        <h3 style="margin-left:10px">상품 리스트</h3>
        <div v-for="product in productlist" :key="product.productnum" class="card mb-3"
            style="float:left; width:30%; height:140px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img img v-bind:src="'http://localhost:8085/products/img/' + product.productnum"
                        class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">{{ product.productname }}</h5>
                        <p class="card-text">{{ product.productinfo }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProductList",
    data() {
        return {
            card: "card",
            productlist: []
        }
    },
    created: function () {
        const self = this
        self.$axios.get("http://localhost:8085/products").then(function (res) {
            self.productlist = res.data.list
        })
    }
}
</script>
<style scoped>
.container{
    position: relative;
    top:30px
}
.card{
    margin-left: 10px;
    margin-right: 10px;
}
img{
    width:128.93px;
    height:128.93px
}
</style>

