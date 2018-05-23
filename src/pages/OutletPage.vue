<template lang="pug">

.outlet-page
  partner-info(:partner-id="id")

</template>

<script>

import PartnerInfo from '@/components/PartnerInfo';

export default {

  name: 'OutletPage',
  components: { PartnerInfo },
  props: ['id'],

};

</script>

<style scoped>

</style>
