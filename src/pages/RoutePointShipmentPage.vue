<template lang="pug">

.route-point-shipment-page(v-if="shipment")

  nav-header.sticky.secondary(
  left-icon="back"
  :prev="backFromShipment"
  )

    label {{ shipment.ndoc }}

    small.totals
      span {{ shipment.positions.length }}п
      span {{ shipment.totalBoxes() | boxes }}

  shipment-details(:shipment="shipment")

</template>
<script>

import ShipmentDetails from '@/components/ShipmentDetails';
import Shipment from '@/models/Shipment';

import RoutePointPage from './RoutePointPage';

export default {

  name: 'RoutePointShipmentPage',

  props: ['shipmentId'],

  data() {
    return { shipment: null };
  },

  components: { ShipmentDetails },

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
<style scoped>


</style>
