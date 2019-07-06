<template>
<div class="pie-container">
  <v-chart :options="options" :init-options="initOptions"/>
</div>
</template>

<script>
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip'
export default {
    name: 'PieChart',
    props: ['data0', 'data1'],
    data() {
        return {
            initOptions: {
                renderer: 'svg'
            },
            options: {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: 'Your answers',
                        type: 'pie',
                        radius: ['45%', '55%'],
                        center: ['50%', '50%'],
                        data:[
                            {
                                value: this.data0,
                                name: 'Correct Answers'
                            },
                            {
                                value: this.data1,
                                name: 'Incorrect Answers'
                            },
                        ].sort((a, b) => a.value - b.value),
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(0, 0, 0, 0.3)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(0, 0, 0, 0.3)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#ffcb52',
                                shadowBlur: 80,
                                shadowColor: 'rgba(0, 0, 0, 0.2)'
                            }
                        },

                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return idx * 50 + Math.random() * 50;
                        }
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
.pie-container {
}
</style>
