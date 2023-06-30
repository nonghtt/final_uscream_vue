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
<style scoped>
.nav-link{
    display: inline;
}

.sidebar{
  width:300px;
  text-align: left;
  border-right: 1px solid black;
  background-color: whitesmoke;
  height:770px;
}

.middlepage{

  display: flex;
}


</style>
