<template lang="pug">
  .home
    HelloWorld
    //router-view
    //AppTabBar
    <!--p-->
      <!--mt-button(type="primary") Тестовая кнопка-->
    p
      router-link(to="tabs" tag="mt-button") Начать работу
</template>

<script>

import HelloWorld from '@/components/HelloWorld';
// import AppTabBar from '@/components/AppTabBar';

export default {
  name: 'HomePage',
  components: { HelloWorld },
};

</script>

<style scoped>

.home > p {
  text-align: center;
}

</style>
