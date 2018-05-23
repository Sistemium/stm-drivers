<template lang="pug">

.route

  h1 Маршрутные задания

  mt-tab-container(v-if="currentDriver" :value="$route.name")

    mt-tab-container-item#RoutePage

      nav-header(
      :prev="prevRoute ? prevClick : undefined"
      :next="nextRoute ? nextClick : undefined"
      :title="title"
      )

      route-point-list(v-if="currentRoute" :shipment-route-id="currentRoute.id")

    mt-tab-container-item#routePoint

      router-view

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

import { dateFormat } from '@/config/moments';

import ChooseDriver from '@/components/ChooseDriver';
import RoutePointList from '@/components/RoutePointList';
import ShipmentDetails from '@/components/ShipmentDetails';

import ShipmentRoute from '@/models/ShipmentRoute';
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
      shipment: undefined,
    };
  },

  components: { RoutePointList, ChooseDriver, ShipmentDetails },

  computed: {

    ...mapState('driver', { currentDriver: 'current' }),
    ...mapGetters('driver', [LAST_DATE]),

    title() {
      if (this.currentRoute) {
        return dateFormat(this.currentRoute.date);
      }
      return this.loading ? 'Загрузка' : 'Нет заданий';
    },

  },

  watch: {
    currentDriver() {
      this.refresh();
    },
    shipmentRoutes() {
      this.setCurrentRoute();
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

    backFromShipment() {
      const { params } = this.$route;
      this.$router.push({ name: 'routePoint', params });
    },

    setCurrentRoutePointAndShipment(params) {
      const { shipmentId } = params || this.$route.params;

      if (shipmentId) {

        this.shipment = Shipment.bindOne(this, shipmentId, 'shipment');

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

    async refresh() {

      const { id: driverId } = this.currentDriver || {};

      if (driverId) {

        const filter = { driverId, orderBy: [['date', 'DESC']] };
        this.shipmentRoutes = ShipmentRoute.bindAll(this, filter, 'shipmentRoutes');

        await ShipmentRoute.findAll({ limit: 50, ...filter })
          .then(this.$loading.show().hide);

        this.setCurrentRoutePointAndShipment();

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
    Shipment.unbindAll(this);
  },

  beforeRouteUpdate(to, from, next) {

    if (to.name === name) {
      if (to.params.date !== this.currentRoute.date) {
        this.setCurrentRoute(this.routeByDate(to.params.date));
      }
    }

    this.setCurrentRoutePointAndShipment(to.params);

    next();

  },

};


</script>
<style scoped lang="scss">

</style>
