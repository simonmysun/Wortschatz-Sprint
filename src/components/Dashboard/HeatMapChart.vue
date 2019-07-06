<template>
<div class="heatmap-container">
  <v-chart :options="options" :init-options="initOptions"/>
</div>
</template>

<script>
import 'echarts/lib/chart/heatmap';
import 'echarts/lib/component/tooltip'
export default {
    name: 'HeatMapChart',
    props: ['data', 'listsAvailable'],
    data() {
        return {
            initOptions: {
                renderer: 'svg'
            },
            options: {
                tooltip: {
                    position: 'top',
                    formatter(p) {
                        const l = p.data[0] - p.data[1] * 9 + 1;
                        const n = p.data[2];
                        return `${l}: ${n}`;
                    }
                },
                xAxis: {
                    type: 'value',
                    show: false,
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'value',
                    show: false,
                    splitArea: {
                        show: true
                    }
                },
                visualMap: {
                    min: 0,
                    max: this.data.reduce((a, v) => Math.max(a, v)),
                    show: false
                },
                series: [{
                    name: 'Punch Card',
                    type: 'heatmap',
                    data: this.listsAvailable.map(l => {
                        const ln = parseInt(l) - 1;
                        const d = this.data[ln + 1];
                        return [ln % 9, -Math.floor(ln / 9), d === undefined ? 0 : d];
                    }),
                    label: {
                        formatter(p) {
                            return p.data[0] - p.data[1] * 9 + 1;
                        },
                        show: true,
                        color: '#000',
                    },
                    itemStyle: {
                        borderColor: '#ccc',
                    }
                }]
            }
        };
    }
}
</script>

<style scoped>
.echarts {
    width: 100%;
    height: 300px;
}
.heatmap-container {
}
</style>
