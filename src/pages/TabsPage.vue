<template lang="pug">

.tabs-page(:style="style")

  router-view.tab-content

  app-tab-bar(:tabs="tabs")

</template>
<script>

import AppTabBar from '@/components/AppTabBar';

export default {

  components: { AppTabBar },

  props: { tabs: Array },

  data() {
    return { style: {} };
  },

  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      const height = `${window.innerHeight}px`;
      this.style = { height };
    },
  },

};

</script>
<style scoped lang="scss">

.tabs-page {
  display: flex;
  flex-direction: column;
}

.tab-content {
  overflow-y: scroll;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}

</style>
