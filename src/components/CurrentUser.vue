<template lang="pug">

.current-user

  mt-cell(v-if="account" :title="account.name" label="Пользователь")
    mt-button(size="small" @click="confirm ? cancelClick() : logoffClick()")
      | {{ confirm ? 'Отменить' : 'Выход' }}

  el-alert(
  v-if="confirm"
  type="warning"
  @close="cancelClick"
  close-text="Отменить"
  title="Внимание"
  )
    p Подтвердите завершение работы на этом устройстве

  p.buttons(v-if="confirm")
    mt-button(
    :type="confirm ? 'danger' : 'default'" @click="logoffClick()"
    )
      | {{ confirm ? 'Подтвердить' : 'Завершить работу' }}

</template>
<script>

import { mapState, mapActions } from 'vuex';
import { LOGOFF } from '@/store/auth/actions';

export default {

  name: 'CurrentUser',

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

</style>
