<template>
  <H3 id="branchSalesTitle">매출 조회</H3>

  <div id="branchSalesContent">

    <!-- 일별 매출 표시 캘린더 -->
    <div id="dailySales" style="width:700px;"></div>

    <div style="display:flex; flex-direction:column; justify-content:space-between; padding-left:20px">
      <!-- 순매출 분석 차트 -->
      <div id="netsalesChart"
        style="border: 1px solid lightgray; width:500px; height:320px; padding:1%; position: relative">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px">
          <div style="font-size:16px; font-weight:bold">순매출 조회</div>
          <div style="display:flex">
            <select v-model="selectYear" class="form-select" style="width:auto">
              <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
            </select>
            <select v-model="selectMonth" class="form-select">
              <option v-for="month in months" :key="month" :value="month">{{ month }}월</option>
            </select>
            <button @click="getNetsalesAnalysis" class="btn btncolor" style="white-space: nowrap">조회</button>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding:10px">
          <h6 style="font-weight:bold; margin-top:10px">총매출 : {{ monthSales }} 원</h6>
          <div id="donutChart" v-show="showDonutChart == true"></div>
          <div v-show="showDonutChart == false"><img src="/nodata.PNG"></div>
        </div>
      </div>

      <!-- 월별 순매출 차트 -->
      <div id="yearlyChart"
        style="border: 1px solid lightgray; width:500px; height:340px; padding:1%; position:relative; z-index:2; margin-top:20px">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px">
          <div style="font-size:16px; font-weight:bold">월별 순매출</div>
          <div style="display:flex; z-index:3">
            <select v-model="selectYear2" class="form-select" style="width:auto">
              <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
            </select>
            <select v-model="selectHalf" class="form-select">
              <option v-for="half in halves" :key="half" :value="half">{{ half }}</option>
            </select>
            <button @click="getYearlyNetsales" class="btn btncolor" style="white-space: nowrap">조회</button>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding:10px">
         <div id="barChart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { ToolboxComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { UniversalTransition } from 'echarts/features';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  name: 'BranchSales',
  component: {},
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
      halves: ['상반기', '하반기'],
      selectYear: null,
      selectMonth: null,
      selectYear2: null,
      selectHalf: '상반기',
      myChart: null,
      myChart2: null,
      showDonutChart: true,
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        views: {
          dayGridMonth: {
          titleFormat: 'YYYY[년] M[월]'
          },
        },
      }
    };
  },
  created() {
    this.storeId = sessionStorage.getItem('loginId');
    this.getSearchCriteria();
    this.monthlyNetsales = Array(12).fill(0);
    echarts.use ([ 
      TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout,
      ToolboxComponent, GridComponent, BarChart, UniversalTransition 
    ]);
  },
  mounted() {
    const currentDate = new Date();
    this.selectYear = currentDate.getFullYear();
    this.selectMonth = currentDate.getMonth();
    this.selectYear2 = currentDate.getFullYear();
    this.addDailySales();
    this.myChart = echarts.init(document.getElementById('donutChart'));
    this.getNetsalesAnalysis();
    this.getYearlyNetsales();
  },
  methods: {
    getSearchCriteria() {
      this.storeId = sessionStorage.getItem('loginId');
      const currentDate = new Date();
      this.year = currentDate.getFullYear();
      this.month = currentDate.getMonth() + 1;
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
              events: events
            });
            calendar.render();
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    getNetsalesAnalysis() {
      this.showDonutChart = true;
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

            self.showDonutChart = false;

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
                  top: '15%',
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
                    tooltip: {
                          valueFormatter: function (value) {
                            return value.toLocaleString() + ' 원';
                          }
                        },
                    data: [
                      {},
                      { value: totalPayroll, name: '인건비', itemStyle: { color: '#ADD8E6' } },
                      { value: totalOrder, name: '발주금액', itemStyle: { color: '#ffda8e' } },
                      { value: totalNetsales, name: '순매출', itemStyle: { color: '#f1bbba' } },

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
              self.showDonutChart = true;
            } else {
              self.monthSales = 0;
              self.monthPayroll = 0;
              self.monthOrder = 0;
              self.monthNetsales = 0;
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    
    getYearlyNetsales() {
      if (this.selectHalf === '상반기') {
        this.firstHalf();
      } else if (this.selectHalf === '하반기') {
        this.secondHalf();
      }
    },
    firstHalf() {
      const storeId = this.storeId;
      const year = this.selectYear2

      console.log(storeId + year);

      if (year) {
        const self = this;

        self.$axios
          .get(`http://localhost:8085/netsales/${storeId}/${year}`)
          .then(response => {
            self.list = response.data.list;
            console.log(self.list);

            if (self.list && self.list.length > 0) {
              for (let i = 0; i < 6; i++) {
                const month = i + 1;
                const item = self.list.find(obj => obj.MONTH === month);

                if (item) {
                  const monthNetsales = item.MNETSALES;
                  self['monthNetsales' + month] = monthNetsales;
                } else {
                  self['monthNetsales' + month] = 0;
                }
              }

              const myChart2 = echarts.init(document.getElementById('barChart'));

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
                    data: ['1월', '2월', '3월', '4월', '5월', '6월'],
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value',
                    name: '', 
                    axisLabel: {
                      formatter: '{value} 원'
                    },
                    interval: 2000000
                  }
                ],
                series: [
                  {
                    name: '순매출',
                    type: 'bar',
                    tooltip: {
                          valueFormatter: function (value) {
                            return value.toLocaleString() + ' 원';
                          }
                        },
                    barWidth: '60%',
                    data: [
                      { value: parseInt(self['monthNetsales1']), itemStyle: { color: '#87CEFA' } },
                      { value: parseInt(self['monthNetsales2']), itemStyle: { color: '#B0C4DE' } },
                      { value: parseInt(self['monthNetsales3']), itemStyle: { color: '#D9D4CF' } },
                      { value: parseInt(self['monthNetsales4']), itemStyle: { color: '#ADD8E6' } },
                      { value: parseInt(self['monthNetsales5']), itemStyle: { color: '#AFEEEE' } },
                      { value: parseInt(self['monthNetsales6']), itemStyle: { color: '#dae9f4' } }

                    ]
                  }
                ]
              };
              myChart2.setOption(option);
            } else {
              // alert("선택하신 연도의 데이터가 없습니다.");
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    secondHalf() {
      const storeId = this.storeId;
      const year = this.selectYear2;

      console.log(storeId + year);

      if (year) {
        const self = this;

        self.$axios
          .get(`http://localhost:8085/netsales/${storeId}/${year}`)
          .then(response => {
            self.list = response.data.list;
            console.log(self.list);

            if (self.list && self.list.length > 0) {
              for (let i = 6; i < 12; i++) {
                const month = i + 1;
                const item = self.list.find(obj => obj.MONTH === month);

                if (item) {
                  const monthNetsales = item.MNETSALES;
                  self['monthNetsales' + month] = monthNetsales;
                } else {
                  self['monthNetsales' + month] = 0;
                }
              }

              const myChart2 = echarts.init(document.getElementById('barChart'));

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
                    data: ['7월', '8월', '9월', '10월', '11월', '12월'],
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value',
                    name: '', 
                    axisLabel: {
                      formatter: '{value} 원'
                    },
                    interval: 2000000
                  }
                ],
                series: [
                  {
                    name: '순매출',
                    type: 'bar',
                    tooltip: {
                          valueFormatter: function (value) {
                            return value.toLocaleString() + ' 원';
                          }
                        },
                    barWidth: '60%',
                    data: [
                    { value: parseInt(self['monthNetsales7']), itemStyle: { color: '#87CEFA' } },
                    { value: parseInt(self['monthNetsales8']), itemStyle: { color: '#B0C4DE' } },
                    { value: parseInt(self['monthNetsales9']), itemStyle: { color: '#D9D4CF' } },
                    { value: parseInt(self['monthNetsales10']), itemStyle: { color: '#ADD8E6' } },
                    { value: parseInt(self['monthNetsales11']), itemStyle: { color: '#AFEEEE' } },
                    { value: parseInt(self['monthNetsales12']), itemStyle: { color: '#dae9f4' } }
                    ]
                  }
                ]
              };
              myChart2.setOption(option);
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    },

  }
};
</script>

<style scoped>
#branchSalesTitle {
  padding-left: 3%;
  padding-top: 1%;
  text-align:left;
}

#branchSalesContent {
  padding-left: 3%;
  padding-top: 1%;
  display: flex;
  overflow: auto;
}

#donutChart {
  width: 500px;
  height: 300px; 
  margin-top: -40px; 
  align-items: center; 
  position: relative; 
  z-index:1;
}

#barChart {
  width: 450px;
  height: 300px;
  margin-top: -40px; 
  align-items: center; 
  position: relative; 
  z-index:2;
}
.BranchSalesContent{
  margin-left: 50px;
  margin-bottom: 50px;
  overflow: auto;
}
#netsalesAnalysis {
  margin-left: 30px;
}

#yearlyNetsales {
  margin-left: 30px;
  margin-top: auto;
}

.btncolor:hover{
  background-color: #FFC67B;
  color:#303030;
}
.btncolor{
    height: 38px;
    color:#303030;
    background-color: #bee96d;
    font-weight: bolder ;
}



</style>

<style>
.fc-daygrid-event-dot {
  display: none;
}
.fc-event-time {
  display: none;
}
.fc-event-title {
  color:rgb(174, 174, 174);
  text-align: center;
  font-weight:normal;
}

.fc-daygrids-day-event {
  color: grey;
  text-align: center;
  font-weight:normal;
}

.fc-prev-button, .fc-next-button, .fc-today-button{
  border : 1px solid white !important;
}

.form-select {
  height: fit-content;
}

</style>

