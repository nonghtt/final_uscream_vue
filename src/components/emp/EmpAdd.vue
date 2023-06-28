<template>
    <div id="eaBody">
        <button @click="testGrade">등급 추가 버튼 (한 번만 눌러야함..))</button>

        <div id="divEmp">
            <h4>직원 등록</h4>
            <div>
                <div>직원 이름 </div>
                <div><input type="text" v-model="empname"></div>
            </div>
            <div>
                <div>입사 날짜</div>
                <div><input type="date" v-model="joindate"></div>
            </div>
            <div>
                <div>등급</div>
                <div>
                    <select v-model="selectedGrade" @change="gradeChange()">
                        <option disabled :key=0 :value="none">
                            --등급 선택--
                        </option>
                        <option v-for="(item, index) in gradeList" :key="index" :value="item.gnum">
                            {{ item.gnum }} : {{ item.salary }}
                        </option>
                    </select>


                </div>

            </div>
            <div>
                <div>컬러</div>
                <div><input type="color" v-model="color"></div>
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
                            <input type="checkbox" v-model='week' value="Sun">SUN
                        </span>
                        <span class="workTime" id="workTimeSun">
                            출근 시간 <input type="time" v-model="startTimeSun">
                            퇴근 시간 <input type="time" v-model="endTimeSun">
                        </span>
                    </li>
                    <li>
                        <span>
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
            week : [],              // 요일 선택 
            startdate : null,       // 언제부터 언제까지 반복할건지 
            enddate : null,
            startTimeSun : null,    // 요일별로 선택한 시간 받아오기
            endTimeSun : null,
            startTimeMon : null,
            endTimeMon : null,
            startTimeTue : null,
            endTimeTue : null,
            startTimeWed : null,
            endTimeWed : null,
            startTimeThu : null,
            endTimeThu : null,
            startTimeFri : null,
            endTimeFri : null,
            startTimeSat : null,
            endTimeSat : null,      
            empnum : ''               // schedule 넣을 때 필요함.
        }
    },
    created: function () {
        const self = this;
        //let storeid = self.id;

        self.$axios.get(`http://localhost:8085/grade/all`)
            .then(function (res) {
                if (res.status == 200 && res.data.flag == true) {
                    self.gradeList = res.data.list;
                    console.log(self.gradeList)
                }
            })

    },
    mounted: function () {
        document.getElementById("divSchedule").style.display = "none";
        const workTime = document.getElementsByClassName("workTime");
        for(let i=0; i<workTime.length; i++){
            workTime[i].style.display = "none";
        }
    },
    methods: {
        gradeChange() {
            const self = this;
            self.grade = self.selectedGrade
            console.log("gradeChange() self.grade :" + self.grade);
        },
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
        empAdd() {
            let empForm = new FormData();
            empForm.append("storeid", this.id);
            empForm.append("empname", this.empname);
            empForm.append("joindate", this.joindate);
            empForm.append("grade", this.grade);
            empForm.append("color", this.color);

            console.log(this.id);
            console.log(this.empname);
            console.log(this.joindate);
            console.log(this.grade);
            console.log(this.color);

            const self = this;
            self.$axios.post('http://localhost:8085/emp', empForm)
                .then(function (res) {
                    console.log(res.status)
                    console.log(res.data.dto)
                    console.log(res.data.dto.empnum)
                    self.empnum =  res.data.dto.empnum
                    document.getElementById('divEmp').style.display = 'none';
                    document.getElementById('divSchedule').style.display = 'block';
                })

    
        },
        scheduleCheckbox(){
            console.log(this.week);
            const checkedWeek = this.week;
            if(checkedWeek.length > 0){
               for(let i=0; i<checkedWeek.length; i++){          
                    let dayId = 'workTime' + checkedWeek[i]
                    console.log(dayId)
                    document.getElementById(dayId).style.display = "block";
               }
            }

        },
        timeCheck(startTime, endTime){        //  startTime, endTime을 체크해줄거에요
            let flag = true
            if(startTime>endTime){
                flag = false
            }
            
            return flag;
        },
        addBasicSchedule(){
            console.log("클릭!")
            const checkedWeek = this.week;
            let startdate = new Date(this.startdate)
            const enddate = new Date(this.enddate)
            const empnum = this.empnum
            console.log("empnum :"+empnum)
            console.log(startdate)
            console.log(enddate)
            if(startdate > enddate){
                console.log("끝날짜가 시작날짜보다 나중이어야 해요!!!")
            }
            /*
                만약 checkedWeek[0] 가 널이 아니면
                그때 값이 있는거니까 넣어주면 될것같아요~?
            */
            while(startdate <= enddate){
                if(checkedWeek[0] && startdate.getDay()==7){
                    console.log("일요일");
                    console.log(startdate)
                } else if (checkedWeek[1] && startdate.getDay()==1){
                    console.log("월요일");
                } else if (checkedWeek[2] && startdate.getDay()==2){
                    console.log("화요일");
                }  else if (checkedWeek[3] && startdate.getDay()==3){
                    console.log("수요일");
                }else if (checkedWeek[4] && startdate.getDay()==4){
                    console.log("목요일");
                }else if (checkedWeek[5] && startdate.getDay()==5){
                    console.log("금요일");
                }else if (checkedWeek[16] && startdate.getDay()==6){
                    console.log("토요일");
                }
                startdate.setDate(startdate.getDate() + 1);
            }

            // 일요일부터 토요일까지 돌려! 
            if(checkedWeek[0]){
                let startTime = this.startTimeSun
                let endTime = this.endTimeSun
                console.log(checkedWeek[0])
                console.log(this.startTimeSun)
                console.log(this.endTimeSun)
                let flag = this.timeCheck(startTime, endTime)
                console.log("일요일의 플래그는요 : "+flag)
            }
            if(checkedWeek[1]){
                console.log(checkedWeek[1])
                console.log(this.startTimeMon)
                console.log(this.endTimeMon)
            }
            if(checkedWeek[2]){
                console.log(checkedWeek[2])
                console.log(this.startTimeTue)
                console.log(this.endTimeTue)
            }
            if(checkedWeek[3]){
                console.log(checkedWeek[3])
                console.log(this.startTimeWed)
                console.log(this.endTimeWed)
            }
            if(checkedWeek[4]){
                console.log(checkedWeek[4])
                console.log(this.startTimeThu)
                console.log(this.endTimeThu)
            }
            if(checkedWeek[5]){
                console.log(checkedWeek[5])
                console.log(this.startTimeFri)
                console.log(this.endTimeFri)
            }
            if(checkedWeek[6]){
                console.log(checkedWeek[6])
                console.log(this.startTimeSat)
                console.log(this.endTimeSat)
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
</style>