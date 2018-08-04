<template lang="pug">

.take-photo-button

  .native(v-if="isNative")

  vue-core-image-upload.browser(
  v-else
  :crop="false"
  @imageuploaded="done"
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

import { isNative } from '@/services/native';
import { serverDateFormat } from '@/config/moments';

export default {

  name: 'TakePhotoButton',

  props: { done: Function },

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
      return `/ims?folder=ShipmentRoutePointPhoto/${serverDateFormat()}`;
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
