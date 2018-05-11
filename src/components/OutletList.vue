<template lang="pug">

.outlet-list

  mt-cell(
  v-for="partner in partners"
  :key="partner.id"
  :label="`Адресов: ${partner.outlets.length}`"
  :title="partner.shortName"
  :to="{name: 'outlet', params: {id: partner.id}}"
  is-link
  )

</template>
<script>

import Partner from '@/models/Partner';
import Outlet from '@/models/Outlet';

export default {

  name: 'outlet-list',

  data() {
    return {
      partners: Partner.bindAll(this, { orderBy: 'shortName' }, 'partners'),
      state: 'list',
    };
  },

  methods: {},

  created() {

    const loader = this.$loading.show();
    loadData().then(() => loader.hide());

    Outlet.bind(this);

  },

  beforeDestroy() {
    Partner.unbindAll(this);
    Outlet.unbindAll(this);
  },

};

function loadData() {
  return Partner.findAll({
    limit: 50, offset: 0,
  }, {
    with: ['outlets'],
  });
}

</script>
<style scoped>

.name {
  cursor: pointer;
}

</style>
