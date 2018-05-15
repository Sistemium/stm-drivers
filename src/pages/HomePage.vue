<template lang="pug">

.home

  hello-world.hero(:lead="`Здравствуйте, ${account.name}!`")

  .buttons
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

.buttons {
  margin-top: 30px;
}

</style>
