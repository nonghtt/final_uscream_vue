<template>
  <div id="searchform" style="display: flex; align-items: center;">
    <div id="select" >
      <select v-model="selected" style="margin-right:10px;">
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      </select>

      <input v-model="searchText" placeholder="검색하실 지점명을 입력하세요" style="margin-right:10px; width:600px">

      <button @click="search">검색</button>
    </div>
  </div>
  <div>
  <div id="monthlychart" style="width: 800px; height: 600px"></div></div>
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
      searchText: '',
    }
  },
  created() {
    echarts.use([
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
                const monthlySales = item.TOTALPRICE;
                self['monthlySales' + year + month] = monthlySales;
              }
            }

            const myChart = echarts.init(document.getElementById('monthlychart'));

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
                type: 'value'
              },
              series: [
                {
                  name: 2020,
                  type: 'line',
                  data: [
                    self['monthlySales20201'], self['monthlySales20202'], self['monthlySales20203'], self['monthlySales20204'],
                    self['monthlySales20205'], self['monthlySales20206'], self['monthlySales20207'], self['monthlySales20208'],
                    self['monthlySales20209'], self['monthlySales202010'], self['monthlySales202011'], self['monthlySales202012']
                  ]
                },
                {
                  name: 2021,
                  type: 'line',
                  data: [
                    self['monthlySales20211'], self['monthlySales20212'], self['monthlySales20213'], self['monthlySales20214'],
                    self['monthlySales20215'], self['monthlySales20216'], self['monthlySales20217'], self['monthlySales20218'],
                    self['monthlySales20219'], self['monthlySales202110'], self['monthlySales202111'], self['monthlySales202112']
                  ]
                },
                {
                  name: 2022,
                  type: 'line',
                  data: [
                    self['monthlySales20221'], self['monthlySales20222'], self['monthlySales20223'], self['monthlySales20224'],
                    self['monthlySales20225'], self['monthlySales20226'], self['monthlySales20227'], self['monthlySales20228'],
                    self['monthlySales20229'], self['monthlySales202210'], self['monthlySales202211'], self['monthlySales202212']
                  ]
                },
                {
                  name: 2023,
                  type: 'line',
                  data: [
                    self['monthlySales20231'], self['monthlySales20232'], self['monthlySales20233'], self['monthlySales20234'],
                    self['monthlySales20235'], self['monthlySales20236'], self['monthlySales20237'], self['monthlySales20238'],
                    self['monthlySales20239'], self['monthlySales202310'], self['monthlySales202311'], self['monthlySales202312']
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





    }

  }
};
</script>

<style>
.searchform {
  display: flex;
  align-items: center;
}
</style>
