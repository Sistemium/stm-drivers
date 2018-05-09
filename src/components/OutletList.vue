<template lang="pug">

.outlet-list
  mt-cell.outlet(
  v-for="partner in partners" :key="partner.id"
  v-bind:title="partner.shortName"
  v-bind:label="`(${partner.outlets.length})`"
  )
    mt-button(v-on:click="deleteClick(partner)" size="small")
      i.el-icon-delete

</template>
<script>

import Partner from '@/models/Partner';

export default {

  name: 'outlet-list',

  data() {
    return { partners: Partner.bindAll(this, { orderBy: 'shortName' }, 'partners') };
  },

  methods: {
    deleteClick(item) {
      // eslint-disable-next-line
      // item.shortName = item.shortName + '-';
      Partner.remove(item);
    },
  },

  created() {
    loadData(this);
  },

  beforeDestroy() {
    Partner.unbind(this);
  },

};

function loadData(vue) {
  return Partner.findAll({ limit: 5, offset: 5 })
    .then((items) => {
      // eslint-disable-next-line
      console.info('findAll found:', items);
      return Promise.all(items.map(partner => partner.loadRelations(['outlets'])))
        .then(() => vue.$forceUpdate());
    });
}

</script>
<style scoped>

</style>
