import actions from './actions';
import mutations, { PHA_AUTH_TOKEN } from './mutations';

function state() {
  return {
    account: undefined,
    error: false,
    [PHA_AUTH_TOKEN]: {},
  };
}

const namespaced = true;

export default { namespaced, actions, mutations, state };
