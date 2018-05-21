import Model from '@/jsdata/Model';

export default new Model('Location', {

  notify: false,

  relations: {
    hasMany: {
      ShipmentRoutePoint: {
        foreignKey: 'reachedAtLocationId',
        localField: 'shipmentRoutePoints',
      },
    },
  },

});
