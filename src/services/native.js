/* eslint-disable no-unused-vars,no-param-reassign */

import get from 'lodash/get';
import assign from 'lodash/assign';
import isArray from 'lodash/isArray';
import first from 'lodash/first';

let requestIdCounter = 0;
const messages = {};
const messageHandlers = get(window, 'stmAndroid') || get(window, 'webkit.messageHandlers');

window.messageCallback = messageCallback;
window.arrayMessageCallback = arrayMessageCallback;
window.iSistemiumIOSCallback = arrayMessageCallback;
window.iSistemiumIOSErrorCallback = arrayMessageCallback;

function isNative() {

  return !!window.webkit || !!window.stmAndroid;

}

function checkIn(desiredAccuracy, requiredAccuracy, data, timeout) {

  return message('checkin', {
    accuracy: desiredAccuracy,
    requiredAccuracy,
    data,
    timeout: timeout || 20000,
  });

}

function handler(name) {

  if (messageHandlers && messageHandlers[name] && messageHandlers[name].postMessage) {

    return messageHandlers[name];

  }

  if (messageHandlers[name]) {

    return {
      postMessage: options => {

        const jsonOptions = options ? JSON.stringify(options) : undefined;

        messageHandlers[name](jsonOptions);

      },
    };

  }

  return {
    postMessage: options => {

      if (name === 'roles') {
        window[options.callback]([{
          account: {
            name: 'Error',
          },
          roles: {
            picker: true,
          },
        }], options);
      } else {
        throw new Error(`IOS handler undefined call to: "${name}"`);
      }

    },
  };

}

function message(handlerName, cfg) {

  return new Promise((resolve, reject) => {

    requestIdCounter += 2;

    const requestId = requestIdCounter;

    const msg = assign({
      requestId,
      callback: 'messageCallback',
      options: { },
    }, cfg);

    msg.options.requestId = requestId;

    messages[requestId] = { resolve, reject, msg };

    handler(handlerName).postMessage(msg);

    if (cfg && cfg.timeout) {
      setTimeout(() => {

        delete messages[requestId];
        reject({ error: `${handlerName} request timeout` });

      }, cfg.timeout);
    }

  });

}

function messageCallback(res, req) {

  const msg = messages[req.requestId];

  if (!msg) {
    return;
  }

  let { status } = req;

  if (!status) {
    status = isArray(res) ? 'resolve' : 'reject';
  }

  if (status === 'resolve') {
    res = isArray(res) ? first(res) : res;
  }

  msg[status](res);

  delete messages[req.requestId];

}

function arrayMessageCallback(res, req) {

  const msg = messages[req.requestId];

  if (!msg) {
    return;
  }

  let { status } = req;

  if (!status) {
    status = isArray(res) ? 'resolve' : 'reject';
  }

  msg[status](res);

  delete messages[req.requestId];

}

function getRoles() {

  return message('roles');

}

function requestFromDevice(type, entity, options, where) {

  const msg = {

    entity,
    options,
    callback: 'arrayMessageCallback',
    where,

  };

  return message(type, msg);

}

export { isNative, checkIn, getRoles, requestFromDevice };
