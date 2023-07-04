<template>
  <div id="sdBody">

    <!-- Button trigger modal -->
    <button type="button" class="btn custom-btn" data-bs-toggle="modal" data-bs-target="#addSchedule" @click="add">
      스케줄 등록(안씀 곧 지울예정)
    </button>

    <ScheduleModal />
    <ScheduleAddModal />
   

    <!-- 등록 Modal -->
    <div class="modal fade" id="addSchedule" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">스케줄 등록</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div>
              안녕?
              <select v-model="selectedEmp" @change="empChange()">
                <option :key=0 :value="none" disabled>
                  --직원 선택--
                </option>
                <option v-for="(item, index) in empList" :key="index" :value="item.empnum">
                  {{ item.empname }}
                </option>
              </select>
            </div>

            <!-- <div> 
              <input v-for="(item, index) in empSelectedList" :key="index" :value="item.bsnum" >
              {{ item.bsnum }}
            </div> -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button type="button" class="btn custom-btn" data-bs-dismiss="modal">등록</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 캘린더 -->
    <div id="fullCalendar">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>


  <!-- Modal -->
  <div class="modal fade" id="scModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">{{empname}}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>{{sdate}}</div>
          <div>{{ starttime }} - {{ endtime }} </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btncolor" data-bs-dismiss="modal">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
//   , { Draggable }
import timeGridPlugin from '@fullcalendar/timegrid';

import ScheduleModal from '@/components/schedule/ScheduleModal.vue'
import ScheduleAddModal from '@/components/schedule/ScheduleAddModal.vue'

import {Modal} from 'bootstrap';

export default {
  name: 'ScheDule',
  data() {
    return {
      storeid: sessionStorage.getItem("loginId"),
      list: [],
      empList: [],
      empSelectedList: [],     // 스케줄 등록에서 선택한 직원의 기본 스케줄
      storename: '',
      selectedEmp: '',
      //scheduleModal:false,
      //test: false,
      // 일정 클릭했을 때의 정보
      snum : 0,
      empname : '',
      sdate : '',
      starttime : '',
      endtime : '', 
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        initialView: 'timeGridWeek',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        },
        droppable: true,
        editable: true,                 // 편집 가능하게 
        events: [],
        eventClick: this.workDayClick,  // 클릭시
        eventDrop: this.workDayEdit,    // 움직일시(?)
        eventResize: this.workDayResize,
        timeZone: 'Asia/Seoul',
        height: 700,
        views: {
          timeGridWeek: {
            scrollTime: '08:00:00',
            allDaySlot: false
          },
        },
        selectable: true,               // 달력 일자 드래그 설정가능
      },
    };
  },
  components: {
    FullCalendar,
    ScheduleModal,
    ScheduleAddModal
  },
  created: function () {
    this.storeid = sessionStorage.getItem('loginId');
    const self = this;

    self.$axios.get('http://localhost:8085/schedule/storeid/' + self.storeid)
      .then(function (res) {
        if (res.status == 200 && res.data.flag == true) {
          //console.log(res.data.list);
          self.list = res.data.list;
          console.log("길이 문제 : " + self.list.length)
          //console.log(self.list[0].emp.empname);
          self.list.forEach(item => {
            //console.log(item.starttime);
            const event = {
              id: item.snum,
              //groupId: item.emp.empnum,
              title: item.emp.empname,
              start: item.starttime,
              end: item.endtime,
              backgroundColor: item.emp.color,
              borderColor: item.emp.color
            };
            // console.log("event");
            // console.log(event);
            self.calendarOptions.events.push(event);

          });
        }
        // console.log(self.calendarOptions.events);
      });
    console.log(self.calendarOptions.events);

  },
  methods: {
    add() {
      console.log('스케줄 추가');
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
      self.selectedEmp = 'none';
    },
    workDayClick(info) {
      const self = this;
      console.log("클릭 정보")
      console.log(info.event)
      const modal = document.getElementById('scModal');
      console.log(modal)
      //modal.setAttribute("aria-hidden", "false");
     
      console.log(info.event._def.defId)
      console.log(info.event._def.title)
      console.log(info.event._instance.range.start)
      console.log(info.event._instance.range.end)
      
      let day = info.event._instance.range.start
      
      let startTime = JSON.stringify(info.event._instance.range.start).slice(12, 17)
      startTime = startTime.replace('^0','').replace(':g','시 ').replace('$','분');
      
     
      //startTime[startTime.length] = '분';
      
      let endTime = JSON.stringify(info.event._instance.range.end).slice(12, 17)
      endTime = endTime.replace(':','시 ');
      endTime += '분'
      //endTime[startTime.length] = '분';
      console.log(typeof(startTime))



      const date = new Date(day);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      self.sdate = `${date.toLocaleDateString('ko-KR', options)}`;
      self.starttime = startTime
      self.endtime = endTime

      self.snum = info.event._def.defId
      self.empname = info.event._def.title
      //self.sdate = info.event._instance.range.start
     // self.starttime = info.event._instance.range.start
     // self.endtime = info.event._instance.range.end

      let myModal = new Modal(modal)
      myModal.show();

  
    },
    workDayEdit(info) {
      console.log("num :" + info.event._def.publicId);

      this.formatDate(info.event._instance.range.start, info.event._instance.range.end, info.event._def.publicId)



    },
    workDayResize(info) {
      console.log(info.event);
      this.formatDate(info.event._instance.range.start, info.event._instance.range.end, info.event._def.publicId)
    },
    // 시간 계산 함수 
    formatDate(start, end, num) {
      let startDateObj = new Date(start)
      startDateObj.setHours(startDateObj.getHours() - 9);
      let year = startDateObj.getFullYear();
      let month = String(startDateObj.getMonth() + 1).padStart(2, "0");
      let day = String(startDateObj.getDate()).padStart(2, "0");
      let editDate = `${year}-${month}-${day}`;
      let time = String(startDateObj.getHours()).padStart(2, "0") + ":" + String(startDateObj.getMinutes()).padStart(2, "0")
      let startTime = `${year}-${month}-${day}T${time}:00`;

      let endDateObj = new Date(end)
      endDateObj.setHours(endDateObj.getHours() - 9);
      let etime = String(endDateObj.getHours()).padStart(2, "0") + ":" + String(endDateObj.getMinutes()).padStart(2, "0")
      let endTime = `${year}-${month}-${day}T${etime}:00`;
      console.log(endTime)

      console.log("formatDate : " + editDate + " / " + startTime + " / " + endTime + " / " + num)
      this.editSchedule(editDate, startTime, endTime, num);

    },
    // 수정 하기 
    editSchedule(editDate, startTime, endTime, num) {
      console.log(editDate)
      console.log(startTime)
      console.log(endTime)
      console.log(num)

      let formData = new FormData();
      formData.append("snum", num);
      formData.append("sdate", editDate);
      formData.append("starttime", startTime);
      formData.append("endtime", endTime);


      const self = this;
      self.$axios.put('http://localhost:8085/schedule', formData)
        .then(function (res) {
          console.log(res.status)
          console.log(res.data.dto)
        })

    },
    // 등록하기 전 직원 선택...............
    empChange() {
      const self = this;

      let empnum = self.selectedEmp;
      console.log(empnum)
      self.$axios.get(`http://localhost:8085/basicschedule/emp/${empnum}`)
        .then(function (res) {
          console.log(res.status)
          console.log(res.data)
          if (res.status == 200 && res.data.flag == true) {
            console.log("성공")
            console.log(res.data)
            self.empSelectedList = res.data.list;
          } else {
            console.log("에러 empChange() : " + res.status)
          }
        })

    },
    // testadd() {
    //   this.test = true;
    //   console.log(this.test)
    // }
  }
};
</script>
  
<style scoped>
#sdBody {
  padding-top: 30px;
  padding-bottom: 30px;
  width: 60%;
  margin: 0 auto;
}

#fullCalendar {
  margin-top: 50px;
}

#scheduleAdd {
  float: right;
}

#sdBody a {
  text-decoration: none;
  color: black;
}

.a {
  text-decoration: none;
}

.custom-btn {
  background-color: #B3C755;
}

.custom-btn:hover {
  background-color: #99ab49;
}

.btncolor:hover{
  background-color: #FFC67B;
  color:#595959
}
.btncolor{
    color:#595959;
    background-color: #bee96d;
    font-weight: bolder ;
}
</style>
  

<style>
/* full calendar css */

.fc-day a {
  color: black;
}

.fc-day-sun a {
  color: lightcoral;
}

.fc-day-sat a {
  /* //color: lightblue; */
  color: lightskyblue;
}

.fc a {
  text-decoration: none;
}

/* < > today 버튼 색 */
.fc-toolbar .fc-prev-button,
.fc-toolbar .fc-next-button,
.fc-toolbar .fc-today-button {
  background-color: #B3C755;
  border-color: #9caf4a;
  color: white;
}

/* < > today 버튼 색  : hover */
.fc-toolbar .fc-prev-button:hover,
.fc-toolbar .fc-next-button:hover,
.fc-toolbar .fc-today-button:hover {
  background-color: #9caf4a;
  border-color: #B3C755;
}

/* month 버튼 */
.fc-toolbar .fc-dayGridMonth-button,
.fc-toolbar .fc-timeGridWeek-button {
  background-color: #84943f;
  border-color: #B3C755;
}

.fc-toolbar .fc-dayGridMonth-button:hover,
.fc-toolbar .fc-timeGridWeek-button:hover {
  background-color: #B3C755;
  border-color: #9caf4a;
}

.fc-toolbar .fc-today-button:disabled {
  /* today 버튼 */
  background-color: #2c3e50;
}

/* 이거 왜 적용 안될까..흑 */
/* .fc-toolbar .fc-timeGridWeek-button {
  background-color: #B3C755;
  border-color: #9caf4a;
  color: white;
} */

.fc .fc-button-primary:not(:disabled).fc-button-active {
  /* 내가 누른 부분의 색깔 */
  background-color: #B3C755;
  border-color: #9caf4a;
}

.fc .fc-button-primary:not(:disabled):active {
  /* 딱 클릭했을 때 색 */
  background-color: #84943f;
}
</style>
