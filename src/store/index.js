import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({

  state: {
    count: 0,
    routePoints: [],
  },

  mutations: {

    increment(state) {
      state.count += 1;
    },

    gotRoutePoints(state, data) {
      state.routePoints.push(...data);
    },

  },

});

export default store;
