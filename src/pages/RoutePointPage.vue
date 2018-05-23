<template lang="pug">

.route-point-page

  nav-header(
  :prev="backFromRoutePoint"
  :title="`Точка маршрута №${routePoint ? routePoint.ord : '?'}`"
  )

  route-point-details(v-if="routePoint" :route-point="routePoint")

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
      this.routePoint = ShipmentRoutePoint.bindOne(this, this.routePointId, 'routePoint');
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
