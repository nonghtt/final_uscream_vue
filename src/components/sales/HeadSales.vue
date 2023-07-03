<template>
    <class id="salespage">

        <div id="netsalesTitle">
            <br />
            <h3>매출 조회</h3>
            <br />
        </div>

        <!-- 일별 매출 표시 캘린더 = 완료 -->
        <div id="dailySales" style="width:700px; height:500px">
        </div>

        <!-- 일별 랭킹 차트 -->
        <div id="dailyranking">
            일간 지점 매출 TOP3
            <div id='rankingchart'></div>
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
    name: 'HeadSales',
    components: {
    },
    data() {
        return {
            storeId: '',
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
        this.addDailySales();
        this.myChart = echarts.init(document.getElementById('rankingchart'));
        this.getDailyRank3();

    },
    methods: {
        getSearchCriteria() {
            const currentDate = new Date();
            this.year = currentDate.getFullYear();
            this.month = currentDate.getMonth() + 1; // 0~11까지만 가져오므로 +1 해줌
            this.day = currentDate.getDate() - 1; // 당일에는 랭킹 조회 불가하므로 어제 날짜 가져옴
        },

        addDailySales() {
            // const storeId = this.storeId;
            const self = this;

            self.$axios
                .get(`http://localhost:8085/selling/dailysales`)
                .then(response => {
                    const data = response.data;
                    self.list3 = response.data;

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

        getDailyRank3() {
            const day = new Date();
            day.setDate(day.getDate() - 1);
            day.setHours(0, 0, 0, 0);
            const self = this;

            console.log(day);

            self.$axios
                .get(`http://localhost:8085/selling/dailyrank3`)
                .then(response => {
                    const data = response.data;
                    self.list = response.data;

                    console.log(data);
                    console.log(self.list);

                    if (self.list && self.list.length > 0) {
                        const filteredData = self.list.filter(item => {
                            const itemDate = new Date(item.SELLINGYEAR, item.SELLINGMONTH - 1, item.SELLINGDAY);
                            return itemDate.getTime() === day.getTime();
                        })

                        if (filteredData.length > 0) {
                            const xAxisData = filteredData.map(item => item.STORENAME);
                            const seriesData = filteredData.map(item => item.TOTALPRICE);
                            // }
                            // for (let i = 0; i < 3; i++) {
                            //     const rank = i + 1;
                            //     const item = self.list.find(obj => obj.RANK === rank);
                            //     if (item) {
                            //         const store = item.STORENAME;

                            const option = {
                                tooltip: {
                                    axisPointer: {
                                        type: '',
                                        crossStyle: {
                                            color: '#999'
                                        }
                                    }
                                },
                                legend: {
                                    data: ['지점 랭킹']
                                },
                                xAxis: [
                                    {
                                        type: 'category',
                                        data: xAxisData
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
                                                return value.toLocaleString() + '원';
                                            }
                                        },
                                        data: seriesData
                                    },
                                ]
                            };
                            this.myChart.setOption(option);
                        } else {
                            // 배열 0;
                        }
                    }
                })
                .catch(error => {
                    console.error(error);

                });
        }
    },
}
</script>
  
