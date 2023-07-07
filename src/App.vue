<template>
 
  <NavBar />
  <div class="middlepage">
  

    <router-view />
  </div>



  

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

.sidebar {
  width: 300px;
  text-align: left;
  border-right: 1px solid black;
  background-color:#04ac4e;         
  height: 770px;
}

.middlepage {

  display: flex;
}
</style>
