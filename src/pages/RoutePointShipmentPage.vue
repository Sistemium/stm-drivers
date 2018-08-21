<template lang="pug">

.route-point-shipment-page(v-if="shipment")

  nav-header.sticky.secondary(
  left-icon="back"
  :prev="backFromShipment"
  )

    b {{ shipment.ndoc }}

    small.totals {{ totalsLabel }}

  shipment-details(:shipment="shipment")

</template>
<script>

import Vue from 'vue';
import ShipmentDetails from '@/components/ShipmentDetails';
import Shipment from '@/models/Shipment';

import RoutePointPage from './RoutePointPage';

const routePointStats = Vue.filter('routePointStats');

export default {

  name: 'RoutePointShipmentPage',

  props: ['shipmentId'],

  data() {
    return { shipment: null };
  },

  computed: {
    totalsLabel() {
      const { shipment, $options: { filters } } = this;
      if (!shipment) {
        return 'Загрузка ...';
      }
      return `${routePointStats(shipment.stats())} ${filters.boxes(shipment.totalBoxes())}`;
    },
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
<style scoped lang="scss">

@import "../styles/variables";

.totals {
  color: $black;
}

</style>
