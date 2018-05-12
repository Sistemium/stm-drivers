<template lang="pug">

.app

  router-view(v-if="authorized")
  hello-world(v-else)

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
    authorizing() {
      return !!this.$store.state.auth.busy;
    },
  },

  watch: {
    authorizing(value) {
      this.setIndicator(value);
    },
  },

  methods: {
    setIndicator(value) {
      if (value) {
        Indicator.open('Идет авторизация');
      } else {
        Indicator.close();
      }
    },
  },

  created() {
    this.setIndicator(this.authorizing);
  },

};

</script>
<style scoped lang="scss">

.app {
  max-width: 420px;
  margin: auto;
}

</style>
