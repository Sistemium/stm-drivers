<template lang="pug">

.my-account-page

  h1 Персональная страница

  .lead Здравствуйте,
    strong &nbsp;{{ account.name }}!

  el-alert(
  v-if="confirm"
  type="warning"
  @close="logoffClick"
  close-text="Подтвердить"
  title="Внимание"
  )
    p Подтвердите завершение работы на этом устройстве

  p.buttons
    mt-button(
    :type="confirm ? 'danger' : 'default'" @click="confirm ? cancelClick() : logoffClick()"
    )
      | {{ confirm ? 'Отменить завершение работы' : 'Завершить работу' }}

</template>
<script>

import { mapState, mapActions } from 'vuex';
import { LOGOFF } from '@/store/auth/actions';

export default {

  data() {
    return { confirm: false };
  },

  computed: mapState('auth', ['account']),

  methods: {

    ...mapActions('auth', [LOGOFF]),

    logoffClick() {
      if (this.confirm) {
        this[LOGOFF]();
      }
      this.confirm = true;
      setTimeout(this.cancelClick, 3500);
    },

    cancelClick() {
      this.confirm = false;
      // this.$router.push('/');
    },

  },

};

</script>
<style scoped lang="scss">

@import "../styles/responsive";

.buttons {

  display: flex;
  justify-content: space-between;

  margin-bottom: 30px;

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
