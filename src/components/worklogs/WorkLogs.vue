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

                <!-- 초과 근무 & 지각 근무 보기 -->
                <select v-if="choiceNum === 1" class="form-select selectbox" v-model="selectedLateTime"
                    @change="latetimeChange()">
                    <option :key=0 :value=0>
                        --전체 보기--
                    </option>
                    <option :key=1 :value=1>
                        지각 근무만 보기
                    </option>
                    <option :key=2 :value=2>
                        초과 근무만 보기
                    </option>
                </select>
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
                        <th scope="col">시간 (분)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="wl in paginatedData" :key="wl.whitenum">
                        <td scope="row">{{ wl.emp.empname }}</td>
                        <td>{{ wl.emp.grade.salary.toLocaleString() }}</td>
                        <td>{{ wl.wdate }}</td>
                        <td>{{ wl.starttime }}</td>
                        <td>{{ wl.endtime }}</td>
                        <td>{{ wl.alltime }}시간</td>
                        <td>
                            <span v-if="wl.latetime > 0">
                                {{ wl.latetime }}분
                                <span class="late">지각</span>
                            </span>
                            <span v-if="wl.latetime < 0">
                                {{ wl.latetime.toString().substring(1) }}분
                                <span class="exceed">초과</span>
                            </span>

                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- 페이징 -->
            <div class="pagination" v-if="totalpages > 0">
                <button :disabled="currentPage === 1" @click="prevPage">이전</button>


                <div v-for="(item, i) in pagearray" :key="i">
                    <!-- 총 페이지의 개수 > index보다 클 경우에만 보여주기 총 페이지가 1이면 1만 보여주기 위해서 -->
                    <button v-if="totalpages > i" :class="{ active: currentPage === item }" @click="goToPage(item)">
                        {{ item }}
                    </button>
                </div>

                <button :disabled="currentPage === totalPages" @click="nextPage">다음</button>
            </div>
            <!-- 페이징 여기까지 -->

        </div>

        <!-- 삭제 Modal : 컬러 블록 선택했을 때 보이는 모달 -->
        <div class="modal fade" id="scModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">하이</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>하이</div>
                        <div>시간 - 시간</div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btncolor" data-bs-dismiss="modal" @click="delsc">삭제</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
//import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';

import { Modal } from 'bootstrap';

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
            pageSize: 12,               // 페이징 : 한 페이지에 보여줄 글 개수
            currentPage: 1,             // 페이징 : 현재 페이지
            totalpages: 0,              // 페이징 : Math.ceil(this.list / this.pageSize) "전체 리스트"에서 "한 페이지에 보여줄 글 개수"를 나눈 값
            pagearray: [1, 2, 3, 4, 5], // 페이징 : 숫자 버튼 5개 초기값
            selectedLateTime: 0,
            modaltitle : '',
            modaldate : '',
            modalstarttime : 0,
            modalendtime : 0,
            modalalltime : 0,
            modallatetime : 0,
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
        self.$axios.get(`http://localhost:8085/emp/name/storeid/${storeid}`)
            .then(function (res) {
                if (res.status == 200 & res.data.flag == true) {
                    self.empList = res.data.list

                }
            })

        this.getWorkdLogsAllList();

    },
    computed: {
        totalPages() {  // 페이징
            return Math.ceil(this.list.length / this.pageSize);
        },
        paginatedData() {   // 페이징
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.list.slice(startIndex, endIndex);
        },
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
                                // console.log(event.title + " 지각시간은 ? " + item.latetime);
                                self.calendarOptions.events.push(event);
                            })
                        } else {
                            console.log("표")
                            self.list = self.chageTime(list);
                            //console.log(self.list)
                            self.totalpages = Math.ceil(self.list.length / self.pageSize);
                            console.log("getWorkdLogsAllList :" + self.totalpages)
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
                            console.log(self.list)
                            self.totalpages = Math.ceil(self.list.length / self.pageSize);
                            console.log("getWorkLogs 총 페이지 : " + self.totalpages);
                        }
                    } else {
                        console.log("에러 : " + res.status)
                    }
                })
        },
        empChange() {
            const self = this;
            self.selectedLateTime = 0;
            self.pagearray = [1, 2, 3, 4, 5]
            let empNum = self.selectedEmp;
            if (empNum === 0) {
                self.getWorkdLogsAllList();
            } else {
                self.getWorkLogs(empNum);
            }
        },
        // 시간 잘라주는 함수 : 원래는 2023-07-05T09:00:00 이렇게 보임 
        chageTime(list) {
            //.log(list)
            const self = this;

            self.totalpages = Math.ceil(list.length / self.pageSize);
            console.log("changeTime 총 페이지 : " + self.totalpages);
            for (let i = 0; i < list.length; i++) {
                list[i].starttime = list[i].starttime.slice(11, 16)
                list[i].endtime = list[i].endtime.slice(11, 16)
                // console.log(list[i].alltime / 60)
                //let alltime =  list[i].alltime
                list[i].alltime = list[i].alltime / 60


                /*
                // hour = 스케줄에 등록된 시간
                let hour = (parseInt(list[i].endtime.slice(0,2))-parseInt(list[i].starttime.slice(0,2))) * 60;
                let minute = parseInt(list[i].endtime.slice(3,5))-parseInt(list[i].starttime.slice(3,5));
                if(minute != 0){
                    hour += minute;
                }

                if(hour < alltime){
                    console.log("초과근무함 :" + alltime);
                    list[i].latetime = parseInt("-" + (alltime - hour));
                }
                //console.log(parseInt(list[i].endtime.slice(0,2))-parseInt(list[i].starttime.slice(0,2)))
                //console.log(parseInt(list[i].endtime.slice(3,5))-parseInt(list[i].starttime.slice(3,5)))
                */
            }
            return list
        },
        // 등록된 스케줄을 눌렀을 때
        workDayClick(info) {
            /*
            const self = this;
            console.log(info)
            console.log("emp name : " + info.event._def.title)

            console.log(info.event._instance.range.start)
            console.log(info.event._instance.range.start)
            console.log(info.event._instance.range)

            const startDate = new Date(info.event._instance.range.start);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            let startTime = JSON.stringify(info.event._instance.range.start).slice(12, 17)
            startTime = startTime.replace(/^0/, '').replace(/:/g, '시 ').replace(/$/, '분');
            // /^0/ → 첫 문자가 0 이라면, /:/g → 모든 문자에 :가 있다면, /$/ → 마지막에 추가.
            let endTime = JSON.stringify(info.event._instance.range.end).slice(12, 17)
            endTime = endTime.replace(/^0/, '').replace(/:/g, '시 ').replace(/$/, '분');

            let date = `${startDate.toLocaleDateString('ko-KR', options)}`;
            */
            const modal = document.getElementById('scModal');
            console.log(info)
            let myModal = new Modal(modal)
            myModal.show();
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
        // 페이징 : "이전" 버튼 클릭
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.lookFivePage(this.currentPage)
            }
        },
        // 페이징 : "이후" 버튼 클릭
        nextPage() {
            if (this.currentPage < this.totalpages) {
                this.currentPage++;
                this.lookFivePage(this.currentPage)
            }
        },
        // 페이징 : 숫자 버튼 클릭
        goToPage(pageNumber) {
            this.lookFivePage(pageNumber)
            this.currentPage = pageNumber;
        },
        // 페이징 : 숫자 버튼 계산
        lookFivePage(pageNumber) {
            if (pageNumber == 1 || pageNumber == 2) {   // 1,2페이지 클릭했을 때 1, 2, 3, 4, 5 뜨게 만들어주기
                for (let i = 0; i < this.pagearray.length; i++) {
                    this.pagearray[i] = i + 1;
                }
            } else if (pageNumber == this.totalpages || pageNumber == (this.totalpages - 1)) {  // 마지막이랑 마지막-1 페이지 클릭했을 때 
                for (let i = 0; i < this.pagearray.length; i++) {
                    this.pagearray[i] = this.totalpages - 4 + i;
                }
            } else {   // 그 중간의 것들 클릭
                if (pageNumber > 3) {
                    for (let i = 0; i < this.pagearray.length; i++) {
                        this.pagearray[i] = pageNumber - 2 + i;
                    }
                }
            }
        },
        // 지각만 보기
        latetimeChange() {
            const self = this;
            const time = self.selectedLateTime;
            const emp = self.selectedEmp;
            //console.log(time);
            // console.log(emp);
            // 0: 전체보기 
            // 1: 지각만 보기
            // 2: 초과만 보기
            // if()
            if (emp === 0 && time === 0) {
                self.getWorkdLogsAllList();
            } else if (emp === 0 && time === 1) {
                self.lookLateTime()
            } else if (emp === 0 && time === 2) {
                self.lookOverTime()
            } else if (emp != 0 && time === 1) {
                self.lookLateTimeAndEmp(emp)
            } else if (emp != 0 && time === 2) {
                self.lookOverTimeAndEmp(emp)
            }
        },
        // 지각 + 직원
        lookLateTimeAndEmp(emp) {
            const self = this;
            self.$axios.get(`http://localhost:8085/worklogs/latetime/${emp}`)
                .then(function (res) {
                    console.log(res.data)
                    if (res.status == 200 && res.data.flag == true) {
                        self.list = self.chageTime(res.data.list);
                    }
                })
        },
        // 초과 + 직원
        lookOverTimeAndEmp(emp) {
            const self = this;
            self.$axios.get(`http://localhost:8085/worklogs/overtime/${emp}`)
                .then(function (res) {
                    console.log(res.data)
                    if (res.status == 200 && res.data.flag == true) {
                        self.list = self.chageTime(res.data.list);
                    }
                })
        },
        // 초과
        lookLateTime() {
            const self = this;
            self.$axios.get(`http://localhost:8085/worklogs/latetime/storeid/${self.id}`)
                .then(function (res) {
                    console.log(res.data)
                    if (res.status == 200 && res.data.flag == true) {
                        self.list = self.chageTime(res.data.list);
                    }
                })
        },
        lookOverTime() {
            const self = this;
            self.$axios.get(`http://localhost:8085/worklogs/overtime/storeid/${self.id}`)
                .then(function (res) {
                    console.log(res.data)
                    if (res.status == 200 && res.data.flag == true) {
                        self.list = self.chageTime(res.data.list);
                    }
                })
        },
    }
}
</script>

<style scoped>
@import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);

.notosanskr * {
    font-family: 'Noto Sans KR', sans-serif;
}

body {
    font-family: 'Noto Sans KR';
}

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
    background-color: #FF6347;
    border-radius: 20px;
    padding: 1px 3px;
    color: white;
}

.exceed {
    background-color: #1E90FF;
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

.selectbox {
    width: 210px;
    /* margin: 0 auto;  */
}

#sb {
    justify-content: center;
    display: flex;
    margin-top: 15px;
    margin-bottom: 40px;
}

#fullCalendar {
    margin-bottom: 50px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
}

.pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: #bee96d;
    color: #fefefe;
    border: none;
    border-radius: 5px;
    font-weight: 550;
}

.pagination button.active {
    background-color: #9ec457;
}
</style>