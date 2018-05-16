<template lang="pug">

.outlets-page

  .list-state(v-if="routeState === 'list'")
    h1 Торговые точки
    outlet-list

  .details-state(v-if="routeState === 'details'")
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
      return this.$route.params.id ? 'details' : 'list';
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
