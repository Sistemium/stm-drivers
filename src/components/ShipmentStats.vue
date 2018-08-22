<template lang="pug">

.shipment-stats {{ shipment.stats() | routePointStats }}

</template>
<script>

import ShipmentPosition from '@/models/ShipmentPosition';
import Article from '@/models/Article';

export default {

  name: 'ShipmentStats',

  data() {
    return { positions: [] };
  },

  props: { shipment: Object },

  created() {

    // ShipmentPosition.bindAll(this, { shipmentId: this.shipment.id }, 'positions');
    ShipmentPosition.bind(this);
    Article.bind(this);

  },

  beforeDestroy() {
    Article.unbindAll(this);
    ShipmentPosition.unbindAll(this);
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.shipment-stats {
  font-size: small;
}

</style>
