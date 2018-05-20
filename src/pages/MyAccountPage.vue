<template lang="pug">

.my-account-page

  hello-world.hero(h1="")

  current-user

  chosen-driver

</template>
<script>

import ChosenDriver from '@/components/ChosenDriver';
import CurrentUser from '@/components/CurrentUser';

export default {

  components: { ChosenDriver, CurrentUser },

};

</script>
<style scoped lang="scss">

</style>
