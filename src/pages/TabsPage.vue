<template lang="pug">

.tabs-page

  bread-crumbs.top-header

  router-view.tab-content

  app-tab-bar(:tabs="tabs")

</template>
<script>

import AppTabBar from '@/components/AppTabBar';
import BreadCrumbs from '@/components/BreadCrumbs';

export default {

  components: { BreadCrumbs, AppTabBar },

  props: {
    tabs: Array,
  },

};

</script>
<style scoped lang="scss">

.tab-content {
  overflow-y: scroll;
  margin-bottom: 55px;
}

</style>
