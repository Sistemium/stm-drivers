<template lang="pug">

.my-account-page

  hello-world.hero(h1="")

  current-user

  chosen-driver

  .buttons

    mt-button.reload(
    size="small"
    type="default"
    plain
    @click="reloadClick"
    )
      i.el-icon-refresh

    mt-button.toggle-profile(
    size="small"
    v-if="showProfileToggle"
    @click="toggleProfileClick"
    type="default"
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

@import "../styles/variables";

.current-user .mint-cell {
  border-bottom: none;
}

.my-account-page {

  position: relative;

  .toggle-profile, .reload {
    position: absolute;
    top: 0;
    border-color: $gray-background;
  }

  .toggle-profile {
    right: 8px;
  }

  .reload {
    left: 8px;
  }

}

</style>
