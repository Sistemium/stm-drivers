<template lang="pug">

.route
  h1 Route page
  p
    router-link(to="/") В начало

  .route-points
    .poite-point(v-for='(point, idx) in routePoints')
      mt-cell(
      :title="point.name"
      :value="idx"
      )

</template>
<script>

export default {

  created() {
    this.routePoints = [
      { id: 1, name: 'Первая точка' },
      { id: 2, name: 'Вторая точка' },
      { id: 3, name: 'Третья точка' },
      { id: 4, name: 'Четвертая точка' },
    ];
  },

};

</script>
<style scoped>

h1 {
  background: aqua;
}

</style>
