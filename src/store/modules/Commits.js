const state = {
    sprintHistory: []
};

// getters
const getters = {
};

// actions
const actions = {
    newSprint({ commit }, sprintData) {
        commit('newSprint', sprintData);
    },
    clearHistory({ commit }) {
        commit('clearHistory');
    }
}

// mutations
const mutations = {
    newSprint(state, sprintData) {
        state.sprintHistory.push(sprintData);
    },
    clearHistory(state) {
        state.sprintHistory = [];
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
