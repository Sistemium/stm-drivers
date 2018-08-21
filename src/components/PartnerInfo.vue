<template lang="pug">

.partner-info(v-if="partner")

  .fields
    mt-cell(title="Название" :value="partner.name")
    mt-cell(title="ИНН" :value="partner.inn")

  .section-title Адреса

  .outlets.cell-list
    .outlet(v-for="outlet in partner.outlets" :key="outlet.id")
      mt-cell(
      :title="outlet.address"
      )

</template>
<script>

import Partner from '@/models/Partner';

export default {

  props: { partnerId: String },

  data() {
    return {
      partner: null,
    };
  },

  created() {
    Partner.bindOne(this, this.partnerId, 'partner');
    Partner.find(this.partnerId, { with: ['outlets'] });
  },

  beforeDestroy() {
    Partner.unbindAll(this);
  },

};

</script>
<style scoped lang="scss">

</style>
