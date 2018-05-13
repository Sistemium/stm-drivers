import Vue from 'vue';

export const AUTHORIZING = 'AUTHORIZING';
export const AUTHORIZED = 'AUTHORIZED';
export const NOT_AUTHORIZED = 'NOT_AUTHORIZED';

export const PHA_AUTH_ID = 'PHA_AUTH_ID';

export default {

  [AUTHORIZING](state, token) {
    Vue.set(state, 'busy', token || false);
  },

  [PHA_AUTH_ID](state, id) {
    notBusy(state);
    Vue.set(state, PHA_AUTH_ID, id);
  },

  [AUTHORIZED](state, data) {
    notBusy(state);
    if (state[PHA_AUTH_ID]) {
      state[PHA_AUTH_ID] = false;
    }
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
