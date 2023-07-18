<template>
    <div id="container">
        <h4 style="z-index=1">매출</h4>

        <div v-if="accounttype == 1" class="content" style="z-index=2">
            <div id="HQchart"></div>
        </div>

        <div v-if="accounttype == 2" class="content" style="z-index=2">
            <div id="storeChart"></div>
        </div>

        <!-- 라우터 링크 넣어주세요~! -->

        <router-link v-if="accounttype == 1" to="/headsales">
        <button class="btn" id="btncolor" style="z-index=3">더보기</button></router-link>

        <router-link v-if="accounttype == 2" to="/branchsales">
        <button class="btn" id="btncolor" style="z-index=3">더보기</button></router-link>

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

export default {
    name: 'IndexNetsales',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            accounttype: sessionStorage.getItem("accounttype"),
            list: [],
            list2: []
        }
    },
    created: function () {
        console.log(this.accounttype);
        echarts.use ([ 
          TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout,
          ToolboxComponent, GridComponent, BarChart, UniversalTransition 
        ]);
        this.type();
    },
    mounted() {

    },
    methods: {
        type() {
            if (this.accounttype === "1") {
                this.getHQchart();
            } else if (this.accounttype === "2") {
                this.getStoreChart();
            }
        },
        getHQchart() {
        const self = this;

        self.$axios.get(`http://localhost:8085/selling/dailysales`)
            .then(response => {
            self.list = response.data;

            console.log(self.list);

            const day = new Date(); // 현재 날짜 추출

            for (let i = 3; i >= 1; i--) {  // 오늘부터 3일전 날짜까지 추출
                const sellingdate = new Date(day.getTime() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
                self['salesDay-' + i] = sellingdate;

                console.log(self['salesDay-' + i]);

                const item = self.list.find(obj => {
                  console.log(obj)
                  console.log(self.list)
                const itemDate = obj.SELLINGDATE.substring(0, 10);
                console.log(itemDate)
                return itemDate.toString() === sellingdate.toString();
                
                });

                if (item) {
                const totalprice = item.TOTALPRICE;
                self['salesDay-' + i + 'sales'] = totalprice;
                }
            }

            const myChart = echarts.init(document.getElementById('HQchart'));

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
                   data: [self['salesDay-1'], self['salesDay-2'], self['salesDay-3']]
                  }
                ],
                yAxis: [
                  {
                   type: 'value',
                   interval: 2500000,
                   axisLabel: {
                      formatter: '{value} 원'
                    }
                  }
                ],
                series: [
                {
                    type: 'bar',
                    barWidth: '50%',
                    data: [
                        { value: self['salesDay-1sales'], itemStyle: { color: '#cbe86b' } },
                        { value: self['salesDay-2sales'], itemStyle: { color: '#f2e9e1' } },
                        { value: self['salesDay-3sales'], itemStyle: { color: '#79bd9a' } }
                    ],
                    tooltip: {
                          valueFormatter: function (value) {
                            return value.toLocaleString() + ' 원';
                          }
                        },
                    showBackground: true,
                    backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                    }
                  }
                ]
            };

            myChart.setOption(option);
            })
            .catch(error => {
            console.error(error);
            });
        },
        getStoreChart() {
        const storeId = this.id;

        console.log(storeId);
        const self = this;

        self.$axios.get(`http://localhost:8085/selling/dailysales/${storeId}`)
            .then(response => {
            self.list2 = response.data.list;

            console.log(self.list2);

            const day = new Date(); // 현재 날짜 추출

            for (let i = 3; i >= 1; i--) {  // 오늘부터 3일전 날짜까지 추출
                const sellingdate = new Date(day.getTime() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
                self['salesDay-' + i] = sellingdate;

                console.log(self['salesDay-' + i]);

                const item = self.list2.find(obj => {
                  console.log(obj)
                const itemDate = obj.SELLINGDATE.substring(0, 10);
                return itemDate.toString() === sellingdate.toString();
                
                });

                if (item) {
                const totalprice = item.TOTALPRICE;
                self['salesDay-' + i + 'sales'] = totalprice;
                }
            }

            for (let i = 1; i <= 3; i++) {
                console.log(self['salesDay-' + i + 'sales']);
            }

            const myChart = echarts.init(document.getElementById('storeChart'));

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
                   data: [self['salesDay-1'], self['salesDay-2'], self['salesDay-3']]
                  }
                ],
                yAxis: [
                  {
                   type: 'value',
                   interval: 500000,
                   axisLabel: {
                      formatter: '{value} 원'
                    }
                  }
                ],
                series: [
                {
                    type: 'bar',
                    barWidth: '50%',
                    data: [
                        { value: self['salesDay-1sales'], itemStyle: { color: '#cbe86b' } },
                        { value: self['salesDay-2sales'], itemStyle: { color: '#f2e9e1' } },
                        { value: self['salesDay-3sales'], itemStyle: { color: '#79bd9a' } }
                    ],
                    tooltip: {
                          valueFormatter: function (value) {
                            return value.toLocaleString() + ' 원';
                          }
                        },
                    showBackground: true,
                    backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                    }
                  }
                ]
            };

            myChart.setOption(option);
            })
            .catch(error => {
            console.error(error);
            });
        }
    }
}


</script>

<style scoped>
#container {
    /* margin: 10px 10px; */
    text-align: center;
    overflow: hidden;
    /* 이 위는 바꾸지 마세요~ */
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: space-between;
}

.content {
    margin-top: 5px;
    /* overflow: auto; */
    max-height: 11em;
    /* 이 위는 바꾸지 마세요~ */
}

#btncolor:hover {
    background-color: #FFC67B;
    color: #595959
}

#btncolor {
    margin-top: 5px;
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
    border: none;
    padding: 5px 10px;
}

#HQchart {
    width: 500px;
    height: 200px;
    margin-top: -40px;
    margin-bottom: 15px;
}

#storeChart {
    width: 500px;
    height: 200px;
    margin-top: -40px;
    margin-bottom: 15px;
}
</style>