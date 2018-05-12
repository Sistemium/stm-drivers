import Vue from 'vue';
import Router from 'vue-router';

import SignInPage from '@/pages/SignInPage';
import tabs from './tabs';
import home from './home';

Vue.use(Router);

export default new Router({

  routes: [
    { path: '*', redirect: '/' },
    { path: '/sign-in', name: 'signIn', component: SignInPage },
    home,
    tabs,
  ],

  scrollBehavior(to, from, savedPosition) {
    if (to.meta.scrollBehavior) {
      const toBehavior = to.meta.scrollBehavior(to, from);
      if (toBehavior) {
        return toBehavior;
      }
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },

});
