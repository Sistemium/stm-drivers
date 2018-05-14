<template lang="pug">

.route

  .has-driver(v-if="currentDriver")

    .title
      span {{ currentDriver.name }}
      a(href @click.prevent="clearDriverClick()")
        i.el-icon-close

    mt-header(v-if="currentRoute" :title="currentRoute.date")
      a.prev(slot="left" v-if="prevRoute" @click="prevClick")
        i.el-icon-arrow-left
      a.next(slot="right" v-if="nextRoute" @click="nextClick")
        i.el-icon-arrow-right

    route-point-list(:route="currentRoute")

  choose-driver(v-else)

</template>
<script>

import { mapState, mapMutations } from 'vuex';
import { DRIVER_CHOSEN } from '@/store/driver';

import ChooseDriver from '@/components/ChooseDriver';
import RoutePointList from '@/components/RoutePointList';

import ShipmentRoute from '@/models/ShipmentRoute';

export default {

  data() {
    return {
      shipmentRoutes: [],
      currentRoute: undefined,
      nextRoute: undefined,
      prevRoute: undefined,
    };
  },

  components: { RoutePointList, ChooseDriver },

  computed: mapState('driver', { currentDriver: 'current' }),

  watch: {
    currentDriver() {
      this.refresh();
    },
    shipmentRoutes() {
      this.setCurrentRoute();
    },
  },

  methods: {

    ...mapMutations('driver', { clearDriverClick: DRIVER_CHOSEN }),

    prevClick() {
      this.setCurrentRoute(this.prevRoute);
    },

    nextClick() {
      this.setCurrentRoute(this.nextRoute);
    },

    setCurrentRoute(route) {

      const { shipmentRoutes } = this;
      this.currentRoute = route || shipmentRoutes[0];

      const idx = shipmentRoutes.indexOf(this.currentRoute);

      this.nextRoute = idx > 0 ? shipmentRoutes[idx - 1] : undefined;
      this.prevRoute = idx >= 0 ? shipmentRoutes[idx + 1] : undefined;

    },

    refresh() {

      const { id: driverId } = this.currentDriver || {};

      if (driverId) {
        const filter = { driverId, orderBy: [['date', 'DESC']] };
        this.shipmentRoutes = ShipmentRoute.bindAll(this, filter, 'shipmentRoutes');
        const loader = this.$loading.show();
        findAll(filter)
          .then(loader.hide);
      } else {
        ShipmentRoute.unbindAll(this);
        this.shipmentRoutes = [];
      }

    },

  },

  created() {
    this.refresh();
  },

};

function findAll(filter) {
  return ShipmentRoute.findAll({ limit: 5, ...filter }, { with: ['routePoints'], force: true });
}

</script>
<style lang="scss">

@import "../styles/variables";

.route .has-driver {

  > .title {

    a {
      margin-left: 5px;
    }

  }

  .mint-header {

    background: none;
    color: $black;
    margin: 7px 0;

    h1 {
      font-weight: 700;
    }

    a.prev, a.next {
      cursor: pointer;
      padding: 5px;
    }

  }

}


</style>
