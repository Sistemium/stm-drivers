import { STModel } from '@/jsdata';

import './Partner';

export default new STModel('Outlet', {
  relations: {
    belongsTo: {
      Partner: {
        localKey: 'partnerId',
        localField: 'partner',
      },
    },
  },
});
