<template lang="pug">

.choose-driver

  h2 Выберите водителя

  mt-cell(
  v-for="driver in drivers" :key="driver.id"
  )
    span(slot="title" @click="chooseDriver(driver)") {{ driver.name }}

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

  created() {
    const loader = this.$loading.show();
    Driver.findAll()
      .then(loader.hide);
  },

};

</script>
<style scoped lang="scss">

</style>
