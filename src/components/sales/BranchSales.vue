<template>
  <h6>매출 조회</h6>

  <div id="salesSummary">
    <table>
      <!-- <tr v-for="li in list" :key="li.totalprice" > -->
      <!-- <td>{{ li.totalprice }}</td> -->
      <!-- </tr> -->
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
      <option v-for="year in years" v-bind:key="year" :value="year">{{ year }}년</option>
    </select>
    <select v-model="selectMonth">
      <option v-for="month in months" v-bind:key="month" :value="month">{{ month }}월</option>
    </select>

    <button @click="getNetSalesAnalysis">조회</button>
    <h6>총매출: {{ monthSales }}</h6>
    <h6>인건비: {{ monthPayroll }}</h6>
    <h6>발주금액: {{ monthOrder }}</h6>
    <h6>순매출: {{ monthNetsales }}</h6>
  </div>

</template>
  
<script>
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
      list: [],
      list2: [],
      years: [2020, 2021, 2022, 2023],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      selectYear: null,
      selectMonth: null,
    };
  },
  created() {
    this.getSearchCriteria();
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

      // 전일 매출 총합
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
    getNetSalesAnalysis() {
      const storeId = this.storeId;
      const year = this.selectYear;
      const month = this.selectMonth;

      console.log(year)
      console.log(month)

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

          
          console.log(self.monthSales);
          console.log(self.monthPayroll);
          console.log(self.monthOrder);
          console.log(self.monthNetsales);
      }
    },
  }
}
</script>


  