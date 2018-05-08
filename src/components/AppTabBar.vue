<template lang="pug">

.app-tab-bar

  mt-tabbar(fixed v-model="selected")

    mt-tab-item(v-for="tab in tabs" v-bind:id="tab.name" :key="tab.name")
      img(slot="icon" v-bind:src="tab.meta.img")
      .title {{ tab.title }}

</template>
<script>

import find from 'lodash/find';

export default {

  data() {
    let selected = this.$route.name;
    const { tabs } = this;

    if (!find(tabs, { name: selected })) {
      selected = this.default || tabs[0].name;
      this.$router.replace({ name: selected });
    }

    return { selected };
  },

  components: {},

  props: { tabs: Array },

  watch: {
    selected(item) {
      this.$router.push({ name: item });
    },
  },

};

</script>
<style scoped>

</style>
