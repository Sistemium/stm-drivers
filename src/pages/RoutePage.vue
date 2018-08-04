<template lang="pug">

.route

  h1.sticky(v-if="isRootState") Маршрутные задания

  nav-header.root-nav.sticky(
  v-else
  left-icon="back"
  :prev="goRootClick"
  )
    label {{ currentRouteTitle }}

  div(v-if="currentDriver")

    div(v-if="isRootState")

      nav-header(
      :prev="prevRoute ? prevClick : undefined"
      :next="nextRoute ? nextClick : undefined"
      :title="title"
      :right-badge="badge"
      )

      .buttons
        mt-button(
        v-for="(value, key) in workflowOptions" :key="key"
        :type="primaryWorkflowOption === key ? 'primary' : 'default'"
        @click = "saveProcessing(key)"
        ) {{ value }}

      route-point-list(v-if="currentRoute" :shipment-route-id="currentRoute.id")

    router-view(v-else)

  choose-driver(v-else)

</template>
<script>

import { mapState, mapActions, mapGetters } from 'vuex';
import { SET_DATE, LAST_DATE } from '@/store/driver';

import find from 'lodash/find';

import { dateFormat, serverDateFormat, tomorrow } from '@/config/moments';

import ChooseDriver from '@/components/ChooseDriver';
import RoutePointList from '@/components/RoutePointList';

import ShipmentRoute from '@/models/ShipmentRoute';

const name = 'RoutePage';

export default {

  name,

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
    ...mapGetters('driver', [LAST_DATE]),

    title() {
      if (this.currentRoute) {
        return dateFormat(this.currentRoute.date);
      }
      return this.loading ? 'Загрузка' : 'Нет заданий';
    },

    workflowOptions() {
      return this.currentRoute && this.currentRoute.workflow().to;
    },

    primaryWorkflowOption() {
      return this.currentRoute && this.currentRoute.workflow().primaryOption;
    },

    badge() {
      return this.nextRoute && this.nextRoute.date === serverDateFormat(tomorrow()) ? '1' : undefined;
    },

    isRootState() {
      return this.$route.name === 'RoutePage';
    },

    currentRouteTitle() {
      return this.currentRoute && `Маршрут ${this.currentRoute.date}`;
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

    ...mapActions('driver', { setLastDate: SET_DATE }),

    prevClick() {
      this.setCurrentRoute(this.prevRoute);
    },

    nextClick() {
      this.setCurrentRoute(this.nextRoute);
    },

    goRootClick() {
      const { date } = this.currentRoute;
      this.$router.push({ name, params: { date } });
    },

    setCurrentRoute(route) {

      const { shipmentRoutes } = this;

      const lastDate = this.$route.params.date || this[LAST_DATE];

      this.currentRoute = route || this.routeByDate(lastDate);

      const idx = shipmentRoutes.indexOf(this.currentRoute);

      this.nextRoute = idx > 0 ? shipmentRoutes[idx - 1] : undefined;
      this.prevRoute = idx >= 0 ? shipmentRoutes[idx + 1] : undefined;

      if (this.currentRoute) {
        this.$router.push({
          name: this.$route.name,
          params: { ...this.$route.params, date: this.currentRoute.date },
        });

        this.setLastDate(this.currentRoute.date);

      }

    },

    routeByDate(date) {
      return find(this.shipmentRoutes, { date }) || this.shipmentRoutes[0];
    },

    saveProcessing(processing) {

      this.currentRoute.processing = processing;
      this.currentRoute.save();

    },

    async refresh() {

      const { id: driverId } = this.currentDriver || {};

      if (driverId) {

        const filter = { driverId, orderBy: [['date', 'DESC']] };
        this.shipmentRoutes = ShipmentRoute.bindAll(this, filter, 'shipmentRoutes');

        await ShipmentRoute.findAll({ limit: 50, ...filter })
          .then(this.$loading.show().hide);

      } else {

        ShipmentRoute.unbindAll(this);
        this.shipmentRoutes = [];

      }

    },

  },

  created() {
    this.refresh();
  },

  beforeDestroy() {
    ShipmentRoute.unbindAll(this);
  },

  beforeRouteUpdate(to, from, next) {

    if (to.name === name) {
      if (to.params.date !== this.currentRoute.date) {
        this.setCurrentRoute(this.routeByDate(to.params.date));
      }
    }

    next();

  },

};


</script>
<style scoped lang="scss">

@import "../styles/variables";

.buttons {
  margin-bottom: $margin-top;
  button:first-child {
    margin-top: 0;
  }
}

.root-nav {
  background: $gray-background;
}

</style>
