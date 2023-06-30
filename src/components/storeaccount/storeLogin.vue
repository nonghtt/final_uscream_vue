<template>
    <div id="login" class="login">
      <!-- <div class="text_login">LOGIN</div> -->


      <!-- <div>
        <img src="../../assets/bckimg.jpg" 
            style="width:100%; height:100%;"
            class="background_img"></div> -->
      
      <div id="login_window">
      <div class="brandname">USCREAM</div>
        <div style="height:40px;"></div>
          <div class="title_login" role="alert" style="font-size:25px; font-weight:bold;">
        LOGIN</div>

      
         

        <!-- <router-link class="logorouter" to="/">
        <img class="logo" style="width:50px; height:50px;" src="../assets/uscreamlogo.png"></router-link> -->
          
          <div class="div_storeid">
          <input class="input_storeid" type="text" v-model="storeid" required>
          <label class="label_storeid">아이디</label>
          <span class="span_storeid"></span>
          </div>
  
          
          <div class="div_pwd">
          <input class="input_pwd" type="password" v-model="pwd" required>
          <label class="label_pwd">비밀번호</label>
          <span class="span_pwd"></span>
        </div>

        <br/>
        <br/>
        <br/>
          <button class="btn_login" v-on:click="login">로그인하기</button>
          </div>
    </div>








  </template>
  
  <script>
  export default {
    name: 'storeLogin',
    data(){
      return{
        storeid:'',
        pwd:'',
        accounttype:''
      }
    },
    components: {

    },
    methods:{
      login(){
              const self = this;
              const form = new FormData();
              form.append('storeid', self.storeid);
              form.append('pwd', self.pwd);
              self.$axios.post('http://localhost:8085/store/login', form) //비동기요청
              .then(function(res){
                  if(res.status == 200){
                      if(res.data.flag){
                          sessionStorage.setItem('loginId', self.storeid)
                          sessionStorage.setItem('accounttype', res.data.type)
                          location.href='/about'
                  }else{
                      alert('로그인 실패')
                  }
              }else{
                  alert('에러코드:' + res.status)
              }
              });
          },
      logout(){
            sessionStorage.remove('storeid')
            sessionStorage.remove('accounttype')
            location.href='/'
          }
    }
  }
  </script>
  <style scoped>
  
  
  /* div위에 div고정 */
  .text_login{
  position: absolute; left: 50%; top: 28%; 
  transform: translate(-50%, -50%); text-align: center;
  border-radius: 15%;
  font-size:30px;
  border:0;
  background-color: rgb(128, 129, 128);
  border-radius: 10%;
  color:white;
  /* div겹치기위한 속성, 숫자가 클수록 위로 옴 */
  z-index:6;
  }
  
  /* 버튼 색 바꾸기 */
  .btn_login{
  background-color: #8eb443;
  border:0;
  color:white;
  font-size:20px;
  width:300px;
  font-weight:bold;
  }
  
  /* 로그인창 윈도우 위치조정 */
  #login_window{
  width: 400px;height: 450px;border: 1px solid #dcdcdc;
  position: absolute; left: 50%; top: 50%; 
  transform: translate(-50%, -50%); text-align: center;
  border-radius: 15%;
  box-shadow: 20px 20px 20px grey;
  background-color: white;
  }
  
  .brandname{
   color: #8eb443;
   font-size:30px;
   font-weight: bold;
  }
  .title_login{
    background-color: #8eb443;
    color:white;
    margin:0;
    /* border-radius:  0 0; */
  }
  
  
        /* 마우스 올리면 버튼 올라오는 기능 */
      /* .btn_login:hover,
      .btn_login:focus-visible{
          transform: translateY(-1rem);
      } */
  
      
     
  
      * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  
  /* input(storeid) 창 꾸미기 */
  
  .div_storeid {
    position: relative;
    width: 300px;
    margin-left: 50px;
    margin-top: 50px;
  }
  
  .input_storeid {
    font-size: 15px;
    color: #222222;
    width: 300px;
    border: none;
    border-bottom: solid #aaaaaa 1px;
    padding-bottom: 10px;
    padding-left: 10px;
    position: relative;
    background: none;
    z-index: 5;
  }
  
  /* .input_storeid::placeholder { color: #aaaaaa; } */
  .input_storeid::placeholder { color: #aaaaaa; }
  .input_storeid:focus { outline: none; }
  
  .span_storeid {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0%;  /* right로만 바꿔주면 오 - 왼 */
    background-color: #666;
    width: 0;
    height: 2px;
    border-radius: 2px;
    transition: 0.5s;
  }
  
  .label_storeid {
    position: absolute;
    color: #aaaaaa;
    left: 10px;
    font-size: 20px;
    bottom: 8px;
    transition: all .2s;
  }
  
  .input_storeid:focus ~ .label_storeid, .input_storeid:valid ~ .label_storeid {
    font-size: 16px;
    bottom: 40px;
    /* 커서올렸을때 글자가 변하는 색 >>>>> 나중에 상의해서 변경하는 */
    /* color: #666; */
    color:#666;
    font-weight: bold;
  }
  
  .input_storeid:focus ~ .span_storeid, .input_storeid:valid ~ .span_storeid {
    width: 100%;
   
  }
  
       
  /* input태그(pwd) 꾸미기 */
  .div_pwd {
    position: relative;
    width: 300px;
    margin-left: 50px;
    margin-top: 50px;
  }
  
  .input_pwd {
    font-size: 15px;
    color: #222222;
    width: 300px;
    border: none;
    border-bottom: solid #aaaaaa 1px;
    padding-bottom: 10px;
    padding-left: 10px;
    position: relative;
    background: none;
    z-index: 5;
  }
  
  .input_pwd::placeholder { color: #aaaaaa; }
  .input_pwd:focus { outline: none; }
  
  .span_pwd {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0%;  /* right로만 바꿔주면 오 - 왼 */
    background-color: #666;
    width: 0;
    height: 2px;
    border-radius: 2px;
    transition: 0.5s;
  }
  
  .label_pwd {
    position: absolute;
    color: #aaa;
    left: 10px;
    font-size: 20px;
    bottom: 8px;
    transition: all .2s;
  }
  
  .input_pwd:focus ~ .label_pwd, .input_pwd:valid ~ .label_pwd {
    font-size: 16px;
    bottom: 40px;
    color: #666;
    font-weight: bold;
  }
  
  .input_pwd:focus ~ .span_pwd, .input_pwd:valid ~ .span_pwd {
    width: 100%;
  }
    
  </style>