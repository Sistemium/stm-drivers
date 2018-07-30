<template lang="pug">

.route-point-details

  .cell-list

    mt-cell.outlet(
    v-if="routePoint.outlet"
    :title="routePoint.outlet.partner.name"
    :label="routePoint.outlet.address"
    )

    mt-cell.reached-at(
    v-if="routePoint.reachedAtLocation"
    title="Прибытие отмечено"
    :label="routePoint.reachedAtLocation.timestamp | dateTime"
    )
      i.el-icon-location

  .buttons
    mt-button(type="primary" @click="checkInClick" v-if="!routePoint.isReached") Отметить прибытие

  .section-title Накладные

  .cell-list

    mt-cell.shipment(
    v-for="item in routePoint.routePointShipments" :key="item.id"
    :title="item.shipment.ndoc"
    :label="item.shipment.commentText"
    :to="{name: 'RoutePointShipmentPage', params: routeParams(item.shipment)}"
    ) {{ item.shipment.totalBoxes() | boxes }}

</template>
<script>

import { MessageBox } from 'mint-ui';
import getLocation from '@/services/locationHelper';
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

          if (result === 'confirm') {

            getLocation(150, 1000, this.routePoint.id, 'RoutePoint', 10000).then(location => {

              this.routePoint.isReached = true;

              this.routePoint.reachedAtLocationId = location.id;

              this.routePoint.save();

            }).catch(e => {

              const message = e.message || e.error || e.toString();

              MessageBox({
                title: 'Ошибка геолокации',
                message,
                confirmButtonText: 'ОК',
              });

            }).finally(this.$loading.show().hide);

          }

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

.el-icon-location {
  font-size: 120%;
  color: lighten(green, 10%);
}

</style>
