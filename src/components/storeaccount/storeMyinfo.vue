<template lang="">
    <div id="myinfo" class="myinfo">

      <div>
        <img src="../../assets/bckimg.jpg" 
            style="width:100%; height:100%;"
            class="background_img"></div>

     <div class="edit_window">
      <div class="brandname">USCREAM</div>      
      <div style="height:0px;">
              </div>

              <div class="title_myinfo" role="alert" style="font-size:25px; font-weight:bold;">
        지점 정보 확인</div>        


<!-- 왼쪽 컨테이너 -->
<div class="box1" id="div_outline">     
  <br/><br/>   
        <div class="div_storeid">
            <input class="input_storeid" type="text" v-model="storeid"><br/>
            <label class="label_storeid">storeid</label>
            <span class="span_storeid"></span>
        </div>        


        <!-- <button v-on:click="idcheck"></button></input><br/> -->
       
       <div class="div_storename">
        <input class="input_storename" type="text" v-model="storename">
        <label class="label_storename">storename</label>
        <span class="span_storename"></span>
        </div>
       

        <div class="div_pwd">
            <input class="input_pwd" type="password" v-model="pwd">    
            <label class="label_pwd">pwd</label>
            <span class="span_pwd"></span>
        </div>
        
        
        <div class="div_managername">
        <input class="input_managername" type="text" v-model="managername"><br/>
        <label class="label_managername">managername</label>
        <span class="span_managername"></span>
        </div>
        
        
        <div class="div_accounttype">
        <input class="input_accounttype" type="text" v-model="accounttype"><br/>
        <label class="label_accounttype">accounttype</label>
        <span class="span_accounttype"></span>
        </div>

</div>

            <!-- 오른쪽 컨테이너 -->
                    
            <div class="box2" id="div_outline">
              <div class="div_location">
                
            <input class="input_location" type="password" v-model="location">    
            <label class="label_location">location</label>
            <span class="span_location"></span>
            ↓지도들어갈꺼임↓ 
        </div>

        





    <img src="../../assets/1.png" 
              style="width:100%; height:100%;"
              class="img_main">
    </div>

        <br/><br/>
        <button class="btn_edit" v-on:click="edit">수정하기</button>
        &nbsp;<router-link to="/" class="btn_cancle">수정취소</router-link>
    </div>
    </div>
        <!-- <h3>kakao map configuration</h3>
       지도가 보여질 영역 -->
<!-- <div id="map" style="width:500px;height:400px;"></div> -->
</template>

<script>
export default {
name:"StoreEdit",
    data(){
        return{
            storeid:'',
            storename:'',
            pwd:'',
            managername:'',
            accounttype: ''
         }
     },
     created:function(){    //컴포넌트 실행될 때 한번 실행
            this.storeid = sessionStorage.getItem('loginId')
            this.accounttype = sessionStorage.getItem('accounttype')
            const self = this;
            self.$axios.get('http://localhost:8085/store/'+self.storeid)
            .then(function(res){
                if(res.status == 200){
                    let dto = res.data.dto
                    if(dto!=null){
                        self.storeid = dto.storeid
                        self.storename = dto.storename
                        self.pwd = dto.pwd
                        self.managername = dto.managername
                        if(self.accounttype == 1){
                            self.accounttype = '본사';
                        }else if(self.accounttype == 2){
                            self.accounttype = '지점';
                        }else{
                            self.accounttype = '지원하지 않는 유형입니다.';
                            }
                    }
                }
            });
     },
     methods:{
        edit(){
            const self = this;
            let formdata = new FormData();
            formdata.append('storeid',self.storeid)
            formdata.append('storename',self.storename)
            formdata.append('pwd',self.pwd)
            formdata.append('managername',self.managername)
            formdata.append('accounttype',self.accounttype)
            self.$axios('http://localhost/8085/store/'+self.storeid)
            .then(function(res){
             
                if(res.status == 200){
                    let dto = res.data.store
                    self.pwd = dto.pwd
                    self.managername = dto.managername
                }else{
                    alert('에러코드:' + res.status)
                }
            });
        }
     }
    }

</script>


<style scoped>

.text_myinfo{
position: absolute; left: 50%; top: 10%; 
transform: translate(-50%, -50%); text-align: center;
border-radius: 15%;
font-size:30px;
font-weight:bold;
border:0;
background-color: rgb(128, 129, 128);
border-radius: 5%;
color:white;
/* div겹치기위한 속성, 숫자가 클수록 위로 옴 */
z-index:6;
}


/* 버튼 색 바꾸기 */
.btn_edit{
background-color: rgb(128, 129, 128);
border:0;
color:white;
border-radius: 10%;
font-size:20px;
font-weight:bold;
}

#div_outline {
    /* display: inline-block; */
    float: left;
    line-height: 100%;
    text-align: center;
    font-size: 20px;
}

.brandname{
   color: #eb34a4;
   font-size:30px;
   font-weight: bold;
   vertical-align: center;
  }

.title_myinfo{
  background-color: #eb34a4;
  color:white;
}

.btn_cancle{
    background-color: rgb(128, 129, 128);
border:0;
color:white;
border-radius: 10%;
font-size:20px;
text-decoration: none;
font-weight:bold;
}

/* 내정보(myinfo) 윈도우 위치조정하기 */
.edit_window{
width: 800px;height: 800px;border: 1px solid #dcdcdc;
position: absolute; left: 50%; top: 55%; 
transform: translate(-50%, -50%); text-align: center;
border-radius: 15%;
box-shadow: 20px 20px 20px grey;
overflow:auto;
background-color: white;
}

/* 스크롤바 없애기 */
.edit_window{
   -ms-overflow-style: none;
}
.edit_window::-webkit-scrollbar{
  display:none;
}


/* input태그 공통 요소 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* input태그(storeid) 꾸미기 */

.div_storeid {
  position: relative;
  width: 300px;
  margin-left: 50px;
  margin-top: 20px;
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
.input_storeid::placeholder { color: #aaa; }
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

 


/* input태그(storename) 꾸미기 */

.div_storename {
  position: relative;
  width: 300px;
  margin-left: 50px;
  margin-top: 100px;
}

.input_storename {
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

/* .input_storename::placeholder { color: #aaaaaa; } */
.input_storename::placeholder { color: #aaaaaa; }
.input_storename:focus { outline: none; }

.span_storename {
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

.label_storename {
  position: absolute;
  color: #aaaaaa;
  left: 10px;
  font-size: 20px;
  bottom: 8px;
  transition: all .2s;
}

.input_storename:focus ~ .label_storename, .input_storename:valid ~ .label_storename {
  font-size: 16px;
  bottom: 40px;
  /* 커서올렸을때 글자가 변하는 색 >>>>> 나중에 상의해서 변경하는 */
  /* color: #666; */
  color:#666;
  font-weight: bold;
}

.input_storename:focus ~ .span_storename, .input_storename:valid ~ .span_storename {
  width: 100%;
 
}


/* input태그(pwd) 꾸미기 */

.div_pwd {
  position: relative;
  width: 300px;
  margin-left: 50px;
  margin-top: 100px;
}

.input_pwd {
  font-size: 15px;
  color: #222222;
  width: 300px;
  border: none;
  border-bottom: solid #aaaaaa 1px;
  padding-bottom: 5px;
  padding-left: 5px;
  position: relative;
  background: none;
  z-index: 5;
}

/* .input_storeid::placeholder { color: #aaaaaa; } */
.input_pwdeid::placeholder { color: #e13b3b; }
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
  color: #aaaaaa;
  left: 10px;
  font-size: 20px;
  bottom: 8px;
  transition: all .2s;
}

.input_pwd:focus ~ .label_pwd, .input_pwd:valid ~ .label_pwd {
  font-size: 16px;
  bottom: 40px;
  /* 커서올렸을때 글자가 변하는 색 >>>>> 나중에 상의해서 변경하는 */
  /* color: #666; */
  color:#666;
  font-weight: bold;
}

.input_pwd:focus ~ .span_pwd, .input_pwd:valid ~ .span_pwd {
  width: 100%;
}



/* input태그(managername) 꾸미기 */

.div_managername {
  position: relative;
  width: 300px;
  margin-left: 50px;
  margin-top: 100px;
}

.input_managername {
  font-size: 15px;
  color: #222222;
  width: 300px;
  border: none;
  border-bottom: solid #aaaaaa 1px;
  padding-bottom: 5px;
  padding-left: 5px;
  position: relative;
  background: none;
  z-index: 5;
}

/* .input_managername::placeholder { color: #aaaaaa; } */
.input_managername::placeholder { color: #e13b3b; }
.input_managername:focus { outline: none; }

.span_managername {
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

.label_managername {
  position: absolute;
  color: #aaaaaa;
  left: 10px;
  font-size: 20px;
  bottom: 8px;
  transition: all .2s;
}

.input_managername:focus ~ .label_managername, .input_managername:valid ~ .label_managername {
  font-size: 16px;
  bottom: 40px;
  /* 커서올렸을때 글자가 변하는 색 >>>>> 나중에 상의해서 변경하는 */
  /* color: #666; */
  color:#666;
  font-weight: bold;
}

.input_managername:focus ~ .span_managername, .input_managername:valid ~ .span_managername {
  width: 100%;
 
}



/* input태그(accounttype) 꾸미기 */

.div_accounttype {
  position: relative;
  width: 300px;
  margin-left: 50px;
  margin-top: 100px;
}

.input_accounttype {
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

/* .input_accounttype::placeholder { color: #aaaaaa; } */
.input_accounttype::placeholder { color: #e13b3b; }
.input_accounttype:focus { outline: none; }

.span_accounttype {
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

.label_accounttype {
  position: absolute;
  color: #aaaaaa;
  left: 10px;
  font-size: 20px;
  bottom: 8px;
  transition: all .2s;
}

.input_accounttype:focus ~ .label_accounttype, .input_accounttype:valid ~ .label_accounttype {
  font-size: 16px;
  bottom: 40px;
  /* 커서올렸을때 글자가 변하는 색 >>>>> 나중에 상의해서 변경하는 */
  /* color: #666; */
  color:#666;
  font-weight: bold;
}

.input_accounttype:focus ~ .span_accounttype, .input_accounttype:valid ~ .span_accounttype {
  width: 100%;
 
}


/* input(location) 창 꾸미기 */
  
.div_location {
    position: relative;
    width: 300px;
    margin-left: 50px;
    margin-top: 50px;
  }
  
  .input_location {
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
  
 
  .input_location::placeholder { color: #aaaaaa; }
  .input_location:focus { outline: none; }
  
  .span_location {
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
  
  .label_location {
    position: absolute;
    color: #aaaaaa;
    left: 10px;
    font-size: 20px;
    bottom: 8px;
    transition: all .2s;
  }
  
  .input_location:focus ~ .label_location, .input_location:valid ~ .label_location {
    font-size: 16px;
    bottom: 40px;
    /* 커서올렸을때 글자가 변하는 색 >>>>> 나중에 상의해서 변경하는 */
    /* color: #666; */
    color:#666;
    font-weight: bold;
  }
  
  .input_location:focus ~ .span_location, .input_location:valid ~ .span_location {
    width: 100%;
   
  }
</style>