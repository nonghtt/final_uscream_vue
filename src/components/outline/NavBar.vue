 <template>
    <nav v-if="loginId == null" class="navbar navbar-expand-lg bg-light shadow">
        <div class="container-fluid">
            <div></div>
            <div class="justify-content-center">
                <a class="navbar-brand " href="#">
                    <router-link class="logorouter" to="/">
                        <img class="logo" src="../../assets/uscreamlogo.png"><span class="logotitle">USCREAM</span>
                    </router-link>
                </a>
            </div>
            <div></div>
        </div>
    </nav>
    <nav v-if="loginId != null" class="navbar navbar-expand-lg bg-light shadow">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <router-link to="/about">
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
                            <li><router-link class="menu" to="/storeList">지점현황</router-link></li>

                        </ul>
                    </li>
                    <li v-if="accounttype == 2" class="nav-item">
                        <router-link class="nav-link active" to="/storeMyinfo">내정보</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link active" to="/NoticeList">
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
                            <li v-if="accounttype == 1"><router-link class="dropdown-item" 
                                    to="/productlist">상품리스트</router-link></li>
                            <li v-if="accounttype == 2"><router-link class="dropdown-item" 
                                    to="/inventory">재고관리</router-link></li>
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
                            <router-link class="nav-link active" v-if="accounttype == 1" to="/headsales">매출관리</router-link>
                            <router-link class="nav-link active" v-if="accounttype == 2" to="/branchsales">매출관리</router-link>
                    </li>
          
                    <li class="nav-item">
                        <router-link class="nav-link" to="/VocList">
                            고객의소리
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="d-flex justify-content-end">
                <router-link class="nav-link mailicon" to="/about">
                    <i class="fa-solid fa-house-chimney"></i>
                </router-link>
                <router-link class="nav-link mailicon" to="/storeMyinfo">
                    <i class="fa-solid fa-user"></i>
                </router-link>
                <router-link class="nav-link mailicon" to="/ReceiveMsg">
                    <i class="fa-solid fa-envelope "></i>
                    <span v-if="mail != 0"
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
            accounttype: null,
            loginId: null,
            mail: 0
        }
    },
    created: function () {
        const self = this
        if (sessionStorage.getItem("loginId") != null) {
            self.loginId = sessionStorage.getItem("loginId");
            self.accounttype = sessionStorage.getItem("accounttype")
            
        
            self.$axios.get("http://localhost:8085/msg/nav/" +sessionStorage.getItem("loginId"))
            .then(function (res) {
             self.mail=res.data;
            })
        }

       
    },
    methods: {
        logout() {
            sessionStorage.removeItem('loginId')
            sessionStorage.removeItem('accounttype')
            sessionStorage.removeItem('lastorder')
            location.href = '/';
            alert('로그아웃이 완료되었습니다.')
        },
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
    font-size: 20px;
    color:black
}
.logo {
    width: 50px;
    height: 60px;
    
}
.logotitle{
    font-family: 'NotoSansKR-Bold';
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
.mailicon {
    margin-left: 10px;
    margin-right: 13px;
}
.logorouter {
    text-decoration: none;
}
.fa-house-chimney {
    font-size: 23px;
}
.fa-envelope {
    font-size: 23px;
}
a {
    text-decoration: none;
}

.nav-link:active{
    background-color:  #bee96d;
}

.dropdown-item:active{
    background-color:  #bee96d;
    color : #595959;
}

.nav-link{
    color : #000000;
}

</style>