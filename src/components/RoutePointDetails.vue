<template lang="pug">

.route-point-details

  .cell-list
    mt-cell(
    :title="routePoint.outlet.partner.name"
    :label="routePoint.outlet.address"
    ) {{ routePoint.ord }}

  .buttons
    mt-button(type="primary" @click="checkInClick") Отметить прибытие

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
