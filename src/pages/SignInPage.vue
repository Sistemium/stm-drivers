<template lang="pug">

.sign-in

  h1 Авторизация
  .lead Пожалуйста, представьтесь:

  .fields

    mt-field(
    label="Телефон"
    v-model="phone"
    :attr="{id: 'phone-input'}"
    :placeholder="placeholder"
    )

    mt-field(
    v-if="state==='sms'"
    label="СМС-код"
    v-model="sms"
    type="number"
    :attr="{id: 'sms-input'}"
    )

  .buttons
    mt-button(type="primary" :disabled="!isComplete" v-on:click="sendClick") Отправить

</template>
<script>

import InputMask from 'inputmask';

const mask = '+7 (999) 999-99-99';
const im = new InputMask(mask);

export default {

  name: 'SignInPage',

  data() {
    return {
      state: 'phone',
      phone: '',
      sms: '',
      placeholder: mask.replace(/9/g, '_'),
      masked: {},
    };
  },

  computed: {
    isComplete() {
      return this.masked.isComplete && this.masked.isComplete();
    },
  },

  methods: {
    sendClick() {
      this.state = 'sms';
    },
  },

  mounted() {
    this.$nextTick(() => {
      const el = document.getElementById('phone-input');
      if (!el) {
        return;
      }
      this.masked = im.mask(el);
    });
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

h1, .lead {
  text-align: center;
}

.fields {
  margin: $margin-top * 3 0;
}

.buttons {

  button {
    display: block;
    width: 100%;
  }

}

</style>
