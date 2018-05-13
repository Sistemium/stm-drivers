import * as m from '@/store/auth/mutations';
import { confirm, login, roles } from '@/services/auth';
import { authorize as authorizeJSDataStore } from '@/jsdata/store';

const LS_KEY = 'std.authorization';

export const AUTH_INIT = 'AUTH_INIT';
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_REQUEST_CONFIRM = 'AUTH_REQUEST_CONFIRM';

export default {

  /*
  Get account info and roles by an authorization token
   */

  [AUTH_INIT]({ commit }, accessToken) {

    const token = accessToken || localStorage.getItem(LS_KEY);

    commit(m.AUTHORIZING, token);

    if (!token) {
      return Promise.resolve();
    }

    return roles(token)
      .then(res => new Promise(resolve => setTimeout(() => resolve(res), 1000)))
      .then(res => {
        commit(m.AUTHORIZED, res);
        localStorage.setItem(LS_KEY, token);
        authorizeJSDataStore(token, res.account.org);
      })
      .catch(error => commit(m.NOT_AUTHORIZED, error));

  },

  /*
  Request phone authorization code
   */

  [AUTH_REQUEST]({ commit }, { value, input: phone }) {

    commit(m.PHA_AUTH_ID, {});
    commit(m.AUTHORIZING, phone);

    return login(`8${value}`)
      .then(id => commit(m.PHA_AUTH_ID, { id, phone }));

  },

  /*
  Confirm phone authorization code
   */

  [AUTH_REQUEST_CONFIRM]({ state, dispatch, commit }, { value: code }) {

    commit(m.AUTHORIZING, code);

    return confirm(code, state[m.PHA_AUTH_ID].id)
      .then(({ accessToken }) => dispatch(AUTH_INIT, accessToken));

  },

};
