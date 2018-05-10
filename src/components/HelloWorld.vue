<template lang="pug">

.hello
  p
    img(src="/static/images/icons8-truck.png")
  h1 {{ msg }}

</template>
<script>

export default {
  name: 'HelloWorld',
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

</style>
