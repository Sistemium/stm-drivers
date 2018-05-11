import http from 'axios';

import { NOT_AUTHORIZED, AUTHORIZING, AUTHORIZATION } from '@/store/mutations';

const PHA_ROLES_URL = 'https://api.sistemium.com/pha/roles';

function roles(token) {

  return http.get(PHA_ROLES_URL, {
    headers: { authorization: token },
  })
    .then(res => res.data);

}

function init(store) {

  const { commit } = store;

  commit(AUTHORIZING);

  roles(process.env.ACCESS_TOKEN)
    .then(res => new Promise(resolve => setTimeout(() => resolve(res), 1000)))
    .then(res => commit(AUTHORIZATION, res))
    .catch(error => commit(NOT_AUTHORIZED, error));

}

export default init;
