import RoutePage from '@/pages/RoutePage';
import MyAccountPage from '@/pages/MyAccountPage';
import OutletsPage from '@/pages/OutletsPage';
import TabsPage from '@/pages/TabsPage';
import OutletPage from '@/pages/OutletPage';

const tabs = [
  {
    path: 'profile',
    name: 'profile',
    component: MyAccountPage,
    meta: { title: 'Профиль', img: '/static/images/icons8-home.png' },
  },
  {
    path: 'route/:date?',
    name: 'route',
    component: RoutePage,
    props: { routeName: 'route' },
    meta: { title: 'Маршрут', img: '/static/images/icons8-to_do.png' },
    children: [
      { name: 'routePoint', path: 'routePoint/:id' },
    ],
  },
  {
    path: 'outlets',
    name: OutletsPage.name,
    component: OutletsPage,
    meta: {
      title: 'Клиенты',
      img: '/static/images/icons8-shop.png',
      scrollBehavior(to, from) {
        if (from.params.id) {
          return {
            selector: `#id-${from.params.id}`,
            offset: { x: 0, y: 100 },
          };
        }
        return false;
      },
    },
    children: [
      { path: ':id', name: OutletPage.name, component: OutletPage, meta: { title: 'Подробности' } },
    ],
  },
];

export default {
  path: '/tabs',
  name: 'tabs',
  component: TabsPage,
  // 'route' is default tab
  redirect: '/tabs/route',
  children: tabs,
  props: { tabs },
};
