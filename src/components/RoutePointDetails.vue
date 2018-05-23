<template lang="pug">

.route-point-details

  .cell-list

    .outlet
      mt-cell(
      :title="routePoint.outlet.partner.name"
      :label="routePoint.outlet.address"
      ) {{ routePoint.ord }}

    .reached-at(v-if="routePoint.reachedAtLocation")
      mt-cell(
      title="Прибытие отмечено"
      :label="routePoint.reachedAtLocation.timestamp"
      )
        i.el-icon-check

  .buttons
    mt-button(type="primary" @click="checkInClick" v-if="!routePoint.isReached") Отметить прибытие

  .section-title Накладные

  .cell-list

    .shipment(v-for="item in routePoint.routePointShipments" :key="item.id")

      mt-cell(
      :title="item.shipment.ndoc"
      :to="{name: 'routePointShipment', params: routeParams(item.shipment)}"
      )

</template>
<script>

import { MessageBox } from 'mint-ui';

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

  },

};

</script>
<style scoped lang="scss">

.buttons {
  margin-top: 10px;
}

</style>
