<template>
  <H3 id="headSalesTitle" style="text-align:left">매출 조회</H3>

  <div id="headSalesContent">

    <div id="dailySales" style="width:700px; height:500px"></div>

    <div style="display:flex; flex-direction:column; padding-left:20px">
      <div style="margin-bottom: 4px; display:flex; justify-content:flex-end"><router-link to="/headsalesDetail"><button class="btn btncolor">연도별 매출 상세</button></router-link></div>

      <div id="rankChart"
        style="border: 1px solid lightgray; width:700px; height: 520px; padding:1%; position:relative; margin-top:9px">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px">
          <div style="font-size:16px; font-weight:bold">일간 지점 매출 TOP5</div>
          <div style="display:flex">
            <select v-model="selectYear" class="form-select" style="width:auto">
              <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
            </select>
            <select v-model="selectMonth" class="form-select">
              <option v-for="month in months" :key="month" :value="month">{{ month }}월</option>
            </select>
            <button @click="getDailyRank5" class="btn btncolor" style="white-space: nowrap">조회</button>
          </div>
        </div>
        <div style="display: flex; flex-direction:column; align-items:center; justify-content:center">
        <div id="ranking5Chart" v-show="showRankingChart == true"></div>
        <div v-show="showRankingChart == false"><img src="/nodata2.PNG"></div>
      </div>
    </div>
    </div>
  </div>
</template>


<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Calendar } from '@fullcalendar/core';

import * as echarts from 'echarts/core';
import { DatasetComponent, GridComponent, VisualMapComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default {
  name: 'HeadSales',
  components: {
  },
  data() {
    return {
      years: [2020, 2021, 2022, 2023],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      selectYear: null,
      selectMonth: null,
      list: [],
      list2: [],
      myChart: null,
      showRankingChart: true,
      monthlySalesData: [],
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
      DatasetComponent,
      GridComponent,
      VisualMapComponent,
      BarChart,
      CanvasRenderer,
      TooltipComponent,
      LegendComponent
    ]);
  },
  mounted() {
    this.addDailySales();
    const currentDate = new Date();
    this.selectYear = currentDate.getFullYear();
    this.selectMonth = currentDate.getMonth() + 1;
    this.getDailyRank5();
  },
  methods: {
    addDailySales() {
      const self = this;

      self.$axios
        .get('http://localhost:8085/selling/dailysales')
        .then(response => {
          self.list = response.data;

          // console.log(self.list);

          if (self.list) {
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
    getDailyRank5() {
      this.showRankingChart = true;
      const year = this.selectYear;
      const month = this.selectMonth;

      if (year && month) {
        const self = this;

        console.log("선택한 연도: " + year, "선택한 월: " + month);

        self.$axios
          .get(`http://localhost:8085/selling/monthlyrank5/${year}/${month}`)
          .then(response => {
            self.list2 = response.data.list;
            console.log("self.list2: " + self.list2);

            self.showRankingChart = false;

            if (self.list2 && self.list2.length > 0) {
              for (let i = 0; i < 5; i++) {
                const rank = i + 1;

                const item = self.list2.find(obj => {
                  return obj.RANK === rank;

                })

                if (item) {
                  const rank = item.RANK;
                  const rankStore = item.STORENAME;
                  self[rank + 'rankStore'] = rankStore;
                  const rankSales = item.TOTALPRICE;
                  self[rank + 'rankSales'] = rankSales;

                  console.log("지점명: " + self[rank + 'rankStore'], "매출금액: " + self[rank + 'rankSales']);

                  const myChart = echarts.init(document.getElementById('ranking5Chart'));
                  
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
                        data: [self['1rankStore'], self['2rankStore'], self['3rankStore'], self['4rankStore'], self['5rankStore']],
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
                        }
                      }
                    ],
                    series: [
                      {
                        name: '총 매출',
                        type: 'bar',
                        barWidth: '60%',
                        tooltip: {
                          valueFormatter: function (value) {
                            return value.toLocaleString() + ' 원';
                          }
                        },
                        data: [
                          { value: self['1rankSales'], itemStyle: { color: '#79bd9a' } },
                          { value: self['2rankSales'], itemStyle: { color: '#f2e9e1' } },
                          { value: self['3rankSales'], itemStyle: { color: '#FAECC5' } },
                          { value: self['4rankSales'], itemStyle: { color: '#FFC19E' } },
                          { value: self['5rankSales'], itemStyle: { color: '#F15F5F' } }
                        ]
                      }
                    ]
                  };
                  myChart.setOption(option);
                  self.showRankingChart = true;
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
}



</script>

<style scoped>
/* @font-face {
  font-family: 'NotoSansKR-Regular';
  src: url('../font/NotoSansKR-Regular.otf') format('opentype');
} */

/* body {
  font-family: 'NotoSansKR-Regular', sans-serif;
}
 */

#headSalesTitle {
  font-size: 20px;
  font-weight: bold;
  padding-left: 3%;
  padding-top: 1%;
}

#headSalesContent {
  padding-left: 3%;
  padding-top: 1%;
  display: flex;
  overflow: auto;
  font-family: 'NotoSansKR-Regular', sans-serif;
}

#ranking5Chart {
  width: 700px;
  height: 400px;
}

.btncolor:hover {
  background-color: #FFC67B;
  color: #595959;
}

.btncolor {
  height: 38px;
  color: #595959;
  background-color: #bee96d;
  font-weight: bolder;
}

.form-select {
  height: fit-content;
  margin-top: 7px;
}

#headSalesTitle {
  font-family: 'NotoSansKR-Thin';
}

</style>


<style>
/* @font-face {
  font-family: 'NotoSansKR-Thin';
  src: url('../assets/fonts/NotoSansKR-Thin.otf') format('opentype');
} */
/* 
.app {
  font-family: 'MyFont', sans-serif;
} */

.fc-event-title {
  font-family: 'NotoSansKR-Thin';
  font-weight: lighter;

}




</style>
