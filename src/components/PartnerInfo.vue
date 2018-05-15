<template lang="pug">

.partner-info

  .fields
    mt-cell(title="Название" :value="partner.name")
    mt-cell(title="ИНН" :value="partner.inn")

  .section-title Адреса

  .outlets
    mt-cell(
    v-for="outlet in partner.outlets" :key="outlet.id"
    :title="outlet.address"
    )

</template>
<script>

import Partner from '@/models/Partner';

export default {

  props: { partnerId: String },

  data() {
    return {
      partner: Partner.bindOne(this, this.partnerId, 'partner'),
    };
  },

  created() {
    Partner.find(this.partnerId, { with: ['outlets'] });
  },

  beforeDestroy() {
    Partner.unbindAll(this);
  },

};

</script>
<style scoped lang="scss">

</style>
