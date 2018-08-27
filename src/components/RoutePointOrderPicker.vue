<template lang="pug">

.route-point-order-picker

  nav-header.root-nav(
  left-icon="back"
  :prev="cancelClick"
  ) Раскладка

  mt-cell.outlet(
  v-if="outlet()"
  :title="outlet().partner.name"
  :label="outlet().address"
  )

  .section-title
    small Укажите порядновый номер точки в маршруте

  mt-picker(
  :slots="slots" @change="onValuesChange"
  :visible-item-count="7"
  )

  .buttons

    mt-button(
    type="primary"
    @click="doneClick"
    ) Готово

</template>
<script>

import range from 'lodash/range';
import nsDebug from '@/services/debug';

const NAME = 'RoutePointOrderPicker';
const debug = nsDebug(NAME);

export default {

  name: NAME,

  data() {
    return { order: 0 };
  },

  props: { count: Number, routePoint: Object, onDone: Function },

  computed: {
    slots() {

      return [
        {
          flex: 1,
          values: range(1, this.count + 1, 1),
          className: 'slot1',
          textAlign: 'center',
          defaultIndex: this.routePoint.ord - 1,
        },
      ];
    },
  },

  watch: {
    routePoint(routePoint) {
      debug('watch', routePoint.ord);
    },
  },

  methods: {
    onValuesChange(ev) {
      this.order = ev.getSlotValue(0);
      debug('onValuesChange', this.order);
    },
    outlet() {
      return this.routePoint.outlet;
    },
    doneClick() {
      this.onDone(this.order);
    },
    cancelClick() {
      this.onDone(false);
    },
  },

  created() {
    this.order = this.routePoint.ord;
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

</style>
