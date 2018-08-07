<template lang="pug">

.image-preload
  .image-loading(v-if="isLoading")
    i.el-icon-loading
  img(v-else :src="src()")

</template>
<script>

import { loadImage } from '@/services/pictureHelper';

/* eslint-disable no-console */

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

    console.info(this.id, this.isLoading, this.picture.srcFull());

    loadImage(this.picture)
      // .then(res => new Promise(resolve => setTimeout(() => resolve(res), 2000)))
      .then(() => {
        this.isLoading = false;
        console.info('loadImage done', this.picture.id, this.picture.srcFull());
      })
      .catch(e => console.error(e));
  },

};

</script>
<style scoped lang="scss">

img {
  max-width: 100%;
}

</style>
