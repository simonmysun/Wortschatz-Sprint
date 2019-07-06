<template>
<div class="container">
  <div v-if="dailyData.length > 0">
    <Row>
      <i-col :xs="24" :sm="8" class="pie-chart-container">
        <PieChart :data0="succAns" :data1="failAns"></PieChart>
      </i-col>
      <i-col :xs="24" :sm="16" class="line-chart-container">
        <LineChart :data="dailyData"></LineChart>
      </i-col>
    </Row>
    <Row>
      <i-col :xs="24" :sm="24" class="punchcard-chart-container">
        <CalendarHeatMapChart :data="dailyData"></CalendarHeatMapChart>
      </i-col>
    </Row>
    <Row>
      <i-col :xs="24" :sm="12" class="heatmap-chart-container">
        <HeatMapChart :data="heatMap" :listsAvailable="listsAvailable"></HeatMapChart>
      </i-col>
      <i-col :xs="24" :sm="12" class="timeline-container">
        <SprintTimeline :data="sprintHistory"></SprintTimeline>
      </i-col>
    </Row>
  </div>
  <div v-else class="empty">
    <h2>You haven't done any sprint. <router-link to="/sprint">Click</router-link> to start one!</h2>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PieChart from './PieChart.vue';
import LineChart from './LineChart.vue';
import CalendarHeatMapChart from './CalendarHeatMapChart.vue';
import HeatMapChart from './HeatMapChart.vue';
import SprintTimeline from './SprintTimeline.vue';

const dateCompare = function(a, b) {
    if(a.getFullYear() > b.getFullYear()) {
        return 1;
    } else if(a.getFullYear() < b.getFullYear()) {
        return -1;
    } else if(a.getMonth() > b.getMonth()) {
        return 1;
    } else if(a.getMonth() < b.getMonth()) {
        return -1;
    } else if(a.getDate() > b.getDate()) {
        return 1;
    } else if(a.getDate() < b.getDate()) {
        return -1;
    } else {
        return 0;
    }
}

export default {
    name: 'Dashboard',
    components: {
        PieChart,
        LineChart,
        CalendarHeatMapChart,
        HeatMapChart,
        SprintTimeline
    },
    computed: {
        ...{
        },
        ...mapState({
            sprintHistory: state => state.commits.sprintHistory,
            listsAvailable: state => state.config.vocabularyLists
        })
    },
    methods: {
        ...{
            updateCharts() {
                this.totalSprints = 0 //this.sprintHistory.length;
                this.totalAns = 0;
                this.succAns = 0;
                this.failAns = 0;
                this.dailyData = [];
                this.heatMap = [];
                let currentDate = new Date(-8640000000000000);
                let dailyCell = null;
                this.sprintHistory.map(sprint => {
                    const date = new Date(sprint.date);
                    while(dateCompare(date, currentDate) > 0) {
                        if(dailyCell === null) {
                            currentDate = date;
                        } else {
                            this.dailyData.push(dailyCell);
                            currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
                        }
                        dailyCell = {
                            date: currentDate.getTime(),
                            totalAns: this.totalAns,
                            succAns: this.succAns,
                            failAns: this.failAns,
                            succ: 0,
                            fail: 0,
                            todaySprint: 0,
                            totalSprint: this.totalSprint,
                            combo: 0,
                            succRate: this.succAns / this.totalAns
                        }
                    }
                    this.totalSprints += 1;
                    this.totalAns += sprint.succNum + sprint.failNum;
                    this.succAns += sprint.succNum;
                    this.failAns += sprint.failNum;
                    dailyCell = {
                        date: dailyCell.date,
                        totalAns: this.totalAns,
                        succAns: this.succAns,
                        failAns: this.failAns,
                        succ: dailyCell.succ + sprint.succNum,
                        fail: dailyCell.fail + sprint.failNum,
                        todaySprint: dailyCell.todaySprint + 1,
                        totalSprint: this.totalSprint,
                        combo: sprint.maxCombo,
                        succRate: this.succAns / this.totalAns
                    }
                    sprint.lists.map(list => {
                        if(this.heatMap[list] === undefined) {
                            this.heatMap[list] = 1;
                        } else {
                            this.heatMap[list] += 1;
                        }
                    });
                });
                if(dailyCell !== null) {
                    this.dailyData.push(dailyCell);
                }
            }
        },
        ...mapActions('commits', [
        ])
    },
    beforeMount() {
        this.updateCharts();
    },
    data() {
        return {
            totalSprints: 0,
            totalAns: 0,
            succAns: 0,
            failAns: 0,
            dailyData: [],
            heatMap: [],
        };
    }
};
</script>

<style scoped>
.container {
    overflow-y: auto;
}
.empty {
    display: grid;
    height: 100%;
}
.empty>h2 {
    margin: auto;
    font-size: bigger;
}
</style>
