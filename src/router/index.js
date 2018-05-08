import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/pages/HomePage';
import RoutePage from '@/pages/RoutePage';
import OutletsPage from '@/pages/OutletsPage';
import TabsPage from '@/pages/TabsPage';

Vue.use(Router);

const tabs = [
  {
    path: 'route',
    name: 'route',
    component: RoutePage,
    meta: { title: 'Маршрут', img: '/static/images/icons8-to_do.png' },
  },
  {
    path: 'outlets',
    name: 'outlets',
    component: OutletsPage,
    meta: { title: 'Точки', img: '/static/images/icons8-shop.png' },
  },
];

const router = new Router({
  routes: [
    { path: '*', redirect: '/' },
    {
      path: '/',
      component: HomePage,
    },
    {
      path: '/tabs',
      name: 'tabs',
      component: TabsPage,
      redirect: '/tabs/route',
      children: tabs,
      props: { tabs },
    },
  ],
});

export default router;
