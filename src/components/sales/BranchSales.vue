<template>
  <class id="salespage">

    <div id="netsalesTitle">
      <br />
      <h3>매출 조회</h3>
      <br />
    </div>

    <!-- 매출 간단 요약 -->
    <div id="salesSummary">
      <table>
        <tr>
          <td>{{ yesterdaySales }}</td>
          <td>ㅤㅤ</td>
          <td>{{ monthTotalSales }}</td>
        </tr>
        <tr :style="{ 'font-size': '10px', 'color': 'lightgray' }">
          <td>전일 총 매출</td>
          <td>ㅤㅤ</td>
          <td>조회월 기준 누적 총 매출</td>
        </tr>
      </table>
    </div>

    <div style="display: flex">
      <!-- 일별 매출 표시 캘린더 -->
      <div id="dailySales" style="width:700px; height:500px">
      </div>

      <!-- 순매출 분석 차트 -->
      <div id="netsalesAnalysis" style="border: 1px solid lightgray; width:450px; height:325px; padding:1%">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-weight: bold"> 순매출 분석 </span>
          <div>
            <select v-model="selectYear">
              <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
            </select>
            <select v-model="selectMonth">
              <option v-for="month in months" :key="month" :value="month">{{ month }}월</option>
            </select>
            <button @click="renderChart">조회</button>
          </div>
        </div>
        <br />
        <h6 style="text-align: center; font-weight:bold">총매출: {{ monthSales }} 원</h6>
        <div id="donutchart" style="width: 450px; height: 300px"></div>
      </div>


      <!-- 월별 순매출 차트 -->
      <div id="yearlyNetsales">
        월별 순매출
        <select v-model="selectYear2">
          <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
        </select>
        <button @click="getYearlyNetsales">조회</button>
        <div id="linechart" style="height: 400px"></div>
      </div>
    </div>
  </class>
</template>

<script>
import * as echarts from 'echarts/core';
// import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


import {
  ToolboxComponent,
  GridComponent,
} from 'echarts/components';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { Calendar } from '@fullcalendar/core';

export default {
  name: 'BranchSales',
  components: {
  },
  data() {
    return {
      storeId: '',
      yesterdaySales: 0,
      monthTotalSales: 0,
      monthSales: 0,
      monthPayroll: 0,
      monthOrder: 0,
      monthNetsales: 0,
      monthlyNetsales: [],
      list: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      years: [2020, 2021, 2022, 2023],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      selectYear: null,
      selectMonth: null,
      selectYear2: null,
      myChart: null,
      myChart2: null,
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth'
      }

    };
  },
  created() {
    this.getSearchCriteria();
    this.monthlyNetsales = Array(12).fill(0);

    echarts.use([
      TooltipComponent,
      LegendComponent,
      PieChart,
      CanvasRenderer,
      LabelLayout,
      ToolboxComponent,
      GridComponent,
      BarChart,
      LineChart,
      UniversalTransition
    ]);
  },
  mounted() {
    const currentDate = new Date();
    this.selectYear = currentDate.getFullYear();
    this.selectMonth = currentDate.getMonth();
    this.selectYear2 = currentDate.getFullYear();

    this.addDailySales();

    this.myChart = echarts.init(document.getElementById('donutchart'));
    this.myChart2 = echarts.init(document.getElementById('linechart'));

    this.renderChart();
    this.getYearlyNetsales();


    // const calendarE1 = document.getElementById('dailySales');
    // const calendar = new Calendar(calendarE1, {
    //   plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, bootstrap5Plugin],
    //   themeSystem: 'bootstrap5',
    //   headerToolbar: {
    //     left: 'title',
    //     right: 'today prev,next',
    //   },
    //   navLinks: true,
    //   events: this.addDailySales(),
    // });

    // calendar.render();

  },
  methods: {
    getSearchCriteria() {
      this.storeId = sessionStorage.getItem('loginId');
      const currentDate = new Date();
      this.year = currentDate.getFullYear();
      this.month = currentDate.getMonth() + 1;
      this.getSearchData();
    },

    getSearchData() {
      const storeId = this.storeId;
      const year = this.year;
      const month = this.month;
      const self = this;

      self.$axios
        .get(`http://localhost:8085/selling/dailysales/${storeId}/${year}/${month}`)
        .then(response => {
          const data = response.data;
          self.list = response.data.list;

          console.log(data);
          console.log(self.list);

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);

          console.log(yesterday);

          const yesterdayValue = self.list.find(item => {
            const itemDate = new Date(item.SELLINGDATE);
            itemDate.setHours(0, 0, 0, 0);
            return itemDate.toDateString() === yesterday.toDateString();
          });

          if (yesterdayValue) {
            const yesterdayPrice = yesterdayValue.TOTALPRICE;
            const formattedYesterdayPrice = yesterdayPrice.toLocaleString();
            self.yesterdaySales = formattedYesterdayPrice;
          } else {
            self.yesterdaySales = 0;
          }

        })
        .catch(error => {
          console.error(error);
        });

      self.$axios
        .get(`http://localhost:8085/selling/monthlysales/${storeId}/${year}/${month}`)
        .then(response => {
          const data = response.data;
          self.list2 = response.data.list;

          console.log(data);
          console.log(self.list2);

          if (self.list2 && self.list2.length > 0) {
            const totalPrice = self.list2[0].TOTALPRICE;
            const formattedTotalPrice = totalPrice.toLocaleString();
            self.monthTotalSales = formattedTotalPrice;
          } else {
            self.monthTotalSales = 0;
          }

        })
        .catch(error => {
          console.error(error);
        });
    },

    addDailySales() {
      const storeId = this.storeId;
      const self = this;

      self.$axios
        .get(`http://localhost:8085/selling/dailysales/${storeId}`)
        .then(response => {
          const data = response.data;
          self.list3 = response.data.list;

          console.log(data);
          console.log(self.list3);

          if (self.list3 && self.list3.length > 0) {
            const events = self.list3.map(item => ({
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
              events: events, // events 배열을 전달합니다.
            });

            calendar.render();
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

    renderChart() {
      const storeId = this.storeId;
      const year = this.selectYear;
      const month = this.selectMonth;

      console.log(year);
      console.log(month);

      if (year && month) {
        const self = this;

        self.$axios
          .get(`http://localhost:8085/netsales/${storeId}/${year}/${month}`)
          .then(response => {
            const data = response.data;
            self.list4 = response.data.list;

            console.log(data);
            console.log(self.list4);

            if (self.list4 && self.list4.length > 0) {
              const totalSales = self.list4[0].MSELLINGPRICE;
              const formattedTotalSales = totalSales.toLocaleString();
              self.monthSales = formattedTotalSales;

              const totalPayroll = self.list4[0].MPSALARY;
              const formattedTotalPayroll = totalPayroll.toLocaleString();
              self.monthPayroll = formattedTotalPayroll;

              const totalOrder = self.list4[0].MORDERCOST;
              const formattedTotalOrder = totalOrder.toLocaleString();
              self.monthOrder = formattedTotalOrder;

              const totalNetsales = self.list4[0].MNETSALES;
              const formattedTotalNetsales = totalNetsales.toLocaleString();
              self.monthNetsales = formattedTotalNetsales;

              const option = {
                tooltip: {
                  trigger: 'item',
                },
                legend: {
                  top: '2%',
                  left: 'center',

                  selectedMode: false
                },
                series: [
                  {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '70%'],

                    startAngle: 180,
                    label: {
                      show: true,
                      formatter(param) {
                        return param.name + ' (' + param.percent * 2 + '%)';
                      }
                    },

                    data: [
                      {},
                      { value: totalPayroll, name: '인건비' },
                      { value: totalOrder, name: '발주금액' },
                      { value: totalNetsales, name: '순매출' },
                      {

                        value: totalPayroll + totalOrder + totalNetsales,
                        itemStyle: {

                          color: 'none',
                          decal: {
                            symbol: 'none'
                          }
                        },
                        label: {
                          show: false
                        }
                      }
                    ]
                  }
                ]
              };
              self.myChart.setOption(option);
            } else {
              self.monthSales = 0;
              self.monthPayroll = 0;
              self.monthOrder = 0;
              self.monthNetsales = 0;
              alert("선택하신 연도와 월에 해당하는 데이터가 없습니다.");
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    getYearlyNetsales() {
      const self = this;
      const storeId = this.storeId;
      const year = this.selectYear2;

      if (year) {
        console.log(year);

        self.$axios
          .get(`http://localhost:8085/netsales/${storeId}/${year}`)
          .then(response => {
            const data = response.data;
            self.list5 = response.data.list;

            console.log(data);
            console.log(self.list4);

            for (let i = 0; i < 12; i++) {
              self['monthlyNetsales' + (i + 1)] = 0;
            }

            if (self.list5 && self.list5.length > 0) {
              for (let i = 0; i < 12; i++) {
                const month = i + 1;
                const item = self.list5.find(obj => obj.MONTH === month);
                if (item) {
                  const monthNetsales = item.MNETSALES;
                  self['monthlyNetsales' + month] = monthNetsales;

                  // 1월부터 12월까지의 순매출 출력 (현재 월까지만 가져옴)
                  // console.log(self['monthlyNetsales1']); 
                  // console.log(self['monthlyNetsales2']);
                  // console.log(self['monthlyNetsales3']);
                  // console.log(self['monthlyNetsales4']);
                  // console.log(self['monthlyNetsales5']);
                  // console.log(self['monthlyNetsales6']);
                  // console.log(self['monthlyNetsales7']);
                  // console.log(self['monthlyNetsales8']);
                  // console.log(self['monthlyNetsales9']);
                  // console.log(self['monthlyNetsales10']);
                  // console.log(self['monthlyNetsales11']);
                  // console.log(self['monthlyNetsales12']);

                  const option = {
                    tooltip: {
                      // trigger: 'axis',
                      axisPointer: {
                        type: '',
                        crossStyle: {
                          color: '#999'
                        }
                      }
                    },
                    toolbox: {
                      feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        // restore: { show: true },
                        saveAsImage: { show: true }
                      }
                    },
                    legend: {
                      data: ['월별 순매출']
                    },
                    xAxis: [
                      {
                        type: 'category',
                        data: [
                          '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'
                        ]
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
                        type: 'bar',
                        tooltip: {
                          valueFormatter: function (value) {
                            return value.toLocaleString() + ' 원';
                          }
                        },
                        data: [
                          parseInt(self['monthlyNetsales1']),
                          parseInt(self['monthlyNetsales2']),
                          parseInt(self['monthlyNetsales3']),
                          parseInt(self['monthlyNetsales4']),
                          parseInt(self['monthlyNetsales5']),
                          parseInt(self['monthlyNetsales6']),
                          parseInt(self['monthlyNetsales7']),
                          parseInt(self['monthlyNetsales8']),
                          parseInt(self['monthlyNetsales9']),
                          parseInt(self['monthlyNetsales10']),
                          parseInt(self['monthlyNetsales11']),
                          parseInt(self['monthlyNetsales12'])
                        ]
                      },
                    ]
                  };
                  self.myChart2.setOption(option);

                } else {
                  self['monthlyNetsales' + month] = 0;
                }
              }
            }
            else {
              alert("선택하신 연도의 데이터가 없습니다.");
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


<style>
.fc-daygrid-event-dot {
  display: none;
}

.fc-event-time {
  display: none;
}

.fc-event-title {
  color: red;
  text-align: center;
}

</style>

