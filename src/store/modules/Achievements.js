import achievementList from './../../assets/achievements.js';

const state = {
    achievements: []
};

// getters
const getters = {
    achievements: (state) => {
        return state.achievements;
    }
};

// actions
const actions = {
    addAchievement({ commit }, achievement) {
        commit('addAchievement', achievement);
    }
}

// mutations
const mutations = {
    addAchievement(state, { name }) {
        if(state.achievements.filter(a => a.name === name).length === 0) {
            state.items.push(achievementList.filter(a => a.name === name)[0]);
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
