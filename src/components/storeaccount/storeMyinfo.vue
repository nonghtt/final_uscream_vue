<template lang="">
    <div id="myinfo" class="myinfo">

      <!-- <div>
        <img src="../../assets/bckimg.jpg" 
            style="width:100%; height:100%;"
            class="background_img"></div> -->

     <div class="edit_window">
      <div class="brandname">USCREAM</div>      
      <div style="height:0px;">
              </div>

              <div class="title_myinfo" role="alert" style="font-size:25px; font-weight:bold;">
        지점 정보 확인</div>        


        
<div class="box">
<!-- 왼쪽 컨테이너 -->
      <div class="box1" id="div_outline">   

              <div class="div_storeid">
                <div style="text-align:left; font-weight:bold;">아이디</div>
                  <input class="input_storeid" type="text" v-model="storeid" readonly><br/>
                  <!-- <label class="label_storeid"></label> -->
                  <span class="span_storeid"></span>
              </div>        



            <div class="div_pwd">
              <div style="text-align:left; font-weight:bold;">비밀번호</div>
                <input class="input_pwd" type="password" v-model="pwd">    
                <!-- <label class="label_pwd">비밀번호</label> -->
                <span class="span_pwd"></span>
            </div>



        <div class="div_accounttype">
          <div style="text-align:left; font-weight:bold;">유형</div>
        <input class="input_accounttype" type="text" v-model="accounttype" readonly><br/>
        <!-- <label class="label_accounttype">유형</label> -->
        <span class="span_accounttype"></span>
        </div>

        

        <img :src="url" class="img_main"><br/>

        <!-- <img :src="'http://localhost:8085/storeid/'+storeid" style="width:90%; height:300px;" class="img_main"><br/> -->
      
    </div>


            <!-- 오른쪽 컨테이너 -->

                 <div class="box2" id="div_outline">
          
                      <div class="div_storename">
                        <div style="text-align:left; font-weight:bold;">지점 이름</div>
                      <input class="input_storename" type="text" v-model="storename">
                      <!-- <label class="label_storename">지점 이름</label> -->
                      <span class="span_storename"></span>
                      </div>

        

                      <div class="div_managername">
                        <div style="text-align:left; font-weight:bold;">지점장 이름</div>
                      <input class="input_managername" type="text" v-model="managername"><br/>
                      <!-- <label class="label_managername">지점장 이름</label> -->
                      <span class="span_managername"></span>
                      </div>

          

                      <div class="div_location">
                        <div style="text-align:left; font-weight:bold;">주소</div>                
                      <input class="input_location" type="text" v-model="location" placeholder="x/y값 변환해서 띄우고 싶어" readonly>    
                      <!-- <label class="label_location">주소</label> -->
                      <span class="span_location"></span>
                      </div>




                      <div> <!-- 지도 뜨는 곳 --><kakaomapMyinfo class="kakaomap" @sendposition = "showLocation" /></div>   
                 


             </div>
   </div>    
     
     
            


            <button class="btn_edit" @click="edit">수정하기</button> &nbsp; &nbsp; &nbsp;
             <button class="btn_cancle" @click="cancle">수정취소</button>
   
             
</div>




</div>

 

      

</template>

<script>
import kakaomapMyinfo from "@/components/storeaccount/kakaomapMyinfo.vue";
export default {
  
name:"StoreEdit",
components:{kakaomapMyinfo},
    data(){
        return{
            storeid:'',
            storename:'',
            pwd:'',
            managername:'',
            accounttype: 0,
            // myinfo:require("'http://localhost:8085/store/img/store/'+storeid"),
            x:0,
            y:0,
            url:'http://localhost:8085/store/img/',
            position:null,
            marker:'',
            simg:[]
         }
     },
     created:function(){    //컴포넌트 실행될 때 한번 실행    
            this.storeid = sessionStorage.getItem('loginId')
            this.accounttype = sessionStorage.getItem('accounttype')
            const self = this;
            self.$axios.get('http://localhost:8085/store/storeid/'+self.storeid)
            .then(function(res){
                if(res.status == 200){
                    let dto = res.data.storelist
                    if(dto!=null){
                        self.storeid = dto.storeid
                        self.storename = dto.storename
                        self.pwd = dto.pwd
                        self.managername = dto.managername
                        self.x =dto.x
                        self.y =dto.y
                        // self.simg=dto.simg
                        self.url = 'http://localhost:8085/store/img/'+dto.storeid
                        console.log(self.url)

                        if(self.accounttype == 1){
                            self.accounttype = '본사';
                        }else if(self.accounttype == 2){
                            self.accounttype = '지점';
                        }else{
                            self.accounttype = '지원하지 않는 유형입니다.';
                            }

                       

      const position = new window.kakao.maps.LatLng(self.x, self.y);

      // alert(position)

      self.map.setCenter(position);
      self.map.setLevel(3);

      self.marker = new window.kakao.maps.Marker({
        position: position,
      });

      self.marker.setMap(self.map);
     

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

            if(self.accounttype ==='본사'){
              self.accounttype = 1;
            }else if(self.accounttype==='지점'){
              self.accounttype = 2;
            }            
            formdata.append('accounttype',self.accounttype)




            alert('수정하러 간다?'+self.pwd);
            alert(formdata);
            self.$axios.post("http://localhost:8085/store",formdata)
            .then(function(res){
             alert('수정하러갔당 옴?')
                if(res.status == 200){
                    let dto = res.data.store
                    self.pwd = dto.pwd
                    self.managername = dto.managername
                }else{
                    alert('에러코드:' + res.status)
                }
            });
        },





        loadScript() {
      const script = document.createElement("script");
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=3ef0a8044022238ae7c9fb846ea37567&autoload=false";
      script.onload = () => window.kakao.maps.load(this.loadMap.bind(this));

      document.head.appendChild(script);
    },
    loadMap() {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(37.3399, 127.109),
        level: 4,
      };

      this.map = new window.kakao.maps.Map(container, options);
      this.showMarker();
    },
    cancle(){
      this.$router.push('/about')
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



.box{
  display:flex;
}
.box1{
  width:50%;
}
.box2{
  width:50%;
}


/* 버튼 색 바꾸기 */
.btn_edit:hover{
  background-color: #FFC67B;
  color:#595959
}

.btn_edit{
  color:#595959;
    background-color: #bee96d;
    font-weight: bolder ;
    border:0;
    border-radius: 10%;
    font-size:20px;
    text-decoration: none;
    font-weight:bold;
    margin-top:37px;
}
.btn_cancle:hover{
  background-color: #FFC67B;
  color:#595959
}
.btn_cancle{
  color:#595959;
    background-color: #bee96d;
    font-weight: bolder ;
    border:0;
    border-radius: 10%;
    font-size:20px;
    text-decoration: none;
    font-weight:bold;
}






#div_outline {
    /* display: inline-block; */
    /* float: left; */
    line-height: 100%;
    text-align: center;
    font-size: 20px;

}

.brandname{
   color: #8eb443;
   font-size:30px;
   font-weight: bold;
   vertical-align: center;
   text-shadow: 5px 5px rgb(236, 234, 234);
  }

.title_myinfo{
  background-color: #8eb443;
  color:white;
  
}




/* 내정보(myinfo) 윈도우 위치조정하기 */
.edit_window{
width: 800px;height: 800px;
/* border: 1px solid #dcdcdc; */
position: absolute; left: 50%; top: 55%; 
transform: translate(-50%, -50%); text-align: center;
border-radius: 15px;
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
.img_main{
  margin-top:26px;
  border-radius: 10px;
  width:76%; 
  height:300px;
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
  margin-top: 50px;
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
  margin-top: 50px;
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