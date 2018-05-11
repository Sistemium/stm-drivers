import Vue from 'vue';

import '@/config/libs';
import '@/styles/index.scss';

import store from './store';
import { AUTH_INIT } from './store/auth';
import router from './router';
import App from './App';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    return store.dispatch(AUTH_INIT);
  },
});

// require('./models');
