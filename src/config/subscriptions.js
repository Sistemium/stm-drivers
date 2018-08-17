import { AUTHORIZED } from '@/store/auth/mutations';
import Workflow from '@/models/Workflow';
import store from '@/store';
import { subscribe, onJsData } from '@/jsdata/scriptMessageSubscribing';
import jsDataStore from '@/jsdata/store';


const debug = require('@/services/debug').default('subscriptions');

store.subscribe(({ type }) => type.endsWith(AUTHORIZED) && onAuthorized());

function onAuthorized() {

  Workflow.findAll();

  subscribe([
    'ShipmentRoutePoint',
    'ShipmentRoute',
    'ShipmentRoutePointPhoto',
    'ShipmentRoutePointShipment',
    'Shipment',
    'ShipmentPosition',
    'RecordStatus',
  ]);

  onJsData('jsData:update', ({ entity, data }) => {

    debug('jsData', entity, data);

    if (entity === 'RecordStatus') {
      return onRecordStatus(data);
    }

    const mapper = jsDataStore.getMapperByName(entity);

    if (!mapper) {
      return false;
    }

    return jsDataStore.addToCache(entity, data, {});

  });

}

function onRecordStatus({ name, objectXid }) {
  debug('onRecordStatus', name, objectXid);
  jsDataStore.remove(name, objectXid);
}
