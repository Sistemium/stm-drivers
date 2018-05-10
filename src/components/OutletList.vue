<template lang="pug">

.outlet-list

  mt-tab-container(v-model="state" :swipeable="true")

    mt-tab-container-item#list
      mt-cell.outlet(
      v-for="partner in partners"
      :key="partner.id"
      :label="`Адресов: ${partner.outlets.length}`"
      :title="partner.shortName"
      :to="{name: 'outlet', params: {id: partner.id}}"
      )
        mt-button(v-on:click="deleteClick(partner)" size="small")
          i.el-icon-delete

    mt-tab-container-item#details
      h2 details
      p
        mt-button(v-on:click="state='list'") Назад

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

  methods: {
    deleteClick(item) {
      Partner.remove(item);
    },
    nameClick(partner) {
      // eslint-disable-next-line
      console.info(partner);
      this.state = 'details';
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
