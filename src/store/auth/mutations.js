import Vue from 'vue';

export const AUTHORIZING = 'AUTHORIZING';
export const AUTHORIZATION = 'AUTHORIZATION';
export const NOT_AUTHORIZED = 'NOT_AUTHORIZED';

export const PHA_AUTH_ID = 'PHA_AUTH_ID';

export default {

  [AUTHORIZATION](state, data) {
    state.auth = data;
  },

  [AUTHORIZING](state) {
    Vue.set(state.auth, 'busy', true);
  },

  [NOT_AUTHORIZED](state, error) {
    state.auth = { error };
  },

  [PHA_AUTH_ID](state, id) {
    Vue.set(state.auth, PHA_AUTH_ID, id);
  },

};
