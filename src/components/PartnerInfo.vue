<template lang="pug">

.partner-info

  .fields
    mt-field(label="Название" v-model="partner.name")
    mt-field(label="ИНН" v-model="partner.inn")

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

  name: 'PartnerInfo',

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

h2 {
  text-align: center;
}

</style>
