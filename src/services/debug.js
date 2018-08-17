import debug from 'debug';
import isString from 'lodash/isString';

import LogMessage from '@/models/LogMessage';

const NS = 'stm:drv:';
const LOG = true;

export default function (domain) {

  const source = `${NS}:${domain}`;
  const nsDebug = debug(source);

  return LOG ? logMessage : nsDebug;

  function logMessage() {

    // eslint-disable-next-line
    const args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));

    nsDebug('logMessage', args);

    const text = args.map(a => (isString(a) ? a : JSON.stringify(a, ' ', null))).join(' ');

    return LogMessage.create({
      type: 'important',
      text,
      source,
    });
  }

}
