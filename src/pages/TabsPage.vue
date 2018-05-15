<template lang="pug">

.tabs-page

  router-view.tab-content

  app-tab-bar(:tabs="tabs")

</template>
<script>

import AppTabBar from '@/components/AppTabBar';

export default {

  components: { AppTabBar },

  props: { tabs: Array },

};

</script>
<style scoped lang="scss">

.tab-content {
  overflow-y: scroll;
  margin-bottom: 55px;
}

</style>
