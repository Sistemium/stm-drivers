import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';

Vue.use(Vuex);

export default new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production',

  state: {
    routePoints: [],
  },

  mutations: {

    gotRoutePoints(state, data) {
      state.routePoints.push(...data);
    },

  },

  modules: {
    auth,
  },

});
