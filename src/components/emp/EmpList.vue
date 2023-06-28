<template>
    <div>
        <h3>직원명단</h3>
        <div>(디자인은 나중에..)</div>
        <div> 
           <div v-for="emp in list" :key="emp.empnum"> 
                <span>{{emp.empname}}</span> |
                <span>{{emp.grade.salary}}</span> |
                <span>{{emp.joindate  }}</span>
           </div> 
        </div>
    </div>
</template> 


<script>
export default {
    name : 'EmpList',
    data(){
        return {
            id : sessionStorage.getItem("loginId"),
            list : []
        };
    },
    created:function(){
        const self = this;
        const storeid = self.id;
        self.$axios.get(`http://localhost:8085/emp/storeid/${storeid}`)
        .then(function(res){
            if(res.status==200 && res.data.flag == true){
                self.list = res.data.list
            } else {
                console.log("에러 :" + res.status)
            }
        });
    }
}
</script>

<style scoped>

</style>