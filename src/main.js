import Vue from 'vue';

import '@/config/libs';
import '@/config/global-components';
import '@/config/filters';

import '@/styles/index.scss';

import App from './App';
import router from './router';
import store from './store';
import './config/subscriptions';
import './config/errors';

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
