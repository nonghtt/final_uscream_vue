<!-- <template>
  <div id="title">매출 조회</div>
  <div>
    <div>
      월별 전체 매출
      <select v-model="selectYear">
        <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
      </select>
      <button @click="getMonthlySales">조회</button>
    </div>
    <div id="monthlychart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

export default {
  name: 'HeadSales',
  components: {},
  data() {
    return {
      years: [2020, 2021, 2022, 2023],
      selectYear: null,
      list3: [],
      myChart: null
    };
  },
  created() {
    echarts.use([
      TitleComponent,
      TooltipComponent,
      GridComponent,
      LegendComponent,
      LineChart,
      CanvasRenderer,
      UniversalTransition
    ]);
  },
  mounted() {
    const currentDate = new Date();
    this.selectYear = currentDate.getFullYear();
  },
  methods: {
    getMonthlySales() {
      const year = this.selectYear;
      console.log(year);

      if (year) {
        this.$axios
          .get(`http://localhost:8085/selling/monthlysales2/${year}`)
          .then(response => {
            this.list3 = response.data.list;
            console.log(this.list3);

            const monthlyTotalSales = Array(12).fill(0);

            if (this.list3 && this.list3.length > 0) {
              this.list3.forEach(item => {
                const month = item.MONTH;
                const monthlySales = item.TOTALPRICE;
                monthlyTotalSales[month - 1] = monthlySales;
              });

              const myChart = echarts.init(document.getElementById('monthlychart'));

              const option = {
                title: {
                  text: '월별 매출'
                },
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: ['월별 매출']
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: [
                    '1월','2월','3월','4월','5월','6월','7월','8월','9월','10월',
                    '11월', '12월']
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name: '월별 매출',
                    type: 'line',
                    data: [
                      parseInt(self['monthlyTotalSales1']),
                      parseInt(self['monthlyTotalSales2']),
                      parseInt(self['monthlyTotalSales3']),
                      parseInt(self['monthlyTotalSales4']),
                      parseInt(self['monthlyTotalSales5']),
                      parseInt(self['monthlyTotalSales6']),
                      parseInt(self['monthlyTotalSales7']),
                      parseInt(self['monthlyTotalSales8']),
                      parseInt(self['monthlyTotalSales9']),
                      parseInt(self['monthlyTotalSales10']),
                      parseInt(self['monthlyTotalSales11']),
                      parseInt(self['monthlyTotalSales12'])
                    ]
                  }
                ]
              };
              
              myChart.setOption(option);
             }
           })
           .catch(error => {
             console.error(error);
           });
        }
      }
    }
  };
</script> -->

<template>
  <div id="branchSalesTitle"> 
    <br/>
    <h3>매출 조회</h3><span>  <router-link to="/headsalesDetail">상세 검색</router-link></span>
  </div>

  <div id="dailySales" style="width:700px; height:500px"></div>
  <div>
    <div>일간 지점 매출 TOP3</div>
    <div id="rankingchart" style="width: 600px; height: 400px"></div>
    <div>월별 전체 매출<select v-model="selectYear">
        <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
      </select>
      <button @click="getMonthlySales">조회</button>
    </div>
    <div id="monthlychart"></div>
  </div>
</template>
  
<script>
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent, TitleComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Calendar } from '@fullcalendar/core';


export default {
  name: 'HeadSales',
  components: {
  },
  data() {
    return {
      years: [2020, 2021, 2022, 2023],
      selectYear: null,
      list: [],
      list2: [],
      list3: [],
      myChart: null,
      myChart2: null,
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        dayGridMonth: {
            titleFormat: 'YYYY[년] M[월]'
        },
      }
    }
  },
  created() {
    echarts.use([
      TooltipComponent,
      GridComponent,
      BarChart,
      LineChart,
      CanvasRenderer,
      UniversalTransition,
      TitleComponent
    ]);
  },
  mounted() {
  const currentDate = new Date();
  this.selectYear = currentDate.getFullYear();

  this.addDailySales();

  this.myChart = echarts.init(document.getElementById('rankingchart'));
  this.myChart2 = echarts.init(document.getElementById('monthlychart'));

  this.getDailyRank3();
  this.getMonthlySales();
  },
  methods: {
    addDailySales() {
      const self = this;

      self.$axios
        .get('http://localhost:8085/selling/dailysales')
        .then(response => {
          self.list = response.data;

          console.log(self.list);

          if (self.list && self.list.length > 0) {
            const events = self.list.map(item => ({
              title: item.TOTALPRICE.toLocaleString(),
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
                      name: '총 매출',
                      type: 'bar',
                      barWidth: '30%',
                      data: [self['rank1Sales'], self['rank2Sales'], self['rank3Sales']]
                    }
                  ]
                };
                self.myChart.setOption(option);

              }
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

    getMonthlySales() {
      const year = this.selectYear;
      console.log(year);

      if (year) {
        const self = this;

        self.$axios
          .get(`http://localhost:8085/selling/monthlysales2/${year}`)
          .then(response => {
            self.list3 = response.data.list;

            console.log(self.list3);

            for (let i = 0; i < 12; i++) {
              self['monthlyTotalSales' + (i + 1)] = 0;

              console.log(self['monthlyTotalSales' + (i + 1)]);

            }

            if (self.list3 && self.list3.length > 0) {
              for (let i = 0; i < 12; i++) {
                const month = i + 1;
                const item = self.list3.find(obj => obj.MONTH === month);
                if (item) {
                  const monthlySales = item.TOTALPRICE;
                  self['monthlyTotalSales' + month] = monthlySales;

                  console.log(self['monthlyTotalSales' + month]);
                }
              }

              const option = {
                title: {
                  text: '월별 전체 매출'
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    crossStyle: {
                      color: '#999'
                    }
                  }
                },

                xAxis: [
                  {
                    type: 'category',
                    data: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    axisPointer: {
                      type: 'shadow'
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value',
                    name: '',
                    min: 0,
                    max: 50000,
                    interval: 10000,
                    axisLabel: {
                      formatter: '{value} 원'
                    }
                  }
                ],
                series: [
                  {
                    name: '',
                    type: 'line',
                    tooltip: {
                      valueFormatter: function (value) {
                        return value + ' 원';
                      }
                    },
                    data: [
                      parseInt(self['monthlyTotalSales1']),
                      parseInt(self['monthlyTotalSales2']),
                      parseInt(self['monthlyTotalSales3']),
                      parseInt(self['monthlyTotalSales4']),
                      parseInt(self['monthlyTotalSales5']),
                      parseInt(self['monthlyTotalSales6']),
                      parseInt(self['monthlyTotalSales7']),
                      parseInt(self['monthlyTotalSales8']),
                      parseInt(self['monthlyTotalSales9']),
                      parseInt(self['monthlyTotalSales10']),
                      parseInt(self['monthlyTotalSales11']),
                      parseInt(self['monthlyTotalSales12']),
                    ]
                  }
                ]
              }
              self.myChart2.setOption(option);
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }
}
</script>  