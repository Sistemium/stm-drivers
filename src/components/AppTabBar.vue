<template lang="pug">

.app-tab-bar

  mt-tabbar(fixed v-model="selected")

    mt-tab-item(v-for="tab in tabs" v-bind:id="tab.name" :key="tab.name")
      img(slot="icon" v-bind:src="tab.meta.img")
      .title {{ tab.meta.title }}

</template>
<script>

import find from 'lodash/find';

export default {

  props: { tabs: Array, default: String },

  data() {

    let selected;
    const { tabs } = this;
    const { matched } = this.$route;

    matched.find(route => {
      selected = find(tabs, { name: route.name });
      return !!selected;
    });

    if (!selected) {
      selected = this.default || tabs[0].name;
      this.$router.replace({ name: selected });
    } else {
      selected = selected.name;
    }

    return { selected };
  },

  watch: {
    selected(item) {
      this.$router.push({ name: item });
    },
  },

};

</script>
<style scoped>

</style>
