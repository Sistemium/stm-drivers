<template lang="pug">

.choose-driver

  h2 Выберите водителя

  mt-cell(
  v-for="driver in drivers" :key="driver.id"
  )
    .name(slot="title" @click="chooseDriver(driver)") {{ driver.name }}

</template>
<script>

import { mapState, mapActions } from 'vuex';
import Driver from '@/models/Driver';
import { SET_CURRENT } from '@/store/driver';

export default {

  data() {
    return { drivers: Driver.bindAll(this, { orderBy: 'name' }, 'drivers') };
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

  created() {
    Driver.findAll()
      .then(this.$loading.show().hide);
  },

};

</script>
<style scoped lang="scss">

.mint-cell .name {
  padding: 10px 0;
  cursor: pointer;
}

</style>
