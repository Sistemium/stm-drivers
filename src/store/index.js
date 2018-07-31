import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import driver from './driver';

Vue.use(Vuex);

const store = new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production',

  state: {
    busy: false,
  },

  modules: {
    auth,
    driver,
  },

});

export default store;
