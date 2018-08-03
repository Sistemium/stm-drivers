<template lang="pug">

.route-point-details

  .cell-list

    mt-cell.outlet(
    v-if="outlet()"
    :title="outlet().partner.name"
    :label="outlet().address"
    )

    mt-cell.reached-at(
    v-if="reachedAtLocation()"
    title="Прибытие отмечено"
    :label="reachedAtLocation().timestamp | dateTime"
    )
      i.el-icon-location

    mt-cell.route-point-photos(
    is-link
    :to="{ name: 'RoutePointPhotosPage', params: { routePointId: routePoint.id } }"
    title="Фото-отчеты"
    v-if="routePointPhotos.length"
    :label="`${routePointPhotos.length} шт.`"
    )
      img.thumbnail(
      v-for="img in headLinePhotos" :key="img.id"
      :src="img.thumbnailHref"
      )

  .buttons

    mt-button(
    type="primary"
    @click="checkInClick"
    ) Отметить прибытие

    vue-core-image-upload.make-photo(
    :crop="false"
    @imageuploaded="imageUploaded"
    :data="imageData"
    :max-file-size="5242880"
    :headers="uploadHeaders"
    :url="imsUrl()"
    )
      mt-button() Сделать Фото-отчет

  .section-title Накладные

  .cell-list

    mt-cell.shipment(
    v-for="item in routePoint.routePointShipments" :key="item.id"
    :title="item.shipment.ndoc"
    :label="item.shipment.commentText"
    :to="{name: 'RoutePointShipmentPage', params: routeParams(item.shipment)}"
    ) {{ item.shipment.totalBoxes() | boxes }}

</template>
<script>

import Vue from 'vue';
import take from 'lodash/take';
import { mapState } from 'vuex';
import { MessageBox } from 'mint-ui';
import getLocation from '@/services/locationHelper';
import { serverDateFormat } from '@/config/moments';
import VueCoreImageUpload from 'vue-core-image-upload';

import ShipmentRoutePointShipment from '@/models/ShipmentRoutePointShipment';
import ShipmentRoutePointPhoto from '@/models/ShipmentRoutePointPhoto';

export default {

  components: { VueCoreImageUpload },
  props: ['routePoint'],

  data() {
    return { imageData: null, routePointPhotos: [] };
  },

  computed: {
    ...mapState('auth', { token: 'id' }),
    uploadHeaders() {
      return { authorization: this.token };
    },
    headLinePhotos() {
      return this.routePointPhotos.length && take(this.routePointPhotos, 3);
    },
  },

  methods: {

    outlet() {
      return this.routePoint.outlet;
    },

    reachedAtLocation() {
      return this.routePoint.reachedAtLocation;
    },

    imsUrl() {
      return `/ims?folder=ShipmentRoutePointPhoto/${serverDateFormat()}`;
    },

    imageUploaded({ pictures: picturesInfo }) {

      const { id: shipmentRoutePointId } = this.routePoint;
      ShipmentRoutePointPhoto.create({ shipmentRoutePointId, picturesInfo });

    },

    checkInClick() {

      MessageBox({
        title: 'Вопрос',
        message: 'Отметить прибытие в точку?',
        showCancelButton: true,
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет',
      })
        .then(result => result === 'confirm' && this.checkInCreate());
    },

    routeParams(shipment) {
      return { ...this.$route.params, shipmentId: shipment.id };
    },

    async refresh() {

      await Promise.all(this.routePoint.routePointShipments.map(routePointShipment =>
        routePointShipment.shipment.loadRelations([
          'positions',
          'positions.article',
        ]))).then(this.$loading.show().hide);

      await this.routePoint.loadRelations('routePointPhotos');

      const filter = { shipmentRoutePointId: this.routePoint.id, orderBy: [['deviceCts', 'DESC']] };
      this.routePointPhotos = ShipmentRoutePointPhoto.bindAll(this, filter, 'routePointPhotos');

      this.$forceUpdate();

    },

    checkInCreate() {

      getLocation(150, 1000, this.routePoint.id, 'RoutePoint', 10000)
        .then(({ id: reachedAtLocationId }) => {

          Object.assign(this.routePoint, {
            isReached: true,
            reachedAtLocationId,
          });

          return this.routePoint.save()
            .then(() => Vue.set(this.routePoint, { reachedAtLocationId }));

        })
        .catch(e => {

          const message = e.message || e.error || e.toString();

          MessageBox({
            title: 'Ошибка геолокации',
            message,
            confirmButtonText: 'ОК',
          });

        })
        .finally(this.$loading.show().hide);

    },

  },

  created() {
    ShipmentRoutePointShipment.bind(this);
    this.refresh();
  },

  beforeDestroy() {
    ShipmentRoutePointShipment.unbindAll(this);
  },

  watch: {
    routePoint() {
      this.refresh();
    },
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.el-icon-location {
  font-size: 120%;
  color: lighten(green, 10%);
}

.make-photo {
  border: solid 1px $gray-border-color;
  border-radius: 4px;
}

$thumbnail-size: 35px;

img.thumbnail {
  margin-left: $margin-right;
  max-height: $thumbnail-size;
  max-width: $thumbnail-size;
}

</style>
