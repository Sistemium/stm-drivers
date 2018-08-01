<template lang="pug">

.my-account-page

  hello-world.hero(h1="")

  current-user

  chosen-driver

  .buttons
    mt-button.reload(@click="reloadClick") Перезапустить
    mt-button.toggle-profile(
    size="small"
    v-if="showProfileToggle"
    @click="toggleProfileClick"
    type="primary"
    plain
    )
      i.el-icon-rank

</template>
<script>

import ChosenDriver from '@/components/ChosenDriver';
import CurrentUser from '@/components/CurrentUser';

import { isNative, toggleTabBar } from '@/services/native';

export default {

  components: { ChosenDriver, CurrentUser },

  computed: {
    showProfileToggle() {
      return isNative();
    },
  },

  methods: {

    reloadClick() {
      window.location.reload();
    },

    toggleProfileClick() {
      toggleTabBar();
    },

  },

};

</script>
<style lang="scss">

.current-user .mint-cell {
  border-bottom: none;
}

.my-account-page {
  position: relative;
  .toggle-profile {
    position: absolute;
    top: 0;
    right: 8px;
  }
}

</style>
