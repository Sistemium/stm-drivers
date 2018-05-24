<template lang="pug">

.route-point-page

  mt-tab-container(v-if="routePoint" :value="$route.name")

    mt-tab-container-item#RoutePointPage

      nav-header(
      :prev="backFromRoutePoint"
      :title="`Точка маршрута №${routePoint && routePoint.ord || '?'}`"
      )

      route-point-details(v-if="routePoint" :route-point="routePoint")

    mt-tab-container-item#RoutePointShipmentPage

      router-view

</template>
<script>

import ShipmentRoutePoint from '@/models/ShipmentRoutePoint';

import RoutePointDetails from '@/components/RoutePointDetails';
import RoutePage from './RoutePage';

export default {

  name: 'RoutePointPage',

  props: ['routePointId'],

  data() {
    return { routePoint: null };
  },

  components: { RoutePointDetails },

  methods: {
    backFromRoutePoint() {
      const { params } = this.$route;
      this.$router.push({ name: RoutePage.name, params });
    },
    rebind() {
      const { routePointId } = this;
      this.routePoint = ShipmentRoutePoint.bindOne(this, routePointId, 'routePoint');
      return ShipmentRoutePoint.find(routePointId, {
        with: [
          'outlet',
          'outlet.partner',
          'reachedAtLocation',
          'routePointShipments',
          'routePointShipments.shipment',
        ],
      });
    },
  },

  created() {
    this.$watch('routePointId', this.rebind, { immediate: true });
  },

  beforeDestroy() {
    ShipmentRoutePoint.unbindAll(this);
  },

};

</script>
<style scoped>

</style>
