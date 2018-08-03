<template lang="pug">

.route-point-photos-page

  nav-header(
  left-icon="back"
  :prev="backClick"
  :title="`Фото в точке маршрута №${routePoint && routePoint.ord || '?'}`"
  )

  .photos
    .photo(v-for="photo in photos" :key="photo.id")
      .timestamp {{ photo.deviceCts | dateTime }}
      img(:src="photo.href")

</template>
<script>

import ShipmentRoutePoint from '@/models/ShipmentRoutePoint';
import ShipmentRoutePointPhoto from '@/models/ShipmentRoutePointPhoto';

export default {

  name: 'RoutePointPhotosPage',

  props: ['routePointId'],

  data() {
    return {
      routePoint: null,
      photos: [],
    };
  },

  methods: {
    backClick() {
      const { routePointId } = this;
      this.$router.push({ name: 'RoutePointPage', params: { routePointId } });
    },
  },

  created() {
    const { routePointId } = this;
    const filter = { shipmentRoutePointId: routePointId, orderBy: [['deviceCts', 'DESC']] };
    this.routePoint = ShipmentRoutePoint.bindOne(this, routePointId, 'routePoint');
    this.photos = ShipmentRoutePointPhoto.bindAll(this, filter, 'photos');
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.photos {
  padding: 0 $margin-right;
}

.photo {

  margin-bottom: $margin-top;
  text-align: center;

  background: $gray-background;
  border-radius: 9px;
  border: solid 1px $gray-border-color;
  padding: $margin-right;

  .timestamp {
    text-align: right;
    font-size: 80%;
    color: $gray;
  }

  img {
    margin-top: $margin-right;
    max-width: 100%;
  }
}

</style>
