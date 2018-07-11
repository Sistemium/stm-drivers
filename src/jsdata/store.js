import http from 'axios';
import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';

import queryTransform from './httpAdapter';
// import axiosScriptMessaging from '@/jsdata/axiosScriptMessaging';

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

    // fix for https://github.com/js-data/js-data/issues/503
    afterFindAll({ name }, query, { _activeWith: activeWith }, response) {

      if (response.length && activeWith) {
        // console.info('afterFindAll activeWith', name, response); // eslint-disable-line
        store.addToCache(name, response, {});
      }

      return response || [];
    },

    afterFind({ name }, query, { _activeWith: activeWith }, response) {

      if (response && activeWith) {
        // console.info('afterFind activeWith', name, response); // eslint-disable-line
        store.addToCache(name, response, {});
      }

      return response;
    },

  };

  httpOptions.http = http;

  const httpAdapter = new HttpAdapter(httpOptions);

  store.clear();
  store.registerAdapter('http', httpAdapter, { default: true });

}
