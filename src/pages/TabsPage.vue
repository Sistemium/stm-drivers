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

.tabs-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.tab-content {
  overflow-y: scroll;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}

</style>
