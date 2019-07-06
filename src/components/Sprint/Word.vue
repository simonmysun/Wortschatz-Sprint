<template>
<transition-group class="container" name="word" tag="div">
  <div :key="content" :class="{ words: true, succ: status ===1, fail: status === 2 }">
    {{ content.split(', ')[0] }}<span :class="{ var: status === 0 }" v-if="content.split(', ').length > 1">, {{ content.split(', ').slice(1).join(', ') }}</span>
    </div>
</transition-group>
</template>

<script>
import fitty from 'fitty';

const fitties = [];

export default {
    name: 'Word',
    props: ['content', 'status'],
    watch: {
        content() {
            fitties.forEach(f => f.unsubscribe());
            fitties.length = 0;
            this.$nextTick().then(() => fitties.push(...fitty('.words', {
                maxSize: 128
            })));
        }
    },
    mounted() {
        this.$nextTick().then(() => {
            fitties.forEach(f => f.unsubscribe());
            fitties.push(...fitty('.words', {
                maxSize: 128
            }));
            this.$nextTick().then(() => fitties.forEach(f => f.fit()));
        });
    },
    data() {
        return {};
    }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css?family=Average');

.container {
    width: 100%;
    height: 100%;
    display: flex ! important;
    justify-content: center;
    align-items: center;
}

.words {
    color: #111;
    vertical-align: middle;
    font-family: 'Average', serif;
    z-index: 999;
    transform: translateX(0) translateY(0) scale(1);
    position: relative;
    opacity: 1;}

.words:hover .var {
    opacity: 1;
    filter: blur(0);
}


.var {
    opacity: 0.1;
    filter: blur(10px);
    transition: opacity 0.3s, filter 0.5s;
}

.word-enter {
    transform: translateY(100%) ! important;
    opacity: 0;
}
.word-leave-to {
    transform: translateX(-100%) ! important;
    opacity: 0;
}
.word-enter-active, .word-leave-active {
    transition: transform .3s ease, opacity .3s;
    animation: none ! important;
    position: absolute;
}
.word-enter-to, .word-leave {
    transform: translateX(0) translateY(0);
    opacity: 1;
}

.succ {
    transition: transform 5s ease-out;
    transform: scale(1.15);
}
.fail {
    animation: shake 0.52s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
}

@keyframes shake {
    10%, 90% {
        transform: translate3d(-2px, 0, 0);
    }

    20%, 80% {
        transform: translate3d(4px, 0, 0);
    }

    30%, 50%, 70% {
        transform: translate3d(-8px, 0, 0);
    }

    40%, 60% {
        transform: translate3d(8px, 0, 0);
  }
}
</style>
