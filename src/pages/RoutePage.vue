<template lang="pug">

.route

  h1 Точки маршрута

  .route-points
    .poite-point(v-for='(point, index) in routePoints' :key="point.id")
      mt-cell(
      v-bind:title="point.name"
      v-bind:value="index + 1"
      )

</template>
<script>

import { v4 } from 'uuid';

export default {

  data() {
    return {};
  },

  computed: {
    routePoints() {
      return this.$store.state.routePoints;
    },
  },

  created() {
    setTimeout(() => sampleData(this.$store.commit), 1000);
    this.$store.commit('gotRoutePoints', [
      { id: v4(), name: 'Первая точка' },
      { id: v4(), name: 'Вторая точка' },
    ]);
  },

};


function sampleData(commit) {
  commit('gotRoutePoints', [{ id: v4(), name: 'Четвертая точка' }]);
}


</script>
<style scoped>

h1 {
  /*background: aqua;*/
}

</style>
