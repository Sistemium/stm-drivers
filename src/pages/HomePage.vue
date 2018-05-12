<template lang="pug">

.home

  HelloWorld

  p
    router-link(to="tabs")
      mt-button(type="primary") Начать работу

</template>

<script>

import HelloWorld from '@/components/HelloWorld';

export default {
  name: 'HomePage',
  components: { HelloWorld },
};

</script>

<style scoped>

.home > p {
  text-align: center;
  margin-top: 40px;
}

</style>
