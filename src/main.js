import Vue from 'vue';
import 'es6-promise/auto';

// import { sync } from 'vuex-router-sync';

import '@/config/libs';

import store from './store';
import router from './router';
import App from './App';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});

// sync(store, router);

require('./models');
