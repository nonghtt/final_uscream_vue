<template>
    <div>
        <h4>근태 관리</h4>
        <div>검색기능 넣어보자..</div>
        <div>(디자인은.. 나중에.. 귀찮은거..? 절대 맞음..)</div>
        <div>
            <div>순서대로 / 이름 / 시급 / 날짜 / 시작 날짜 / 끝난 날짜</div>
            <div v-for="wl in list" :key="wl.whitenum">
                <span>{{ wl.emp.empname }}</span> |
                <span>{{ wl.emp.grade.salary }}</span> |
                <span>{{ wl.wdate }}</span> |
                <span>{{ wl.starttime }}</span> |
                <span>{{ wl.endtime }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'WorkLogs',
    data(){
        return {
            id : sessionStorage.getItem("loginId"),
            list : []
        }
    },
    created:function(){
        const self = this;
        const storeid = self.id;
        self.$axios.get(`http://localhost:8085/worklogs/storeid/${storeid}`)
        .then(function(res){
            if(res.status==200 & res.data.flag == true){
                console.log(res.data.list)
                self.list = res.data.list;
            } else {
                console.log("WorkLogs error : "+ res.status);
            }
        })
    }
}
</script>

<style scoped>


</style>