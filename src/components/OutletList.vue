<template lang="pug">

.outlet-list.cell-list

  mt-index-list
    mt-index-section(v-for="group in index" :index="group.key" :key="group.key")
      .partner(
      v-for= "partner in group.partners"
      :id="`id-${partner.id}`"
      :key="partner.id"
      )
        mt-cell(
        :label="`Адресов: ${partner.outlets.length}`"
        :title="partner.shortName"
        :to="{name: 'OutletPage', params: {id: partner.id}}"
        )

</template>
<script>

import groupBy from 'lodash/groupBy';
import upperCase from 'lodash/upperCase';
import first from 'lodash/first';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Partner from '@/models/Partner';
// import Outlet from '@/models/Outlet';

export default {

  name: 'outlet-list',

  data() {
    return {
      partners: Partner.bindAll(this, { orderBy: 'shortName' }, 'partners'),
    };
  },

  computed: {
    index() {
      const grouped = groupBy(this.partners, partner => upperCase(first(partner.shortName)));
      return sortBy(map(grouped, (partners, key) => ({ key, partners })), 'key');
    },
  },

  created() {

    loadData()
      .then(this.$loading.show().hide);

    // Outlet.bind(this);

  },

  beforeDestroy() {
    Partner.unbindAll(this);
    // Outlet.unbindAll(this);
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

</style>
