<template lang="pug">

.route-point-page

  #RoutePointPage(v-if="isRootState")

    nav-header.title(
    :prev="prevRoutePoint ? prevClick : undefined"
    :next="nextRoutePoint ? nextClick : undefined"
    :title="`Точка маршрута №${routePoint && routePoint.ord || '?'}`"
    )

    route-point-details(v-if="routePoint" :route-point="routePoint")

  router-view(v-else)

</template>
<script>

import ShipmentRoutePoint from '@/models/ShipmentRoutePoint';

import RoutePointDetails from '@/components/RoutePointDetails';

const name = 'RoutePointPage';

export default {

  name,

  props: ['routePointId'],

  data() {
    return { routePoint: null, routePoints: [] };
  },

  components: { RoutePointDetails },

  computed: {
    prevRoutePoint() {
      const { routePoints } = this;
      const idx = this.currentIndex();
      return idx > 0 ? routePoints[idx - 1] : undefined;
    },
    nextRoutePoint() {
      const { routePoints } = this;
      const idx = this.currentIndex();
      return idx < routePoints.length - 1 ? routePoints[idx + 1] : undefined;
    },
    isRootState() {
      return this.$route.name === name;
    },
  },

  methods: {

    currentIndex() {
      const { routePoints } = this;
      return routePoints.indexOf(this.routePoint);
    },

    prevClick() {
      const { id: routePointId } = this.routePoints[this.currentIndex() - 1];
      this.$router.push({ name, params: { routePointId } });
    },

    nextClick() {
      const { id: routePointId } = this.routePoints[this.currentIndex() + 1];
      this.$router.push({ name, params: { routePointId } });
    },

    async rebind() {

      const { routePointId } = this;

      this.routePoint = ShipmentRoutePoint.bindOne(this, routePointId, 'routePoint');

      await ShipmentRoutePoint.find(routePointId, {
        with: [
          'outlet',
          'outlet.partner',
          'reachedAtLocation',
          'routePointPhotos',
          'routePointShipments',
          'routePointShipments.shipment',
        ],
      })
        .then(({ shipmentRouteId }) => ShipmentRoutePoint.findAll({ shipmentRouteId }))
        .then(this.$loading.show().hide);

    },
    onRouteChange(shipmentRouteId) {
      if (!shipmentRouteId) {
        return;
      }
      const filter = { orderBy: [['ord', 'ASC']], shipmentRouteId };
      this.routePoints = ShipmentRoutePoint.bindAll(this, filter, 'routePoints');
    },
  },

  created() {
    this.$watch('routePointId', this.rebind, { immediate: true });
    this.$watch('routePoint.shipmentRouteId', this.onRouteChange, { immediate: true });
  },

  beforeDestroy() {
    ShipmentRoutePoint.unbindAll(this);
  },

};

</script>
<style scoped>

</style>
