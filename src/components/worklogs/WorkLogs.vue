<template>
    <div id="wlBody">
        <h3>근태 관리</h3>

        <!-- 캘린더 or 표 -->
        <button id="ca" class="btncolor" @click="lookCalendar">캘린더로 보기</button>
        <button id="ta" class="btncolor" @click="lookTable">표로 보기</button>

        <!-- 직원 선택하기 -->
        <div>
            <!-- <div>직원</div> -->
            <div id="sb">
                <select class="form-select selectbox" v-model="selectedEmp" @change="empChange()">
                    <option :key=0 :value=0>
                        --전체 선택--
                    </option>
                    <option v-for="(item, index) in empList" :key="index" :value="item.empnum">
                        {{ item.empname }}
                    </option>
                </select>
                <!-- <button @click="lookWlLate">{{ lookwltable }}</button> -->
            </div>
        </div>

        <!-- 캘린더 -->
        <div v-if="choiceNum === 0" id="fullCalendar">
            <FullCalendar :options="calendarOptions" />
        </div>

        <!-- 검색 결과 테이블 -->
        <div v-if="choiceNum === 1">
            <div v-if="list.length === 0">
                검색 결과가 존재하지 않습니다.
            </div>
            <table class="table table-striped" v-else>
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
                        <td>{{ wl.emp.grade.salary.toLocaleString() }}</td>
                        <td>{{ wl.wdate }}</td>
                        <td>{{ wl.starttime }}</td>
                        <td>{{ wl.endtime }}</td>
                        <td>{{ wl.alltime }}시간</td>
                        <td>
                            {{ wl.latetime }}분
                            <span class="late" v-if="wl.latetime > 0">지각</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
//import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';

export default {
    name: 'WorkLogs',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            list: [],
            empList: [],
            selectedEmp: 0,
          //  lookwltable : '지각만 보기',
            choiceNum: 0,
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin, momentPlugin],
                // timeGridPlugin
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth',
                },
                droppable: true,
                editable: true,                 // 편집 가능하게 
                events: [],
                eventClick: this.workDayClick,  // 클릭시
                eventDrop: this.workDayEdit,    // 움직일시(?)
                //eventResize: this.workDayResize,
                timeZone: 'Asia/Seoul',
                height: 700,
                views: {  // views 안에 제목?을 지정해줄 수 있음
                    timeGridWeek: {
                        slotDuration: '00:30:00',
                        scrollTime: '08:00:00',
                        allDaySlot: false,
                        titleFormat: 'M[월] D[일]',
                        titleRangeSeparator: ' - ',
                    },
                    dayGridMonth: {
                        titleFormat: 'YYYY[년] M[월]'
                    },
                },
                selectable: true,               // 달력 일자 드래그 설정가능

            },
        }
    },
    components: {
        FullCalendar,
    },
    created: function () {
        const self = this;
        const storeid = self.id;    // 현재 로그인 중인 아이디 

        // 직원 목록 불러오기 
        self.$axios.get(`http://localhost:8085/emp/storeid/${storeid}`)
            .then(function (res) {
                if (res.status == 200 & res.data.flag == true) {
                    self.empList = res.data.list
                }
            })

        this.getWorkdLogsAllList();

    },
    methods: {
        // 지점별로 근태 관리 리스트 보기 
        getWorkdLogsAllList() {
            const self = this;
            const storeid = self.id;
            self.$axios.get(`http://localhost:8085/worklogs/storeid/${storeid}`)
                .then(function (res) {
                    if (res.status == 200 & res.data.flag == true) {
                        const list = res.data.list;
                        if (self.choiceNum === 0) {
                            console.log("캘린더")
                            list.forEach(item => {
                                const event = {
                                    id: item.wnum,
                                    //title : item.latetime > 0 ? item.emp.empname : (item.emp.empname + ' 분'),
                                    title: item.emp.empname,
                                    start: item.starttime,
                                    end: item.endtime,
                                    backgroundColor: item.latetime > 0 ? '#FF0000' : '#FFFFFF',
                                    borderColor: item.latetime > 0 ? '#FF0000' : '#FFFFFF',
                                    // rendering : "background"
                                    //textColor : '#FF0000',
                                    //display: 'background',
                                }

                                if (item.latetime > 0) {
                                    event.title = event.title + " " + item.latetime + "분";
                                }
                                console.log(event.title + " 지각시간은 ? " + item.latetime);
                                self.calendarOptions.events.push(event);
                            })
                        } else {
                            console.log("표")
                             self.list = self.chageTime(list);
                        }


                    } else {
                        console.log("WorkLogs error : " + res.status);
                    }
                })
        },
        // 직원 별로 보기 
        getWorkLogs(empNum) {
            const self = this;
            //self.emp = self.selectedEmp
            //console.log(self.emp)
            self.$axios.get(`http://localhost:8085/worklogs/empnum/${empNum}`)
                .then(function (res) {
                    if (res.status == 200 & res.data.flag == true) {
                        let list = res.data.list
                        //self.list = self.chageTime(list)
                       // console.log(list)
                        
                        if (self.choiceNum === 0) {
                            self.calendarOptions.events = []
                           // console.log("캘린더ㄹㄹㄹㄹ")
                            list.forEach(item => {
                                const event = {
                                    id: item.wnum,
                                    //title : item.latetime > 0 ? item.emp.empname : (item.emp.empname + ' 분'),
                                    title: item.emp.empname,
                                    start: item.starttime,
                                    end: item.endtime,
                                    backgroundColor: item.latetime > 0 ? '#FF0000' : '#FFFFFF',
                                    borderColor: item.latetime > 0 ? '#FF0000' : '#FFFFFF',
                                    // rendering : "background"
                                    //textColor : '#FF0000',
                                    //display: 'background',
                                }

                                if (item.latetime > 0) {
                                    event.title = event.title + " " + item.latetime + "분";
                                }
                                console.log(event.title + " 지각시간은 ? " + item.latetime);
                                self.calendarOptions.events.push(event);
                            })
                        } else {
                            //console.log("표")
                             self.list = self.chageTime(list);
                        }
                    } else {
                        console.log("에러 : " + res.status)
                    }
                })
        },
        empChange() {
            const self = this;
            let empNum = self.selectedEmp;
            if (empNum === 0) {
                
                console.log("전체보기 ㅇㅇㅇㅇㅇㅇㅇㅇㅇ")
                self.getWorkdLogsAllList();
            } else {
                console.log("특정멤버로 보기")
                self.getWorkLogs(empNum);
            }
        },
        // 시간 잘라주는 함수 : 원래는 2023-07-05T09:00:00 이렇게 보임 
        chageTime(list) {
            //.log(list)
            for (let i = 0; i < list.length; i++) {
                list[i].starttime = list[i].starttime.slice(11, 16)
                list[i].endtime = list[i].endtime.slice(11, 16)
               // console.log(list[i].alltime / 60)
                list[i].alltime = list[i].alltime / 60

            }
            return list
        },
        // 등록된 스케줄을 눌렀을 때
        workDayClick(info) {
            console.log(info)
        },
        workDayEdit(info) {
            console.log(info)
        },
        // 캘린더로 보기 클릭 
        lookCalendar() {
            const self = this;
            self.choiceNum = 0
           // console.log(self.choiceNum)

            let empNum = self.selectedEmp;
            if (empNum === 0) {
                console.log("전체보기 ㅇㅇㅇㅇㅇㅇㅇㅇㅇ")
                self.getWorkdLogsAllList();
            } else {
                console.log("특정멤버로 보기")
                self.getWorkLogs(empNum);
            }
        },
        // 테이블로 보기 클릭 
        lookTable() {
            const self = this;
            self.choiceNum = 1
            //console.log(self.choiceNum)
           // console.log("gmdmdmda" + self.selectedEmp)

            let empNum = self.selectedEmp;
            if (empNum === 0) {
                //console.log("전체보기 ㅇㅇㅇㅇㅇㅇㅇㅇㅇ")
                self.getWorkdLogsAllList();
            } else {
                //console.log("특정멤버로 보기")
                self.getWorkLogs(empNum);
            }
        },
        // lookWlLate(){
        //     const self = this;
        //     if(self.lookwltable === '지각만 보기'){
        //         console.log("후하")
        //     } else { // 전체보기 
        //         console.log("후하")
        //     }
        // }
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

.late {
    background-color: red;
    border-radius: 20px;
    padding: 1px 3px;
    color: white;
}

.btncolor:hover {
    background-color: #FFC67B;
    color: #595959
}

.btncolor {
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
    border: none;
    padding: 5px 10px;
}

#ca {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}


#ta {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}

.selectbox{
    width:210px;
    /* margin: 0 auto;  */
}

#sb{
    justify-content: center;
    display: flex;
    margin-top:15px;
    margin-bottom:40px;
}

#fullCalendar{
    margin-bottom:50px;
}
</style>