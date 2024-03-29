import Vue from 'vue';

// mutations
export const OPTIONS = 'OPTIONS';
export const DRIVER_CHOSEN = 'DRIVER_CHOSEN';
export const LAST_DATE = 'LAST_DATE';

// actions
export const SET_OPTIONS = 'SET_OPTIONS';
export const SET_CURRENT = 'SET_CURRENT';
export const SET_DATE = 'SET_DATE';

function initialState() {
  return {
    current: null,
    lastDate: null,
    options: [],
  };
}

const getters = {

  [LAST_DATE](state) {
    return state.lastDate;
  },

};

const mutations = {

  [OPTIONS](state, drivers) {
    Vue.set(state, 'options', drivers);
  },

  [DRIVER_CHOSEN](state, driver) {
    Vue.set(state, 'current', driver);
  },

  [LAST_DATE](state, date) {
    state.lastDate = date;
  },

};

const actions = {

  [SET_OPTIONS]({ commit }, options = []) {
    commit(OPTIONS, options);
  },

  [SET_CURRENT]({ commit }, driver = false) {
    commit(DRIVER_CHOSEN, driver);
  },

  [SET_DATE]({ commit }, date = null) {
    commit(LAST_DATE, date);
  },

};

export default { namespaced: true, state: initialState, mutations, actions, getters };
