<template lang="pug">

.route-point-details

  .cell-list

    mt-cell.outlet.sticky.secondary(
    v-if="outlet()"
    :title="outlet().partner.name"
    :label="outlet().address"
    )
      .stats {{ routePoint.shipmentStats() | routePointStats }}

    mt-cell.reached-at(
    v-if="isReached"
    title="Прибытие отмечено"
    :label="checkInLabel()"
    )
      small {{ accuracyLabel }}
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
    )
      shipment-stats(:shipment="item.shipment")

</template>
<script>

import Vue from 'vue';
import take from 'lodash/take';
import round from 'lodash/round';

import { MessageBox } from 'mint-ui';

import nsDebug from '@/services/debug';
import getLocation from '@/services/locationHelper';

import ShipmentPosition from '@/models/ShipmentPosition';
import ShipmentRoutePointShipment from '@/models/ShipmentRoutePointShipment';
import ShipmentRoutePointPhoto from '@/models/ShipmentRoutePointPhoto';
import Location from '@/models/Location';

import TakePhotoButton from './TakePhotoButton';
import ShipmentStats from './ShipmentStats';

const debug = nsDebug('RoutePointDetails');

export default {

  components: { TakePhotoButton, ShipmentStats },
  props: { routePoint: Object },

  data() {
    return {
      routePointPhotos: [],
      routePointShipments: [],
      reachedAtLocation: null,
    };
  },

  computed: {
    isReached() {
      return !!this.routePoint.reachedAtLocationId;
    },
    headLinePhotos() {
      return this.routePointPhotos.length && take(this.routePointPhotos, 4);
    },
    accuracyLabel() {
      if (!this.isReached) {
        return '';
      }
      const { horizontalAccuracy } = this.reachedAtLocation || {};
      if (!horizontalAccuracy) return '';
      let res = `${horizontalAccuracy} м.`;
      if (horizontalAccuracy > 900) {
        res = `${round(horizontalAccuracy / 1000, 1)} км.`;
      } else if (horizontalAccuracy > 200) {
        res = `${Math.floor(horizontalAccuracy / 100) * 100} м.`;
      }
      return `± ${res}`;
    },
  },

  methods: {

    checkInLabel() {

      const location = this.reachedAtLocation;

      if (!location) return '';

      const { timestamp } = location;

      return `${this.$options.filters.dateTime(timestamp)}`;

    },

    outlet() {
      return this.routePoint.outlet;
    },

    async imageDone(data) {
      const { id: shipmentRoutePointId } = this.routePoint;
      await ShipmentRoutePointPhoto.create({ ...data, shipmentRoutePointId });
      this.$forceUpdate();
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
        const { routePointShipments } = this.routePoint;
        const promises = routePointShipments.map(({ shipment }) =>
          shipment.loadRelations([
            'positions',
            'positions.article',
          ]));
        await Promise.all(promises);
        await this.routePoint.loadRelations('routePointPhotos');
      } catch (e) {
        debug('refresh:error', e);
      }

      loading.hide();

      ShipmentRoutePointShipment.bindAll(this, filter, 'routePointShipments');
      const filterLocation = () => this.routePoint.reachedAtLocationId;
      Location.bindOne(this, filterLocation, 'reachedAtLocation');

      this.$forceUpdate();

    },

    async checkInCreate() {

      const loading = this.$loading.show();

      await getLocation(150, 1000, this.routePoint.id, 'RoutePoint', 30000)
        .then(location => {

          const { id: reachedAtLocationId } = location;

          this.routePoint.isReached = true;
          this.routePoint.reachedAtLocationId = reachedAtLocationId;
          this.reachedAtLocation = location;

          return this.routePoint.save();

        })
        .catch(e => {

          const message = e.message || e.error || e.toString();

          debug('checkInCreate', message);

          MessageBox({
            title: 'Ошибка геолокации',
            message,
            confirmButtonText: 'ОК',
          });

        });

      loading.hide();

    },

  },

  created() {
    const setReactive = () => {
      Vue.util.defineReactive(this.routePoint, 'reachedAtLocationId');
    };
    ShipmentPosition.bind(this);
    ShipmentRoutePointShipment.bind(this);
    this.$watch('routePoint', setReactive, { immediate: true });
    this.refresh();
  },

  beforeDestroy() {
    ShipmentPosition.unbindAll(this);
    ShipmentRoutePointPhoto.unbindAll(this);
    ShipmentRoutePointShipment.unbindAll(this);
    Location.unbindAll(this);
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

.title {

  display: flex;
  align-items: center;
  justify-content: space-between;

}

.stats {
  font-size: small;
}

.label {
  margin-top: 4px;
  color: $gray;
  font-size: 75%;
}

</style>
