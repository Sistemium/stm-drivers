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

    // fix for https://github.com/js-data/js-data/issues/503
    afterFindAll({ name }, query, opts, response) {

      const { _activeWith: activeWith } = opts;

      if (response.length && activeWith) {
        // console.info('afterFindAll activeWith', name, response); // eslint-disable-line
        setTimeout(() => store.addToCache(name, response, opts));
      }

      return response || [];
    },

    afterFind({ name }, query, opts, response) {

      const { _activeWith: activeWith } = opts;
      if (response && activeWith) {
        // console.info('afterFind activeWith', name, response); // eslint-disable-line
        setTimeout(() => store.addToCache(name, response, opts));
      }

      return response;
    },

  };

  const httpAdapter = new HttpAdapter(httpOptions);

  store.clear();
  store.registerAdapter('http', httpAdapter, { default: true });

}
