import Vue from 'vue';

export const AUTHORIZING = 'AUTHORIZING';
export const AUTHORIZED = 'AUTHORIZED';
export const NOT_AUTHORIZED = 'NOT_AUTHORIZED';

export const PHA_AUTH_TOKEN = 'PHA_AUTH_TOKEN';

export default {

  [AUTHORIZING](state, token) {
    Vue.set(state, 'busy', token || false);
  },

  [PHA_AUTH_TOKEN](state, id) {
    notBusy(state);
    Vue.set(state, PHA_AUTH_TOKEN, id);
  },

  [AUTHORIZED](state, data) {
    notBusy(state);
    state[PHA_AUTH_TOKEN] = false;
    Object.keys(data)
      .forEach(key => Vue.set(state, key, data[key]));
  },

  [NOT_AUTHORIZED](state, error) {
    notBusy(state);
    Vue.set(state, 'error', error);
  },

};


function notBusy(state) {
  state.busy = false;
}
