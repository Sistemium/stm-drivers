<template lang="pug">

.tabs-page

  h4
    el-breadcrumb(separator-class="el-icon-arrow-right")
      el-breadcrumb-item
        router-link(to="/") Начало
      el-breadcrumb-item {{ currentTabTitle }}

  router-view

  app-tab-bar(:tabs="tabs")

</template>
<script>

import AppTabBar from '@/components/AppTabBar';

export default {

  components: { AppTabBar },

  methods: {
    title() {
      return this.$route.name;
    },
  },

  props: {
    tabs: Array,
  },

  computed: {
    currentTabTitle() {
      const { route } = this.$store.state;
      return route && route.meta.title;
    },
  },

};

</script>
<style scoped>

.el-breadcrumb {
  font-size: 110%;
  line-height: 1.1;
}

</style>
