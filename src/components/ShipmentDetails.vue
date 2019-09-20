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
    ) {{ item.volume | boxPcs(item.article) }}

</template>
<script>

import ShipmentPosition from '@/models/ShipmentPosition';
import log from '@/services/debug';

const { error } = log('ShipmentDetails');

export default {

  props: { shipment: Object },

  data() {
    return { positions: [] };
  },

  methods: {
    refresh() {
      this.loadData().catch(error);
    },

    async loadData() {
      const { shipment } = this;

      if (!shipment) {
        return;
      }

      const loading = this.$loading.show();

      try {
        await shipment.loadRelations(['positions', 'positions.article']);
      } catch (e) {
        error('loadRelations', e.message);
      }

      loading.hide();

      const filter = { shipmentId: shipment.id, orderBy: [['article.name', 'ASC']] };
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
