<template>
    <div id="eaBody">
        <button @click="testGrade">등급 추가 버튼 (한 번만 눌러야함..))</button>

        <div id="divEmp">
            <h3>직원 등록</h3>

            <div class="mb-3">
                <label for="empName" class="form-label">직원 이름</label>
                <input type="text" class="form-control"  v-model="empname" placeholder="홍길동">
            </div>

            <div class="mb-3">
                <label for="empDate" class="form-label">입사 날짜</label>
                <input type="date" class="form-control"  v-model="joindate">
            </div>

            <div class="mb-3">
                <label for="empGrade" class="form-label">등급</label>
                <select v-model="selectedGrade" @change="gradeChange()" class="form-select">
                        <option disabled :key=0 :value="none">
                            --등급 선택--
                        </option>
                        <option v-for="(item, index) in gradeList" :key="index" :value="item.gnum">
                            {{ item.gnum }} : {{ item.salary }}
                        </option>
                    </select>
            </div>

            <div class="mb-3">
                <label for="empDate" class="form-label">컬러</label>
                <input type="color" class="form-control form-control-color"  v-model="color">
            </div>
 
          
            <div><button @click="empAdd()">등록</button></div>


        </div>

        <div id="divSchedule">
            <h4>기본 스케줄 등록 (미완)</h4>
            <div>
                <div>시작 날짜</div>
                <div><input type="date" v-model="startdate"></div>
            </div>
            <div>
                <div>종료 날짜</div>
                <div><input type="date" v-model="enddate"></div>
            </div>

            <div @change="scheduleCheckbox">
                <ul>
                    <li>
                        <span>
                            <!-- <input type="checkbox" v-model='week' :true-value="trueValueMethod('Sun')" :false-value="falseValueMethod('Sun')">SUN -->
                            <input type="checkbox" v-model='week' value="Sun">SUN
                        </span>
                        <span class="workTime" id="workTimeSun">
                            출근 시간 <input type="time" v-model="startTimeSun">
                            퇴근 시간 <input type="time" v-model="endTimeSun">
                        </span>
                    </li>
                    <li>
                        <span>
                            <!-- <input type="checkbox" v-model='week' :true-value="trueValueMethod('Mon')" :false-value="falseValueMethod('Mon')">MON -->
                            <input type="checkbox" v-model='week' value="Mon">MON
                        </span>
                        <span class="workTime" id="workTimeMon">
                            출근 시간 <input type="time" v-model="startTimeMon">
                            퇴근 시간 <input type="time" v-model="endTimeMon">
                        </span>
                    </li>
                    <li>
                        <span>
                            <input type="checkbox" v-model='week' value="Tue">TUE
                        </span>
                        <span class="workTime" id="workTimeTue">
                            출근 시간 <input type="time" v-model="startTimeTue">
                            퇴근 시간 <input type="time" v-model="endTimeTue">
                        </span>
                    </li>
                    <li>
                        <span>
                            <input type="checkbox" v-model='week' value="Wed">WED
                        </span>
                        <span class="workTime" id="workTimeWed">
                            출근 시간 <input type="time" v-model="startTimeWed">
                            퇴근 시간 <input type="time" v-model="endTimeWed">
                        </span>
                    </li>
                    <li>
                        <span>
                            <input type="checkbox" v-model='week' value="Thu">THU
                        </span>
                        <span class="workTime" id="workTimeThu">
                            출근 시간 <input type="time" v-model="startTimeThu">
                            퇴근 시간 <input type="time" v-model="endTimeThu">
                        </span>
                    </li>
                    <li>
                        <span>
                            <input type="checkbox" v-model='week' value="Fri">FRI
                        </span>
                        <span class="workTime" id="workTimeFri">
                            출근 시간 <input type="time" v-model="startTimeFri">
                            퇴근 시간 <input type="time" v-model="endTimeFri">
                        </span>
                    </li>
                    <li>
                        <span>
                            <input type="checkbox" v-model='week' value="Sat">SAT
                        </span>
                        <span class="workTime" id="workTimeSat">
                            출근 시간 <input type="time" v-model="startTimeSat">
                            퇴근 시간 <input type="time" v-model="endTimeSat">
                        </span>
                    </li>
                </ul>
            </div>
            <div>
                <button @click="addBasicSchedule">스케줄 등록</button>
            </div>

        </div>
    </div>
</template>

<script>
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
            selectedGrade: '',      // 등급 선택 
            week: [],               // 요일 선택 
            startdate: null,        // 언제부터 언제까지 반복할건지 
            enddate: null,
            startTimeSun: null,     // 요일별로 선택한 시간 받아오기
            endTimeSun: null,
            startTimeMon: null,
            endTimeMon: null,
            startTimeTue: null,
            endTimeTue: null,
            startTimeWed: null,
            endTimeWed: null,
            startTimeThu: null,
            endTimeThu: null,
            startTimeFri: null,
            endTimeFri: null,
            startTimeSat: null,
            endTimeSat: null,
            empnum: ''               // schedule 넣을 때 필요함.
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

        // 요일 선택을 해야 시간 선택이 보일 수 있게 
        const workTime = document.getElementsByClassName("workTime");
        for (let i = 0; i < workTime.length; i++) {
            workTime[i].style.display = "none";
        }
    },
    methods: {
        // 등급 선택 
        gradeChange() {
            const self = this;
            self.grade = self.selectedGrade
            //console.log("gradeChange() self.grade :" + self.grade);
        },
        // 이 함수는 지울 예정 (데이터 넣기 편하라고 넣어둔 함수)
        testGrade() {
            let mul = [1, 1.2, 1.4, 1.6];
            for (let i = 0; i < 4; i++) {
                let formData = new FormData();
                let money = parseInt(9620 * mul[i]);
                money = Math.ceil(money / 10) * 10;

                formData.append("gnum", i + 1);
                formData.append("salary", money);

                const self = this;
                self.$axios.post('http://localhost:8085/grade', formData)
                    .then(function (res) {
                        console.log(res.status)
                    })
            }
        },
        // 직원 등록 
        empAdd() {
            let empForm = new FormData();
            empForm.append("storeid", this.id);
            empForm.append("empname", this.empname);
            empForm.append("joindate", this.joindate);
            empForm.append("grade", this.grade);
            empForm.append("color", this.color);

            const self = this;
            self.$axios.post('http://localhost:8085/emp', empForm)
                .then(function (res) {
                    self.empnum = res.data.dto.empnum      // 직원 num 넣어주기 → 스케줄 등록할 때 num 필요함 
                    document.getElementById('divEmp').style.display = 'none';       // 등록하면 직원 등록창 사라지고
                    document.getElementById('divSchedule').style.display = 'block'; // 등록하면 스케줄 등록창 추가하기 
                })
        },
        // 체크하면 체크한 부분 보여주기 
        scheduleCheckbox() {
            console.log(this.week);
            const checkedWeek = this.week;
            if (checkedWeek.length > 0) {
                for (let i = 0; i < checkedWeek.length; i++) {
                    let dayId = 'workTime' + checkedWeek[i]
                    console.log(dayId)
                    document.getElementById(dayId).style.display = "block";
                }
            }

        },
        timeCheck(startTime, endTime) {        //  startTime, endTime을 체크해줄거에요
            let flag = true
            if (startTime > endTime) {
                flag = false
            }

            return flag;
        },
        addBasicSchedule() {
            const self = this
            const checkedWeek = self.week;
            //console.log("checkedWeek :" + checkedWeek);
            let startdate = new Date(self.startdate)
            const enddate = new Date(self.enddate)
            //console.log("startdate :" + startdate)
            //console.log("enddate :" + enddate)

            if (startdate > enddate) {
                alert("끝날짜가 시작날짜보다 나중이어야 해요!!!")
            }

            let start = ''
            let end = ''

            // 첫날짜부터 마지막 날짜까지 while문으로 돌리기 
            while (startdate <= enddate) {
                start = ''
                end = ''

                if (checkedWeek[0] && startdate.getDay() == 0) {
                    start = self.startTimeSun   // 설정한 시작 시간 넣어주기 
                    end = self.endTimeSun       // 설정한 끝 시간 넣어주기 
                    this.basicScheduleAdd(start, end, startdate)    // 스케줄 추가하기 (함수)
                } else if (checkedWeek[1] && startdate.getDay() == 1) {
                    start = self.startTimeMon
                    end = self.endTimeMon
                    this.basicScheduleAdd(start, end, startdate)
                } else if (checkedWeek[2] && startdate.getDay() == 2) {
                    start = self.startTimeTue
                    end = self.endTimeTue
                    this.basicScheduleAdd(start, end, startdate)
                } else if (checkedWeek[3] && startdate.getDay() == 3) {
                    start = self.startTimeWed
                    end = self.endTimeWed
                    this.basicScheduleAdd(start, end, startdate)
                } else if (checkedWeek[4] && startdate.getDay() == 4) {
                    start = self.startTimeThu
                    end = self.endTimeThu
                    this.basicScheduleAdd(start, end, startdate)
                } else if (checkedWeek[5] && startdate.getDay() == 5) {
                    start = self.startTimeFri
                    end = self.endTimeFri
                    this.basicScheduleAdd(start, end, startdate)
                } else if (checkedWeek[6] && startdate.getDay() == 6) {
                    start = self.startTimeSat
                    end = self.endTimeSat
                    this.basicScheduleAdd(start, end, startdate)
                }
                startdate.setDate(startdate.getDate() + 1);
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

            // console.log("startTime :" +startTime);
            // console.log("endTime :" +endTime);
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

        }

    }
}
</script>

<style scoped>
#eaBody {
    max-width: 100%;
    margin: 0 auto;
    padding-top: 30px;
    padding-bottom: 30px;
}

#h3 {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
}
</style>