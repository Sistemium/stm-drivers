<template lang="pug">

.my-account-page

  hello-world.hero(:h1="`Здравствуйте, ${account.name}!`")

  current-user

  chosen-driver

</template>
<script>

import { mapState } from 'vuex';

import ChosenDriver from '@/components/ChosenDriver';
import CurrentUser from '@/components/CurrentUser';

export default {

  components: { ChosenDriver, CurrentUser },

  computed: mapState('auth', ['account']),

};

</script>
<style scoped lang="scss">

@import "../styles/responsive";

.lead {
  text-align: center;
  strong {
    white-space: nowrap;
  }
}

</style>
