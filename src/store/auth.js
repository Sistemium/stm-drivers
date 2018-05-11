import roles from '@/services/auth';

export const AUTHORIZING = 'AUTHORIZING';
export const AUTHORIZATION = 'AUTHORIZATION';
export const NOT_AUTHORIZED = 'NOT_AUTHORIZED';

export const mutations = {

  [AUTHORIZATION](state, data) {
    state.auth = data;
  },

  [AUTHORIZING](state) {
    state.auth.busy = true;
  },

  [NOT_AUTHORIZED](state, error) {
    state.auth = { error };
  },

};

export const AUTH_INIT = 'AUTH_INIT';

export const actions = {

  [AUTH_INIT]({ commit }) {

    commit(AUTHORIZING);

    return roles(process.env.ACCESS_TOKEN)
      .then(res => new Promise(resolve => setTimeout(() => resolve(res), 1000)))
      .then(res => commit(AUTHORIZATION, res))
      .catch(error => commit(NOT_AUTHORIZED, error));

  },

};
