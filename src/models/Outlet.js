import STModel from '@/jsdata/Model';

import './Partner';

export default new STModel({

  name: 'Outlet',

  relations: {
    // TODO: fix jsData error on store.clear/removeAll if 'hasOne' instead of 'belongsTo'
    belongsTo: {
      Partner: {
        localKey: 'partnerId',
        localField: 'partner',
      },
    },
  },
});
