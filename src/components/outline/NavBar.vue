<template>
    <nav v-if="loginId == null" class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
            <div></div>
            <div class="justify-content-center">
                <a class="navbar-brand " href="#">
                    <router-link class="logorouter" to="/">
                        <img class="logo" src="../../assets/uscreamlogo.png">USCREAM
                    </router-link>
                </a>
            </div>
            <div></div>
        </div>
    </nav>
    <nav v-if="loginId != null" class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <router-link to="/">
                    <img class="logo" src="../../assets/uscreamlogo.png">
                </router-link>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li v-if="accounttype == 1" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            계정관리
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link class="menu" to="/storeJoin">지점등록</router-link></li>
                            <li><router-link class="menu" to="/storeState">지점현황</router-link></li>
                            <li><router-link class="menu" to="/storeMyinfo">내정보</router-link></li>
                        </ul>
                    </li>
                    <li v-if="accounttype == 2" class="nav-item">
                        <router-link class="nav-link active" to="/storeMyinfo">내정보</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link active" to="/about">
                            공지사항
                        </router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            상품관리
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link class="dropdown-item" to="/orderlist">발주현황</router-link></li>
                            <li v-if="accounttype == 1"><a class="dropdown-item" href="#">상품등록</a></li>
                            <li v-if="accounttype == 1"><router-link class="dropdown-item" active-class="active" to="/productlist" >상품리스트</router-link></li>
                            <li v-if="accounttype == 2"><a class="dropdown-item" href="#">재고관리</a></li>
                        </ul>
                    </li>
                    <li v-if="accounttype == 2" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            직원관리
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link class="dropdown-item" to="/empadd">직원등록</router-link></li>
                            <li><router-link class="dropdown-item" to="/emplist">직원명단</router-link></li>
                            <li><router-link class="dropdown-item" to="/schedule">업무스케줄</router-link></li>
                            <!-- <li><a class="dropdown-item" href="../schedule/ScheDule.vue">업무스케줄</a></li> -->
                            <li><router-link class="dropdown-item" to="/worklogs">근태관리</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link active" to="/branchsales">
                            매출관리
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/about">
                            고객의소리
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="d-flex justify-content-end">
                <router-link class="nav-link mailicon" to="/about">
                    <i class="fa-solid fa-house-chimney"></i>
                </router-link>
                <router-link class="nav-link mailicon" to="/ReceiveMsg">
                    <i class="fa-solid fa-envelope "></i>
                    <span v-if="mail !=null"
                        class="position-absolute top-30 start-250 translate-middle p-2 bg-danger border border-light rounded-circle">
                        <span class="visually-hidden">New alerts</span>
                    </span>
                </router-link>
                <router-link class="nav-link" to="/about" style="margin-left: 10px; margin-right: 10px;">
                 <P v-on:click="logout"> LOGOUT </P>
                </router-link>

            </div>
        </div>
    </nav>
</template>
  
<script>
export default {
    name: "NavBar",
    data() {
        return {
            // 테스트용 데이터
            accounttype:null,
            loginId: null,
            mail:null
        }
    },
    created: function(){
        const self =this
        if(sessionStorage.getItem("loginId")!=null){
            self.loginId = sessionStorage.getItem("loginId");
            self.accounttype = sessionStorage.getItem("accounttype")
            
        }
    },
    methods:{
        logout(){
            sessionStorage.removeItem('loginId')
            sessionStorage.removeItem('type')
            location.href = '/';
            alert('로그아웃이 완료되었습니다.')
        }
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
    font-size: 20px;
}

.logo {
    width: 50px;
    height: 60px;
}

h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: black
}

.mailicon {
    margin-left: 10px;
    margin-right: 13px;
}

.logorouter {
    text-decoration: none;
}

.fa-house-chimney{
    font-size: 23px;
}
.fa-envelope{
    font-size: 23px;
    
}

a{
    text-decoration : none;
}
</style>
  