<template lang="pug">

.tabs-page

  .header
    el-breadcrumb(separator-class="el-icon-arrow-right")
      el-breadcrumb-item
        router-link(to="/") Начало
      el-breadcrumb-item(v-for='parent in parents' :key="parent.id")
        router-link(:to="{name: parent.to}") {{ parent.title }}
      el-breadcrumb-item {{ currentTabTitle }}

  router-view.tab-content

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
      return this.$route && this.$route.meta.title;
    },

    parents() {

      const crumbs = [];

      for (let i = 0; i < this.$route.matched.length - 1; i += 1) {
        const parent = this.$route.matched[i];
        if (parent.meta.title) {
          crumbs.push({
            id: parent.name,
            title: parent.meta.title,
            to: parent.name,
          });
        }
      }

      return crumbs;

    },

  },

};

</script>
<style scoped>

.header {
  position: fixed;
  z-index: 1;
  background: white;
  padding: 16px 0;
  width: 100%;
  top: 0;
  /*left: 0;*/
}

.tab-content {
  overflow-y: scroll;
  margin: 35px 0 55px;
}

.el-breadcrumb {
  font-size: 110%;
  line-height: 1.1;
}

</style>
