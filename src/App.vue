<template>
  <NavBar/>

  <router-view/> 
  
 
</template>

<script>
import NavBar from '@/components/outline/NavBar'

export default{
  name: 'App',
  components: {NavBar},
  data(){
    return{

    }
  }
}
</script>
<style>
.nav-link{
    display: inline;
}


</style>
