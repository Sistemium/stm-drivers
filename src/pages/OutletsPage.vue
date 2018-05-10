<template lang="pug">

.outlets-page

  .list-state(v-if="routeState === 'list'")
    h1 Торговые точки
    outlet-list

  .details-state(v-if="routeState === 'details'")
    h1
      router-link.page-back(:to="{name: 'outlets'}")
        i.mintui.mintui-back
      span Торговая точка
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

h1 {


  > span {
    margin-left: 15px;
  }


  button.back {
    display: block;
    margin-left: 1px;
  }

}


</style>
