import roles from '@/services/auth';

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

};

export const actions = {

  [a.AUTH_INIT]({ commit }) {

    commit(m.AUTHORIZING);

    return roles(process.env.ACCESS_TOKEN)
      .then(res => new Promise(resolve => setTimeout(() => resolve(res), 1000)))
      .then(res => commit(m.AUTHORIZATION, res))
      .catch(error => commit(m.NOT_AUTHORIZED, error));

  },

};
