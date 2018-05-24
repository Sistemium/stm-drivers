<template lang="pug">

.outlets-page

  h1 Торговые точки

  outlet-list(v-if="$route.name === 'OutletsPage'")

  .outlet-page(v-else)
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
