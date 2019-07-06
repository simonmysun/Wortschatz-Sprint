import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import iView from 'iview';
import locale from 'iview/dist/locale/en-US';
import 'iview/dist/styles/iview.css';
import ECharts from 'vue-echarts';
import App from './App.vue';
import store from './store';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(iView, { locale });
Vue.component('v-chart', ECharts);

new Vue({
    render: h => h(App),
    store,
    created() {
        this.$store.dispatch("config/fetchVocabularyLists");
    }
}).$mount('#app');
