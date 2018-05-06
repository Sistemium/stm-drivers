<template lang="pug">
  .home
    HelloWorld
    p
      mt-button(type="primary") default
    p
      router-link(to="route") Маршрут
</template>

<script>

import HelloWorld from '@/components/HelloWorld';

export default {
  name: 'HomePage',
  components: { HelloWorld },
};

</script>

<style scoped>

</style>
