<template>
<div class="line-container">
  <v-chart :options="options" :init-options="initOptions"/>
</div>
</template>

<script>
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/dataZoom';

export default {
    name: 'LineChart',
    props: ['data'],
    data() {
        return {
            initOptions: {
                renderer: 'svg'
            },
            options: {
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    start: 0,
                    end: 100,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                xAxis: {
                    type: 'category',
                    data: this.data.map(function (item) {
                        return new Date(item.date).toLocaleDateString();
                    })
                },
                yAxis: [
                    { //for total answers
                        show: false,
                        type: 'value'
                    },
                    { //for daily answers
                        show: false,
                        type: 'value',
                        max: function(value) {
                            return value.max * 3;
                        }
                    },
                    { //for total sprints
                        show: false,
                        type: 'value'
                    },
                    { // for daily sprints and combos
                        show: false,
                        type: 'value',
                        max: function(value) {
                            return value.max * 3;
                        }
                    },
                    { // for rates
                        show: false,
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Total Answers',
                        type: 'line',
                        data: this.data.map(function (item) {
                            return item.totalAns;
                        }),
                        smooth: true,
                        smoothMonotone: 'x',
                        sampling: 'average',
                        yAxisIndex: 0
                    },
                    {
                        name: 'Correct Answers',
                        type: 'line',
                        data: this.data.map(function (item) {
                            return item.succAns;
                        }),
                        smooth: true,
                        smoothMonotone: 'x',
                        sampling: 'average',
                        yAxisIndex: 0
                    },
                    {
                        name: 'incorrect Answers',
                        type: 'line',
                        data: this.data.map(function (item) {
                            return item.failAns;
                        }),
                        smooth: true,
                        smoothMonotone: 'x',
                        sampling: 'average',
                        yAxisIndex: 0
                    },
                    {
                        name: 'Correct Answers Today',
                        type: 'line',
                        data: this.data.map(function (item) {
                            return item.succ;
                        }),
                        smooth: true,
                        smoothMonotone: 'x',
                        sampling: 'average',
                        areaStyle: {},
                        yAxisIndex: 1
                    },
                    {
                        name: 'Incorrect Answers Today',
                        type: 'line',
                        data: this.data.map(function (item) {
                            return item.fail;
                        }),
                        smooth: true,
                        smoothMonotone: 'x',
                        sampling: 'average',
                        areaStyle: {},
                        yAxisIndex: 1
                    },
                    {
                        name: 'Sprints Today',
                        type: 'line',
                        data: this.data.map(function (item) {
                            return item.todaySprint;
                        }),
                        smooth: true,
                        smoothMonotone: 'x',
                        sampling: 'average',
                        areaStyle: {},
                        yAxisIndex: 3
                    },
                    {
                        name: 'Total Sprints',
                        type: 'line',
                        data: this.data.map(function (item) {
                            return item.totalSprint;
                        }),
                        smooth: true,
                        smoothMonotone: 'x',
                        sampling: 'average',
                        yAxisIndex: 2
                    },
                    {
                        name: 'Combo',
                        type: 'line',
                        data: this.data.map(function (item) {
                            return item.maxCombo;
                        }),
                        smooth: true,
                        smoothMonotone: 'x',
                        sampling: 'average',
                        yAxisIndex: 1
                    },
                    {
                        name: 'Success Rate',
                        type: 'line',
                        data: this.data.map(function (item) {
                            return item.succRate;
                        }),
                        smooth: true,
                        smoothMonotone: 'x',
                        sampling: 'average',
                        yAxisIndex: 4
                    }
                ]
            }
        };
    }
}
</script>

<style scoped>
.echarts {
    width: 100%;
    height: 50vh;
}
.line-container {
}
</style>
