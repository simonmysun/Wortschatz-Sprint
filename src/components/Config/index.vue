<template>
<div class="container">
  <Tooltip :content="tier0.map(x => x.word).join(',')" placement="right-start">
    <Button type="error" class="btn" v-on:click="tier0Clear()">Clear {{ tier0.length }} word(s) of Tier 0</Button>
  </Tooltip>
  <br>
  <Tooltip :content="tier1.map(x => x.word).join(',')" placement="right-start">
    <Button type="error" class="btn" v-on:click="tier1Clear()">Clear {{ tier1.length }} word(s) of Tier 1</Button>
  </Tooltip>
  <br>
  <Tooltip :content="tier2.map(x => x.word).join(',')" placement="right-start">
    <Button type="error" class="btn" v-on:click="tier2Clear()">Clear {{ tier2.length }} word(s) of Tier 2</Button>
  </Tooltip>
  <br>
  <Tooltip content="Reset All" placement="right-start">
    <Button type="error" class="btn" v-on:click="reset()">Reset</Button>
  </Tooltip>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'Config',
    computed: {
        ...mapState({
            currentVocabularyLists: state => state.vocabularyPool.currentVocabularyLists,
            tier0:  state => state.vocabularyPool.tier0,
            tier1:  state => state.vocabularyPool.tier1,
            tier2:  state => state.vocabularyPool.tier2
        })
    },
    methods: {
        ...mapActions('vocabularyPool', [
            'tier0Clear',
            'tier1Clear',
            'tier2Clear'
        ]),
        ...mapActions('commits', [
            'clearHistory'
        ]),
        reset() {
            this.clearHistory();
            this.tier0Clear();
            this.tier1Clear();
            this.tier2Clear();
        }
    }
};
</script>

<style scoped>
.top {
    text-align: center;
}

.btn {
    margin: 5px;
}
</style>
