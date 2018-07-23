import { requestFromDevice } from '@/services/native';
import forOwn from 'lodash/forOwn';

const settle = require('axios/lib/core/settle');

export default function axiosAdapter(config) {

  // console.info('Request config', config);

  return new Promise((resolve, reject) => {

    const options = {};
    const { params, op } = config;

    // let ids;
    let where;

    const iosParams = {
      entity: config.name,
      options,
    };

    if (params['x-order-by:']) {
      options.sortBy = params['x-order-by:'].substr(1);
    }

    if (params['x-page-size:']) {
      options.pageSize = params['x-page-size:'];
    }

    if (params['where:']) {
      where = JSON.parse(params['where:'].replace('"in"', '"=="'));
    }

    if (op === 'find') {
      iosParams.id = parseIdParam(config.url);
    }

    delete params['where:'];

    forOwn(params, (v, k) => {

      if (!where) {

        where = {};

      }

      where[k] = {};
      where[k]['=='] = v;

    });

    if (where) {
      iosParams.where = where;
    }

    requestFromDevice(op, iosParams)
      .then(res => {

        const response = {
          data: JSON.stringify(res),
          status: 200,
          statusText: 'OK',
          // headers: config.headers,
          config,
          // request: config.transport.request,
        };

        console.log('_______________________');
        console.log(config);
        console.log(where);
        console.log(config.name);
        console.log(res);
        console.log('_______________________');

        settle(resolve, reject, response);

      })
      .catch(reject);

  });
}


function parseIdParam(url) {
  return url.match(/[^\/]*$/)[0];
}
