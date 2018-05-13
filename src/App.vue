<template lang="pug">

.app(:class="{busy: authorizing || error}")

  router-view(v-if="authorized || $route.name === 'signIn'")
  .join(v-else)
    hello-world

    p(v-if="!authorizing")
      router-link.solo(to="/sign-in" tag="div")
        mt-button(type="primary") Вход для клиентов

</template>
<script>

import { mapState, mapActions } from 'vuex';
import { Indicator, Toast } from 'mint-ui';
import HelloWorld from '@/components/HelloWorld';
import { CLEAR_ERROR } from '@/store/auth/actions';

export default {

  name: 'App',

  components: { HelloWorld },

  computed: {
    ...mapState('auth', { error: 'error' }),
    authorized() {
      return !!this.$store.state.auth.roles;
    },
    authorizing() {
      return this.$store.state.auth.busy;
    },
  },

  watch: {
    authorizing(value) {
      this.setIndicator(value);
    },
    error(value) {

      if (!value) {
        return;
      }

      const toast = Toast(typeof value === 'string' ? value : 'Ошибка');

      setTimeout(() => {
        this[CLEAR_ERROR]();
        toast.close();
      }, 2500);

    },
  },

  methods: {
    ...mapActions('auth', [CLEAR_ERROR]),
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

.join > p {
  margin-top: 40px;
}

</style>
