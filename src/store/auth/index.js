import Vue from 'vue';

import { roles, login, confirm } from '@/services/auth';

import * as m from './mutations';
import * as a from './actions';

export const initial = {};

export const mutations = {

  [m.AUTHORIZATION](state, data) {
    state.auth = data;
  },

  [m.AUTHORIZING](state) {
    state.auth.busy = true;
  },

  [m.NOT_AUTHORIZED](state, error) {
    state.auth = { error };
  },

  [m.PHA_AUTH_ID](state, id) {
    Vue.set(state.auth, m.PHA_AUTH_ID, id);
  },

};

export const actions = {

  [a.AUTH_INIT]({ commit }, accessToken = process.env.ACCESS_TOKEN) {

    commit(m.AUTHORIZING, accessToken);

    return roles(accessToken)
      .then(res => new Promise(resolve => setTimeout(() => resolve(res), 1000)))
      .then(res => commit(m.AUTHORIZATION, res))
      .catch(error => commit(m.NOT_AUTHORIZED, error));

  },

  [a.AUTH_REQUEST]({ commit }, phone) {

    return login(phone)
      .then(id => commit(m.PHA_AUTH_ID, id));

  },

  [a.AUTH_REQUEST_CONFIRM]({ state, dispatch }, code) {

    return confirm(code, state.auth[m.PHA_AUTH_ID])
      .then(res => dispatch(a.AUTH_INIT, res.accessToken));

  },

};
