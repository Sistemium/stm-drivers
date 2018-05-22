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

      route-point-list(:shipment-route="currentRoute")

    mt-tab-container-item#item(v-if="routePoint")

      nav-header(
      :prev="showList"
      :title="`${title} / ${routePoint.ord || '?'}`"
      )

      route-point-details(:route-point="routePoint")

  choose-driver(v-else)

</template>
<script>

import { mapState } from 'vuex';

import find from 'lodash/find';

import ChooseDriver from '@/components/ChooseDriver';
import RoutePointList from '@/components/RoutePointList';
import RoutePointDetails from '@/components/RoutePointDetails';

import ShipmentRoute from '@/models/ShipmentRoute';
import ShipmentRoutePoint from '@/models/ShipmentRoutePoint';

export default {

  props: { routeName: String },

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

    prevClick() {
      this.setCurrentRoute(this.prevRoute);
    },

    nextClick() {
      this.setCurrentRoute(this.nextRoute);
    },

    showList() {
      const { date } = this.$route.params;
      this.$router.push({ name: this.routeName, params: { date } });
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

      const lastDate = this.$route.params.date || this.$store.driver.lastDate;

      this.currentRoute = route || this.routeByDate(lastDate);

      const idx = shipmentRoutes.indexOf(this.currentRoute);

      this.nextRoute = idx > 0 ? shipmentRoutes[idx - 1] : undefined;
      this.prevRoute = idx >= 0 ? shipmentRoutes[idx + 1] : undefined;

      if (this.currentRoute) {
        this.$router.push({
          name: this.$route.name,
          params: { ...this.$route.params, date: this.currentRoute.date },
        });

        // TODO: save date to vuex "driver.lastDate"
      }

    },

    routeByDate(date) {
      return find(this.shipmentRoutes, { date }) || this.shipmentRoutes[0];
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

  beforeRouteUpdate(to, from, next) {

    if (to.name === this.routeName) {
      if (to.params.date !== this.currentRoute.date) {
        this.setCurrentRoute(this.routeByDate(to.params.date));
      }
    }

    next();

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
