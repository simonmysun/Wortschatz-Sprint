<template>
<div class="container">
  <div v-if="tier0.length === 0">
    <SelectLists :lists="listsAvailable" :selected="selectedLists" @updateSelected="updateSelectedLists" @load="load"></SelectLists>
    {{ selectedLists }}
  </div>
  <div v-else>
    <Progress :percent="Math.max(0, (1 - total / currentSprintLength)) * 100" hide-info status="active"/>
    <Progress :percent="Math.max(0, (1 - total / currentSprintLength)) * 100" hide-info status="active"/>
    <div class="total">total: {{ total }}</div>
    <Row class="quiz-container" :gutter="72">
      <i-col :xs="24" :sm="24" :md="12" :lg="12" class="word-container">
        <Word class="word" :content="currentWord" :status="status"></Word>
      </i-col>
      <i-col :xs="24" :sm="24" :md="12" :lg="12" class="answer-container">
        <div v-if="status === 0" class="submission-form">
          <form v-on:submit.prevent="examine(submission)">
            <div class="form-box">
              <div class="submission-box">
                <input class="submission" ref="submissionEl" v-model="submission">
              </div>
              <div class="btn-box">
                <Button class="btn-submit" icon="ios-return-left" @click="examine(submission)"/>
              </div>
            </div>
          </form>
        </div>
        <div v-else>
          <form v-on:submit.prevent="next(true)">
            <div>{{ status === 1 ? 'Richtig' : 'Falsch' }}! </div>
            <div>Translation: {{ currentTranslation }}</div>
            <div v-if="status === 2">Your answer: <del>{{ submission }}</del></div>
            <div>
              <div v-for="item in diff" :key="item.diff.na + Math.random()">
                <div>Distance: {{ item.dist }}</div>
                <div>Allowed distance: {{ item.distAllowed }}</div>
                <div>Your answer: <span v-html="item.diff.na" class="your-answer"></span></div>
                <div>Correct answer: <span v-html="item.diff.nb" class="correct-answer"></span></div>
              </div>
            </div>
            <div v-if="status === 1">
              <input type="submit" value="Next" ref="nextElSucc" v-on:click="feedback(true)">
              <a href="#" v-on:click.prevent="feedback(false)">Mark as failure</a>
            </div>
            <div v-if="status === 2">
              <input type="submit" value="Next" ref="nextElFail" v-on:click="feedback(false)">
              <a href="#" v-on:click.prevent="feedback(true)">Mark as success</a>
            </div>
          </form>
        </div>
      </i-col>
    </Row>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Word from './Word.vue';
import SelectLists from './SelectLists.vue';
import { compare } from './libcompare.js';

export default {
    name: 'Sprint',
    components: {
        Word,
        SelectLists
    },
    computed: {
        ...{
            total() {
                let length = 0;
                this.tier0.forEach(item => length += item.fail);
                if(length > 0 && this.currentWord === ''){
                    this.nextWord(length);
                }
                return length;
            },
        },
        ...mapState({
            listsAvailable: state => state.config.vocabularyLists,
            currentVocabularyLists: state => state.vocabularyPool.currentVocabularyLists,
            tier0:  state => state.vocabularyPool.tier0,
            tier1:  state => state.vocabularyPool.tier1,
            tier2:  state => state.vocabularyPool.tier2,
            vocabulary: state => state.vocabularyPool.vocabulary,
            currentSprintLength: state => state.vocabularyPool.currentSprintLength
        }),
    },
    methods: {
        ...{
            initialize() {
                this.initializeSprint();
                this.selectedLists = [];
                this.succNum = 0;
                this.failNum = 0;
                this.maxCombo = 0;
                this.currentCombo = 0;
                this.currentWord = '';
                this.currentTranslation = '';
                this.status = 0;
                this.submission = '';
                this.diff = [];

            },
            updateSelectedLists(lists) {
                this.selectedLists = lists;
            },
            load() {
                if(this.selectedLists.length > 0) {
                    this.$Spin.show();
                    this.$Loading.start();
                    this.loadVocabulary(this.selectedLists)
                        .then(() => {
                            this.$Loading.finish();
                            this.$Spin.hide();
                        }).catch(error => {
                            this.$Loading.error(error);
                            this.$Spin.hide();
                        });
                }
            },
            nextWord(totalLength) {
                if(totalLength === 0) {
                    return;
                }
                const rand = Math.floor(Math.random() * totalLength);
                let sum = 0;
                for(let i = this.tier0.length - 1; i >= 0; i -= 1) {
                    sum += this.tier0[i].fail;
                    if(sum > rand) {
                        this.currentWord = this.tier0[i].word;
                        this.currentTranslation = this.tier0[i].translation;
                        break;
                    }
                }
                const v = this;
                this.$nextTick().then(function() {
                    v.$refs.submissionEl.focus();
                    window.scrollTo(0, 0);
                });
            },
            examine(submission) {
                const res = compare(submission, this.currentTranslation)
                this.diff = res.res.map(r => {
                    return {
                        diff: r.diff,
                        dist: r.dist,
                        distAllowed: r.distAllowed
                    };
                });
                const v = this;
                if(res.cmp) {
                    this.status = 1;
                    this.$nextTick().then(function() {
                        v.$refs.nextElSucc.focus();
                    });
                } else {
                    this.status = 2;
                    this.$nextTick().then(function() {
                        v.$refs.nextElFail.focus();
                    });
                }
            },
            feedback(result) {
                if(result) {
                    this.succNum += 1;
                    this.tier0Remove(this.currentWord);
                    if(this.total === 0) {
                        this.recordSprint({
                            date: Date.now(),
                            lists: this.currentVocabularyLists,
                            wordNum: this.currentSprintLength,
                            succNum: this.succNum,
                            failNum: this.failNum,
                            maxCombo: this.maxCombo
                        });
                        this.$Modal.success({
                            title: 'Hooray! You finished a sprint',
                            content: `
Lists: ${this.currentVocabularyLists};<br>
Number of words: ${this.currentSprintLength};<br>
Successful attempts: ${this.succNum};<br>
Unsuccessful attempts: ${this.failNum};<br>
Max Combo: ${this.maxCombo}
`
                        });
                        this.initialize();
                    }
                } else {
                    this.failNum += 1;
                    this.tier0Duplicate(this.currentWord);
                }
                this.submission = '';
                this.status = 0;
                this.diff = [];
                this.nextWord(this.total);
            }
        },
        ...mapActions('vocabularyPool', [
            'tier0Remove',
            'tier0Duplicate',
            'loadVocabulary',
            'initializeSprint'

        ]),
        ...mapActions('commits', {
            recordSprint: 'newSprint'
        })
    },
    data() {
        return {
            selectedLists: [],
            succNum: 0,
            failNum: 0,
            maxCombo: 0,
            currentCombo: 0,
            currentWord: '',
            currentTranslation: '',
            status: 0, // 0: default; 1: richtig; 2: falsch
            submission: '',
            diff: []
        }
    }
};
</script>

<style scoped>

.container {
}

.quiz-container {
    position: absolute;
    top: 50px;
    right: 72px;
    bottom: 0;
    left: 72px;
}

.word-container {
    height: 100%;
}

.answer-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.your-answer, .correct-answer {
    font-family: monospace;
}

.form-box {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
}

.submission-form {
    width: 100%;
}

.submission {
    border: 0;
    display: inline-block;
    width: 100%;
    outline: none;
    font-size: 80px;
    text-align: center;
    border-bottom: 1px solid #aaa;
}

.submission:focus {
    border: 0;
    outline: none;
    border-bottom: 1px solid #aaa;
}

.submission-box {
}

.btn-box {
}

.btn-submit {
    height: 80px;
    width: 80px;
    font-size: 53.5px;
}

@media (max-width: 768.98px) {
    .answer-container, .word-container {
        height: 50%;
    }
    .btn-submit {
        height: 40px;
        width: 40px;
        font-size: 26.75px;
    }
    .submission {
        font-size: 40px;
    }
}
</style>
