import Vue from 'vue';

export const AUTHORIZING = 'AUTHORIZING';
export const AUTHORIZATION = 'AUTHORIZATION';
export const NOT_AUTHORIZED = 'NOT_AUTHORIZED';

export const PHA_AUTH_ID = 'PHA_AUTH_ID';

export default {

  [AUTHORIZATION](state, data) {
    state.busy = false;
    if (state[PHA_AUTH_ID]) {
      state[PHA_AUTH_ID] = false;
    }
    Object.keys(data)
      .forEach(key => Vue.set(state, key, data[key]));
  },

  [AUTHORIZING](state, token) {
    Vue.set(state, 'busy', token || false);
  },

  [NOT_AUTHORIZED](state, error) {
    Vue.set(state, 'error', error);
  },

  [PHA_AUTH_ID](state, id) {
    Vue.set(state, PHA_AUTH_ID, id);
  },

};
