<template lang="pug">

.outlets-page

  .list-state(v-if="routeState === 'list'")
    h1 Торговые точки
    outlet-list

  .details-state(v-if="routeState === 'details'")
    h1.has-button-left
      router-link.page-back(:to="{name: 'outlets'}")
        i.mintui.mintui-back
      span Клиент
    router-view

</template>
<script>

import OutletList from '@/components/OutletList';

export default {

  components: { OutletList },
  name: 'outlets-page',

  computed: {
    routeState() {
      return this.$route.params.id ? 'details' : 'list';
    },
  },

};

</script>
<style scoped lang="scss">
@import "../styles/variables";

h1 {
  margin-top: 0;
}

h1.has-button-left {

  display: flex;
  align-items: center;

  > span {
    flex: 1;
    margin-right: $icon-button-width;
    text-align: center;
    margin-left: auto;
  }

  button.back {
    display: block;
    margin-left: 1px;
  }

}

</style>
