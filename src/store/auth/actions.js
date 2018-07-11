import * as m from '@/store/auth/mutations';
import { confirm, login, roles } from '@/services/auth';
import { authorize as authorizeJSDataStore } from '@/jsdata/store';
import { isNative, getRoles } from '@/services/native';

const LS_KEY = 'std.authorization';

export const AUTH_INIT = 'AUTH_INIT';
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_REQUEST_CONFIRM = 'AUTH_REQUEST_CONFIRM';
export const LOGOFF = 'LOGOFF';
export const CLEAR_ERROR = '';

export default {

  /*
  Get account info and roles by an authorization token
   */

  [AUTH_INIT]({ commit }, accessToken) {

    if (isNative()) {

      commit(m.AUTHORIZING, true);

      return getRoles()
        .then(res => new Promise(resolve => setTimeout(() => resolve(res), 1000)))
        .then(res => {
          authorizeJSDataStore(undefined, res.account.org);
          commit(m.AUTHORIZED, res);
        })
        .catch(error => commit(m.NOT_AUTHORIZED, error));

    }

    const token = accessToken || localStorage.getItem(LS_KEY);

    commit(m.AUTHORIZING, token);

    if (!token) {
      return Promise.resolve();
    }

    return roles(token)
      .then(res => new Promise(resolve => setTimeout(() => resolve(res), 1000)))
      .then(res => {
        localStorage.setItem(LS_KEY, token);
        authorizeJSDataStore(token, res.account.org);
        commit(m.AUTHORIZED, res);
      })
      .catch(error => commit(m.NOT_AUTHORIZED, error));

  },

  /*
  Request phone authorization code
   */

  [AUTH_REQUEST]({ commit }, { value, input: phone }) {

    commit(m.PHA_AUTH_TOKEN, {});
    commit(m.AUTHORIZING, phone);

    const res = login(`8${value}`)
      .then(id => commit(m.PHA_AUTH_TOKEN, { id, phone }));

    res.catch(() => commit(m.NOT_AUTHORIZED, 'Неизвестный номер'));

    return res;

  },

  /*
  Confirm phone authorization code
   */

  [AUTH_REQUEST_CONFIRM]({ state, dispatch, commit }, { value: code }) {

    commit(m.AUTHORIZING, code);

    const res = confirm(code, state[m.PHA_AUTH_TOKEN].id)
      .then(({ accessToken }) => dispatch(AUTH_INIT, accessToken));

    res.catch(() => commit(m.NOT_AUTHORIZED, 'Неправильный пароль'));

    return res;

  },

  /*
  Clean up
   */

  [LOGOFF]({ commit }) {
    commit(m.AUTHORIZED, { account: false, roles: false });
    localStorage.removeItem(LS_KEY);
  },

  [CLEAR_ERROR]({ commit }) {
    commit(m.NOT_AUTHORIZED, false);
  },

};
