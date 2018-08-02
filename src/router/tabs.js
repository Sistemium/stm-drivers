import RoutePage from '@/pages/RoutePage';
import RoutePointPage from '@/pages/RoutePointPage';
import MyAccountPage from '@/pages/MyAccountPage';
import OutletsPage from '@/pages/OutletsPage';
import TabsPage from '@/pages/TabsPage';
import OutletPage from '@/pages/OutletPage';
import RoutePointShipmentPage from '@/pages/RoutePointShipmentPage';

const tabs = [
  {
    path: 'profile',
    name: 'profile',
    component: MyAccountPage,
    meta: { title: 'Профиль', img: '/static/images/icons8-home.png' },
  },
  {
    path: 'route/:date?',
    name: RoutePage.name,
    component: RoutePage,
    meta: { title: 'Маршруты', img: '/static/images/icons8-to_do.png' },
    children: [
      {
        path: 'routePoint/:routePointId',
        name: RoutePointPage.name,
        component: RoutePointPage,
        props: true,
        children: [{
          path: 'shipment/:shipmentId',
          name: RoutePointShipmentPage.name,
          component: RoutePointShipmentPage,
          props: true,
        }],
      },
    ],
  },
  {
    path: 'outlets',
    name: OutletsPage.name,
    component: OutletsPage,
    meta: {
      title: 'Клиенты',
      img: '/static/images/icons8-shop.png',
    },
    children: [
      {
        path: ':id',
        name: OutletPage.name,
        component: OutletPage,
        meta: { title: 'Подробности' },
        props: true,
      },
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
