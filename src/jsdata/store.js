import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';

import queryTransform from './httpAdapter';

const store = new DataStore();

export default store;

export function authorize(token, org) {

  const httpOptions = {
    basePath: `https://api.sistemium.com/v4d/${org}`,
    httpConfig: {
      headers: {
        authorization: token,
        'x-page-size': 1000,
      },
    },
    queryTransform(mapper, params, options) {
      return queryTransform(params, options);
    },
  };

  const httpAdapter = new HttpAdapter(httpOptions);

  store.clear();
  store.registerAdapter('http', httpAdapter, { default: true });

}
