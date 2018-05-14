import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import driver from './driver';

Vue.use(Vuex);

export default new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production',

  state: {
    busy: false,
  },

  modules: {
    auth,
    driver,
  },

});
