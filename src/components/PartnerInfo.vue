<template lang="pug">

.partner-info

  p ID: {{ partnerId }}

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
    Partner.find(this.partnerId);
  },

  beforeDestroy() {
    Partner.unbindAll(this);
  },

};

</script>
<style scoped lang="scss">

</style>
