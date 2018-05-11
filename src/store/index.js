import Vue from 'vue';
import Vuex from 'vuex';

import * as auth from './auth';

Vue.use(Vuex);

const store = new Vuex.Store({

  state: {
    auth: {},
    routePoints: [],
  },

  mutations: {

    gotRoutePoints(state, data) {
      state.routePoints.push(...data);
    },

    ...auth.mutations,

  },

  actions: {
    ...auth.actions,
  },

});

export default store;
