<template>
    <!-- Button trigger modal -->
    <button type="button" class="btn btncolor" data-bs-toggle="modal" data-bs-target="#addSchedule2" @click="SdClick">
        스케줄 등록
    </button>

    <!-- Modal -->
    <div class="modal fade" id="addSchedule2" tabindex="-1" aria-labelledby="addSchedule2Label" aria-hidden="true" @click="handleModalClose">
        <!-- <div> -->
        <div class="modal-dialog  modal-dialog-scrollable  modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addSchedule2Label">스케줄 등록</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>
                </div>
                <div class="modal-body">
                    <div>

                        직원
                        <select v-model="selectedEmp" @change="empChange()"  class="form-select">
                            <option :key=0 :value=0 disabled>
                                --직원 선택--
                            </option>
                            <option v-for="(item, index) in empList" :key="index" :value="item.empnum">
                                {{ item.empname }}
                            </option>
                        </select>

                    </div>
                    <div id="divSchedule">
                        <div v-if="bsEmp" class="form-check">

                            <div id="selectedyear">{{ selectedYear }}년</div>
                            <div id="selectedmonth">
                                <div id="monthCircle">
                                    {{ selectedMonth }}
                                </div>
                            </div>
                            <div id="timeClass">
                                <div v-for="(item, index) in empSelectedList" :key="index" :value="item.bsnum"
                                    class="empScheduleTime">
                                    <input type="checkbox" v-model="schedule" :value="item.bsnum">
                                    {{ item.bsdate }} {{ item.starttime }}-{{ item.endtime }}
                                </div>
                            </div>
                        </div>
                        <div v-show="empEmpty" style="color:grey">
                            직원을 선택해주세요
                        </div>
                    </div>
                    <div id="pnBtn" v-if="bsEmp">
                        <button class="btn pnbtn" @click="prev">&lt;</button>
                        <button class="btn pnbtn" @click="next">></button>
                    </div>
                    <div><button class="btn delete-btn" @click="delBasicSchedule">삭제하기</button></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btncolor" data-bs-dismiss="modal" @click="realAdd">추가</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ScheduleModal',
    data() {
        return {
            empList: [],     // 한 스토어의 전체 직원 불러오기 
            storeid: sessionStorage.getItem("loginId"),
            selectedEmp: 0,
            empSelectedList: [],
            bsEmp: false,
            schedule: [],
            empEmpty: true,
            selectedMonth: 0,  // 처음 : 현재 달, 이전 이후 버튼 누르면 달이 바뀜
            selectedYear: 0,    // 현재 년도 (버튼 눌렀을 때 값 변하면 넣어주기)

        }
    },
    created: function () {
        let today = new Date();
        this.selectedYear = today.getFullYear();
        this.selectedMonth = today.getMonth() + 1
    },
    methods: {
        // 모달 클릭시 직원 list 출력 
        // 근데 이거 여기에 있는 것보다 created에 있는게 맞는듯?
        SdClick() {
            const self = this;
            const storeid = self.storeid;
            console.log(storeid)
            self.$axios.get(`http://localhost:8085/emp/storeid/${storeid}`)
                .then(function (res) {
                    if (res.status == 200 & res.data.flag == true) {
                        self.empList = res.data.list
                        console.log(self.empList)
                    } else {
                        console.log("에러 :" + res.status);
                    }
                })
            self.selectedEmp = 'none';
        },
        // 직원을 바꿈
        empChange() {
            const self = this;
            // let year = self.year;
            // let month = self.month;
            let empnum = self.selectedEmp;
            console.log("empnum : " + empnum + "/ self.year : " + self.selectedYear + "/ self.month : " + self.selectedMonth)
            self.empBasicSchedule(empnum, self.selectedYear, self.selectedMonth)


        },
        // emp basicSchedule 가져오기 후하..
        empBasicSchedule(empnum, year, month) {
            const self = this;
            if (empnum != null) {
                self.$axios.get(`http://localhost:8085/basicschedule/emp/${empnum}/${year}/${month}`)
                    .then(function (res) {
                        console.log(res.status)
                        console.log(res.data)
                        if (res.status == 200 && res.data.flag == true) {
                            console.log("성공")
                            const list = res.data.list
                            self.empSelectedList = self.changeTime(list);
                            console.log(self.empSelectedList)
                            self.bsEmp = true;
                            self.empEmpty = false;
                            console.log(self.bsEmp)
                        } else {
                            console.log("에러 empChange() basicschedule: " + res.status)
                        }
                    })

            } else {
                console.log("empChange() empnum = null 입니다..");
            }
        },
        // 닫기 버튼을 눌렀을 때 
        close() {
            this.bsEmp = false;
            //console.log(this.bsEmp)
            this.empEmpty = true;
        },
        // 외부창을 누르면서 닫았을 때 
        handleModalClose(event){
            if (event.target === event.currentTarget) {
                this.bsEmp = false;
                this.empEmpty = true;
            }
        },
        // 추가하기
        realAdd() {
            const self = this
            let arr = self.schedule
            for (let i = 0; i < arr.length; i++) {
                console.log(arr[i]);
                // 추가
                self.$axios.post(`http://localhost:8085/schedule/${arr[i]}`)
                    .then(function (res) {
                        console.log("schedule 등록");
                        console.log(res.status)
                        console.log(res.data)
                        self.$emit('button-clicked', "10cm 버튼 클릭");
                    })

                self.$axios.put(`http://localhost:8085/basicschedule/${arr[i]}`)
                    .then(function (res) {
                        console.log("basicschedule 수정");
                        console.log(res.status)
                        console.log(res.data)
                        //self.bsEmp = false;
                        //self.empEmpty = true;
                    })
            }
            self.bsEmp = false;
            self.empEmpty = true;
            self.schedule = [];
        },
        // 기본 스케줄 삭제 -> 캘린더 변경 X
        delBasicSchedule() {
            const self = this
            let arr = self.schedule;
            for (let i = 0; i < arr.length; i++) {
                self.$axios.delete(`http://localhost:8085/basicschedule/${arr[i]}`)
                    .then(function (res) {
                        console.log("삭제완?")
                        console.log(res.status)
                        self.empChange();
                    })
            }
        },
        // 시간 잘라주는 함수
        changeTime(list) {
            console.log(list)
            for (let i = 0; i < list.length; i++) {
                const date = new Date(list[i].bsdate);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                //const dayOfWeek = date.toLocaleDateString('ko-KR', options).split(' ')[0]; // 2023년
                //console.log(dayOfWeek)
                list[i].bsdate = `${date.toLocaleDateString('ko-KR', options)}`;
                list[i].starttime = list[i].starttime.slice(11, 16)
                list[i].endtime = list[i].endtime.slice(11, 16)

            }
            return list
        },
        // 이전 버튼 클릭
        prev() {
            const self = this;
            if (self.selectedMonth == 1) {
                self.selectedMonth = 12;
                self.selectedYear -= 1;
            } else {
                self.selectedMonth -= 1;
            }
            self.empBasicSchedule(self.selectedEmp, self.selectedYear, self.selectedMonth)
        },
        // 다음 버튼 클릭 
        next() {
            const self = this;
            if (self.selectedMonth == 12) {
                self.selectedMonth = 1;
                self.selectedYear += 1;
            } else {
                self.selectedMonth += 1;
            }
            self.empBasicSchedule(self.selectedEmp, self.selectedYear, self.selectedMonth)
        }
    }
}
</script>

<style scoped>
@import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);

body{
    font-family: 'Noto Sans KR', sans-serif;
}

#divSchedule {
    height: 400px;
    overflow: auto;
    padding-top: 10px;
}

.empScheduleTime {
    padding-top: 5px;
    /* float : left; */
    /* display: flex; */
}

#timeClass {
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center;
    text-align: center;
    align-items: first baseline; */
    display: flex;
   flex-direction: column;
   align-items: flex-start;
   margin-left : 70px;
}

.custom-btn {
    background-color: #B3C755; 
}

.delete-btn{
    background-color: #ed9393;
}

.delete-btn:hover{
    background-color: #df7f7f;
}

.pnbtn{
    border-radius: 50px; 
    background-color: #BEE96D;
    margin-left: 5px;
    margin-right: 5px;
    font-weight: 700;
}

.pnbtn:hover{
    background-color: #FFC67B;
}

.custom-btn:hover {
    background-color: #FFC67B;
}

#selectedyear {
    text-align: center;
}

#monthCircle {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    text-align: center;
    background-color: #BEE96D;
    font-size: 25px;
}

#selectedmonth {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom:5px;
}

#pnBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top:10px;
}

.btncolor:hover{
  background-color: #FFC67B;
  color:#595959;
}
.btncolor{
    color:#595959;
    background-color: #bee96d;
    font-weight: bolder ;
    margin-top:5px;
    margin-bottom:5px;
}
</style>