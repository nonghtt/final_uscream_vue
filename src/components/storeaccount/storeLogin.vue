
<template>
  <div :class="logincontainerClasses " class="logincontainer" id="logincontainer">
    <!-- FORM SECTION -->
    <div class="loginrow">
      <!-- SIGN UP -->
      <div class="col align-items-center flex-col sign-up">
        <div class="loginform-wrapper align-items-center">
          <div class="form sign-up">
            <div class="logininput-group">
              <i class='bx bxs-user'></i>
              <input type="text" placeholder="Username">
            </div>
            <div class="logininput-group">
              <i class='bx bx-mail-send'></i>
              <input type="email" placeholder="Email">
            </div>
            <div class="logininput-group">
              <i class='bx bxs-lock-alt'></i>
              <input type="password" placeholder="Password">
            </div>
            <div class="logininput-group">
              <i class='bx bxs-lock-alt'></i>
              <input type="password" placeholder="Confirm password">
            </div>
            <button>
              Sign up
            </button>
            <p>
              <span>
                Already have an account?
              </span>
              <b onclick="toggle()" class="loginpointer">
                Sign in here
              </b>
            </p>
          </div>
        </div>


      </div>
      <!-- END SIGN UP -->
      <!-- SIGN IN -->
      <div class="col align-items-center flex-col sign-in">
        <div class="loginform-wrapper align-items-center"  style="margin-bottom:5%; margin-left:-10%">
          <div class="form sign-in">
            <div class="logininput-group">
              <i class='bx bxs-user'></i>
              <input type="text" placeholder="Login ID" v-model="storeid" required>
            </div>
            <div class="logininput-group">
              <i class='bx bxs-lock-alt'></i>
              <input type="password" placeholder="Password" v-model="pwd" required>
            </div>
            <button v-on:click="login">
              Log In
            </button>

          </div>
        </div>
        <div class="loginform-wrapper">

        </div>
      </div>
      <!-- END SIGN IN -->
    </div>
    <!-- END FORM SECTION -->
    <!-- CONTENT SECTION -->
    <div class="loginrow content-loginrow">
      <!-- SIGN IN CONTENT -->
      <div class="col align-items-center flex-col" style="margin-bottom:5%; margin-left:8%">
        <div class="text sign-in">
          <h2>
            Welcome <br> USCREAM
          </h2>

        </div>
        <div class="img sign-in">

        </div>
      </div>
      <!-- END SIGN IN CONTENT -->
      <!-- SIGN UP CONTENT -->
      <div class="col align-items-center flex-col">
        <div class="img sign-up">

        </div>
        <div class="text sign-up">
          <h2>
            Join with us
          </h2>

        </div>
      </div>
      <!-- END SIGN UP CONTENT -->
    </div>
    <!-- END CONTENT SECTION -->
  </div>
</template>


<script>
export default {
  name: 'storeLogin',
  data() {
    return {
      storeid: '',
      pwd: '',
      accounttype: '',
      logincontainerClasses:''
    };
  },
  created: function () {
   setTimeout(() => {
     this.logincontainerClasses ="sign-in"
     }, 100);
  },
  methods: {
    login() {
      const self = this;
      const form = new FormData();
      form.append('storeid', self.storeid);
      form.append('pwd', self.pwd);
      self.$axios
        .post('http://localhost:8085/store/login', form)
        .then(function(res) {
          if (res.status === 200) {
            if (res.data.flag) {
              sessionStorage.setItem('loginId', self.storeid);
              sessionStorage.setItem('accounttype', res.data.type);
              location.href = '/about';
            } else {
              alert('로그인 실패');
            }
          } else {
            alert('에러코드: ' + res.status);
          }
        });
      }
    }
  }


</script>

<style> 
:root {
  --primary-color: #bee96d;
  --secondary-color: #bee96d;
  --black: #000000;
  --white: #ffffff;
  --gray: #efefef;
  --gray-2: #757575;

  --facebook-color: #4267B2;
  --google-color: #DB4437;
  --twitter-color: #1DA1F2;
  --insta-color: #E1306C;
}

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100vh;
  /* overflow: hidden; */
}

.logincontainer {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.loginrow {
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
}

.col {
  width: 50%;
}

.align-items-center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loginform-wrapper {
  width: 100%;
  max-width: 28rem;
}

.form {
  padding: 1rem;
  background-color: var(--white);
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: scale(0);
  transition: .5s ease-in-out;
  transition-delay: 1s;
}

.logininput-group {
  position: relative;
  width: 100%;
  margin: 1rem 0;
}

.logininput-group i {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  font-size: 1.4rem;
  color: var(--gray-2);
}

.logininput-group input {
  width: 100%;
  padding: 1rem 3rem;
  font-size: 1rem;
  background-color: var(--gray);
  border-radius: .5rem;
  border: 0.125rem solid var(--white);
  outline: none;
}

.logininput-group input:focus {
  border: 0.125rem solid var(--primary-color);
}

.form button {
  cursor: pointer;
  width: 100%;
  padding: .6rem 0;
  border-radius: .5rem;
  border: none;
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 1.2rem;
  outline: none;
}

.form p {
  margin: 1rem 0;
  font-size: .7rem;
}

.flex-col {
  flex-direction: column;
}

.social-list {
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: scale(0);
  transition: .5s ease-in-out;
  transition-delay: 1.2s;
}

.social-list>div {
  color: var(--white);
  margin: 0 .5rem;
  padding: .7rem;
  cursor: pointer;
  border-radius: .5rem;
  cursor: pointer;
  transform: scale(0);
  transition: .5s ease-in-out;
}

.social-list>div:nth-child(1) {
  transition-delay: 1.4s;
}

.social-list>div:nth-child(2) {
  transition-delay: 1.6s;
}

.social-list>div:nth-child(3) {
  transition-delay: 1.8s;
}

.social-list>div:nth-child(4) {
  transition-delay: 2s;
}

.social-list>div>i {
  font-size: 1.5rem;
  transition: .4s ease-in-out;
}

.social-list>div:hover i {
  transform: scale(1.5);
}

.facebook-bg {
  background-color: var(--facebook-color);
}

.google-bg {
  background-color: var(--google-color);
}

.twitter-bg {
  background-color: var(--twitter-color);
}

.insta-bg {
  background-color: var(--insta-color);
}

.loginpointer {
  cursor: pointer;
}

.logincontainer.sign-in .form.sign-in,
.logincontainer.sign-in .social-list.sign-in,
.logincontainer.sign-in .social-list.sign-in>div,
.logincontainer.sign-up .form.sign-up,
.logincontainer.sign-up .social-list.sign-up,
.logincontainer.sign-up .social-list.sign-up>div {
  transform: scale(1);
}

.content-loginrow {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 6;
  width: 100%;
}

.text {
  margin: 4rem;
  color: var(--white);
}

.text h2 {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 2rem 0;
  transition: 1s ease-in-out;
}

.text p {
  font-weight: 600;
  transition: 1s ease-in-out;
  transition-delay: .2s;
}

.img img {
  width: 30vw;
  transition: 1s ease-in-out;
  transition-delay: .4s;
}

.text.sign-in h2,
.text.sign-in p,
.img.sign-in img {
  transform: translateX(-250%);
}

.text.sign-up h2,
.text.sign-up p,
.img.sign-up img {
  transform: translateX(250%);
}

.logincontainer.sign-in .text.sign-in h2,
.logincontainer.sign-in .text.sign-in p,
.logincontainer.sign-in .img.sign-in img,
.logincontainer.sign-up .text.sign-up h2,
.logincontainer.sign-up .text.sign-up p,
.logincontainer.sign-up .img.sign-up img {
  transform: translateX(0);
}

/* BACKGROUND */

.logincontainer::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 300vw;
  transform: translate(35%, 0);
  background-image: linear-gradient(-45deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  transition: 1s ease-in-out;
  z-index: 6;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-bottom-right-radius: max(50vw, 50vh);
  border-top-left-radius: max(50vw, 50vh);
}

.logincontainer.sign-in::before {
  transform: translate(0, 0);
  right: 50%;
}

.logincontainer.sign-up::before {
  transform: translate(100%, 0);
  right: 50%;
}

/* RESPONSIVE */

@media only screen and (max-width: 425px) {

  .logincontainer::before,
  .logincontainer.sign-in::before,
  .logincontainer.sign-up::before {
    height: 100vh;
    border-bottom-right-radius: 0;
    border-top-left-radius: 0;
    z-index: 0;
    transform: none;
    right: 0;

  }

  /* .logincontainer.sign-in .col.sign-up {
        transform: translateY(100%);
    } */

  .logincontainer.sign-in .col.sign-in,
  .logincontainer.sign-up .col.sign-up {
    transform: translateY(0);
  }

  /* @media (min-width: 768px)
  .logincontainer, .logincontainer-md, .logincontainer-sm {
    max-width: 100%;
  } */

  .content-loginrow {
    align-items: flex-start !important;
  }

  .content-loginrow .col {
    transform: translateY(0);
    background-color: unset;
  }

  .col {
    width: 100%;
    position: absolute;
    padding: 2rem;
    background-color: var(--white);
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    transform: translateY(100%);
    transition: 1s ease-in-out;
  }

  .loginrow {
    align-items: flex-end;
    justify-content: flex-end;
  }

  .form,
  .social-list {
    box-shadow: none;
    margin: 0;
    padding: 0;
  }

  .text {
    margin: 0;
  }

  .text p {
    display: none;
  }

  .text h2 {
    margin: .5rem;
    font-size: 2rem;
  }
}
</style>