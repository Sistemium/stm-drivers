<template lang="pug">

.my-account-page

  h1 Персональная страница

  .lead Здравствуйте,
    strong &nbsp;{{ account.name }}!

  p.buttons
    mt-button(:type="confirm ? 'danger' : 'default'" @click="logoffClick")
      | {{ confirm ? 'Точно завершить?' : 'Завершить работу' }}
    router-link(to="/tabs")
      mt-button(type="primary") Продолжить работу

  el-alert(
  v-if="confirm"
  type="warning"
  @close="confirm = false"
  close-text="Отмена"
  title="Внимание"
  )
    p Подтвердите завершение работы на этом устройстве

</template>
<script>

import { mapState, mapActions } from 'vuex';
import { LOGOFF } from '@/store/auth/actions';

export default {

  data() {
    return {
      confirm: false,
    };
  },

  computed: mapState('auth', {
    account: 'account',
  }),

  methods: {
    ...mapActions('auth', [LOGOFF]),
    logoffClick() {
      if (this.confirm) {
        this[LOGOFF]();
      }
      this.confirm = true;
    },
  },

};

</script>
<style scoped lang="scss">

@import "../styles/responsive";

.buttons {
  display: flex;
  justify-content: space-around;

  margin-top: 30px;
  @include responsive-only(xxs) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    > *, button {
      display: block;
      width: 100%;
      text-decoration: none;
      & + * {
        margin-top: $margin-top * 2;
      }
    }
  }
}

.lead {
  text-align: center;
}

</style>
