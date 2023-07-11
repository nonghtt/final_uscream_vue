<template>
    <div id="container">
        <h2>매출</h2>

        <div v-if="accounttype == 1" class="content"> 
            <div id="HQchart"></div>


            
        </div>

        <div v-if="accounttype == 2" class="content"> 
            <div id="StoreChart"></div>
            
        </div>

         <!-- 라우터 링크 넣어주세요~! -->
        <button class="btn" id="btncolor">더보기</button>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default {
    name: 'IndexNetsales',
    data() {
        return {
            id: sessionStorage.getItem("loginId"),
            accounttype: sessionStorage.getItem("accounttype"),
            list: [],
        }
    },
    created: function () {
        console.log(this.accounttype);
        echarts.use([GridComponent, BarChart, CanvasRenderer]);
        this.type();
    },
    mounted () {
        const currentDate = new Date();
        this.year = currentDate.getFullYear();
        this.month = currentDate.getMonth();
    },
    methods: {
      type () {
        if (this.accounttype === "1") {
            this.getHQchart();
        } else if (this.accounttype === "2") {
            this.getHQchart();
        }
      },
      getHQchart() {
        const self = this;

        self.$axios.get(`http://localhost:8085/selling/dailysales`)
            .then(response => {
            self.list = response.data;

            console.log(self.list);

            const day = new Date(); // 현재 날짜 추출

            for (let i = 4; i >= 0; i--) {  // 오늘부터 5일전 날짜까지 추출
                const sellingdate = new Date(day.getTime() - i * 24 * 60 * 60 * 1000);
                self[sellingdate + '-' + i + 'day'] = sellingdate;

                console.log(sellingdate);
                
                const item = self.list.find(obj => {
                    const itemDate = new Date(obj.SELLINGDATE);
                    return itemDate.toDateString() === sellingdate.toDateString();
                })
   

                if (item) {
                    const totalprice = item.TOTALPRICE;
                    self[sellingdate + totalprice] = totalprice;
                    self.sellingdate = totalprice;
                    console.log(self[sellingdate + '-' + i + 'day']);
                }
            }

        

            const myChart = echarts.init(document.getElementById('HQchart'));

            const option = {
                xAxis: {
                type: 'category',
                data: [
                    new Date(day.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                    new Date(day.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                    new Date(day.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                    new Date(day.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                    new Date(day).toISOString().slice(0, 10)
                ]
                },
                yAxis: {
                type: 'value'
                },
                series: [
                {
                    data: [
                    self[new Date(day.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + 'sales'],
                    self[new Date(day.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + 'sales'],
                    self[new Date(day.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + 'sales'],
                    self[new Date(day.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + 'sales'],
                    self[new Date(day).toISOString().slice(0, 10) + 'sales']
                    ],
                    tooltip: {
                          valueFormatter: function (value) {
                            return value.toLocaleString() + ' 원';
                          }
                        },
                    type: 'bar',
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
    margin: 10px 10px;
    text-align: center;
    overflow: hidden;
     /* 이 위는 바꾸지 마세요~ */
}

.content{
    margin-top:5px;
    overflow: auto;
    max-height: 11em;
     /* 이 위는 바꾸지 마세요~ */
}

#btncolor:hover {
    background-color: #FFC67B;
    color: #595959
}

#btncolor {
    margin-top:5px;
    color: #595959;
    background-color: #bee96d;
    font-weight: bolder;
    border: none;
    padding: 5px 10px;
}

#HQchart {
    width:400px;
    height:300px;
}
</style>