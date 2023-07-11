<template>
 
 
 <div class="wrapper">
  <div class="container">
    <div class="sign-up-container">
      <form>
      
              <div class="social-links">
                    <div>
                      <a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                    </div>
                    <div>
                      <a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                    </div>
                    <div>
                      <a href="#"><i class="fa fa-linkedin" aria-hidden="true"></i></a>
                    </div>
             </div>
        <input type="storeid" placeholder="ID">
        <input type="pwd" placeholder="Password">
        <button class="form_btn">Sign Up</button>
      </form>
    </div>
    <div class="sign-in-container">
      <form>
        <h1>Sign In</h1>
        <div class="social-links">
          <div>
            <a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a>
          </div>
          <div>
            <a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a>
          </div>
          <div>
            <a href="#"><i class="fa fa-linkedin" aria-hidden="true"></i></a>
          </div>
        </div>
        <span>or use your account</span>
        <input type="email" placeholder="Email">
        <input type="password" placeholder="Password">
        <button class="form_btn">Sign In</button>
      </form>
    </div>
  </div>
</div>


  </template>

  <script>
 
import axios from "axios";
  
  export default {
    name: "AddressGeocoding",
    data() {
      return {
        address: "",
        coordinates: null,
        x: 37.3389,
        y: 127.1092,
        storeid:'test',
        storename:'test',
        pwd:'test',
        managername:'test',
        accounttype: 1,
        msg:''
      };
    },
    methods: {
      getCoordinates() {
        if (this.address === "") {
          alert("주소를 입력하세요.");
          return;
        }
  

        
        const encodedAddress = encodeURIComponent(this.address);
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyAEMcBVXcTsB5UmbNou29kkZkSPpq4mDJA`;
  

              const signUpBtn = document.getElementById("signUp");
              const signInBtn = document.getElementById("signIn");
              const container = document.querySelector(".container");

              signUpBtn.addEventListener("click", () => {
                container.classList.add("right-panel-active");
              });
              signInBtn.addEventListener("click", () => {
                container.classList.remove("right-panel-active");
              });


        axios.get(apiUrl).then((response) => {

          const self = this;
            const result = response.data.results[0];
 
            console.log(result.geometry.location.lat)
            console.log(result.geometry.location.lng)

       
            if (result) {
          
          
              const result = response.data.results[0];

             


                  self.x = result.geometry.location.lat
                  self.y = result.geometry.location.lng
               

                  let formdata = new FormData;
                  formdata.append('storeid',self.storeid);
                  formdata.append('storename',self.storename);
                  formdata.append('pwd',self.pwd);
                  formdata.append('managername',self.managername);
                  formdata.append('accounttype',self.accounttype);
                  formdata.append('x',self.x);
                  formdata.append('y',self.y);
                
                  alert(self.x);
                  alert(self.y);
                
                  // alert(2)

              self.$axios.post('http://localhost:8085/store', formdata).then(function(res){
                alert(3)
                self.x =res.data.dto.x
                self.y = res.data.dto.y
                if (self.x != null && self.y != null){
                  self.msg = '주소가 완료되었습니다.';
                }
                alert(4)
              })
         
                  } 
                  
                  
                  
                  
                  else {
                    alert("주소를 찾을 수 없습니다.");
                  }

                })
                .catch((error) => {
                  console.error("Error:", error);
                  alert("주소를 가져오는 도중 오류가 발생했습니다.");
                });
      },
    },
  };
  </script>
  <style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css");


* {
  box-sizing: border-box;
}
body {
  font-family: "Montserrat", sans-serif;
  margin: 0;
  padding: 0;
}
.wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebecf0;
  overflow: hidden;
}
.container {
  border-radius: 10px;
  box-shadow: -5px -5px 10px #fff, 5px 5px 10px #babebc;
  position: absolute;
  width: 400px;
  min-height: 480px;
  overflow: hidden;
}
form {
  background: #ebecf0;
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  justify-content: center;
  align-items: center;
}
form input {
  background: #eee;
  padding: 16px;
  margin: 8px 0;
  width: 55%;
  border: 0;
  outline: none;
  border-radius: 20px;
  box-shadow: inset 7px 2px 10px #babebc, inset -5px -5px 12px #fff;
}
button {
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 12px;
  font-weight: bold;
  padding: 15px 45px;
  margin: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 80ms ease-in;
}
.form_btn {
  box-shadow: -5px -5px 10px #fff, 5px 5px 8px #babebc;
}
.form_btn:active {
  box-shadow: inset 1px 1px 2px #babebc, inset -1px -1px 2px #fff;
}

.sign-in-container {
  position: relative;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 0.5s;
}
.sign-up-container {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 0.5s;
}



.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 2;
}
.container.right-panel-active .overlay-right {
  transform: translateX(-100%);
  opacity: 0;
}
.container.right-panel-active .overlay-left {
  transform: translateX(-100%);
  opacity: 1;
  z-index: 2;
}
.social-links {
  margin: 20px 0;
}
form h1 {
  font-weight: bold;
  margin: 0;
  color: #000;
}

p {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}
span {
  font-size: 12px;
  color: #000;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}
.social-links div {
  width: 40px;
  height: 40px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  border-radius: 50%;
  box-shadow: -5px -5px 10px #fff, 5px 5px 8px #babebc;
  cursor: pointer;
}
.social-links a {
  color: #000;
}
.social-links div:active {
  box-shadow: inset 1px 1px 2px #babebc, inset -1px -1px 2px #fff;
}

</style>