<template lang="pug">

.choose-driver

  h2 Выберите водителя

  .cell-list
    .driver(v-for="driver in drivers" :key="driver.id")
      mt-cell
        .name(slot="title" @click="chooseDriver(driver)") {{ driver.name }}

</template>
<script>

import { mapState, mapActions } from 'vuex';
import Driver from '@/models/Driver';
import { SET_CURRENT } from '@/store/driver';
import nsDebug from '@/services/debug';

const debug = nsDebug('choose-driver');

export default {

  data() {
    return { drivers: [] };
  },

  computed: mapState('driver', ['current']),

  methods: {
    ...mapActions('driver', { chooseDriver: SET_CURRENT }),
  },

  watch: {
    drivers(data) {
      if (data.length === 1) {
        this.chooseDriver(data[0]);
      }
    },
  },

  async created() {

    const loading = this.$loading.show();

    Driver.bindAll(this, { orderBy: 'name' }, 'drivers');

    try {
      await Driver.findAll();
    } catch (e) {
      debug(e.name, e.message);
    }

    debug('created');
    loading.hide();

  },

  beforeDestroy() {
    Driver.unbindAll(this);
  },

};

</script>
<style scoped lang="scss">

.mint-cell .name {
  padding: 10px 0;
  cursor: pointer;
}

</style>
