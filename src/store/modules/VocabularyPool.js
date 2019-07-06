const state = {
    busy: false,
    currentVocabularyLists: [],
    tier0: [],
    tier1: [],
    tier2: [],
    currentSprintLength: 0
};

// getters
const getters = {
};

// actions
const actions = {
    loadVocabulary({ commit, rootState }, listsToLoad) {
        return Promise.all(listsToLoad.map(list => fetch(rootState.config.vocabularyListsBaseUrl + `/${list}`)
                              .then(response => {
                                  if(response.ok) {
                                      return response;
                                  } else {
                                      throw Error(response.statusText);
                                  }
                              })
                              .then(response => response.text())
                              .then(data => {
                                  commit('loadVocabulary', {
                                      listName: list,
                                      vocabulary: data.split('\n')
                                          .filter(line => line.length > 0)
                                          .map(line => {
                                              line = line.split('|');
                                              return {
                                                  fromList: line[2],
                                                  word: line[0],
                                                  translation: line[1],
                                                  fail: 1
                                              };
                                          })
                                  });
                                  this.dispatch('notifications/notify', {
                                      title: 'New list loaded',
                                      type: 'success',
                                      description: `List ${list} successfully loaded`,
                                      timeout: 3000,
                                      key: Math.random().toString(36).substr(2, 8)
                                  }, { root: true });
                              })
                              .catch(error => {
                                  this.dispatch('notifications/notify', {
                                      title: 'Error on loading vocabulary list',
                                      type: 'error',
                                      description: `Failed to load List ${list}: \n${error}`,
                                      timeout: 3000,
                                      key: Math.random().toString(36).substr(2, 8)
                                  }, { root: true });
                                  throw error;
                              })))
            .then(() => {
                this.dispatch('notifications/notify', {
                    title: 'Fetching data finished',
                    type: 'success',
                    description: ``,
                    timeout: 3000,
                    key: Math.random().toString(36).substr(2, 8)
                }, { root: true });
            });
    },
    initializeSprint({ commit }) {
        commit('initializeSprint');
    },
    tier0Remove({ commit }, word) {
        commit('tier0Remove', word);
    },
    tier0Duplicate({ commit }, word) {
        commit('tier0Duplicate', word);
    },
    tier0Clear({ commit }) {
        commit('tier0Clear');
    }
}

// mutations
const mutations = {
    loadVocabulary(state, vocabularyList) {
        state.currentVocabularyLists.push(vocabularyList.listName);
        vocabularyList.vocabulary.forEach(item => state.tier0.push(item));
        state.currentSprintLength = state.tier0.length;
    },
    initializeSprint(state) {
        state.currentVocabularyLists = [];
        state.currentSprintLength = 0;
    },
    tier0Remove(state, word) {
        for(let i = state.tier0.length - 1; i >= 0; i -= 1) {
            if(state.tier0[i].word === word) {
                state.tier0[i].fail -= 1;
                if(state.tier0[i].fail <= 0) {
                    state.tier0.splice(i, 1);
                }
                break;
            }
        }
    },
    tier0Duplicate(state, word) {
        for(let i = state.tier0.length - 1; i >= 0; i -= 1) {
            if(state.tier0[i].word === word) {
                state.tier0[i].fail = Math.ceil(1.6180339887 * state.tier0[i].fail);
                break;
            }
        }
    },
    tier0Clear(state) {
        state.tier0 = [];
    },
    tier1Clear(state) {
        state.tier1 = [];
    },
    tier2Clear(state) {
        state.tier2 = [];
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
