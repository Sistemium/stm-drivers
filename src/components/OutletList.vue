<template lang="pug">

.outlet-list
  mt-cell.outlet(
  v-for="partner in partners" :key="partner.id"
  v-bind:title="partner.shortName"
  )
    mt-button(v-on:click="deleteClick(partner)")
      i.el-icon-delete

</template>
<script>

import '@/models/Partner';

import store from '@/models';

export default {

  name: 'outlet-list',

  data() {
    return { partners: [] };
  },

  methods: {
    deleteClick(item) {
      // eslint-disable-next-line
      // item.shortName = item.shortName + '-';
      store.remove('partner', item);
    },
    setPartners() {
      this.partners = Object.seal(store.filter('partner', { orderBy: 'shortName' }));
    },
    onPartnerDataChange(name) {
      if (name === 'partner') {
        this.setPartners();
        // eslint-disable-next-line
        console.info('onPartnerDataChange');
      }
    },
  },

  created() {

    this.setPartners();
    loadData();

    store.on('add', this.onPartnerDataChange);
    store.on('remove', this.onPartnerDataChange);

  },

  beforeDestroy() {
    store.off('remove', this.onPartnerDataChange);
    store.off('add', this.onPartnerDataChange);
  },

};

function loadData() {
  return store.findAll('partner', { limit: 5, offset: 5 }, { force: true, with: ['outlets'] })
    .then((items) => {
      // eslint-disable-next-line
      console.info('findAll found:', items);
    });
}

</script>
<style scoped>

</style>
