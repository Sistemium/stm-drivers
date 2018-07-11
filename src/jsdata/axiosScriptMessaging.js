import { requestFromDevice } from '@/services/native';
import forOwn from 'lodash/forOwn';

const settle = require('axios/lib/core/settle');

export default function axiosAdapter(config) {

  return new Promise((resolve, reject) => {

    const options = {};

    // let ids;
    let where;

    if (config.params['x-order-by:']) {

      options.sortBy = config.params['x-order-by:'].substr(1);

    }

    if (config.params['x-page-size:']) {

      options.pageSize = config.params['x-page-size:'];

    }

    if (config.params['where:']) {

      where = JSON.parse(config.params['where:'].replace('"in"', '"=="'));

    }

    const params = config.params;

    delete params['where:'];

    forOwn(params, (v, k) => {

      if (!where) {

        where = {};

      }

      where[k] = {};
      where[k]['=='] = v;

    });

    requestFromDevice(config.op, config.name, options, where)
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
      .catch(e => {

        reject(e);

      });

    // if (config.params['where:']) {
    //
    //   const where = JSON.parse(config.params['where:']);
    //
    //   key = Object.keys(where)[0];
    //
    //   ids = where[key].in;
    //
    // }

    // console.log('_______________________');
    // console.log(config.name);
    // console.log(config.op);
    // console.log(config.params);
    // if (config.params['where:']) {
    //
    //   console.log(ids);
    //
    // }
    // console.log(ids);
    // console.log('_______________________');

    // if (ids) {
    //
    //   const promises = [];
    //   const res = [];
    //
    //   ids.forEach(i => {
    //
    //     const where = {};
    //
    //     where[key] = { '==': i };
    //
    //     promises.push(requestFromDevice(config.op, config.name, options, where).then(
    //       r => {
    //         res.push(JSON.stringify(r));
    //         console.log(where);
    //         console.log(r);
    //       }));
    //
    //   });
    //
    //   Promise.all(promises).then(() => {
    //
    //     const response = {
    //       data: res,
    //       status: 200,
    //       statusText: 'OK',
    //       // headers: config.headers,
    //       config,
    //       // request: config.transport.request,
    //     };
    //
    //     console.log(res);
    //
    //     settle(resolve, reject, response);
    //
    //   }).catch(e => {
    //
    //     reject(e);
    //
    //   });
    //
    // } else {
    //
    //   requestFromDevice(config.op, config.name, options)
    //     .then(res => {
    //
    //       const response = {
    //         data: JSON.stringify(res),
    //         status: 200,
    //         statusText: 'OK',
    //         // headers: config.headers,
    //         config,
    //         // request: config.transport.request,
    //       };
    //
    //       settle(resolve, reject, response);
    //
    //     })
    //     .catch(e => {
    //
    //       reject(e);
    //
    //     });
    //
    // }

  });
}
