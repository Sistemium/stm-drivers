<template lang="pug">

.outlets-page

  mt-tab-container(:value='routeState')

    mt-tab-container-item#outlets
      h1 Торговые точки
      outlet-list

    mt-tab-container-item#outlet
      nav-header(title="Клиент" :prev="backClick")
      router-view

</template>
<script>

import OutletList from '@/components/OutletList';

export default {

  components: { OutletList },
  name: 'outlets-page',

  computed: {
    routeState() {
      return this.$route.name;
    },
  },

  methods: {
    backClick() {
      this.$router.push({ name: 'outlets' });
    },
  },

};

</script>
<style scoped lang="scss">

</style>
