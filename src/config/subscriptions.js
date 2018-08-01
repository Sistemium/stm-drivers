import { AUTHORIZED } from '@/store/auth/mutations';
import Workflow from '@/models/Workflow';
import store from '@/store';
import { subscribe, onJsData } from '@/jsdata/scriptMessageSubscribing';
import jsDataStore from '@/jsdata/store';


const debug = require('debug')('stm:subscriptions');

store.subscribe(({ type }) => type.endsWith(AUTHORIZED) && onAuthorized());

function onAuthorized() {

  Workflow.findAll();

  subscribe(['ShipmentRoutePoint', 'ShipmentRoute']);

  onJsData('jsData:update', ({ entity, data }) => {

    debug('jsData', entity, data);

    const mapper = jsDataStore.getMapperByName(entity);

    if (!mapper) {
      return;
    }

    jsDataStore.addToCache(entity, data, {});

  });

}
