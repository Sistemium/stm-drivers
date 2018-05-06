import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/pages/HomePage';
import RoutePage from '@/pages/RoutePage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: HomePage,
    },
    {
      path: '/route',
      component: RoutePage,
    },
  ],
});
