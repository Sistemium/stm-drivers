<template lang="pug">

.outlet-list

  .cell-list(ref="content")

    mt-index-list(v-if="listHeight" :height="listHeight")
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

  props: {
    scrollParentClass: { default: 'tab-content' },
  },

  data() {
    return {
      partners: Partner.bindAll(this, { orderBy: 'shortName' }, 'partners'),
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
    this.$nextTick(this.handleResize);
  },

  methods: {
    handleResize() {
      const scrollParent = document.getElementsByClassName(this.scrollParentClass)[0];
      this.listHeight = scrollParent.clientHeight - this.$refs.content.getBoundingClientRect().top;
    },
  },

  created() {

    loadData()
      .then(this.$loading.show().hide);

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
