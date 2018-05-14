<template lang="pug">

.sign-in

  bread-crumbs.top-header

  hello-world(h1="")

  <!--h1 приветствует вас!-->

  .lead Пожалуйста, представьтесь:

  .fields

    mt-field(
    v-if="phaState==='sms'"
    label="Телефон"
    v-model="phone"
    disabled
    )

    mt-field(
    v-model="input"
    type="tel"
    :label="label"
    :attr="{ id: 'sign-input', autocomplete: 'off' }"
    :placeholder="placeholder"
    :readonly="!!error"
    )

  .buttons
    mt-button(
    :type="buttonType"
    :disabled="!isComplete || !!error"
    @click="sendClick"
    ) {{ buttonText }}

</template>
<script>

import { mapActions, mapState } from 'vuex';
import InputMask from 'inputmask';

import { AUTH_REQUEST, AUTH_REQUEST_CONFIRM } from '@/store/auth/actions';
import { PHA_AUTH_TOKEN } from '@/store/auth/mutations';
import HelloWorld from '@/components/HelloWorld';
import BreadCrumbs from '@/components/BreadCrumbs';

const phoneMask = '+7 (999) 999-99-99';
const smsMask = '9{4,6}';

export default {

  components: { BreadCrumbs, HelloWorld },

  data() {
    return {
      input: '',
      masked: {},
    };
  },

  computed: {
    ...mapState('auth', {
      phaState(state) {
        return state[PHA_AUTH_TOKEN] && state[PHA_AUTH_TOKEN].phone ? 'sms' : 'phone';
      },
      phone(state) {
        return state[PHA_AUTH_TOKEN] && state[PHA_AUTH_TOKEN].phone;
      },
      error: 'error',
    }),
    isComplete() {
      return this.masked.isComplete && this.masked.isComplete();
    },
    placeholder() {
      return this.phaState === 'phone' ? phoneMask.replace(/9/g, '_') : '4-6 цифр из СМС';
    },
    label() {
      return this.phaState === 'phone' ? 'Телефон' : 'Пароль';
    },
    buttonText() {
      if (this.phaState === 'phone') {
        return 'Ваш номер, который был зарегистрирован';
      }
      return this.isComplete ? 'Вход' : 'Вам отправлено СМС';
    },
    buttonType() {
      return this.phaState === 'phone' ? 'default' : 'primary';
    },
  },

  watch: {
    phaState() {
      this.attachMask();
    },
    isComplete(value) {
      if (value && this.phaState === 'phone') {
        this.$nextTick(() => this.sendClick());
      }
    },
  },

  methods: {

    ...mapActions('auth', [AUTH_REQUEST, AUTH_REQUEST_CONFIRM]),

    sendClick() {

      if (!this.isComplete || this.error) {
        return false;
      }

      const value = { value: this.masked.unmaskedvalue(), input: this.input };

      if (this.phaState === 'phone') {
        return this[AUTH_REQUEST](value)
          .then(() => {
            this.input = '';
          });
      }

      return this[AUTH_REQUEST_CONFIRM](value)
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

      this.masked = this.inputMask().mask(el);

    },

    inputMask() {

      return new InputMask({
        mask: this.phaState === 'phone' ? phoneMask : smsMask,
        onKeyDown: ({ which }) => which === 13 && this.sendClick(),
      });

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

.top-header + .hello {
  margin-top: 60px;
}

.hello + h1 {
  margin-top: -15px;
}

.lead {
  text-align: center;
  margin-top: 0;
}

.buttons {

  margin-top: $margin-top * 3;

  button {
    display: block;
    width: 100%;
    padding: $margin-top 12px;
    height: auto;
  }

}

.hidden {
  display: none;
}

</style>
