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
    this.setHeight();
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    setHeight() {
      this.style = { height: `${window.innerHeight}px` };
    },
    handleResize() {
      setTimeout(this.setHeight, 700);
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
