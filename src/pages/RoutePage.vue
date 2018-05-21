<template lang="pug">

.route

  h1 Маршрутные задания

  mt-tab-container(v-if="currentDriver" :value="containerPage")

    mt-tab-container-item#list

      nav-header(
      :prev="prevRoute ? prevClick : undefined"
      :next="nextRoute ? nextClick : undefined"
      :title="title"
      )

      route-point-list(:route="currentRoute")

    mt-tab-container-item#item(v-if="routePoint")

      nav-header(
      :prev="showList"
      :title="`${title} / ${routePoint.ord || '?'}`"
      )

      route-point-details(:route-point="routePoint")

  choose-driver(v-else)

</template>
<script>

import { mapState, mapActions } from 'vuex';

import { SET_CURRENT } from '@/store/driver';

import ChooseDriver from '@/components/ChooseDriver';
import RoutePointList from '@/components/RoutePointList';
import RoutePointDetails from '@/components/RoutePointDetails';

import ShipmentRoute from '@/models/ShipmentRoute';
import ShipmentRoutePoint from '@/models/ShipmentRoutePoint';

export default {

  data() {
    return {
      shipmentRoutes: [],
      currentRoute: undefined,
      nextRoute: undefined,
      prevRoute: undefined,
      routePoint: undefined,
    };
  },

  components: { RoutePointList, ChooseDriver, RoutePointDetails },

  computed: {

    ...mapState('driver', { currentDriver: 'current' }),

    title() {
      if (this.currentRoute) {
        return this.currentRoute.date;
      }
      return this.loading ? 'Загрузка' : 'Нет заданий';
    },

    containerPage() {
      const { id } = this.$route.params;
      return id ? 'item' : 'list';
    },

  },

  watch: {
    currentDriver() {
      this.refresh();
    },
    shipmentRoutes() {
      this.setCurrentRoute();
    },
    containerPage() {
      this.setCurrentRoutePoint();
    },
  },

  methods: {

    ...mapActions('driver', { chooseDriver: SET_CURRENT }),

    prevClick() {
      this.setCurrentRoute(this.prevRoute);
    },

    nextClick() {
      this.setCurrentRoute(this.nextRoute);
    },

    showList() {
      this.$router.push({ name: 'route' });
    },

    setCurrentRoutePoint() {
      const { id } = this.$route.params;
      if (id) {
        this.routePoint = ShipmentRoutePoint.bindOne(this, id, 'routePoint');
        // ShipmentRoutePoint.find(id, { with: ['Location'] });
      }
    },

    setCurrentRoute(route) {

      const { shipmentRoutes } = this;
      this.currentRoute = route || shipmentRoutes[0];

      const idx = shipmentRoutes.indexOf(this.currentRoute);

      this.nextRoute = idx > 0 ? shipmentRoutes[idx - 1] : undefined;
      this.prevRoute = idx >= 0 ? shipmentRoutes[idx + 1] : undefined;

    },

    refresh() {

      const { id: driverId } = this.currentDriver || {};

      if (driverId) {

        const filter = { driverId, orderBy: [['date', 'DESC']] };
        this.shipmentRoutes = ShipmentRoute.bindAll(this, filter, 'shipmentRoutes');

        findAll(filter)
          .then(this.setCurrentRoutePoint)
          .then(this.$loading.show().hide);

      } else {

        ShipmentRoute.unbindAll(this);
        this.shipmentRoutes = [];

      }

    },

  },

  created() {
    this.refresh();
  },

  beforeDestroy() {
    ShipmentRoute.unbindAll(this);
    ShipmentRoutePoint.unbindAll(this);
  },

};

function findAll(filter) {
  return ShipmentRoute.findAll(
    { limit: 5, ...filter },
    { with: ['routePoints', 'routePoints.outlet', 'routePoints.outlet.partner', 'routePoints.reachedAtLocation'] },
  );
}

</script>
<style scoped lang="scss">

</style>
