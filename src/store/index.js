import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import achievements from './modules/Achievements.js';
import vocabularyPool from './modules/VocabularyPool.js';
import commits from './modules/Commits.js';
import config from './modules/Config.js';
import notifications from './modules/Notifications.js';

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        achievements,
        vocabularyPool,
        commits,
        config,
        notifications
    },
    plugins: [createPersistedState()]
})
