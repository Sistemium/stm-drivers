<template lang="pug">

.outlet-list

  .cell-list(ref="content")

    mt-index-list(v-if="listHeight" :height="listHeight")
      mt-index-section(v-for="group in index" :index="group.key" :key="group.key")
        mt-cell.partner(
        v-for= "partner in group.partners"
        :id="`id-${partner.id}`"
        :key="partner.id"
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

  props: {
    scrollParentClass: { default: 'tab-content' },
  },

  data() {
    return {
      partners: [],
      listHeight: null,
    };
  },

  computed: {
    index() {
      const grouped = groupBy(this.partners, partner => upperCase(first(partner.shortName)));
      return sortBy(map(grouped, (partners, key) => ({ key, partners })), 'key');
    },
  },

  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.$nextTick(this.setHeight);
  },

  methods: {
    handleResize() {
      setTimeout(this.setHeight, 700);
    },
    setHeight() {
      const scrollParent = document.getElementsByClassName(this.scrollParentClass)[0];
      const { top } = this.$refs.content.getBoundingClientRect();
      this.listHeight = scrollParent.clientHeight - top;
    },
  },

  created() {

    Partner.bindAll(this, { orderBy: 'shortName' }, 'partners');

    const loading = this.$loading.show();

    loadData()
      .finally(() => loading.hide());

  },

  beforeDestroy() {
    Partner.unbindAll(this);
    window.removeEventListener('resize', this.handleResize);
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

.cell-list {
  /* to match ui-mint index nav left-border */
  border-top: solid 1px #ddd;
}

</style>
