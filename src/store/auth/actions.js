import * as m from '@/store/auth/mutations';
import { confirm, login, roles } from '@/services/auth';

export const AUTH_INIT = 'AUTH_INIT';
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_REQUEST_CONFIRM = 'AUTH_REQUEST_CONFIRM';

export default {

  [AUTH_INIT]({ commit }, accessToken = process.env.ACCESS_TOKEN) {

    commit(m.AUTHORIZING, accessToken);

    return roles(accessToken)
      .then(res => new Promise(resolve => setTimeout(() => resolve(res), 1000)))
      .then(res => commit(m.AUTHORIZATION, res))
      .catch(error => commit(m.NOT_AUTHORIZED, error));

  },

  [AUTH_REQUEST]({ commit }, { value, input: phone }) {

    commit(m.PHA_AUTH_ID, {});

    return login(`8${value}`)
      .then(id => commit(m.PHA_AUTH_ID, { id, phone }));

  },

  [AUTH_REQUEST_CONFIRM]({ state, dispatch }, { value: code }) {

    return confirm(code, state.auth[m.PHA_AUTH_ID].id)
      .then(({ accessToken }) => dispatch(AUTH_INIT, accessToken));

  },

};
