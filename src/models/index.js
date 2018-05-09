import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';

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
    return jsDataToSTAPI(params, options);
  },
};

const httpAdapter = new HttpAdapter(httpOptions);

store.registerAdapter('http', httpAdapter, { default: true });

export default store;

store.on('all', (name, model, data) => {
  // eslint-disable-next-line
  console.group(`Event "${name}" on "${model}"`);
  // eslint-disable-next-line
  console.log('Data: ', data);
  // eslint-disable-next-line
  console.groupEnd();
});


function jsDataToSTAPI(params, options = {}) {

  const parsed = { ...params };

  let { orderBy } = params;

  if (orderBy && orderBy.length) {

    if (!Array.isArray(orderBy)) {
      orderBy = [[orderBy]];
    } else if (!Array.isArray(orderBy[0])) {
      orderBy = [orderBy];
    }

    parsed['x-order-by:'] = orderBy.map((order) => {
      const [col, dir] = order;
      return `${dir.match(/desc/i) ? '-' : ''}${col}`;
    }).join(',');

  }

  if (params.limit) {
    parsed['x-page-size:'] = params.limit;
  }

  if (params.offset) {
    parsed['x-start-page:'] = Math.ceil(params.offset / (params.limit || 1)) + 1;
  }

  if (params.where) {
    parsed['where:'] = JSON.stringify(params.where);
  }

  if (Array.isArray(options.groupBy)) {
    parsed['groupBy:'] = options.groupBy.join(',');
  }

  delete parsed.where;
  delete parsed.offset;
  delete parsed.limit;
  delete parsed._;
  delete parsed.orderBy;

  return parsed;

}
