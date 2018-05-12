import Vue from 'vue';
import Vuex from 'vuex';

import * as auth from './auth';

Vue.use(Vuex);

const store = new Vuex.Store({

  state: {
    auth: auth.initial,
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
