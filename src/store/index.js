import Vue from 'vue';
import Vuex from 'vuex';

import * as m from './mutations';

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

    [m.AUTHORIZATION](state, data) {
      state.auth = data;
    },

    [m.AUTHORIZING](state) {
      state.auth.busy = true;
    },

    [m.NOT_AUTHORIZED](state, error) {
      state.auth = { error };
    },

  },

});

export default store;
