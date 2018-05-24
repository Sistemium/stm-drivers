<template lang="pug">

.outlets-page

  h1 Торговые точки

  mt-tab-container(:value='$route.name')

    mt-tab-container-item#OutletsPage
      outlet-list

    mt-tab-container-item#OutletPage
      nav-header(title="Клиент" :prev="backClick")
      router-view

</template>
<script>

import OutletList from '@/components/OutletList';

const name = 'OutletsPage';

export default {

  components: { OutletList },
  name,

  methods: {
    backClick() {
      this.$router.push({ name });
    },
  },

};

</script>
<style scoped lang="scss">

</style>
