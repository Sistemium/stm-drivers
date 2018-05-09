import Vue from 'vue';
import 'es6-promise/auto';

import { Breadcrumb, BreadcrumbItem } from 'element-ui';

import ru from 'element-ui/lib/locale/lang/ru-RU';
import locale from 'element-ui/lib/locale';

import { sync } from 'vuex-router-sync';

import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

import store from './store';
import router from './router';
import App from './App';

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);

Vue.use(Mint);

locale.use(ru);

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

// store.commit('increment');

// eslint-disable-next-line
// console.log(store.state.count);

require('./models');
