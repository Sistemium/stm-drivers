<template lang="pug">

.sign-in

  h1 Авторизация
  .lead Пожалуйста, представьтесь:

  mt-field(
  v-if="phaState==='sms'"
  label="Телефон"
  v-model="phone"
  disabled
  )

  form.fields(@submit.prevent='sendClick')


    mt-field(
    v-model="input"
    :label="label"
    :attr="{id: 'sign-input'}"
    :placeholder="placeholder"
    )

  .buttons
    mt-button(type="primary" :disabled="!isComplete" @click="sendClick") Отправить

</template>
<script>

import InputMask from 'inputmask';
import { AUTH_REQUEST, AUTH_REQUEST_CONFIRM } from '@/store/auth/actions';
import { PHA_AUTH_ID } from '@/store/auth/mutations';

const mask = '+7 (999) 999-99-99';
const maskPhone = new InputMask(mask);
const maskSms = new InputMask('9{4,6}');

export default {

  name: 'SignInPage',

  data() {
    return {
      input: '',
      masked: {},
    };
  },

  computed: {
    phaState() {
      return this.$store.state.auth[PHA_AUTH_ID] && this.phone ? 'sms' : 'phone';
    },
    phone() {
      return this.$store.state.auth[PHA_AUTH_ID] && this.$store.state.auth[PHA_AUTH_ID].phone;
    },
    isComplete() {
      return this.masked.isComplete && this.masked.isComplete();
    },
    placeholder() {
      return this.phaState === 'phone' ? mask.replace(/9/g, '_') : '4-6 цифр в СМС';
    },
    label() {
      return this.phaState === 'phone' ? 'Телефон' : 'Код';
    },
  },

  watch: {
    phaState() {
      this.attachMask();
    },
  },

  methods: {

    sendClick() {

      if (!this.isComplete) {
        return false;
      }

      const value = { value: this.masked.unmaskedvalue(), input: this.input };

      if (this.phaState === 'phone') {
        return this.$store.dispatch(AUTH_REQUEST, value)
          .then(() => {
            this.input = '';
          });
      }

      return this.$store.dispatch(AUTH_REQUEST_CONFIRM, value)
        .then(() => this.$router.push('/'));

    },

    element() {
      return document.getElementById('sign-input');
    },

    attachMask() {

      const el = this.element();

      if (!el) {
        return;
      }

      const masker = this.phaState === 'phone' ? maskPhone : maskSms;
      this.masked = masker.mask(el);

    },

  },

  mounted() {

    this.$nextTick(() => {
      this.attachMask();
    });

  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.lead {
  text-align: center;
}

.buttons {

  margin-top: $margin-top * 3;

  button {
    display: block;
    width: 100%;
  }

}

.hidden {
  display: none;
}

</style>
