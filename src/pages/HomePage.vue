<template lang="pug">

.home

  HelloWorld.hero

  p.greeting
    span Здравствуйте, {{ account.name }}!

  p
    router-link(to="tabs")
      mt-button(type="primary") Начать работу

</template>

<script>

import HelloWorld from '@/components/HelloWorld';
import { mapState } from 'vuex';

export default {

  components: { HelloWorld },

  computed: mapState('auth', {
    account: 'account',
  }),

};

</script>

<style scoped lang="scss">

.home > p {
  text-align: center;
  margin-top: 30px;
}

.greeting {
  font-size: 115%;
  font-weight: 700;
  > a {
    text-decoration: none;
    margin-left: 0.5em;
  }
}

</style>
