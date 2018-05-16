<template lang="pug">

.nav-header

  mt-button.prev(:plain="true" @click="prevClick" :disabled="!prev")
    i.el-icon-arrow-left(v-if="prev")

  .title
    strong {{ title }}

  mt-button.prev(:plain="true" @click="nextClick" :disabled="!next")
    i.el-icon-arrow-right(v-if="next")

</template>
<script>

export default {

  name: 'nav-header',

  props: {
    title: String,
    prev: Function,
    next: Function,
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


</style>
