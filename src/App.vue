<template>
 
  <NavBar />
  <!-- <div class="middlepage"> -->
  

    <router-view />
  <!-- </div> -->



  

</template>

<script>
import NavBar from '@/components/outline/NavBar'
export default {
  name: 'App',
  components: { NavBar},

  data() {
    return {
    }
  },
}
</script>
<style >
.nav-link {
  display: inline;
}
@import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);

.notosanskr * {
 font-family: 'Noto Sans KR', sans-serif;
}
</style>
