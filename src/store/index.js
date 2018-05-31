import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import driver from './driver';
import Workflow from '../models/Workflow';
import { AUTHORIZED } from './auth/mutations';

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

store.subscribe(action => {
  if (action.type.endsWith(AUTHORIZED)) {

    Workflow.findAll();

  }
});


export default store;
