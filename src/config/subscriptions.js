import { AUTHORIZED } from '@/store/auth/mutations';
import Workflow from '@/models/Workflow';
import store from '@/store';
store.subscribe(action => {

  if (action.type.endsWith(AUTHORIZED)) {
    Workflow.findAll();
  }

});
