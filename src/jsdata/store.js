import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';

import queryTransform from './httpAdapter';

const store = new DataStore();

const httpOptions = {
  basePath: 'https://api.sistemium.com/v4d/dr50',
  httpConfig: {
    headers: {
      authorization: process.env.ACCESS_TOKEN,
      'x-page-size': 1000,
    },
  },
  queryTransform(mapper, params, options) {
    return queryTransform(params, options);
  },
};

const httpAdapter = new HttpAdapter(httpOptions);

store.registerAdapter('http', httpAdapter, { default: true });

export default store;
