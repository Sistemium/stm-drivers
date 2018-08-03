<template lang="pug">

.route-point-photos-page

  nav-header.sticky.secondary(
  left-icon="back"
  :prev="backClick"
  :title="`Фото в точке №${routePoint && routePoint.ord || '?'}`"
  )
    .outlet(
    v-if="outlet()"
    )
      strong {{ outlet().partner.name }}
      small {{ outlet().address }}

  //.cell-list

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
      // TODO: refactor backClick without specifying route name with string literal private constant
      this.$router.push({ name: 'RoutePointPage', params: { routePointId } });
    },
    outlet() {
      return this.routePoint && this.routePoint.outlet;
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

  margin: $margin-top 0;
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

.sticky {

  @extend %list-cell-bordered;

  .outlet {
    > * {
      display: block;
    }
    strong {
      color: $dark-gray;
    }
    small {
      color: $gray;
      font-size: 75%;
    }
  }
}

</style>
