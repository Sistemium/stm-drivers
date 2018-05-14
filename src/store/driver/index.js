import Vue from 'vue';

const namespaced = true;

export const DRIVER_CHOSEN = 'DRIVER_CHOSEN';

export const SET_CURRENT = 'SET_CURRENT';

function initialState() {
  return {};
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

export default { namespaced, state: initialState, mutations, actions };
