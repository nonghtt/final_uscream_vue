<template>
  <div id="sdBody">

    <!-- Button trigger modal -->
    <button type="button" class="btn custom-btn" data-bs-toggle="modal" data-bs-target="#addSchedule" @click="add">
      스케줄 등록
    </button>

    <!-- 삭제 Modal -->
    <div class="modal fade" id="addSchedule" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">하하</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <span class="name">하하</span>님을 삭제하시겠습니까? <br />

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">등록</button>
            <button type="button" class="btn custom-btn" data-bs-dismiss="modal" >삭제</button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <button id="scheduleAdd" @click="add">스케줄 등록</button>
    </div>
    <div id="fullCalendar">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>
  
<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
//   , { Draggable }
import timeGridPlugin from '@fullcalendar/timegrid';

export default {
  name: 'ScheDule',
  data() {
    return {
      storeid: '',
      list: [],
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
        eventResize : this.workDayResize,
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
    FullCalendar
  },
  created: function () {
    this.storeid = sessionStorage.getItem('loginId');
    const self = this;

    self.$axios.get('http://localhost:8085/schedule/storeid/' + self.storeid)
      .then(function (res) {
        if (res.status == 200 && res.data.flag == true) {
          //console.log(res.data.list);
          self.list = res.data.list;
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
    },
    workDayClick(info) {
      console.log("클릭 정보")
      console.log(info.event)
    },
    workDayEdit(info) {
      console.log("num :" + info.event._def.publicId);

     this.formatDate(info.event._instance.range.start, info.event._instance.range.end, info.event._def.publicId)
     


    },
    workDayResize(info){
      console.log(info.event);
    },
    // 시간 계산 함수 
    formatDate(start, end, num){
      // var object = {
      //   startTime : '',
      //   endTime : '',
      //   date : '',
      // };

      let startDateObj = new Date(start)
      startDateObj.setHours(startDateObj.getHours()-9);
      let year = startDateObj.getFullYear();
      let month = String(startDateObj.getMonth() + 1).padStart(2, "0");
      let day = String(startDateObj.getDate()).padStart(2, "0");
      let editDate = `${year}-${month}-${day}`; 
      let time = String(startDateObj.getHours()).padStart(2,"0") +":"+ String(startDateObj.getMinutes()).padStart(2,"0")
      let startTime = `${year}-${month}-${day}T${time}:00`;

      let endDateObj = new Date(end)
      endDateObj.setHours(endDateObj.getHours()-9);
      let etime = String(endDateObj.getHours()).padStart(2,"0") +":"+ String(endDateObj.getMinutes()).padStart(2,"0")
      let endTime = `${year}-${month}-${day}T${etime}:00`;
      console.log(endTime)

      // object.date = editDate;
      // object.startTime = startTime;
      // object.endTime = endTime;

      // console.log(object.date)
      console.log("formatDate : "+editDate+" / " + startTime + " / "+endTime + " / "+num )
      this.editSchedule(editDate, startTime, endTime, num);
      // return object;
    },
    // 수정 하기 
    editSchedule(editDate, startTime, endTime, num){
      console.log(editDate)
      console.log(startTime)
      console.log(endTime)
      console.log(num)

      let formData = new FormData();
      formData.append("snum", num);
      formData.append("sdate", editDate);
      formData.append("starttime",startTime);
      formData.append("endtime",endTime);

      
      const self = this;
      self.$axios.put('http://localhost:8085/schedule', formData)
      .then(function(res){
        console.log(res.status)
        console.log(res.data.dto)
      })
      
    }
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
