<template lang="pug">

.route

  h1 Маршрутные задания

  mt-tab-container(v-if="currentDriver" :value="currentRouteName")

    mt-tab-container-item#RoutePage

      nav-header(
      :prev="prevRoute ? prevClick : undefined"
      :next="nextRoute ? nextClick : undefined"
      :title="title"
      )

      route-point-list(:shipment-route="currentRoute")

    mt-tab-container-item#routePoint(v-if="routePoint")

      nav-header(
      :prev="backFromRoutePoint"
      :title="`${title} / ${routePoint.ord || '?'}`"
      )

      route-point-details(:route-point="routePoint")

    mt-tab-container-item#routePointShipment(v-if="shipment")

      nav-header(
      :prev="backFromShipment"
      :title="shipment.ndoc"
      )

      shipment-details(:shipment="shipment")

  choose-driver(v-else)

</template>
<script>

import { mapState, mapActions, mapGetters } from 'vuex';
import { SET_DATE, LAST_DATE } from '@/store/driver';

import find from 'lodash/find';

import ChooseDriver from '@/components/ChooseDriver';
import RoutePointList from '@/components/RoutePointList';
import RoutePointDetails from '@/components/RoutePointDetails';
import ShipmentDetails from '@/components/ShipmentDetails';

import ShipmentRoute from '@/models/ShipmentRoute';
import ShipmentRoutePoint from '@/models/ShipmentRoutePoint';
import Shipment from '@/models/Shipment';

const name = 'RoutePage';

export default {

  name,

  data() {
    return {
      shipmentRoutes: [],
      currentRoute: undefined,
      nextRoute: undefined,
      prevRoute: undefined,
      routePoint: undefined,
      shipment: undefined,
    };
  },

  components: { RoutePointList, ChooseDriver, RoutePointDetails, ShipmentDetails },

  computed: {

    ...mapState('driver', { currentDriver: 'current' }),
    ...mapGetters('driver', [LAST_DATE]),

    title() {
      if (this.currentRoute) {
        return this.currentRoute.date;
      }
      return this.loading ? 'Загрузка' : 'Нет заданий';
    },

    currentRouteName() {
      return this.$route.name;
    },

  },

  watch: {
    currentDriver() {
      this.refresh();
    },
    shipmentRoutes() {
      this.setCurrentRoute();
    },
    currentRouteName() {
      this.setCurrentRoutePointAndShipment();
    },
  },

  methods: {

    ...mapActions('driver', { setLastDate: SET_DATE }),

    prevClick() {
      this.setCurrentRoute(this.prevRoute);
    },

    nextClick() {
      this.setCurrentRoute(this.nextRoute);
    },

    backFromRoutePoint() {
      const { params } = this.$route;
      this.$router.push({ name, params });
    },

    backFromShipment() {
      const { params } = this.$route;
      this.$router.push({ name: 'routePoint', params });
    },

    setCurrentRoutePointAndShipment() {
      const { id, shipmentId } = this.$route.params;

      if (shipmentId) {

        this.shipment = Shipment.bindOne(this, shipmentId, 'shipment');

      }

      if (id) {
        this.routePoint = ShipmentRoutePoint.bindOne(this, id, 'routePoint');
        // ShipmentRoutePoint.find(id, { with: ['Location'] });
      }
    },

    setCurrentRoute(route) {

      const { shipmentRoutes } = this;

      const lastDate = this.$route.params.date || this[LAST_DATE];

      this.currentRoute = route || this.routeByDate(lastDate);

      const idx = shipmentRoutes.indexOf(this.currentRoute);

      this.nextRoute = idx > 0 ? shipmentRoutes[idx - 1] : undefined;
      this.prevRoute = idx >= 0 ? shipmentRoutes[idx + 1] : undefined;

      if (this.currentRoute) {
        this.$router.push({
          name: this.$route.name,
          params: { ...this.$route.params, date: this.currentRoute.date },
        });

        this.setLastDate(this.currentRoute.date);

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
          .then(this.setCurrentRoutePointAndShipment)
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
    Shipment.unbindAll(this);
  },

  beforeRouteUpdate(to, from, next) {

    if (to.name === name) {
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
    {
      with: [
        'routePoints', 'routePoints.outlet', 'routePoints.outlet.partner',
        'routePoints.reachedAtLocation', 'routePoints.routePointShipments',
        'routePoints.routePointShipments.shipment',
      ],
    },
  );
}

</script>
<style scoped lang="scss">

</style>
