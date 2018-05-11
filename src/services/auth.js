import http from 'axios';

const PHA_ROLES_URL = 'https://api.sistemium.com/pha/roles';

function roles(token) {

  return http.get(PHA_ROLES_URL, {
    headers: { authorization: token },
  })
    .then(res => res.data);

}

export default roles;
