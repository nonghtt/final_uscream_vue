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
<style scoped>
.nav-link {
  display: inline;
}

</style>
