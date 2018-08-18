<template lang="pug">

.route-point-details

  .cell-list

    mt-cell.outlet.sticky.secondary(
    v-if="outlet()"
    :title="outlet().partner.name"
    :label="outlet().address"
    )

    mt-cell.reached-at(
    v-if="isReached"
    title="Прибытие отмечено"
    :label="checkInLabel()"
    )
      small {{ accuracyLabel() }}
      mt-button.checking-again(size="small" v-if="isReached" @click="checkInClick")
        span Уточнить

    mt-cell.route-point-photos(
    is-link
    :to="{ name: 'RoutePointPhotosPage', params: { routePointId: routePoint.id } }"
    title="Фото-отчеты"
    v-if="routePointPhotos.length"
    :label="`${routePointPhotos.length} шт.`"
    )
      img.thumbnail(
      v-for="img in headLinePhotos" :key="img.id"
      :src="img.srcThumbnail()"
      )

  .buttons

    mt-button(
    v-if="!isReached"
    type="primary"
    @click="checkInClick"
    ) Отметить прибытие

    take-photo-button.make-photo(
    :done="imageDone"
    entity-name="ShipmentRoutePointPhoto"
    ) Сделать Фото-отчет

  .section-title Накладные

  .cell-list

    mt-cell.shipment(
    v-for="item in routePointShipments" :key="item.id"
    :title="item.shipment.ndoc | ndoc"
    :label="item.shipment.commentText"
    :to="{name: 'RoutePointShipmentPage', params: routeParams(item.shipment)}"
    ) {{ item.shipment.totalBoxes() | boxes }}

</template>
<script>

import Vue from 'vue';
import take from 'lodash/take';
import round from 'lodash/round';

import { MessageBox } from 'mint-ui';

import getLocation from '@/services/locationHelper';
import ShipmentRoutePointShipment from '@/models/ShipmentRoutePointShipment';
import ShipmentRoutePointPhoto from '@/models/ShipmentRoutePointPhoto';

import TakePhotoButton from './TakePhotoButton';

const debug = require('@/services/debug').default('RoutePointDetails');

export default {

  components: { TakePhotoButton },
  props: ['routePoint'],

  data() {
    return { routePointPhotos: [], routePointShipments: [] };
  },

  computed: {
    isReached() {
      return !!this.routePoint.reachedAtLocationId;
    },
    headLinePhotos() {
      return this.routePointPhotos.length && take(this.routePointPhotos, 4);
    },
  },

  methods: {

    accuracyLabel() {
      const { horizontalAccuracy } = this.reachedAtLocation() || {};
      if (!horizontalAccuracy) return '';
      let res = `${horizontalAccuracy} м.`;
      if (horizontalAccuracy > 900) {
        res = `${round(horizontalAccuracy / 1000, 1)} км.`;
      } else if (horizontalAccuracy > 200) {
        res = `${Math.floor(horizontalAccuracy / 100) * 100} м.`;
      }
      return `± ${res}`;
    },

    checkInLabel() {

      const location = this.reachedAtLocation();

      if (!location) return '';

      const { timestamp } = location;

      return `${this.$options.filters.dateTime(timestamp)}`;

    },

    outlet() {
      return this.routePoint.outlet;
    },

    reachedAtLocation() {
      return this.routePoint.reachedAtLocation;
    },

    imageDone(data) {
      const { id: shipmentRoutePointId } = this.routePoint;
      ShipmentRoutePointPhoto.create({ ...data, shipmentRoutePointId });
    },

    checkInClick() {

      const message = `${this.isReached ? 'Заново о' : 'О'}тметить прибытие в точку?`;

      MessageBox({
        title: 'Вопрос',
        message,
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

      const filter = { shipmentRoutePointId: this.routePoint.id, orderBy: [['deviceCts', 'DESC']] };

      ShipmentRoutePointPhoto.bindAll(this, filter, 'routePointPhotos');

      const loading = this.$loading.show();

      try {
        await Promise.all(this.routePoint.routePointShipments.map(routePointShipment =>
          routePointShipment.shipment.loadRelations([
            'positions',
            'positions.article',
          ])));
        await this.routePoint.loadRelations('routePointPhotos');
        this.$forceUpdate();
      } catch (e) {
        debug('refresh', e);
      }

      loading.hide();

      ShipmentRoutePointShipment.bindAll(this, filter, 'routePointShipments');

      this.$forceUpdate();

    },

    checkInCreate() {

      const loading = this.$loading.show();

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
        .finally(() => loading.hide());

    },

  },

  created() {
    ShipmentRoutePointShipment.bind(this);
    this.refresh();
  },

  beforeDestroy() {
    ShipmentRoutePointPhoto.unbindAll(this);
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

$thumbnail-size: 35px;

img.thumbnail {
  margin-left: $margin-right;
  max-height: $thumbnail-size;
  max-width: $thumbnail-size;
}

.checking-again {
  padding: 2px 6px;
  height: auto;
  margin-left: $margin-right;
}

.reached-at {
  border-top: none;
}

</style>
