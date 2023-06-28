<template>
    <div id="container">
      <h6>매출 조회</h6>
    </div>
  
    <div id="salesSummary">
      <table>
        <tr v-for="li in list" :key="li.totalprice" >
            <td>{{ li.totalprice }}</td>
        </tr>
        <tr><td>{{ yesterdaySales }}</td><td>{{ monthTotalSales }}</td></tr>
        <tr><td>전일 총 매출</td><td>조회월 기준 누적 총 매출</td></tr>
      </table>
    </div>
  
    <div id="dailySales">
      캘린더 삽입
    </div>
  </template>
  
  <script>
  export default {
    name: 'BranchSales',
    data() {
      return {
        storeId: '',
        yesterdaySales: 0,
        monthTotalSales: "",
        list: [],
        list2: [],
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
    },
  };
  </script>
  