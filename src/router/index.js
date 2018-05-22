import Vue from 'vue';
import Router from 'vue-router';

import tabs from './tabs';
import home from './home';

Vue.use(Router);

export default new Router({

  routes: [
    { path: '*', redirect: '/' },
    ...home,
    tabs,
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.meta.scrollBehavior) {
      const toBehavior = to.meta.scrollBehavior(to, from);
      if (toBehavior) {
        return toBehavior;
      }
    }
    return { x: 0, y: 0 };
  },

});
