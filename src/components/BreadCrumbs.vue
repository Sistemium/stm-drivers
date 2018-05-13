<template lang="pug">

.bread-crumbs
  el-breadcrumb(separator-class="el-icon-arrow-right")
    el-breadcrumb-item
      router-link(to="/") Начало
    el-breadcrumb-item(v-for='parent in parents' :key="parent.id")
      router-link(:to="{name: parent.to}") {{ parent.title }}
    el-breadcrumb-item {{ currentTabTitle }}

</template>
<script>

export default {

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
<style scoped lang="scss">

</style>
