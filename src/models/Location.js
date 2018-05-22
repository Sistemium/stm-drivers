import Model from '@/jsdata/Model';

export default new Model({

  name: 'Location',

  relations: {
    hasMany: {
      ShipmentRoutePoint: {
        foreignKey: 'reachedAtLocationId',
        localField: 'shipmentRoutePoints',
      },
    },
  },

});
