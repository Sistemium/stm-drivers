<template lang="pug">

.route-point-list
  .route-point(v-for='(point, index) in routePoints' :key="point.id")
    mt-cell(
    v-bind:title="point.name"
    v-bind:value="index + 1"
    )

</template>
<script>

export default {

  computed: {
    routePoints() {
      return this.$store.state.routePoints;
    },
  },

};

</script>
<style scoped>

</style>
