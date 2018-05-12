import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';

Vue.use(Vuex);

const store = new Vuex.Store({

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

export default store;
