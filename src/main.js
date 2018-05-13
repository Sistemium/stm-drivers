import Vue from 'vue';

import '@/config/libs';
import '@/styles/index.scss';

import App from './App';
import router from './router';
import store from './store';

import { AUTH_INIT } from './store/auth/actions';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    return store.dispatch(`auth/${AUTH_INIT}`);
  },
});

// require('./models');
