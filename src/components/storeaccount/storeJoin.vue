<template lang="">
    <div id="join" class="join">

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
            <div class="example">(ex) 오리역점</div>
        
        
        
        <div class="div_storeid">
          <input class="input_storeid" type="text" v-model="storeid" required>
          <label class="label_storeid">아이디</label>
          <span class="span_storeid"></span>
          </div>

          <div class="descript">
            <i class="fa-solid fa-circle-question"
                @mouseenter="iddescription=true"
                @mouseleave="iddescription=false"></i></div>
            <button v-on:click="idcheck">중복체크</button><br/>
            {{idmsg}}

        <div v-if="iddescription" class="iddescript_window">(ex) 지역코드 + 숫자 KG001</div>

              <div class="div_pwd">
                <input class="input_pwd" type="password" v-model="password" required
                         @input="validationpassword">
                <label class="label_pwd">비밀번호</label>  
                         <span v-if="passwordErrorText">{{ passwordErrorText }}</span>
              </div>validationpassword


<input type="password" v-if="validationpassword()">
<div v-else>{{pwdmsg}}</div>

                  
           <div class="image-container">   
              <i class="fa-solid fa-circle-question" 
                      @mouseenter="showDescription = true"
                      @mouseleave="showDescription = false"></i>
          </div>

              <!-- <span class="span_pwd"></span> -->
              

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
            


  </div>
          

          <!-- 오른쪽 컨테이너 -->
                  
          <div class="box2" id="div_outline">

    
            <div class="profile_manager"
            style="margin-top:60px;">
    지점장 사진
    <div>
      <span>파일 선택</span>
    <img :src="previewImageUrl" class="profile" 
    v-if="previewImageUrl" style="width:200px; height:200px;" /><br/>
    <label class="custom-file-upload">
      <input type="file" @change="previewImage" alt="../assets/1.png"/>
    
    </label>
  </div>
  </div>

            
<br/><br/>
  <div>
    진짜 지도 띄울거임↓↓↓↓↓↓↓↓↓↓
    </div>
    </div>    
<div> <button class="btn_join" v-on:click="join">가입하기</button></div></div>

</div>

</template>


<script>
// import axios from "axios";

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
            pwdmsg:'',
            previewImageUrl: null,
            address: "오리역",
            map: null,
            marker: null,
            latitude: 0,
            longtide: 0,
            password: '',
           passwordError: '',
           iddescription:'',
           showDescription: false,
           pwd_confirm:'',
           text_pwd_validation:'',
           passwordErrorText:''
          }
        },
        created:function(){
          this.initialImage();
        },
    methods :{
      join(){
        const self = this;
        let formdata = new FormData();
        console.log(formdata)
        formdata.append('storeid',self.storeid);
        formdata.append('storename',self.storename);
        formdata.append('pwd',self.pwd);
        formdata.append('managername',self.managername);
        formdata.append('accounttype',self.accounttype);
        alert(formdata)
        
        self.$axios.post('http://localhost:8085/store', formdata).then(function(res){
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
      self.$axios.get('http://localhost:8085/store/storeid/'+self.storeid).then(function(res){
        if(res.status==200){
          if(res.data.dto==null){
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
            if(this.password == null){
              alert('비밀번호를 입력하세요')
            }else if(this.password !== this.pwd_confirm) {
              alert("비밀번호가 일치하지 않습니다.")
                this.pwdmsg = '비밀번호가 일치하지 않습니다.';
                this.pwd_confirm ='';
            }else{
                this.pwdmsg = '사용가능한 비밀번호 입니다.';
            }             
          },
      clean_input_id(){
          this.idmsg = ''
        },   previewImage(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.previewImageUrl = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    validationpassword(){
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;      
      if (this.password != passwordRegex){
        this.passwordErrorText = "최소 8 자, 하나 이상의 대문자, 하나의 소문자 및 하나의 숫자 정규식";
      }else{
        this.passwordErrorText = "사용가능한 비밀번호";
      }
    },
    initialImage(){ 
      // 이미지를 미리 채워넣을 URL
      const initialImageUrl = "https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg";
      this.previewImageUrl = initialImageUrl;
    },
    validatePassword() {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (passwordRegex.test(this.password)) {
        this.passwordvalidation = '사용가능한 비밀번호입니다.'; // 비밀번호가 유효하면 에러 메시지를 지웁니다.
        // 여기에 비밀번호가 유효한 경우 수행할 작업을 추가할 수 있습니다.
          
        this.text_pwd_validation = '사용가능한 비밀번호입니다.'
      } else {
        this.passwordvalidation = '비밀번호 형식이 유효하지 않습니다.';
      }
    },
    validationPassword() {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(this.password)) {
        this.passwordErrorText = "비밀번호는 최소 8자 이상이어야 하며, 최소 하나의 대문자, 하나의 소문자, 하나의 숫자, 하나의 특수문자를 포함해야 합니다.";
      } else {
        this.passwordErrorText = "";
      }
    }
  }
}

</script>



<style scoped>


.profile{
  border-radius:15%;
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


/* 파일추가 버튼 꾸미기 1 */
.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
}
/* 파일추가 버튼 꾸미기 2 */
.custom-file-upload input[type="file"] {
  display: none;
}
/* 파일추가 버튼 꾸미기 3 */
.custom-file-upload span {
  margin-left: 5px;
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
}

*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
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

}

.box2 {
    /* background-color: #64acff; */
    width:50%;
    height:100%;
    vertical-align: middle;
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
  background-color: #8eb443;
  color:white;
}

/* 아이디 설명 및 예시 창 */
.descript{
position: relative;
  display: inline-block;
}

.iddescript_window{
  z-index:3;
  background-color: antiquewhite;
}

/* 비밀번호 유효성검사 확인 창 */
.validation{
  z-index:3;
  background-color: antiquewhite;
}
image-container{
  position: relative;
  display: inline-block;
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
    z-index:5;
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
    color:#eb34a4;
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
    z-index:5;
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
    z-index:5;
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
    color:#eb34a4;
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
    z-index:5;
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
    color:#eb34a4;
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
    z-index:5;
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
    color:#eb34a4;
    font-weight: bold;
  }
  
  .input_managername:focus ~ .span_managername, .input_managername:valid ~ .span_managername {
    width: 100%;
   
  }



  #map {
    width: 100%;
    height: 400px;
    border-radius: 30%;
    margin-top: 25px;
  }
  .div_map{
    margin-top: 25px;
    padding-right: 10px;
  }

  
</style>