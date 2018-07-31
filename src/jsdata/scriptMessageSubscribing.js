import v4 from 'uuid/v4';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import filter from 'lodash/filter';

import difference from 'lodash/difference';

import { handler, isNative } from '@/services/native';

// const debug = require('debug')('stm:scriptMessageSubscribing');

const SUBSCRIBE = 'subscribe';
const CALLBACK = 'iosSocketsJsDataSubscribe';
const DATA_CALLBACK = 'iosSocketsJsDataSubscribeData';

const ons = [];
const subscriptions = {};

let subscribed = [];

window[CALLBACK] = iosSocketsJsDataSubscribe;
window[DATA_CALLBACK] = subscribeDataCallback;


export function subscribe(entities) {

  const id = v4();

  subscriptions[id] = { id, entities };

  if (!isNative()) {
    return () => null;
  }

  nativeSubscribe(entities);

  return () => {

    delete subscriptions[id];

    const reSubscribeRest = flatten(map(subscriptions, 'entities'));

    if (difference(subscribed, reSubscribeRest)) {
      nativeSubscribe(reSubscribeRest);
    }

  };

}

export function onJsData(event, callback) {

  const subscription = { event, callback };

  ons.push(subscription);

  return () => {
    ons.splice(ons.indexOf(subscription), 1);
  };

}

/*
Private functions
 */

function nativeSubscribe(entities) {
  return handler(SUBSCRIBE).postMessage({
    entities,
    callback: CALLBACK,
    dataCallback: DATA_CALLBACK,
  });
}


function subscribeDataCallback(dataResponse) {

  if (!dataResponse || !dataResponse.length) return;

  // let model = Schema.model(_.get(data[0], 'entity'));
  //
  // //if (!model) return console.error('iosSockets:subscribeDataCallback:', 'no model');

  const updateSubscriptions = filter(ons, { event: 'jsData:update' });

  const index = {};

  dataResponse.forEach(({ data, xid, entity }) => {

    index[xid] = data;

    updateSubscriptions.forEach(subscription => subscription.callback({ entity, data }));

  });

  // debug('subscribeDataCallback:', dataResponse);

  // if (!model) return;

  const finishedSubscriptions = filter(ons, { event: 'jsData:update:finished' });

  finishedSubscriptions.forEach(subscription => {

    subscription.callback({
      // model,
      data: dataResponse,
      index,
    });

  });

}


function iosSocketsJsDataSubscribe(msg, { entities }) {
  subscribed = entities;
}
