<template lang="pug">

.outlet-list.cell-list

  .partner(
  v-for="partner in partners"
  :id="`id-${partner.id}`"
  :key="partner.id"
  )
    mt-cell(
    :label="`Адресов: ${partner.outlets.length}`"
    :title="partner.shortName"
    :to="{name: 'OutletPage', params: {id: partner.id}}"
    is-link
    )

</template>
<script>

import Partner from '@/models/Partner';
// import Outlet from '@/models/Outlet';

export default {

  name: 'outlet-list',

  data() {
    return {
      partners: Partner.bindAll(this, { orderBy: 'shortName' }, 'partners'),
    };
  },

  methods: {},

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
