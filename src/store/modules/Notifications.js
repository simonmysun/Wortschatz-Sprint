const state = {
    notifications: []
};

// getters
const getters = {
};

// actions
const actions = {
    notify({ commit }, notification) {
        commit('notify', notification);
        setTimeout(function() {
            commit('removeNotification', notification.key);
        }, notification.timeout);
    },
    removeNotification({ commit }, key) {
        commit('removeNotification', key);
    }
}

// mutations
const mutations = {
    notify(state, notification) {
        state.notifications.push(notification);
    },
    removeNotification(state, notificationId) {
        for(let i = state.notifications.length - 1; i >= 0; i -= 1) {
            if(state.notifications[i].key === notificationId) {
                state.notifications.splice(i, 1);
                break;
            }
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
