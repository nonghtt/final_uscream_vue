<template lang="">
    <div id="join" class="join">

          <div>
            <img src="../../assets/bckimg.jpg" 
            style="width:100%; height:100%;"
            class="background_img">
          </div>

  <div class="join_window">
              <div style="height:30px;">
              </div>
          
          <div class="title_join" role="alert" style="font-size:25px; font-weight:bold;">
        JOIN</div>
        


        <!-- 왼쪽 컨테이너 -->
       <div class="box1" id="div_outline">
        
        <div class="div_storename">
                  <input class="input_storename" type="text" v-model="storename" required><br/>
                  <label class="label_storename">지점명</label>
                  <span class="span_storename"></span>
            </div>
        
        
            
        
        <div class="div_storeid">
          <input class="input_storeid" type="text" v-model="storeid" required>
          <label class="label_storeid">아이디</label>
          <span class="span_storeid"></span>
          </div>
            <button v-on:click="idcheck">중복체크</button><br/>
            {{idmsg}}

            

              <div class="div_pwd">
                <input class="input_pwd" type="password" v-model="pwd" required>
                <label class="label_pwd">비밀번호</label>
                <span class="span_pwd"></span>
              </div>

            <div class="div_pwd_confirm">
                  <input class="input_pwd_confirm" type="password" @click="clean_input_pwd" v-model="pwd_confirm" required><br/>
                  <label class="label_pwd_confirm">비밀번호 확인</label>
                  <span class="span_pwd_confirm"></span>
            </div>
            <button v-on:click="pwdcheck">중복확인</button><br/>
            {{pwdmsg}}

            <div class="div_managername">
                <input class="input_managername" type="text" v-model="managername" required><br/>
                <label class="label_managername">지점주 이름</label>
                <span class="span_managername"></span>
            </div>


            <input class="select" name="type" type="radio" id="radio" v-model="accounttype" value="1" checked><label for="radio"><div id="text_float">본사</div></label>
                  <input class="select" name="type" type="radio" id="radio2" v-model="accounttype" value="2" ><label for="radio2"><div class="text_branch">지점</div></label><br/> 
            
            <!-- <div class="div_accounttype">
                  <input class="select" name="type" type="radio" id="radio" v-model="accounttype" value="1" checked><label for="radio">본사</label>
                  <input class="select" name="type" type="radio" id="radio2" v-model="accounttype" value="2" ><label for="radio2">지점</label><br/> 
                  <label class="label_accounttype">타입</label>
                  <span class="span_accounttype"></span>
            </div> -->






            
            <input type="file" accept="image/*"/>









    <button class="btn_join" v-on:click="join">가입하기</button>

  </div>
          

          <!-- 오른쪽 컨테이너 -->
                  
          <div class="box2" id="div_outline">

            <img src="../../assets/1.png" 
                      style="width:100%; height:100%;"
                      class="img_main">
          </div>


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
            accounttype:'',
            location: 0,
            idmsg:'',
            pwdmsg:''
        }
    },
    methods :{
        join(){
        const self = this;
        let formdata = new FormData();
        formdata.append('storeid',self.storeid);
        formdata.append('storename',self.storename);
        formdata.append('pwd',self.pwd);
        formdata.append('managername',self.managername);
        formdata.append('accounttype',self.accounttype);

        //폼양식에서 사용자가 이미지 추가한 부분을 id(simg)로 당겨오는 곳
        // const file = document.getElementById('f1')
        // formdata.append('simg', file.files[0]);

        self.$axios.post('http://localhost:8085/store', formdata
        // ,{ headers: { "Content-Type": "multipart/form-data" } }
        )
    
        .then(function(res){
         if(res.status==200){
        
            alert(self.storeid+"님, 회원가입이 완료되었습니다. 축하드립니다.")
            if(self.accounttype ==2){
            self.$axios.get('http://localhost:8085/products').then(function(res){
              alert(res.data.list.length)
              for(let i=0; i<res.data.list.length; i++){
                let productnum = res.data.list[i].productnum
                console.log(productnum)
                let form = new FormData()
                form.append("productname",productnum)
                form.append("storeid",self.storeid)
                form.append("amount",0)
                self.$axios.post('http://localhost:8085/inventorys',form).then(function(res2){
                  console.log(res2.data.inventory)
                })
              }

            })
          }
        }else{
            alert('에러코드:'+res.status)
        }
    })
    },
        idcheck(){
            const self = this;
            alert('눌렀노?')
      self.$axios.get('http://localhost:8085/store/'+self.storeid).then(function(res){
        if(res.status==200){
          alert(res.data.dto.storeid)
          if(res.data.dto==null){
          alert(res.data.dto.storeid)
            self.idmsg='사용가능한 아이디'
          }else{
            self.idmsg='중복된 아이디'
            self.storeid=''
          }
        }else{
          alert('에러코드:'+res.status)
        }
      }); 
   },
        pwdcheck(){
          const self = this;
          if(self.pwd == self.pwd_confirm){
            alert("사용가능한 비밀번호입니다.")
            self.pwdmsg = '비밀번호 확인완료';
          }else{
            alert("비밀번호가 일치하지 않습니다.")
            self.pwdmsg = '비밀번호가 일치하지 않습니다.';
            // self.pwd = ''
            self.pwd_confirm=''
          }

     },
        checkpassword(){
          // 비밀번호 형식 검사(영문, 숫자, 특수문자)
        //  const validatePassword = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/
        },
        clean_input_id(){
          this.idmsg = ''
        }
        
        // ,
        // final_check(){
        //   const self = this;
        //   if(
        //   this.storeid === null   ||
        //   this.pwd === null          ||
        //   this.pwd_confirm === null  ||
        //   this.managername === null  ||
        //   this.accounttype === null  ||
        //   this.storeid ===null
        //   ){
        //     alert('입력하지 않은 값이 있습니다.')
        //   }
        // }


    },
    watch: {
      'password':function(){
        this.checkpassword
      }
    }
}
</script>



<style scoped>
.background_img{
  z-index: 1;
}


.text_join{
position: absolute; left: 50%; top: 20%; 
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
width: 800px;height: 800px;border: 1px solid #dcdcdc;
position: absolute; left: 50%; top: 55%; 
transform: translate(-50%, -50%); text-align: center;
border-radius: 15%;
box-shadow: 20px 20px 20px grey;
overflow:auto;
background-color: white;
z-index: 2;
}

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-size: 0;
    letter-spacing: 0;
    word-spacing: 0;
}

#div_outline {
    /* display: inline-block; */
    float: left;
    line-height: 100%;
    text-align: center;
    font-size: 20px;
}

.box1 {
    /* background-color: #50e04a; */
    width:50%;
    height:100%;
    z-index:3;
}

.box2 {
    /* background-color: #64acff; */
    width:50%;
    height:100%;
    z-index:3;
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


.img_main{
  /* border-radius: 70%; */
  height:100%;
}



.title_join{
  background-color: #eb34a4;
  color:white;
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
  /* 입력되면 보이는 색깔 */
  .input_pwd:focus { outline: none; color:#eb34a4}
  
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
    color: #eb34a4;
    font-weight: bold;
  }
  
  .input_pwd:focus ~ .span_pwd, .input_pwd:valid ~ .span_pwd {
    width: 100%;
  }




  /* input(storename) 창 꾸미기 */
  .div_storename {
    position: relative;
    width: 300px;
    margin-left: 50px;
    margin-top: 50px;
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

  /* input(pwd_confirm) 창 꾸미기 */
  
  .div_pwd_confirm {
    position: relative;
    width: 300px;
    margin-left: 50px;
    margin-top: 50px;
  }
  
  .input_pwd_confirm {
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
  
  /* .input_pwd_confirm::placeholder { color: #aaaaaa; } */
  .input_pwd_confirm::placeholder { color: #aaaaaa; }
  .input_pwd_confirm:focus { outline: none; }
  
  .span_pwd_confirm {
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
  
  .label_pwd_confirm {
    position: absolute;
    color: #aaaaaa;
    left: 10px;
    font-size: 20px;
    bottom: 8px;
    transition: all .2s;
  }
  
  .input_pwd_confirm:focus ~ .label_pwd_confirm, .input_pwd_confirm:valid ~ .label_pwd_confirm {
    font-size: 16px;
    bottom: 40px;
    /* 커서올렸을때 글자가 변하는 색 >>>>> 나중에 상의해서 변경하는 */
    /* color: #666; */
    color:#666;
    font-weight: bold;
  }
  
  .input_pwd_confirm:focus ~ .span_pwd_confirm, .input_pwd_confirm:valid ~ .span_pwd_confirm {
    width: 100%;
   
  }


  /* input(managername) 창 꾸미기 */
  
  .div_managername {
    position: relative;
    width: 300px;
    margin-left: 50px;
    margin-top: 50px;
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
  
 
  .input_managername::placeholder { color: #aaaaaa; }
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
</style>