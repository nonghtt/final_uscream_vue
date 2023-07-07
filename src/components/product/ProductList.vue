<template>
    <div class="container">
        <div class="row justify-content-end" style="margin: 0 0 20px 0;">
            <div class="col-5"></div>
            <div class="col-4 justify-content-center">
                <h3 style="margin-top: 10px ;">상품리스트</h3>
            </div>
            <div class="col-3 justify-content-end" style="align-items: center; right: 30px;position:relative;display: flex;"><button type="button"
                    class="btn btncolor" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    제품등록
                </button></div>
                <button @click="addinventory">인벤토리</button>
        </div>
        <div v-for="product in productlist" :key="product.productnum" class="card mb-3"
            style="float:left; width:31%; height:140px;">
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

    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">상품등록</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table>
                        <tr>
                            <th>제품명</th>
                            <td><input type="text" v-model="productname"></td>
                        </tr>
                        <tr>
                            <th>제품 이미지</th>
                            <td><input type="file" ref="productimg" @change="selectimg"></td>
                        </tr>
                        <tr>
                            <th>상품설명</th>
                            <td><textarea v-model="productinfo"></textarea></td>
                        </tr>
                        <tr>
                            <th>제품 가격</th>
                            <input type="number" v-model="cost">
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="addproduct">등록</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
            productlist: [],
            productname: '',
            productinfo: '',
            pimg: '',
            cost: '',
            store: []
        }
    },
    created: function () {
        const self = this
        self.$axios.get("http://localhost:8085/products").then(function (res) {
            self.productlist = res.data.list
        })
    },
    methods: {
        selectimg() {
            this.pimg = this.$refs.productimg.files[0]
            console.log(this.pimg)
        },
        addproduct() {
            const self = this;
            let formdata = new FormData()
            let orderble = true
            formdata.append("productname", this.productname)
            formdata.append("pimg", this.pimg)
            formdata.append("productinfo", this.productinfo)
            formdata.append("cost", this.cost)
            formdata.append("orderble", orderble)
            self.$axios.post('http://localhost:8085/products', formdata, {
                headers: {
                    'contnet-type': 'multipart/form-data'
                }
            }).then(function (res) {
                location.href = "/"
                console.log(res.data)
                /* console.log(res.data)
                let num = res.data.product.productnum
                let cnt = 0
                
                self.$axios.get("http://localhost:8085/store").then(function(res2){
                    self.store=res2.data.storelist

                })
                console.log(self.store)
                for(let i=0;i<self.store.length;i++){
                    let form = new FormData()
                    form.append("cnt",cnt)
                    form.paaend("storeid",self.store[i].storeid)
                    form.append("productname",num)
                    self.$axios.post('http://localhost:8085/inventorys',form).then(function(res3){
                        console.log(res3)
                    })
                } */
            })
        },
        addinventory(){
            const self = this
            self.$axios.get("http://localhost:8085/store").then(function(res){
                let storelist =  res.data.storelist
                for(let i =0 ; i < storelist.length ; i++){
                    let accounttype = storelist[i].accounttype
                    if(accounttype ==2){
                self.$axios.get('http://localhost:8085/products').then(function(res){
                for(let j=0; j<res.data.list.length; j++){
                let productnum = res.data.list[j].productnum
                console.log(productnum)
                let form = new FormData()
                form.append("productname",productnum)
                form.append("storeid",storelist[i].storeid)
                form.append("amount",0)
                self.$axios.post('http://localhost:8085/inventorys',form).then(function(res2){
                  console.log(res2.data.inventory)
                })
              }

            })
          }
                    
                }
            })

        }
    }
}
</script>
<style scoped>
.container {
    position: relative;
    top: 30px
}

.card {
    margin-left: 10px;
    margin-right: 10px;
}

img {
    width: 128.93px;
    height: 128.93px
}

.btncolor:hover {
    background-color: #FFC67B;
    color: #595959
}

.btncolor {
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
}
</style>

