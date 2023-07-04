<template>
  <div id="title"> 매출 조회 </div>
  <div id="dailySales" style="width:700px; height:500px"></div>
  <div>일간 지점 매출 TOP3</div><div id="rankingchart" style="width: 600px; height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Calendar } from '@fullcalendar/core';



export default {
  name: 'CalendarTest',
  components: {
  },
  data() {
    return {
      list: [],
      list2: [],
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth'
      }
    }

  },
  mounted() {
    this.addDailySales();
    this.getDailyRank3();
  },
  methods: {

    addDailySales() {
      const self = this;

      self.$axios
      .get('http://localhost:8085/selling/dailysales')
      .then(response => {
        self.list = response.data;

        console.log(self.list);

        if(self.list && self.list.length > 0) {
          const events = self.list.map(item => ({
            title: item. TOTALPRICE.toLocaleString(),
            start: item.SELLINGDATE
          }));

          const calendarE1 = document.getElementById('dailySales');
          const calendar = new Calendar(calendarE1, {
            plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, bootstrap5Plugin],
            themeSystem: 'bootstrap5',
            headerToolbar: {
              left: 'title',
              right: 'today prev,next',
            },
            navLinks: true,
            events: events,
          });
          calendar.render();
        }
      })
      .catch(error => {
        console.error(error);
      });
    },

    getDailyRank3() {
      const day = new Date(); // 페이지 로딩 시 어제 날짜 추출
      day.setDate(day.getDate() - 1);
      day.setHours(0, 0, 0, 0);
      const self = this;

      self.$axios
        .get(`http://localhost:8085/selling/dailyrank3`)
        .then(response => {
          self.list2 = response.data.list;

          for (let i = 0; i < 3; i++) {   // 차트에 참조값으로 띄울 TOP3 지점 매출 초기화
            self['rank' + (i + 1) + 'StoreSales'] = 0;
          }

          if (self.list2 && self.list2.length > 0) {  //  데이터가 있을 경우만 진행
            for (let i = 0; i < 3; i++) {
              const rank = i + 1;
              const item = self.list2.find(obj => {   // DB 날짜와 페이지에서 추출한 날짜, 랭킹 서로 비교하여 일치하는 것 추출
                const itemDate = new Date(obj.SELLINGDATE).toString();
                const dayDate = day.toString();
                return itemDate === dayDate && obj.RANK === rank;
              });

              if (item) {
                const rank = item.RANK;
                const rankStore = item.STORENAME;
                self['rank' + rank + 'Store'] = rankStore;
                const rankSales = item.TOTALPRICE;
                self['rank' + rank + 'Sales'] = rankSales;

                console.log(self['rank' + rank + 'Store'], self['rank' + rank + 'Sales']);

                echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);
                const myChart = echarts.init(document.getElementById('rankingchart'));

                const option = {
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'shadow'
                    }
                  },
                  grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                  },
                  xAxis: [
                    {
                      type: 'category',
                      data: [self['rank1Store'], self['rank2Store'], self['rank3Store']],
                      axisTick: {
                        alignWithLabel: true
                      }
                    }
                  ],
                  yAxis: [
                    {
                      type: 'value'
                    }
                  ],
                  series: [
                    {
                      name: 'Direct',
                      type: 'bar',
                      barWidth: '30%',
                      data: [self['rank1Sales'], self['rank2Sales'], self['rank3Sales']]
                    }
                  ]
                };

                option && myChart.setOption(option);
              } else {
                self['rankStore' + rank] = 0;
              }
            }
          }
        })
        .catch(error => {
                    console.error(error);
                });
          }
        }
}
</script>

