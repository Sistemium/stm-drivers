<template lang="pug">

.chosen-driver

  mt-cell(v-if="current" :title="current.name" label="В роли водителя")
    mt-button(size="small" @click="chooseDriver(null)") Сменить

  choose-driver(v-else)

</template>
<script>

import { mapState, mapActions } from 'vuex';
import { SET_CURRENT } from '@/store/driver';

import ChooseDriver from './ChooseDriver';

export default {

  components: { ChooseDriver },
  computed: mapState('driver', ['current']),
  methods: mapActions('driver', { chooseDriver: SET_CURRENT }),

};

</script>
<style scoped lang="scss">

</style>
