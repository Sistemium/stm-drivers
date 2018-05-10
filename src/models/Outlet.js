import STModel from '@/jsdata/STModel';

import './Partner';

export default new STModel('Outlet', {
  relations: {
    hasOne: {
      Partner: {
        localKey: 'partnerId',
        localField: 'partner',
      },
    },
  },
});
