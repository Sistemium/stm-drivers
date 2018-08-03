<template lang="pug">

.route-point-list.cell-list

  transition-group(name="flip-list")

    mt-cell.route-point(
    v-for='(routePoint, index) in orderedRoutePoints' :key="routePoint.id"
    :to="{name: routeName, params: routeParams(routePoint)}"
    )

      span(v-if="!reordering") {{ routePoint.routePointShipments.length }}н

      button(
      @click.prevent.stop="reorder(routePoint, -1)"
      v-if="reordering"
      :disabled = "index === 0"
      )
        i.el-icon-arrow-up

      button(
      @click.prevent.stop="reorder(routePoint, 1)"
      v-if="reordering"
      :disabled = "index === orderedRoutePoints.length - 1"
      )
        i.el-icon-arrow-down

      template(slot="title")
        .title
          span.ord {{ routePoint.ord || '?' }}
          span.done(v-if="routePoint.reachedAtLocationId")
            i.el-icon-check
          span.photo(v-if="routePoint.routePointPhotos.length")
            i.el-icon-picture-outline
          span {{ rowTitle(routePoint) }}
        .label {{ rowLabel(routePoint) }}

</template>
<script>

import Vue from 'vue';
import ShipmentRoutePoint from '@/models/ShipmentRoutePoint';
import ShipmentRoute from '@/models/ShipmentRoute';
import orderBy from 'lodash/orderBy';
import maxBy from 'lodash/maxBy';
import get from 'lodash/get';
import fpForEach from 'lodash/fp/forEach';

export default {

  data() {
    return {
      routePoints: this.bindRoutePoints(),
      shipmentRoute: ShipmentRoute.bindOne(this, this.shipmentRouteId, 'shipmentRoute'),
    };
  },

  watch: {
    shipmentRouteId() {
      this.shipmentRoute = ShipmentRoute.bindOne(this, this.shipmentRouteId, 'shipmentRoute');
      this.routePoints = this.bindRoutePoints();
      this.refresh();
    },
  },

  props: {
    shipmentRouteId: String,
    routeName: { type: String, default: 'RoutePointPage' },
    routeParamName: { type: String, default: 'routePointId' },
  },

  computed: {

    orderedRoutePoints() {
      return orderBy(this.routePoints, 'ord');
    },

    reordering() {
      return this.shipmentRoute.processing === 'routing';
      // return true;
    },

  },

  methods: {

    rowLabel(routePoint) {
      return get(routePoint, 'outlet.address');
    },

    rowTitle(routePoint) {
      return get(routePoint, 'outlet.partner.shortName');
    },

    bindRoutePoints() {
      const { shipmentRouteId } = this;
      return ShipmentRoutePoint.bindAll(this, { shipmentRouteId, orderBy: [['ord', 'ASC']] }, 'routePoints');
    },

    routeParams(routePoint) {
      return { ...this.$route.params, [this.routeParamName]: routePoint.id };
    },

    refresh() {
      findAll(this.shipmentRouteId)
        .then(fpForEach(point => {

          this.reorder(point, 0);

        }))
        .then(this.$loading.show().hide);
    },

    reorder(routePoint1, change) {

      if (!routePoint1.ord) {

        const max = maxBy(this.orderedRoutePoints, 'ord');

        if (max) {
          setOrd(routePoint1, max.ord + 1);
        } else {
          setOrd(routePoint1, 1);
        }

        routePoint1.save();

        return;

      }

      if (change === 0) {
        return;
      }

      const routePoint2 = this.orderedRoutePoints[(routePoint1.ord + change) - 1];

      if (!routePoint2 || !routePoint2.ord) {
        return;
      }

      setOrd(routePoint2, routePoint1.ord);
      setOrd(routePoint1, routePoint1.ord + change);

      routePoint2.save();
      routePoint1.save();

    },

  },

  created() {
    this.refresh();
  },

  beforeDestroy() {
    ShipmentRoutePoint.unbindAll(this);
  },

};

function setOrd(routePoint, ord) {
  Vue.set(routePoint, 'ord', ord);
}

function findAll(shipmentRouteId) {

  if (!shipmentRouteId) {
    return Promise.resolve();
  }

  return ShipmentRoutePoint.findAll({ shipmentRouteId }, {
    with: [
      'outlet',
      'outlet.partner',
      'reachedAtLocation',
      'routePointShipments',
      'routePointShipments.shipment',
      'routePointPhotos',
    ],
    // TODO: move routePoint loading to RoutePage
    force: true,
  });
  //
  // return Promise.all(res.map(routePoint =>
  //   routePoint.loadRelations([
  //     // 'routePointShipments.shipment.positions',
  //   ])));

}

</script>
<style scoped lang="scss">

@import "../styles/variables";

.label {
  margin-top: 4px;
  color: $gray;
  font-size: 75%;
}

.route-point {
  button {
    flex: 1;
    padding: 10px 7px;
  }
}

.title > span {
  margin-right: 7px;
  i {
    color: $green;
  }
}

.ord {
  font-size: 75%;
  display: inline-block;
  padding: 2px 4px;
  background: $gray-background;
  border-radius: 5px;
  position: relative;
  top: -4px;
}

.done {
  i {
    font-size: 75%;
    top: -4px;
    position: relative;
  }
}

.reorder {

  margin-left: 8px;

}

.flip-list-move {
  transition: transform 0.3s;
}

</style>
