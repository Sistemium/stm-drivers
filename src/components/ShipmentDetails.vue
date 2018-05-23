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
      :title="item.articleId"
      ) {{ item.volume }}

</template>
<script>

export default {

  props: ['shipment'],

  methods: {

  },

};

</script>
<style scoped lang="scss">

.buttons {
  margin-top: 10px;
}

</style>
