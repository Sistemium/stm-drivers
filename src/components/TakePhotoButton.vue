<template lang="pug">

.take-photo-button

  .native(v-if="isNative")
    mt-button.trigger(@click="nativeTriggerClick") Сделать Фото-отчет

  vue-core-image-upload.browser(
  v-else
  :crop="false"
  @imageuploaded="imageUploaded"
  :data="imageData"
  :max-file-size="5242880"
  :headers="uploadHeaders"
  :url="imsUrl()"
  )
    mt-button.trigger() Сделать Фото-отчет

</template>
<script>

import { mapState } from 'vuex';
import VueCoreImageUpload from 'vue-core-image-upload';

import { isNative, takePhoto } from '@/services/native';
import { serverDateFormat } from '@/config/moments';
import nsDebug from '@/services/debug';

const NAME = 'TakePhotoButton';
const debug = nsDebug(NAME);

export default {

  name: NAME,

  props: { done: Function, entityName: String },

  components: { VueCoreImageUpload },

  data() {
    return { imageData: null, routePointPhotos: [] };
  },

  computed: {
    ...mapState('auth', { token: 'id' }),
    isNative,
    uploadHeaders() {
      return { authorization: this.token };
    },
  },

  methods: {

    imsUrl() {
      return `/ims1?folder=${this.entityName}/${serverDateFormat()}`;
    },

    nativeTriggerClick() {
      takePhoto(this.entityName, {})
        .then(this.done);
    },

    imageUploaded(res) {
      debug('imageUploaded', res);
      const { pictures: picturesInfo } = res;
      if (!picturesInfo) {
        return;
      }
      this.done({ picturesInfo });
    },

  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.take-photo-button {
  border: solid 1px $gray-border-color;
  border-radius: 4px;
}

.trigger {
  box-shadow: none;
  border: none;
  width: 100%;
}

</style>
