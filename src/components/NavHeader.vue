<template lang="pug">

.nav-header

  .left
    mt-button.prev(:plain="true" @click="prevClick" :disabled="!prev")
      i.el-icon-arrow-left(v-if="prev")

  .title
    slot
      strong {{ title }}

  .right
    mt-button.prev(:plain="true" @click="nextClick" :disabled="!next")
      i.el-icon-arrow-right(v-if="next")
    .badge(v-if="rightBadge")
      mt-badge(type="warning" size="small") {{ rightBadge }}

</template>
<script>

export default {

  name: 'nav-header',

  props: {
    title: String,
    prev: Function,
    next: Function,
    rightBadge: String,
  },

  methods: {
    prevClick() {
      this.prev();
    },
    nextClick() {
      this.next();
    },
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.right {

  position: relative;

  > .badge {
    position: absolute;
    top: -3px;
    right: 6px;
  }

}

</style>
