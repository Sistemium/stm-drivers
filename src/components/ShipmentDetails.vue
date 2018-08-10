<template lang="pug">

.shipment-details(v-if="shipment.outlet")

  .cell-list

    mt-cell#outlet(
    :title="shipment.outlet.partner.name"
    :label="shipment.outlet.address"
    )

  .section-title Товары

  .cell-list.shipment-positions

    mt-cell.shipment(
    v-for="item in positions" :key="item.id"
    :title="item.article && item.article.name"
    ) {{ item.volume | boxPcs(item.article.packageRel) }}

</template>
<script>

import ShipmentPosition from '@/models/ShipmentPosition';

export default {

  props: { shipment: Object },

  data() {
    return { positions: [] };
  },

  methods: {
    refresh() {

      const { shipment } = this;

      if (!shipment) {
        return;
      }

      const filter = { shipmentId: shipment.id, orderBy: [['article.name', 'ASC']] };

      const { hide } = this.$loading.show();

      this.shipment.loadRelations(['positions', 'positions.article'])
        .finally(hide);

      this.positions = ShipmentPosition.bindAll(this, filter, 'positions');

      this.$forceUpdate();

    },
  },

  watch: {
    shipment() {
      this.refresh();
    },
  },

  created() {
    this.refresh();
  },

  beforeDestroy() {
    ShipmentPosition.unbindAll(this);
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.buttons {
  margin-top: 10px;
}

.mint-cell-text strong {
  margin-right: $margin-right;
}

#outlet {
  border-top: none;
}

</style>
