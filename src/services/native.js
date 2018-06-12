/* eslint-disable no-unused-vars */

import get from 'lodash/get';
import assign from 'lodash/assign';

let requestIdCounter = 0;

const messages = {};

const messageHandlers = get(window, 'stmAndroid') || get(window, 'webkit.messageHandlers');

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
      callback: 'iosPhotoCallback',
      options: { requestId },
    }, cfg);

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

export { isNative, checkIn };
