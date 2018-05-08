import Vue from 'vue';
import 'es6-promise/auto';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/ru-RU';

import { sync } from 'vuex-router-sync';

import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

import store from './store';
import router from './router';
import App from './App';

Vue.use(ElementUI, locale);
Vue.use(Mint);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});

sync(store, router);

store.commit('increment');

// eslint-disable-next-line
console.log(store.state.count);
