<template lang="pug">

.route-point-details

  .cell-list

    mt-cell(
    :title="routePoint.outlet.partner.name"
    :label="routePoint.outlet.address"
    ) {{ routePoint.ord }}

    mt-cell(
    v-if="routePoint.reachedAtLocation"
    title="Прибытие отмечено"
    :label="routePoint.reachedAtLocation.timestamp"
    )
      i.el-icon-check

  .buttons
    mt-button(type="primary" @click="checkInClick" v-if="!routePoint.isReached") Отметить прибытие

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
  },

};

</script>
<style scoped lang="scss">

.buttons {
  margin-top: 10px;
}

</style>
