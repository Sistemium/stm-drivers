<template lang="pug">

.route-point-details

  .cell-list

    .outlet(v-if="routePoint.outlet")
      mt-cell(
      :title="routePoint.outlet.partner.name"
      :label="routePoint.outlet.address"
      )

    .reached-at(v-if="routePoint.reachedAtLocation")
      mt-cell(
      title="Прибытие отмечено"
      :label="routePoint.reachedAtLocation.timestamp | dateTime"
      )
        i.el-icon-location

  .buttons
    mt-button(type="primary" @click="checkInClick" v-if="!routePoint.isReached") Отметить прибытие

  .section-title Накладные

  .cell-list

    .shipment(v-for="item in routePoint.routePointShipments" :key="item.id")

      mt-cell(
      :title="item.shipment.ndoc"
      :to="{name: 'RoutePointShipmentPage', params: routeParams(item.shipment)}"
      ) {{ item.shipment.totalBoxes() }}

</template>
<script>

import { MessageBox } from 'mint-ui';
import ShipmentRoutePointShipment from '@/models/ShipmentRoutePointShipment';

export default {

  props: ['routePoint'],

  methods: {
    checkInClick() {

      MessageBox({
        title: 'Вопрос',
        message: 'Отметить прибытие в точку?',
        showCancelButton: true,
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет',
      })
        .then(result => {
          this.routePoint.isReached = result === 'confirm';
        });
    },

    routeParams(shipment) {
      return { ...this.$route.params, shipmentId: shipment.id };
    },

    async refresh() {

      await Promise.all(this.routePoint.routePointShipments.map(routePointShipment =>
        routePointShipment.shipment.loadRelations([
          'positions',
          'positions.article',
        ]))).then(this.$loading.show().hide);

      this.$forceUpdate();

    },

  },

  created() {
    ShipmentRoutePointShipment.bind(this);
    this.refresh();
  },

  beforeDestroy() {
    ShipmentRoutePointShipment.unbindAll(this);
  },

  watch: {
    routePoint() {
      this.refresh();
    },
  },

};

</script>
<style scoped lang="scss">

.buttons {
  margin-top: 10px;
}

.el-icon-location {
  font-size: 120%;
  color: lighten(green, 10%);
}

</style>
