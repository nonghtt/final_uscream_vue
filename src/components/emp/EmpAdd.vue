<template>
    <div id="eaBody">

        <div id="divEmp">
            <h3>직원 등록</h3>

            <div class="mb-3">
                <label for="empName" class="form-label title">직원 이름</label>
                <input type="text" class="form-control" v-model="empname" placeholder="홍길동">
            </div>

            <div class="mb-3">
                <label for="empDate" class="form-label title">입사 날짜</label>
                <input type="date" class="form-control" v-model="joindate">
            </div>

            <div class="mb-3">
                <label for="empGrade" class="form-label title">등급</label>
                <select v-model="selectedGrade" @change="gradeChange()" class="form-select">
                    <option disabled :key=0 :value=0>
                        --등급 선택--
                    </option>
                    <option v-for="(item, index) in gradeList" :key="index" :value="item.gnum">
                        {{ item.gnum }} : {{ item.salary.toLocaleString() }}
                    </option>
                </select>
            </div>

            <div class="mb-3">
                <label for="empDate" class="form-label title">컬러</label>
                <input type="color" class="form-control" v-model="color" id="inputColor">
            </div>


            <div class="content">
                <button class="btn custom-btn" @click="empAdd()">등록</button>
            </div>


        </div>

        <div id="divSchedule">
            <h3>기본 스케줄 등록</h3>
            <div class="mb-3">
                <label for="labelStartDate" class="form-label title">시작 날짜</label>
                <input type="date" class="form-control" v-model="startdate">
            </div>
            <div class="mb-3">
                <label for="labelEndDate" class="form-label title">종료 날짜</label>
                <input type="date" class="form-control" v-model="enddate">
            </div>

            <div class="title">요일 및 시간 선택</div>

            <div>
                <ul>
                    <li>
                        <div class="workDay">

                            <input type="checkbox" v-model='week' value="Sun"> SUN
                        </div>
                        <span class="workTime" id="workTimeSun">
                            출근 시간 <input type="time" v-model="startTimeSun" class="inputStartTime">
                            퇴근 시간 <input type="time" v-model="endTimeSun">
                        </span>
                    </li>
                    <li>
                        <div class="workDay">

                            <input type="checkbox" v-model='week' value="Mon"> MON
                        </div>
                        <span class="workTime" id="workTimeMon">
                            출근 시간 <input type="time" v-model="startTimeMon" class="inputStartTime">
                            퇴근 시간 <input type="time" v-model="endTimeMon">
                        </span>
                    </li>
                    <li>
                        <div class="workDay">
                            <input type="checkbox" v-model='week' value="Tue"> TUE
                        </div>
                        <span class="workTime" id="workTimeTue">
                            출근 시간 <input type="time" v-model="startTimeTue" class="inputStartTime">
                            퇴근 시간 <input type="time" v-model="endTimeTue">
                        </span>
                    </li>
                    <li>
                        <div class="workDay">
                            <input type="checkbox" v-model='week' value="Wed"> WED
                        </div>
                        <span class="workTime" id="workTimeWed">
                            출근 시간 <input type="time" v-model="startTimeWed" class="inputStartTime">
                            퇴근 시간 <input type="time" v-model="endTimeWed">
                        </span>
                    </li>
                    <li>
                        <div class="workDay">
                            <input type="checkbox" v-model='week' value="Thu"> THU
                        </div>
                        <span class="workTime" id="workTimeThu">
                            출근 시간 <input type="time" v-model="startTimeThu" class="inputStartTime">
                            퇴근 시간 <input type="time" v-model="endTimeThu">
                        </span>
                    </li>
                    <li>
                        <div class="workDay">
                            <input type="checkbox" v-model='week' value="Fri"> FRI
                        </div>
                        <span class="workTime" id="workTimeFri">
                            출근 시간 <input type="time" v-model="startTimeFri" class="inputStartTime">
                            퇴근 시간 <input type="time" v-model="endTimeFri">
                        </span>
                    </li>
                    <li>
                        <div class="workDay">
                            <input type="checkbox" v-model='week' value="Sat"> SAT
                        </div>
                        <span class="workTime" id="workTimeSat">
                            출근 시간 <input type="time" v-model="startTimeSat" class="inputStartTime">
                            퇴근 시간 <input type="time" v-model="endTimeSat">
                        </span>
                    </li>
                </ul>
            </div>

            <div class="content">
                <button class="btn custom-btn" @click="addBasicSchedule">
                    스케줄 등록
                </button>
            </div>

            <!-- Modal -->
            <div class="modal fade" id="add" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">직원 등록</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            직원 등록 성공
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn custom-btn" data-bs-dismiss="modal" @click="addSuccess">닫기</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
    name: 'EmpAdd',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),  // id : storeid
            empname: '',
            joindate: '',
            grade: '',
            color: '',              // emp dto 
            gradeList: [],          // 등급 리스트 보여주기
            selectedGrade: 0,       // 등급 선택 
            week: [],               // 요일 선택 
            startdate: null,        // 언제부터 언제까지 반복할건지 
            enddate: null,
            startTimeSun: '09:00',     // 요일별로 선택한 시간 받아오기
            endTimeSun: '18:00',
            startTimeMon: '09:00',
            endTimeMon: '18:00',
            startTimeTue: '09:00',
            endTimeTue: '18:00',
            startTimeWed: '09:00',
            endTimeWed: '18:00',
            startTimeThu: '09:00',
            endTimeThu: '18:00',
            startTimeFri: '09:00',
            endTimeFri: '18:00',
            startTimeSat:'09:00',
            endTimeSat: '18:00',
            empnum: '',               // schedule 넣을 때 필요함.
            showModal : false         // 직원 등록 잘못됐을시 모달안보여줄거임
        }
    },
    created: function () {
        const self = this;

        // grade 셀렉버튼 창 만들어주기 위해서 
        self.$axios.get(`http://localhost:8085/grade/all`)
            .then(function (res) {
                if (res.status == 200 && res.data.flag == true) {
                    self.gradeList = res.data.list;
                    console.log(self.gradeList)
                }
            })
    },
    mounted: function () {
        // 직원 등록 전에 스케줄 등록 none
        document.getElementById("divSchedule").style.display = "none";
    },
    methods: {
        // 등급 선택 
        gradeChange() {
            const self = this;
            self.grade = self.selectedGrade
        },
        // 직원 등록 
        empAdd() {
            let empForm = new FormData();
            empForm.append("storeid", this.id);
            empForm.append("empname", this.empname);
            empForm.append("joindate", this.joindate);
            empForm.append("grade", this.grade);
            empForm.append("color", this.color);

            if (this.empname === null || this.empname == '') {
                alert("직원 이름을 입력해주세요")
            } else if (this.joindata === null) {
                alert("입사 날짜를 입력해주세요")
            } else if (this.grade === null || this.grade == '') {
                alert("등급을 입력해주세요")
            } else {
                const self = this;
                self.$axios.post('http://localhost:8085/emp', empForm)
                    .then(function (res) {
                        self.empnum = res.data.dto.empnum      // 직원 num 넣어주기 → 스케줄 등록할 때 num 필요함 
                        document.getElementById('divEmp').style.display = 'none';       // 등록하면 직원 등록창 사라지고
                        document.getElementById('divSchedule').style.display = 'block'; // 등록하면 스케줄 등록창 추가하기 
                    })
            }
        },
        // startTime, endTime을 체크해줄거에요
        timeCheck(startTime, endTime) {
            let flag = true
            if (startTime > endTime) {
                flag = false
            }
            return flag;
        },
        addBasicSchedule() {
            const self = this
            const checkedWeek = self.week;
            let checkedWeekArr = [0, 0, 0, 0, 0, 0, 0]

            for (let i = 0; i < checkedWeek.length; i++) {
                switch (checkedWeek[i]) {
                    case 'Sun':
                        checkedWeekArr[0] = 1;
                        break;
                    case 'Mon':
                        checkedWeekArr[1] = 1;
                        break;
                    case 'Tue':
                        checkedWeekArr[2] = 1;
                        break;
                    case 'Wed':
                        checkedWeekArr[3] = 1;
                        break;
                    case 'Thu':
                        checkedWeekArr[4] = 1;
                        break;
                    case 'Fri':
                        checkedWeekArr[5] = 1;
                        break;
                    case 'Sat':
                        checkedWeekArr[6] = 1;
                        break;

                }
            }

            let startdate = new Date(self.startdate)
            const enddate = new Date(self.enddate)

      

            let start = ''
            let end = ''
            let check = true;
       
            

            // if(self.startTimeSun)
            if (checkedWeekArr[0] == 1) {
                if (self.startTimeSun > self.endTimeSun) {
                    alert("일요일의 시작 시간이 종료 시간보다 빨라야 해요!")
                    check = false;
                }
                if (self.startTimeSun == null || self.endTimeSun == null) {
                    alert("일요일 시간을 설정해주세요");
                    check = false;
                }
            }
            if (checkedWeekArr[1] == 1) {
                if (self.startTimeMon > self.endTimeMon) {
                    alert("월요일의 시작 시간이 종료 시간보다 빨라야 해요!")
                    check = false;
                }
                if (self.startTimeMon == null || self.endTimeMon == null) {
                    alert("월요일 시간을 설정해주세요");
                    check = false;
                }
            }
            if (checkedWeekArr[2] == 1) {
                if (self.startTimeTue > self.endTimeTue) {
                    alert("화요일의 시작 시간이 종료 시간보다 빨라야 해요!")
                    check = false;
                }
                if (self.startTimeTue == null || self.endTimeTue == null) {
                    alert("화요일 시간을 설정해주세요");
                    check = false;
                }
            }
            if (checkedWeekArr[3] == 1) {
                if (self.startTimeWed > self.endTimeWed) {
                    alert("수요일의 시작 시간이 종료 시간보다 빨라야 해요!")
                    check = false;
                }
                if (self.startTimeWed == null || self.endTimeWed == null) {
                    alert("수요일 시간을 설정해주세요");
                    check = false;
                }
            }
            if (checkedWeekArr[4] == 1) {
                if (self.startTimeThu > self.endTimeThu) {
                    alert("목요일의 시작 시간이 종료 시간보다 빨라야 해요!")
                    check = false;
                }
                if (self.startTimeThu == null || self.endTimeThu == null) {
                    alert("목요일 시간을 설정해주세요");
                    check = false;
                }
            }
            if (checkedWeekArr[5] == 1) {
                if (self.startTimeFri > self.endTimeFri) {
                    alert("금요일의 시작 시간이 종료 시간보다 빨라야 해요!")
                    check = false;
                }
                if (self.startTimeFri == null || self.endTimeFri == null) {
                    alert("금요일 시간을 설정해주세요");
                    check = false;
                }
            }
            if (checkedWeekArr[6] == 1) {
                if (self.startTimeSat > self.endTimeSat) {
                    alert("토요일의 시작 시간이 종료 시간보다 빨라야 해요!")
                    check = false;
                }
                if (self.startTimeSat == null || self.endTimeSat == null) {
                    alert("토요일 시간을 설정해주세요");
                    check = false;
                }
            }


           if(startdate === null){
                alert("시작 날짜를 설정해주세요")
                document.getElementById("add").setAttribute("aria-hidden", "true")
                //self.showModal=false;
           } else if(enddate === null){
            alert("종료 날짜를 설정해주세요")
            document.getElementById("add").setAttribute("aria-hidden", "true")
            //self.showModal=false;
           } else if(startdate > enddate) {
                alert("끝날짜가 시작날짜보다 나중이어야 해요!!!")
                document.getElementById("add").setAttribute("aria-hidden", "true")
                //self.showModal=false;
            } else if(self.week.length === 0){
                alert("요일을 선택해주세요!")
            } else if(check){
                //self.showModal=true;
                const modal = document.getElementById('add');
                let myModal = new Modal(modal)
                myModal.show();

                while (startdate <= enddate) {
                    start = ''
                    end = ''

                    if (checkedWeekArr[0] == 1 && startdate.getDay() == 0) {
                        start = self.startTimeSun   // 설정한 시작 시간 넣어주기 
                        end = self.endTimeSun       // 설정한 끝 시간 넣어주기 
                        this.basicScheduleAdd(start, end, startdate)
                        // 스케줄 추가하기 (함수)
                    } else if (checkedWeekArr[1] == 1 && startdate.getDay() == 1) {
                        start = self.startTimeMon
                        end = self.endTimeMon
                        this.basicScheduleAdd(start, end, startdate)
                    } else if (checkedWeekArr[2] == 1 && startdate.getDay() == 2) {
                        start = self.startTimeTue
                        end = self.endTimeTue
                        this.basicScheduleAdd(start, end, startdate)
                    } else if (checkedWeekArr[3] == 1 && startdate.getDay() == 3) {
                        start = self.startTimeWed
                        end = self.endTimeWed
                        this.basicScheduleAdd(start, end, startdate)
                    } else if (checkedWeekArr[4] == 1 && startdate.getDay() == 4) {
                        start = self.startTimeThu
                        end = self.endTimeThu
                        this.basicScheduleAdd(start, end, startdate)
                    } else if (checkedWeekArr[5] == 1 && startdate.getDay() == 5) {
                        start = self.startTimeFri
                        end = self.endTimeFri
                        this.basicScheduleAdd(start, end, startdate)
                    } else if (checkedWeekArr[6] == 1 && startdate.getDay() == 6) {
                        start = self.startTimeSat
                        end = self.endTimeSat
                        this.basicScheduleAdd(start, end, startdate)
                    }
                    startdate.setDate(startdate.getDate() + 1);
                }
            }
        },
        basicScheduleAdd(start, end, day) {     // 스케줄 추가 함수
            const self = this;
            let formData = new FormData()

            let dateObj = new Date(day)
            let year = dateObj.getFullYear();
            let month = String(dateObj.getMonth() + 1).padStart(2, "0");
            let day2 = String(dateObj.getDate()).padStart(2, "0");
            let formattedDate = `${year}-${month}-${day2}`;             // 얜 string

            let startTime = formattedDate + 'T' + start + ':00'
            let endTime = formattedDate + 'T' + end + ':00'

            console.log("startTime :" + startTime);
            console.log("endTime :" + endTime);
            // console.log("formattedDate :" +formattedDate);
            // console.log("typeof formattedDate :"+typeof formattedDate)

            formData.append("storeid", self.id)
            formData.append("emp", self.empnum)
            formData.append("bsdate", formattedDate)
            formData.append("starttime", startTime)
            formData.append("endtime", endTime)

            if (startTime != null && endTime != null) {
                self.$axios.post('http://localhost:8085/basicschedule', formData)
                    .then(function (res) {
                        if (res.status == 200) {
                            console.log("res.data.flag :" + res.data.flag)
                        }
                    })
            } else {
                console.log("null 오류 : startTime" + startTime + " / endTime" + endTime);
            }

        },
        addSuccess(){
             // 초기화 해주기기
             self.startdate = null;
            self.enddate = null;
            self.startTimeSun = '09:00';
            self.startTimeMon = '09:00';
            self.startTimeTue = '09:00';
            self.startTimeWed = '09:00';
            self.startTimeThu = '09:00';
            self.startTimeFri = '09:00';
            self.startTimeSat = '09:00';
            self.endTimeSun = '18:00';
            self.endTimeMon = '18:00';
            self.endTimeTue = '18:00';
            self.endTimeWed = '18:00';
            self.endTimeThu ='18:00';
            self.endTimeFri = '18:00';
            self.endTimeSat = '18:00';

            this.$router.push({
                name: 'emplist'
            });

        
        }
    }
}
</script>

<style scoped>
@import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);

#eaBody {
    width: 50%;
    margin: 0 auto;
    padding-top: 30px;
    padding-bottom: 30px;
    font-family: 'Noto Sans KR', sans-serif;
}

h3 {
    text-align: center;
}

.custom-btn {
    background-color: #bee96d;
    width: 150px;
    margin-top: 20px;
}

.custom-btn:hover {
    background-color: #FFC67B;
}

.content {
    text-align: center;
}

ul {
    list-style: none;
    padding: 0px;
    /* text-align:center; */
}

li {
    padding: 7px 0px;
}

.workDay {
    width: 90px;
    float: left;
    font-size: 1.2em;
}

.title {
    font-weight: bold;
    padding-top: 20px;
}

.inputStartTime {
    margin-right: 15px;
}

#inputColor {
    height: 30px;
}

.modal {
    text-align: center;
}

@media screen and (min-width: 768px) {
    .modal:before {
        display: inline-block;
        vertical-align: middle;
        content: " ";
        height: 100%;
    }
}

.modal-dialog {
    display: inline-block;
    text-align: left;
    vertical-align: middle;
}

.modal-content {
    width : 500px;
}

h3 {
  text-align: left;
}
</style>