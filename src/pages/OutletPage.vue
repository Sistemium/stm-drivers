<template lang="pug">

.outlet-page
  outlet-info(:outlet-id="$route.params.id")

</template>

<script>

import OutletInfo from '@/components/OutletInfo';

export default {

  name: 'OutletPage',
  components: { OutletInfo },

};

</script>

<style scoped>

</style>
