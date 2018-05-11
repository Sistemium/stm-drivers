import Vue from 'vue';

import '@/config/libs';
import '@/styles/index.scss';

import store from './store';
import router from './router';
import App from './App';

import authInit from './services/auth';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});

authInit(store);

// require('./models');
