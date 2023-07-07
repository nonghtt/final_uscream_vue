<template>
    <div class="sidebar_container">

        <SideBar />
 
 



    </div> 
</template>
  
<script>
import SideBar from '@/views/SideBar.vue'

export default {
    name: "PAGETEST",
    components: { SideBar},
    data() {
        return {
            list: [],   // ==pageArray
            countall: 0,
            count: 0,
            id: sessionStorage.getItem("loginId"),
            markimg: require("../../assets/staron.png"),
            markimg2: require("../../assets/starnomal.png"),
            readimg: require("../../assets/msgnoread.png"),
            readimg2: require("../../assets/msgread.png"),
            checkedmsg: [],
            checked: [],
            num: [],
            clickmsg:[],
            currentPage:1,
            perPage:7,
            items: [
          { id: 1, first_name: 'Fred', last_name: 'Flintstone' },
          { id: 2, first_name: 'Wilma', last_name: 'Flintstone' },
          { id: 3, first_name: 'Barney', last_name: 'Rubble' },
          { id: 4, first_name: 'Betty', last_name: 'Rubble' },
          { id: 5, first_name: 'Pebbles', last_name: 'Flintstone' },
          { id: 6, first_name: 'Bamm Bamm', last_name: 'Rubble' },
          { id: 7, first_name: 'The Great', last_name: 'Gazzoo' },
          { id: 8, first_name: 'Rockhead', last_name: 'Slate' },
          { id: 9, first_name: 'Pearl', last_name: 'Slaghoople' }
        ]
        }
    },
    created: function () {
        const self = this;
        let id = sessionStorage.getItem("loginId");

        self.$axios.get("http://localhost:8085/msg/" + id)
            .then(function (res) {
                self.list = res.data.msglist;
                self.count = res.data.countByReadReceiveMsg;
                self.countall = res.data.countAllByReadReceiveMsg;
            })


    },
    methods: {
      
    
    
    
    },
    computed:{
        rows(){
            return this.items.length
        }
    }

}
</script>
  
 
<style scoped>
.sidebar_container {
    display: inline-block;
    width: 300px;
    text-align: left;
    border-right: 1px solid black;
    background-color: whitesmoke;
    height: 770px;
}


h3 {
    font-size: large;
}

.container {
    margin: 5px 5px 5px 5px;
}

.topbar {
    text-align: center;
    margin-top: 2%;
    margin-bottom: 2%;

}
.middlebar_container{
    border-bottom:1px solid black;
}

.middlebar {
    display: inline-block;
    margin-bottom: 20px;
}

.searchbar {
    float: right;

    display: inline-block;
}

.null_div {
    margin-top: 20px;
    text-align: center;
    font-size: 25px;
}


.main {
    width: 100%;
    text-align: center;
}

/* .boldtext{
    font-weight: bold;
} */

table {
    border-radius: 6px;
}
th {
    text-align: left;

}
th:nth-child(4)  {
    text-align: center;
}

tr {
    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

td {
    padding-top: 7px;
    padding-bottom: 12px;
}

td:nth-child(1) {
    width: 20%;
}

td:nth-child(2) {
    width: 15%;
    text-align: left;
}

td:nth-child(3) {
    width: 50%;
    text-align: left;
}

td:nth-child(4) {
    width: 15%;
}

.check {
    display: flex;
    align-items: center;
    width: 40px;
}


.lcon {
    width: 20px;
    height: 30px;
    margin-left: 20px;
    margin-right: 8px;
}

.checkbox_icon {
    zoom: 1.5;
}

.btncolor:hover{
  background-color: #04ac4e;
  color:#fefefe;
}
.btncolor{
    color:#fefefe;
    background-color: #03c75a;
    font-weight: 550 ;
    padding : 5px 10px;
    width : 100px;
}
.but {
    border:none;
    border-right: 2px solid rgba(0, 49, 9, 0.108);
}

.f{
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px; 
}

.e{
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px; 
}

.textbar{
    border-radius: 5px;
    width:250px;
    border-color: #EAEAEA;
}

.textbar:hover{
    border-color: black;
}
.bold {
  font-weight: bold;
}

</style>
  