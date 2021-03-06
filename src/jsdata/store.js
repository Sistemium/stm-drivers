import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';

import queryTransform from './httpAdapter';

const store = new DataStore();

export default store;

export function authorize(token, org) {

  const httpOptions = {
    basePath: `/api/${org}`,
    httpConfig: {
      headers: {
        authorization: token,
        'x-page-size': 1000,
      },
    },
    queryTransform(mapper, params, options) {
      return queryTransform(params, options);
    },
    afterFindAll(mapper, query, opts, response) {
      return response || [];
    },
  };

  const httpAdapter = new HttpAdapter(httpOptions);

  store.clear();
  store.registerAdapter('http', httpAdapter, { default: true });

}
