import STModel from '@/jsdata/STModel';

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
