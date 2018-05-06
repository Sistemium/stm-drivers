<template lang="pug">
  .route
    h1 Route
    p
      router-link(to="/") В начало
</template>

<script>
export default {
  name: 'Route',
};
</script>

<style scoped>
  h1 {
    background: aqua;
  }
</style>
