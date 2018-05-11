import Vue from 'vue';

import '@/config/libs';

import '@/styles/index.scss';

import store from './store';
import router from './router';
import App from './App';


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
