<template>
  <h6>매출 조회</h6>
  <div>
    <div id="salesSummary">
      <table>
        <tr>
          <td>{{ yesterdaySales }}</td>
          <td>{{ monthTotalSales }}</td>
        </tr>
        <tr>
          <td>전일 총 매출</td>
          <td>조회월 기준 누적 총 매출</td>
        </tr>
      </table>
    </div>
    <div id="dailySales">
      캘린더 삽입
    </div>
    <div id="netsalesAnalysis">
      순매출 분석
      <select v-model="selectYear">
        <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
      </select>
      <select v-model="selectMonth">
        <option v-for="month in months" :key="month" :value="month">{{ month }}월</option>
      </select>
      <button @click="renderChart">조회</button>
      <h6>총매출: {{ monthSales }}</h6>
      <!-- <h6>인건비: {{ monthPayroll }}</h6>
    <h6>발주금액: {{ monthOrder }}</h6>
    <h6>순매출: {{ monthNetsales }}</h6> -->
      <div id="donutchart" style="width: 600px; height: 400px"></div>
    </div>
    <div id="yearlyNetsales">
      월별 순매출
      <select v-model="selectYear2">
        <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
      </select>
      <button @click="getYearlyNetsales">조회</button>
      <div id="linechart" style="width: 800px; height: 400px"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

export default {
  name: 'BranchSales',
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
      years: [2020, 2021, 2022, 2023],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      selectYear: null,
      selectMonth: null,
      selectYear2: null,
      myChart: null,
      // option: [],
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
      LabelLayout
    ]);
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById('donutchart'));
    this.renderChart();
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
          console.log(self.list2)
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
            self.list3 = response.data.list;

            console.log(data);
            console.log(self.list3);

            if (self.list3 && self.list3.length > 0) {
              const totalSales = self.list3[0].MSELLINGPRICE;
              const formattedTotalSales = totalSales.toLocaleString();
              self.monthSales = formattedTotalSales;

              const totalPayroll = self.list3[0].MPSALARY;
              const formattedTotalPayroll = totalPayroll.toLocaleString();
              self.monthPayroll = formattedTotalPayroll;

              const totalOrder = self.list3[0].MORDERCOST;
              const formattedTotalOrder = totalOrder.toLocaleString();
              self.monthOrder = formattedTotalOrder;

              const totalNetsales = self.list3[0].MNETSALES;
              const formattedTotalNetsales = totalNetsales.toLocaleString();
              self.monthNetsales = formattedTotalNetsales;

              const option = {
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  top: '5%',
                  left: 'center',

                  selectedMode: false
                },
                series: [
                  {
                    name: '금액',
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
            self.list4 = response.data.list;

            console.log(data);
            console.log(self.list4);

            for (let i = 0; i < 12; i++) {
              self['monthlyNetsales' + (i + 1)] = 0;
            }

            if (self.list4 && self.list4.length > 0) {
              for (let i = 0; i < 12; i++) {
                const month = i + 1;
                const item = self.list4.find(obj => obj.MONTH === month);
                if (item) {
                  const monthNetsales = item.MNETSALES;
                  const formattedMonthNetsales = monthNetsales.toLocaleString();
                  self['monthlyNetsales' + month] = formattedMonthNetsales;
                } else {
                  self['monthlyNetsales' + month] = 0;
                }
              }
            }

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



          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }
}



    // getYearlyNetsales() {
    //   const self = this;
    //   const storeId = this.storeId;
    //   const year = this.selectYear2;

    //   if (year) {
    //     console.log(year);

    //     self.$axios
    //       .get(`http://localhost:8085/netsales/${storeId}/${year}`)
    //       .then(response => {
    //         const data = response.data;
    //         self.list4 = response.data.list;

    //         console.log(data);
    //         console.log(self.list4);

    //         for (let i = 0; i < 12; i++) {
    //           self['monthlyNetsales' + (i + 1)] = 0;
    //         }

    //         if (self.list4 && self.list4.length > 0) {
    //           for (let i = 0; i < self.list4.length; i++) {
    //             const monthNetsales = self.list4[i].MNETSALES;
    //             const formattedMonthNetsales = monthNetsales.toLocaleString();
    //             self['monthlyNetsales' + (i + 1)] = formattedMonthNetsales;
    //           }
    //         } else {
    //           // 데이터가 없는 경우에도 초기화를 수행
    //           for (let i = 0; i < 12; i++) {
    //             self['monthlyNetsales' + (i + 1)] = 0;
    //           }
    //         }


    //       })
    //       .catch(error => {
    //         console.error(error);
    //       });
    //   }
    // },

</script>