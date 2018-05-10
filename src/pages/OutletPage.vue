<template lang="pug">

.outlet-page
  partner-info(:partner-id="$route.params.id")

</template>

<script>

import PartnerInfo from '@/components/PartnerInfo';

export default {

  name: 'OutletPage',
  components: { PartnerInfo },

};

</script>

<style scoped>

</style>
