<template lang="pug">

.shipment-details

  .cell-list

    mt-cell(
    :title="shipment.outlet.partner.name"
    :label="shipment.outlet.address"
    )

  .section-title Товары

  .cell-list

    .shipment(v-for="item in shipment.positions" :key="item.id")

      mt-cell(
      :title="item.article && item.article.name"
      ) {{ item.volume }}

</template>
<script>

import ShipmentPosition from '@/models/ShipmentPosition';

export default {

  props: { shipment: Object },

  methods: {
    async refresh() {
      if (this.shipment) {
        // await this.shipment.loadRelations(['positions', 'positions.article']);
        const { id: shipmentId } = this.shipment;
        await ShipmentPosition.findAll({ shipmentId })
          .then(positions => positions.map(position => position.loadRelations(['article'])))
          .then(promises => Promise.all(promises))
          .then(this.$loading.show().hide);
        this.$forceUpdate();
      }
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

};

</script>
<style scoped lang="scss">

.buttons {
  margin-top: 10px;
}

</style>
