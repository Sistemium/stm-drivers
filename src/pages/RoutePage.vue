<template lang="pug">

.route

  h1 Маршрутные задания

  .has-driver(v-if="currentDriver")

    .navs-header

      mt-button.prev(:plain="true" @click="prevClick" :disabled="!prevRoute")
        i.el-icon-arrow-left(v-if="prevRoute")

      .title
        strong {{ title }}
        a(@click.prevent="chooseDriver(null)")
          i.el-icon-close

      mt-button.prev(:plain="true" @click="nextClick" :disabled="!nextRoute")
        i.el-icon-arrow-right(v-if="nextRoute")

    route-point-list(:route="currentRoute")

  choose-driver(v-else)

</template>
<script>

import { mapState, mapActions } from 'vuex';

import { SET_CURRENT } from '@/store/driver';

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

  computed: {
    ...mapState('driver', { currentDriver: 'current' }),
    title() {
      if (this.currentRoute) {
        return this.currentRoute.date;
      }
      return this.loading ? 'Загрузка' : 'Нет заданий';
    },
  },

  watch: {
    currentDriver() {
      this.refresh();
    },
    shipmentRoutes() {
      this.setCurrentRoute();
    },
  },

  methods: {

    ...mapActions('driver', { chooseDriver: SET_CURRENT }),

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
  return ShipmentRoute.findAll({ limit: 5, ...filter }, { with: ['routePoints'] });
}

</script>
<style scoped lang="scss">

</style>
