<template lang="pug">

.route-point-shipment-page(v-if="shipment")

  nav-header.sticky.secondary(
  left-icon="back"
  :prev="backFromShipment"
  )

    b {{ shipment.ndoc }}
    shipment-stats(:shipment="shipment")

  shipment-details(:shipment="shipment")

</template>
<script>

// import Vue from 'vue';
import ShipmentDetails from '@/components/ShipmentDetails';
import ShipmentStats from '@/components/ShipmentStats';
import Shipment from '@/models/Shipment';

import RoutePointPage from './RoutePointPage';

// const routePointStats = Vue.filter('routePointStats');

export default {

  name: 'RoutePointShipmentPage',

  props: ['shipmentId'],

  data() {
    return { shipment: null };
  },

  components: { ShipmentDetails, ShipmentStats },

  methods: {
    backFromShipment() {
      const { params } = this.$route;
      this.$router.push({ name: RoutePointPage.name, params });
    },
    rebind() {
      this.shipment = Shipment.bindOne(this, this.shipmentId, 'shipment');
    },
  },

  created() {
    this.$watch('shipmentId', this.rebind, { immediate: true });
  },

  beforeDestroy() {
    Shipment.unbindAll(this);
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.totals {
  color: $black;
}

</style>
