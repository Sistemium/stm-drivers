import Vue from 'vue';

// mutations
export const DRIVER_CHOSEN = 'DRIVER_CHOSEN';

// actions
export const SET_CURRENT = 'SET_CURRENT';

function initialState() {
  return { current: null };
}

const mutations = {

  [DRIVER_CHOSEN](state, driver) {
    Vue.set(state, 'current', driver);
  },

};

const actions = {
  [SET_CURRENT]({ commit }, driver = false) {
    commit(DRIVER_CHOSEN, driver);
  },
};

export default { namespaced: true, state: initialState, mutations, actions };
