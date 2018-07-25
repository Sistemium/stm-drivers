import { requestFromDevice } from '@/services/native';
import forOwn from 'lodash/forOwn';

const settle = require('axios/lib/core/settle');

export default function axiosAdapter(config) {

  // console.info('Request config', config);

  return new Promise((resolve, reject) => {

    const options = {};
    const { params } = config;
    let { op } = config;
    let where;

    if (op === 'create') op = 'update';

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

      if (!iosParams.id || iosParams.id.indexOf('-') === -1) {

        const response = {
          data: '',
          status: 204,
          statusText: 'No Content',
          config,
        };

        settle(resolve, reject, response);

        return;

      }
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

    if (config.data) {

      iosParams.data = JSON.parse(config.data);

    }

    requestFromDevice(op, iosParams)
      .then(res => {

        const response = {
          data: JSON.stringify((op === 'update' || op === 'find') ? res[0] : res),
          status: 200,
          statusText: 'OK',
          config,
        };

        settle(resolve, reject, response);

      })
      .catch(reject);

  });
}


function parseIdParam(url) {
  return url.match(/[^/]*$/)[0];
}
