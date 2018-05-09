<template lang="pug">

.outlets-page

  h1 Магазины

  outlet-list

</template>
<script>

import OutletList from '@/components/OutletList';

export default {
  components: { OutletList },
  name: 'outlets-page',
};

</script>
<style scoped>

</style>
