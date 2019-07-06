const state = {
    vocabularyListsBaseUrl: './assets/vocabulary/latein',
    vocabularyLists: []
};

// getters
const getters = {
};

// actions
const actions = {
    async fetchVocabularyLists({ commit }) {
        var data = await fetch(state.vocabularyListsBaseUrl + `/index.json`)
            .then(response => {
                if(response.ok) {
                    return response;
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(response => response.json());
        commit('fetchVocabularyLists', data);
    }
}

// mutations
const mutations = {
    fetchVocabularyLists(state, lists) {
        state.vocabularyLists = lists;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
