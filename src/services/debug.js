import v4 from 'uuid/v4';
import debug from 'debug';
import isString from 'lodash/isString';
import trim from 'lodash/trim';
import filter from 'lodash/filter';

import LogMessage from '@/models/LogMessage';

const sesionId = v4();
const NS = 'stm:drv';
const LOG = true;

export default function (domain) {

  const source = `${NS}:${domain}`;
  const nsDebug = debug(source);

  return LOG ? logMessage : nsDebug;

  function logMessage() {

    // eslint-disable-next-line
    const args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));

    nsDebug(...args);

    const text = filter(args.map(a => (isString(a) ? trim(a) : JSON.stringify(a, ' ', null))))
      .join(' ');

    return LogMessage.create({
      type: 'important',
      text,
      source,
      target: sesionId,
    })
      .catch(({ name, message }) => {
        nsDebug(name, message);
      });
  }

}
