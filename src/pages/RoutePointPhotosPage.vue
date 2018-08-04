<template lang="pug">

.route-point-photos-page

  nav-header.sticky.secondary(
  left-icon="back"
  :prev="backClick"
  :title="`Фото в точке №${routePoint && routePoint.ord || '?'}`"
  )
    .outlet(v-if="outlet()")
      strong {{ outlet().partner.name }}
      small {{ outlet().address }}

  .photos
    .photo(v-for="photo in photos" :key="photo.id")
      .header
        .remove

          span(v-if="confirmDeleting(photo)") Точно удалить?

          a.btn-link(
          @click="removeClick(photo)"
          :class="{confirm: confirmDeleting(photo), warn: !confirmDeleting(photo)}"
          )
            | {{ confirmDeleting(photo) ? 'Да' : 'Удалить' }}

        .timestamp {{ photo.deviceCts | dateTime }}
      img(:src="photo.srcFull()")

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
      deleting: false,
      deletingTimeout: false,
    };
  },

  methods: {
    confirmDeleting({ id }) {
      return this.deleting === id;
    },
    removeClick(photo) {

      const cleanup = () => {
        this.deleting = false;
        clearTimeout(this.deletingTimeout);
      };

      if (this.deleting !== photo.id) {
        this.deleting = photo.id;
        if (this.deletingTimeout) clearTimeout(this.deletingTimeout);
        this.deletingTimeout = setTimeout(cleanup, 5000);
        return;
      }

      ShipmentRoutePointPhoto.destroy(photo)
        .finally(this.$loading.show().hide);

    },
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

  .header {
    display: flex;
    justify-content: space-between;
    font-size: 80%;
    color: $gray;
    .remove > * {
      margin-right: $margin-right / 2;
    }
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
      font-size: 90%;
    }
  }
}

</style>
