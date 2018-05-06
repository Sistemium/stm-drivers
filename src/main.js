// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import 'es6-promise/auto';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { sync } from 'vuex-router-sync';

import store from './store';
import router from './router';
import App from './App';

Vue.use(ElementUI);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});

sync(store, router);

store.commit('increment');

// eslint-disable-next-line
console.log(store.state.count);
