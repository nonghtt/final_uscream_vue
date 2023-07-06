<template>
    <div>
        <!-- Button trigger modal -->
        <button type="button" class="btn btncolor" data-bs-toggle="modal" data-bs-target="#addModal">
            스케줄 추가
        </button>

        <!-- Modal -->
        <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
            <div class="modal-dialog  modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            직원
                            <select v-model="selectedEmp" class="form-select"> <!--@change="empChange()" -->
                                <option :key=0 :value=0 disabled>
                                    --직원 선택--
                                </option>
                                <option v-for="(item, index) in empList" :key="index" :value="item.empnum">
                                    {{ item.empname }}
                                </option>
                            </select>
                        </div>


                        <div class="mb-3">
                            <label for="labelDate" class="form-label title">날짜</label>
                            <input type="date" class="form-control" v-model="workDate">
                        </div>
                        <div class="mb-3">
                            출근 시간 <input type="time" class="form-control" v-model="startTime" step="600">
                        </div>
                        <div class="mb-3">
                            퇴근 시간 <input type="time" class="form-control" v-model="endTime">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btncolor" data-bs-dismiss="modal" @click="scAdd">추가</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ScheduleAddModal',
    data() {
        return {
            storeid: sessionStorage.getItem("loginId"),
            empList: [],         // 한 스토어의 전체 직원 불러오기 
            selectedEmp: 0,      // select에서 직원 고른 값
            workDate: null,      // 일 할 날짜 선택택
            startTime: '09:00',  // 기본 시간 9시로 설정
            endTime: '18:00',
        }
    },
    created: function () {
        // 직원 list
        const self = this;
        const storeid = self.storeid;
        self.$axios.get(`http://localhost:8085/emp/storeid/${storeid}`)
            .then(function (res) {
                if (res.status == 200 & res.data.flag == true) {
                    self.empList = res.data.list
                } else {
                    console.log("에러 :" + res.status);
                }
            })
    },
    methods: {
        // 직원을 바꿈
        /*
        empChange() {
            const self = this;
            let empnum = self.selectedEmp;
            // console.log("empnum : " + empnum + "/ self.year : " + self.selectedYear + "/ self.month : " + self.selectedMonth)
            // self.empBasicSchedule(empnum, self.selectedYear, self.selectedMonth)
            console.log(empnum)
        },
        */
        // 스케줄 등록
        scAdd() {
            const self = this;

            let day = self.workDate
            let starttime = day + 'T' + this.startTime + ':00';
            let endtime = day + 'T' + this.endTime + ':00';

            const formData = new FormData();
            formData.append("emp", self.selectedEmp);
            formData.append("storeid", self.storeid);
            formData.append("sdate", day);
            formData.append("starttime", starttime);
            formData.append("endtime", endtime);

            if (self.workDate === null) {
                alert("날짜를 선택해주세요")
            } else if (self.selectedEmp === 0) {
                alert("직원을 선택해주세요.")
            } else {
                self.$axios.post('http://localhost:8085/schedule', formData)
                    .then(function (res) {
                        if (res.status == 200 && res.data.flag == true) {
                            // 다시 초기값으로 변경해주기
                            self.startTime = '09:00';
                            self.endTime = '18:00';
                            self.selectedEmp = 0;
                            self.workDate = null;
                            self.$emit('button-clicked', "10cm 버튼 클릭");
                        } else {
                            console.log("에러 :" + res.status)
                        }
                    })
            }
        },
        // 외부창을 누르면서 닫았을 때
        close() {
            const self = this;
            self.startTime = '09:00';
            self.endTime = '18:00';
            self.selectedEmp = 0;
            self.workDate = null;
        },
        // 외부창을 누르면서 닫았을 때 
        handleModalClose(event) {
            const self = this;
            if (event.target === event.currentTarget) {
                self.startTime = '09:00';
                self.endTime = '18:00';
                self.selectedEmp = 0;
                self.workDate = null;
            }
        },

    }
}
</script>

<style scoped>
.btncolor:hover {
    background-color: #FFC67B;
    color: #595959;
}

.btncolor {
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
    margin-top: 5px;
    margin-bottom: 5px;
}

.modal-body {
    height: 500px;
}
</style>