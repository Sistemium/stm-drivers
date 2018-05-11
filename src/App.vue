<template lang="pug">

.app

  hello-world(v-if="!authorized")
  router-view(v-if="authorized")

</template>
<script>

import { Indicator } from 'mint-ui';
import HelloWorld from '@/components/HelloWorld';

export default {

  name: 'App',

  components: { HelloWorld },

  computed: {
    authorized() {
      return !!this.$store.state.auth.roles;
    },
  },

  watch: {
    authorized(value) {
      this.setIndicator(!value);
    },
  },

  methods: {
    setIndicator(value) {
      if (value) {
        Indicator.open('Авторизация');
      } else {
        Indicator.close();
      }
    },
  },

  created() {
    this.setIndicator(!this.authorized);
  },

};

</script>
<style scoped lang="scss">

.app {
  max-width: 420px;
  margin: auto;
}

</style>
