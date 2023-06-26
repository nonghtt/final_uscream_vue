<template lang="">
    <div id="join" class="join">
        <div class="text_join">JOIN</div>
        <div class="join_window">


        <div class="div_storeid">
        <input class="input_storeid" type="text" v-model="storeid"><br/>
        <label class="label_storeid">아이디</label>
        <span class="span_storeid"></span>
        </div>


        <!-- <button v-on:click="idcheck"></button></input><br/> -->
        
        <div class="div_storename">
        <input class="input_storename" type="text" v-model="storename"><br/>
        <label class="label_storename">지점명</label>
        <span class="span_storename"></span>
        </div>
        
        <div class="div_pwd">
        <input class="input_pwd" type="password" v-model="pwd"><br/>
        <label class="label_pwd">비밀번호</label>
        <span class="span_pwd"></span>
        </div>


        <div class="div_managername">
        <input class="input_managername" type="text" v-model="managername"><br/>
        <label class="label_managername">지점장 이름</label>
        <span class="span_managername"></span>
        </div>

        
        <div class="div_accounttype">
                    <input class="select" name="type" type="radio" id="radio" v-model="type" value="1" checked><label for="radio">본사</label>
                    <input class="select" name="type" type="radio" id="radio2" v-model="type" value="2"><label for="radio2">지점</label><br/> 
                     <label class="label_accounttype">타입</label>
                    <span class="span_accounttype"></span>
        </div>
       
                    <!-- storeimg:
                        x:
                        y: -->
            <button class="btn_join" v-on:click="join">가입하기</button>
        </div>
    </div>
</template>
<script>
export default {
    name: "StoreJoin",
    data(){
        return{
            storeid:'',
            storename:'',
            pwd:'',
            managername:'',
            accounttype:0
        }
    },
    methods :{
        join(){
        const self = this;

        let formdata = new FormData();
        formdata.append('storeid',self.storeid)
        formdata.append('storename',self.storename)
        formdata.append('pwd',self.pwd)
        formdata.append('managername',self.managername)
        formdata.append('accounttype',self.accounttype)
        self.$axios.post('http://localhost:8085/store', formdata)
        .then(function(res){
         if(res.status==200){
            let dto = res.data.store
            alert(dto.storeid+"/"+dto.accounttype)
            alert(self.storeid+"님, 회원가입이 완료되었습니다. 축하드립니다.")
            location.href='/'
        }else{
            alert('에러코드:'+res.status)
        }
    })
    }
    //     idcheck(){
    //         const self = this;
    //   self.$axios.get('/store/'+self.id)
    //   .then(function(res){
    //     if(res.status==200 ){
    //       if(res.data.dto==null){
    //         self.msg= '사용가능한 아이디'
    //       }else{
    //         self.msg='중복된 아이디'
    //         self.id=''
    //       }
    //     }else{
    //       alert('에러코드:'+res.status)
    //     }

    //   }); 
    //     }
    }
}
</script>
<style scoped>
.text_join{
position: absolute; left: 50%; top: 28%; 
transform: translate(-50%, -50%); text-align: center;
border-radius: 15%;
font-size:30px;
border:0;
font-weight:bold;
background-color: rgb(128, 129, 128);
border-radius: 10%;
color:white;
/* div겹치기위한 속성, 숫자가 클수록 위로 옴 */
z-index:6;
}

/* 버튼 색 바꾸기 */
.btn_join{
    background-color: rgb(128, 129, 128);
border:0;
color:white;
border-radius: 10%;
font-size:20px;
font-weight:bold;
}




/* 회원가입 윈도우 위치 조정 */
.join_window{
width: 400px;height: 400px;border: 1px solid #dcdcdc;
position: absolute; left: 50%; top: 50%; 
transform: translate(-50%, -50%); text-align: center;
border-radius: 15%;
box-shadow: 20px 20px 20px grey;
overflow:auto;
}


/* 스크롤바 없애기 */
.join_window{
   -ms-overflow-style: none;
}
.join_window::-webkit-scrollbar{
  display:none;
}

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
  margin-top: 100px;
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
.input_storeid::placeholder { color: #e13b3b; }
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










/* input(storename) 창 꾸미기 */

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

/* .input_storeid::placeholder { color: #aaaaaa; } */
.input_storename::placeholder { color: #e13b3b; }
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




/* input(pwd) 창 꾸미기 */

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
  padding-bottom: 10px;
  padding-left: 10px;
  position: relative;
  background: none;
  z-index: 5;
}

/* .input_storeid::placeholder { color: #aaaaaa; } */
.input_pwd::placeholder { color: #e13b3b; }
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

.input_pwd:focus ~ .span_pwd, .input_pwd:valid ~ .span_spwd {
  width: 100%; 
}





/* input(managername) 창 꾸미기 */
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
  padding-bottom: 10px;
  padding-left: 10px;
  position: relative;
  background: none;
  z-index: 5;
}

/* .input_storeid::placeholder { color: #aaaaaa; } */
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



/* input(accounttype) 창 꾸미기 */
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

/* .input_storeid::placeholder { color: #aaaaaa; } */
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


/* 체크박스 꾸미기 */
.input_accounttype[type="checkbox"]{
        display: none;
      }
.input_accounttype[type="checkbox"] + .label_accounttype{
        display: inline-block;
        width: 30px;
        height: 30px;
        border:3px solid #707070;
        position: relative;
      }
.input_accounttype[id="check1"]:checked + .label_accounttype::after{
        content:'✔';
        font-size: 25px;
        width: 30px;
        height: 30px;
        text-align: center;
        position: absolute;
        left: 0;
        top:0;
      }
</style>