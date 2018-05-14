<template lang="pug">

.my-account-page

  hello-world.hero(h1="")

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
      this.confirm = setTimeout(this.cancelClick, 3500);
    },

    cancelClick() {

      if (!this.confirm) {
        return;
      }

      clearTimeout(this.confirm);
      this.confirm = false;

    },

  },

};

</script>
<style scoped lang="scss">

@import "../styles/responsive";

.lead {
  text-align: center;
}

</style>
