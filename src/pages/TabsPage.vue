<template lang="pug">

.tabs-page

  bread-crumbs.header

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
<style lang="scss">

.header {

  position: fixed;
  z-index: 1;
  background: white;
  padding: 16px 0;
  width: 100%;
  top: 0;

  .el-breadcrumb {
    font-size: 110%;
    line-height: 1.1;
  }

}

.tab-content {
  overflow-y: scroll;
  margin: 35px 0 55px;
}

</style>
