<template>
  <div class="box">
  <div id="searchform">
    <div id="select">
      <span>
        <select v-model="selected" style="margin-right:10px;">
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
        </select>
      </span>
      <span>
        <input v-model="searchKeyword" placeholder="검색하실 지점명을 입력하세요" style="margin-right:10px; width:600px">
      </span>  
      <span>
        <button @click="search">검색</button>
      </span>
    </div>
    <br/>
    <div id="storeMonthlychart" style="width: 800px; height: 600px"></div>
  </div>
  </div>
</template> 

<script>
import 'bootstrap/dist/css/bootstrap.css';


import 'bootstrap-icons/font/bootstrap-icons.css';
import * as echarts from 'echarts/core';
import { TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
export default {
  name: 'HeadSalesDetail',
  components: {},
  data() {
    return {
      selected: '',
      options: ['본사', '지점'],
      searchKeyword: '',
      list: [],
      list2: []
    };
  },
  created() {
    echarts.use ([
      TitleComponent,
      ToolboxComponent,
      TooltipComponent,
      GridComponent,
      LegendComponent,
      LineChart,
      CanvasRenderer,
      UniversalTransition
    ]);
  },
  methods: {
    search() {
      if (this.selected === '본사') {
        this.searchHead();
      } else if (this.selected === '지점') {
        this.searchBranch();
      }
    },
    searchHead() {
      const self = this;
      self.$axios
        .get('http://localhost:8085/selling/monthlysales')
        .then(response => {
          self.list = response.data.list;
          console.log(self.list);
          if (self.list && self.list.length > 0) {
            for (let i = 0; i < 12; i++) {
              const month = i + 1;
              const item = self.list.find(obj => obj.MONTH === month);
              
              if (item) {
                const year = item.YEAR;
                const storeMonthlySales = item.TOTALPRICE;
                self['storeMonthlySales' + year + month] = storeMonthlySales;
              }
            }
            const myChart = echarts.init(document.getElementById('storeMonthlychart'));
            const option = {
              title: {
                text: '연도별 매출 추이'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: [2020, 2021, 2022, 2023]
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
                  '1월', '2월', '3월', '4월', '5월', '6월',
                  '7월', '8월', '9월', '10월', '11월', '12월'
                ]
              },
              yAxis: {
                  type: 'value',
                  axisLabel: {
                    formatter: '{value} 원'}
              },
              series: [
                {
                  name: 2020,
                  type: 'line',
                  data: [
                    self['storeMonthlySales20201'], self['storeMonthlySales20202'], self['storeMonthlySales20203'], self['storeMonthlySales20204'],
                    self['storeMonthlySales20205'], self['storeMonthlySales20206'], self['storeMonthlySales20207'], self['storeMonthlySales20208'],
                    self['storeMonthlySales20209'], self['storeMonthlySales202010'], self['storeMonthlySales202011'], self['storeMonthlySales202012']
                  ]
                },
                {
                  name: 2021,
                  type: 'line',
                  data: [
                    self['storeMonthlySales20211'], self['storeMonthlySales20212'], self['storeMonthlySales20213'], self['storeMonthlySales20214'],
                    self['storeMonthlySales20215'], self['storeMonthlySales20216'], self['storeMonthlySales20217'], self['storeMonthlySales20218'],
                    self['storeMonthlySales20219'], self['storeMonthlySales202110'], self['storeMonthlySales202111'], self['storeMonthlySales202112']
                  ]
                },
                {
                  name: 2022,
                  type: 'line',
                  data: [
                    self['storeMonthlySales20221'], self['storeMonthlySales20222'], self['storeMonthlySales20223'], self['storeMonthlySales20224'],
                    self['storeMonthlySales20225'], self['storeMonthlySales20226'], self['storeMonthlySales20227'], self['storeMonthlySales20228'],
                    self['storeMonthlySales20229'], self['storeMonthlySales202210'], self['storeMonthlySales202211'], self['storeMonthlySales202212']
                  ]
                },
                {
                  name: 2023,
                  type: 'line',
                  data: [
                    self['storeMonthlySales20231'], self['storeMonthlySales20232'], self['storeMonthlySales20233'], self['storeMonthlySales20234'],
                    self['storeMonthlySales20235'], self['storeMonthlySales20236'], self['storeMonthlySales20237'], self['storeMonthlySales20238'],
                    self['storeMonthlySales20239'], self['storeMonthlySales202310'], self['storeMonthlySales202311'], self['storeMonthlySales202312']
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
      },
      searchBranch() {
      const self = this;
      const keyword = self.searchKeyword;
      if (keyword) {
        console.log(keyword);
        self.$axios
          .get(`http://localhost:8085/selling/monthlysales/${keyword}`)
          .then(response => {
            self.list2 = response.data.list;
            console.log(self.list2);
            if (self.list2 && self.list2.length > 0) {
              for (let i = 0; i < 12; i++) {
                const month = i + 1;
                const item = self.list2.find(obj => obj.MONTH === month);
                if (item) {
                  const year = item.YEAR;
                  const storeMonthlySales = item.TOTALPRICE;
                  self['storeMonthlySales' + year + month] = storeMonthlySales;
                }
              }
              const myChart = echarts.init(document.getElementById('storeMonthlychart'));
              const option = {
                title: {
                  text: '연도별 매출 추이'
                },
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: [2020, 2021, 2022, 2023]
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
                    '1월', '2월', '3월', '4월', '5월', '6월',
                    '7월', '8월', '9월', '10월', '11월', '12월'
                  ]
                },
                yAxis: {
                  type: 'value',
                  axisLabel: {
                    formatter: '{value} 원'}
                },
                series: [
                  {
                    name: 2020,
                    type: 'line',
                    data: [
                      self['storeMonthlySales20201'], self['storeMonthlySales20202'], self['storeMonthlySales20203'], self['storeMonthlySales20204'],
                      self['storeMonthlySales20205'], self['storeMonthlySales20206'], self['storeMonthlySales20207'], self['storeMonthlySales20208'],
                      self['storeMonthlySales20209'], self['storeMonthlySales202010'], self['storeMonthlySales202011'], self['storeMonthlySales202012']
                    ]
                  },
                  {
                    name: 2021,
                    type: 'line',
                    data: [
                      self['storeMonthlySales20211'], self['storeMonthlySales20212'], self['storeMonthlySales20213'], self['storeMonthlySales20214'],
                      self['storeMonthlySales20215'], self['storeMonthlySales20216'], self['storeMonthlySales20217'], self['storeMonthlySales20218'],
                      self['storeMonthlySales20219'], self['storeMonthlySales202110'], self['storeMonthlySales202111'], self['storeMonthlySales202112']
                    ]
                  },
                  {
                    name: 2022,
                    type: 'line',
                    data: [
                      self['storeMonthlySales20221'], self['storeMonthlySales20222'], self['storeMonthlySales20223'], self['storeMonthlySales20224'],
                      self['storeMonthlySales20225'], self['storeMonthlySales20226'], self['storeMonthlySales20227'], self['storeMonthlySales20228'],
                      self['storeMonthlySales20229'], self['storeMonthlySales202210'], self['storeMonthlySales202211'], self['storeMonthlySales202212']
                    ]
                  },
                  {
                    name: 2023,
                    type: 'line',
                    data: [
                      self['storeMonthlySales20231'], self['storeMonthlySales20232'], self['storeMonthlySales20233'], self['storeMonthlySales20234'],
                      self['storeMonthlySales20235'], self['storeMonthlySales20236'], self['storeMonthlySales20237'], self['storeMonthlySales20238'],
                      self['storeMonthlySales20239'], self['storeMonthlySales202310'], self['storeMonthlySales202311'], self['storeMonthlySales202312']
                    ]
                  }
                ]
              };
              myChart.setOption(option);
            } else {
              alert ("\n검색하신 키워드가 존재하지 않습니다. \n키워드는 전체 이름(ex.오리역점)으로 검색해주세요.");
            }
          })
          .catch(error => {
            console.error(error);
          });
        }
      }
    }
  };
</script>
<style scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
  
</style>