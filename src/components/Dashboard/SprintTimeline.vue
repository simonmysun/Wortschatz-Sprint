<template>
<div class="sprint-timeline-container">
  <Timeline>
    <TimelineItem v-for="s in data" :key="s.date">
      <p class="time">{{ new Date(s.date).toString() }}</p>
      <p class="content">
        Lists: {{ s.lists.join(',') }};<br>
        Number of words: {{ s.wordNum }};<br>
        Successful attempts: {{ s.succNum }};<br>
        Unsuccessful attempts: {{ s.failNum }};<br>
        Max Combo: {{ s.maxCombo }}</p>
    </TimelineItem>
  </Timeline>
</div>
</template>

<script>
export default {
    name: 'SprintTimeline',
    props: ['data'],
    data() {
        return {
        };
    }
}
</script>

<style scoped>
.sprint-timeline-container {
}

.time{
    font-size: 14px;
    font-weight: bold;
}
.content{
    padding-left: 5px;
}
</style>
