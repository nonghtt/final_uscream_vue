<template>
  
  <NavBar/>
  <div class="middlepage">
    
<div class="sidebar">
  <SideBar/>
</div>

    <router-view/> 
  </div>
  

</template>

<script>
import NavBar from '@/components/outline/NavBar'
import SideBar from '@/views/SideBar.vue'
export default{
  name: 'App',
  components: {NavBar, SideBar},

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

.sidebar{
  width:13%;
  text-align: left;
}

.middlepage{

  display: flex;
}


</style>
