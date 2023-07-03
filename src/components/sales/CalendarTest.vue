<!-- <script>
import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
// import { INITIAL_EVENTS, createEventId } from './event-utils'

export default defineComponent({
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        headerToolbar: {
          left: 'title', 
        //   center: 'title',
        //   right: 'dayGridMonth,timeGridWeek,timeGridDay'
          right: 'prev,next today'
        },
        initialView: 'dayGridMonth',
        // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      },
      currentEvents: [],
    }
  },
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },
    handleDateSelect(selectInfo) {
      let title = prompt('Please enter a new title for your event')
      let calendarApi = selectInfo.view.calendar

      calendarApi.unselect() // clear date selection

      if (title) {
        calendarApi.addEvent({
        //   id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
      }
    },
    handleEventClick(clickInfo) {
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
    },
    handleEvents(events) {
      this.currentEvents = events
    },
  }
})

</script>

<template>
  <div class='demo-app'>
    <div class='demo-app-sidebar'>
      <div class='demo-app-sidebar-section'>
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>
      <div class='demo-app-sidebar-section'>
        <label>
          <input
            type='checkbox'
            :checked='calendarOptions.weekends'
            @change='handleWeekendsToggle'
          />
          toggle weekends
        </label>
      </div>
      <div class='demo-app-sidebar-section'>
        <h2>All Events ({{ currentEvents.length }})</h2>
        <ul>
          <li v-for='event in currentEvents' :key='event.id'>
            <b>{{ event.startStr }}</b>
            <i>{{ event.title }}</i>
          </li>
        </ul>
      </div>
    </div>
    <div class='demo-app-main'>
      <FullCalendar
        class='demo-app-calendar'
        :options='calendarOptions'
      >
        <template v-slot:eventContent='arg'>
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<style lang='css'>

h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b { /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc { /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}

</style> -->




<!-- <template>
    <div>
      <div id="calendar" :style="{ width: '800px' }"></div>
    </div>
  </template>
  
  <script>
  import { Calendar } from '@fullcalendar/core';
  import interactionPlugin from '@fullcalendar/interaction';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import bootstrap5Plugin from '@fullcalendar/bootstrap5';
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap-icons/font/bootstrap-icons.css';

  
  export default {
    name: 'CalendarTest',
    mounted() {
      const calendarEl = document.getElementById('calendar');
      const calendar = new Calendar(calendarEl, {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, bootstrap5Plugin],
        themeSystem: 'bootstrap5',
        headerToolbar: {
          left: 'title',
          right: 'today prev,next',
        //   center: 'title',
        //   right: 'dayGridMonth',
        },
        // initialDate: '2018-01-12',
        navLinks: true,
        // editable: true,
        // dayMaxEvents: true,
        events: [
          {
            // title: 'All Day Event',
            // start: '2018-01-01',
          },
          // 다른 이벤트들...
        ],
      });
  
      calendar.render();
    },
  };
  </script>
  
  <style> -->
 

  <template>
    <div>
      <div id="calendar" :style="{ width: '800px' }"></div>
    </div>
  </template>
  
  <script>
  import { Calendar } from '@fullcalendar/core';
  import interactionPlugin from '@fullcalendar/interaction';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import bootstrap5Plugin from '@fullcalendar/bootstrap5';
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap-icons/font/bootstrap-icons.css';
  
  export default {
    name: 'CalendarTest',
    mounted() {
      const calendarEl = document.getElementById('calendar');
      const calendar = new Calendar(calendarEl, {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, bootstrap5Plugin],
        themeSystem: 'bootstrap5',
        headerToolbar: {
          left: 'title',
          right: 'today prev,next',
        },
        navLinks: true,
        events: this.generateEvents(),
      });
  
      calendar.render();
    },
    methods: {
      generateEvents() {
        // 배열 리스트 데이터 예시
        const list = [
          {
            "sellingnum": 1,
            "sellproductprice": 3000,
            "sellingdate": "2023-05-31T15:00:00.000+00:00"
          },
          {
            "sellingnum": 2,
            "sellproductprice": 3000,
            "sellingdate": "2023-05-31T15:00:00.000+00:00"
          },
          {
            "sellingnum": 3,
            "sellproductprice": 3000,
            "sellingdate": "2023-06-01T15:00:00.000+00:00"
          },
          // 추가 데이터...
        ];
  
        const events = [];
  
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
  
          events.push({
            title: `${item.sellproductprice}`,
            start: item.sellingdate,
          });
        }
  
        return events;
      },
    },
  };
  </script>
  
  <style>
  </style>

