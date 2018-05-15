<template lang="pug">

.hello

  p.logo
    img(src="../assets/logo.png")

  h1(v-if="h1!==''") {{ h1 || msg }}

  .lead(v-if="lead") {{ lead }}

</template>
<script>

export default {

  props: { h1: String, lead: String },

  data() {
    return {
      msg: 'Программа для водителей',
    };
  },

};

</script>
<style scoped>

.hello {
  text-align: center;
}

.lead {
  text-align: center;
  margin-bottom: 21px;
}

</style>
