import LogMessage from '@/models/LogMessage';

const debug = require('@/services/debug').default('errors');

window.onerror = errorCatcherFn;

function errorCatcherFn(message, file, line, col, error = {}) {

  debug(message, file, line, col, error);

  LogMessage.create({
    type: 'error',
    text: error.message || 'Unknown message',
    source: 'vue',
  })
    .then(res => debug(res))
    .catch(({ name, message: savingErrorMessage }) => debug(name, savingErrorMessage));

  return false;

}
