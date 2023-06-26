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
                            <li><a class="dropdown-item" href="#">지점등록</a></li>
                            <li><a class="dropdown-item" href="#">지점현황</a></li>
                            <li><a class="dropdown-item" href="#">내정보</a></li>
                        </ul>
                    </li>
                    <li v-if="accounttype == 2" class="nav-item">
                        <router-link class="nav-link active" to="/about">
                            내정보
                        </router-link>
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
                            <li><a class="dropdown-item" href="#">발주현황</a></li>
                            <li v-if="accounttype == 1"><a class="dropdown-item" href="#">상품등록</a></li>
                            <li v-if="accounttype == 2"><a class="dropdown-item" href="#">재고관리</a></li>
                        </ul>
                    </li>
                    <li v-if="accounttype == 2" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            직원관리
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">직원등록</a></li>
                            <li><a class="dropdown-item" href="#">직원명단</a></li>
                            <li><a class="dropdown-item" href="#">업무스케줄</a></li>
                            <li><a class="dropdown-item" href="#">근태관리</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link active" to="/about">
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
                <router-link class="nav-link mailicon" to="/about">
                    <i class="fa-solid fa-envelope "></i>
                </router-link>
                <router-link class="nav-link" to="/about" style="margin-left: 10px; margin-right: 10px;">
                    LOGOUT
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
            accounttype: 1,
            loginId: 1
        }
    },


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
    margin-right: 10px;
}
.logorouter{
    text-decoration: none;
}
</style>
  