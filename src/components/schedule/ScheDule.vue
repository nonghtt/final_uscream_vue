<template>
    <div id="sdBody">
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
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          droppable: true,
          events: []
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
                id : item.emp.empnum,
                groupid : item.snum, 
                title: item.emp.empname,
                start : item.starttime,
                end : item.endtime,
                backgroundColor : item.emp.color,
                borderColor : item.emp.color
              };
              console.log("event");
              console.log(event);
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
      }
    }
  };
  </script>
  
  <style scoped>
  #sdBody {
    padding-top: 30px;
    padding-bottom : 30px;
    max-width: 80%;
    margin: 0 auto;
  }
  
  #fullCalendar {
    margin-top: 50px;
  }
  
  #scheduleAdd {
    float: right;
  }

  #sdBody a{
    text-decoration: none;
    color : black;
  }
  </style>
  