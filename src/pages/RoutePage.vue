<template lang="pug">

.route

  h1 Точки маршрута

  route-point-list

</template>
<script>

import v4 from 'uuid/v4';
import RoutePointList from '@/components/RoutePointList';

export default {

  created() {
    setTimeout(() => sampleData(this.$store.commit), 1000);
    this.$store.commit('gotRoutePoints', [
      { id: v4(), name: 'Первая точка' },
      { id: v4(), name: 'Вторая точка' },
    ]);
  },

  components: { RoutePointList },

};


function sampleData(commit) {
  commit('gotRoutePoints', [{ id: v4(), name: 'Четвертая точка' }]);
}

</script>
<style scoped>

</style>
