<template lang="pug">

.image-preload
  .image-loading(v-if="isLoading")
    i.el-icon-loading
  img(v-else :src="src()")

</template>
<script>

import { loadImage } from '@/services/pictureHelper';

const debug = require('debug')('stm:ImagePreload');

export default {

  name: 'ImagePreload',

  props: {
    picture: Object,
  },

  data() {
    return { isLoading: true };
  },

  methods: {
    src() {
      return this.picture.srcFull();
    },
  },

  created() {

    loadImage(this.picture)
      // .then(res => new Promise(resolve => setTimeout(() => resolve(res), 2000)))
      .then(() => {
        this.isLoading = false;
      })
      .catch(e => debug('Error:', e));
  },

};

</script>
<style scoped lang="scss">

img {
  max-width: 100%;
}

</style>
