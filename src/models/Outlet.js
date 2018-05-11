import STModel from '@/jsdata/Model';

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
