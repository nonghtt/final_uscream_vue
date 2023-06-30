<template>
    <div id="wlBody">
        <h3>근태 관리</h3>
        <div>
            <div>직원</div>
            <div>
                <select v-model="selectedEmp" @change="empChange()">
                    <option :key=0 :value="none">
                        --전체 선택--
                    </option>
                    <option v-for="(item, index) in empList" :key="index" :value="item.empnum">
                        {{ item.empname }}
                    </option>
                </select>


            </div>

        </div>
        <div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">이름</th>
                        <th scope="col">시급</th>
                        <th scope="col">날짜</th>
                        <th scope="col">출근시간</th>
                        <th scope="col">퇴근시간</th>
                        <th scope="col">총 시간</th>
                        <th scope="col">지각 시간 (분)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="wl in list" :key="wl.whitenum">
                        <td scope="row">{{ wl.emp.empname }}</td>
                        <td>{{ wl.emp.grade.salary }}</td>
                        <td>{{ wl.wdate }}</td>
                        <td>{{ wl.starttime }}</td>
                        <td>{{ wl.endtime }}</td>
                        <td>{{ wl.alltime }}시간</td>
                        <td>{{ wl.latetime }}분</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WorkLogs',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            list: [],
            empList: [],
            selectedEmp: 0
        }
    },
    created: function () {
        const self = this;
        const storeid = self.id;    // 현재 로그인 중인 아이디 

        // 지점별로 근태 관리 리스트 보기 
        self.$axios.get(`http://localhost:8085/worklogs/storeid/${storeid}`)
            .then(function (res) {
                if (res.status == 200 & res.data.flag == true) {
                    const list = res.data.list;
                    self.list = self.chageTime(list)
                } else {
                    console.log("WorkLogs error : " + res.status);
                }
            })
        // 직원 목록 불러오기 
        self.$axios.get(`http://localhost:8085/emp/storeid/${storeid}`)
            .then(function (res) {
                if (res.status == 200 & res.data.flag == true) {
                    self.empList = res.data.list
                }
            })
        // 
        
    },
    methods: {
        empChange() {
            const self = this;
            self.emp = self.selectedEmp
            console.log(self.emp)
            self.$axios.get(`http://localhost:8085/worklogs/empnum/${self.emp}`)
                .then(function (res) {
                    if (res.status == 200 & res.data.flag == true) {
                        const list = res.data.list
                        self.list = self.chageTime(list)
                    }
                })
        },
        // 시간 잘라주는 함수 : 원래는 2023-07-05T09:00:00 이렇게 보임 
        chageTime(list) {
            console.log(list)
            for (let i = 0; i < list.length; i++) {
                list[i].starttime = list[i].starttime.slice(11, 16)
                list[i].endtime = list[i].endtime.slice(11, 16)
                console.log(list[i].alltime / 60)
                list[i].alltime = list[i].alltime / 60

            }
            return list
        }
    }
}
</script>

<style scoped>
h3 {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
}

#wlBody {
    width: 70%;
    margin: 0 auto;
    text-align: center;
}
</style>