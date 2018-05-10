<template lang="pug">

.outlet-list

  mt-cell.outlet(
  v-for="partner in partners"
  :key="partner.id"
  :title="partner.shortName"
  :label="`Адресов: ${partner.outlets.length}`"
  )
    mt-button(v-on:click="deleteClick(partner)" size="small")
      i.el-icon-delete

</template>
<script>

import Partner from '@/models/Partner';
import Outlet from '@/models/Outlet';

export default {

  name: 'outlet-list',

  data() {
    return {
      partners: Partner.bindAll(this, { orderBy: 'shortName' }, 'partners'),
    };
  },

  methods: {
    deleteClick(item) {
      Partner.remove(item);
    },
  },

  created() {
    const loader = this.$loading.show();
    loadData()
      .then(() => loader.hide());
    Outlet.bind(this);
  },

  beforeDestroy() {
    Partner.unbindAll(this);
    Outlet.unbindAll(this);
  },

};

function loadData() {
  return Partner.findAll({ limit: 50, offset: 0 }, {
    // with: ['outlets']
  })
    .then((items) => {
      // eslint-disable-next-line
      console.info('findAll found:', items);
      return Promise.all(items.map(partner => partner.loadRelations(['outlets'])));
    });
}

</script>
<style scoped>

</style>
