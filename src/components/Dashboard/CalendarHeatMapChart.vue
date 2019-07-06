<template>
<div class="calendar-heatmap-container">
  <v-chart :options="options" :init-options="initOptions"/>
</div>
</template>

<script>
import 'echarts/lib/chart/heatmap';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/visualMap';
import 'echarts/extension/bmap/bmap.js';

const formatDate = function(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

export default {
    name: 'CalendarHeatMapChart',
    props: ['data'],
    data() {
        return {
            initOptions: {
                renderer: 'svg'
            },
            options: {
                tooltip: {
                    formatter: function (p) {
                        var format = formatDate(p.data[0]);
                        return format + ': ' + p.data[1];
                    }
                },
                visualMap: {
                    min: 0,
                    max: this.data.reduce((a, v) => Math.max(a, v.todaySprint), -1),
                    range: [0, this.data.reduce((a, v) => Math.max(a, v.todaySprint), -1)],
                    calculable: true,
                    type: 'continuous',
                    orient: 'vertical',
                    top: 'middle',
                    left: 0,
                    itemHeight: '100px',
                    textStyle: {
                        color: '#000'
                    }
                },
                calendar: {
                    top: 'middle',
                    left: 90,
                    right: 30,
                    cellSize: [13, 13],
                    range: [formatDate(new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000)), formatDate(new Date())],
                    itemStyle: {
                        normal: {borderWidth: 0.5}
                    },
                    yearLabel: {show: false}
                },
                series: {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: this.data.map(day => [formatDate(new Date(day.date)), day.todaySprint])
                }
            }
        };
    }
}
</script>

<style scoped>
.echarts {
    width: 100%;
    margin: 0 15px;
    height: 200px;
}
.calendar-heatmap-container {
}
</style>
