<template lang="pug">

.route

  h1 Точки маршрута

  .route-points
    .poite-point(v-for='(point, index) in routePoints')
      mt-cell(
      v-bind:title="point.name"
      v-bind:value="index + 1"
      )

</template>
<script>

export default {

  data() {
    return {
    };
  },

  computed: {
    routePoints() {
      return this.$store.state.routePoints;
    },
  },

  created() {
    setTimeout(() => sampleData(this.$store.commit), 1000);
    this.$store.commit('gotRoutePoints', [
      { id: 1, name: 'Первая точка' },
      { id: 2, name: 'Вторая точка' },
    ]);
  },

};


function sampleData(commit) {
  commit('gotRoutePoints', [{ id: 4, name: 'Четвертая точка' }]);
}


</script>
<style scoped>

h1 {
  /*background: aqua;*/
}

</style>
