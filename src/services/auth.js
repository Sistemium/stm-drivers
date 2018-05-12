import http from 'axios';

const PHA_ROLES_URL = 'https://api.sistemium.com/pha/roles';
const PHA_AUTH_URL = 'https://api.sistemium.com/pha/auth';

function roles(token) {

  return http.get(PHA_ROLES_URL, {
    headers: { authorization: token },
  })
    .then(res => res.data);

}

function login(phone) {

  const config = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  return http.post(PHA_AUTH_URL, `mobileNumber=${phone}`, config)
    .then(res => res.data.ID);

}

function confirm(code, id) {

  const params = { ID: id, smsCode: code };
  const config = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [data => {
      const str = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
      return str.join('&');
    }],
  };

  return http.post(PHA_AUTH_URL, params, config)
    .then(res => res.data || Promise.reject('Service error'));

}

export { roles, login, confirm };
