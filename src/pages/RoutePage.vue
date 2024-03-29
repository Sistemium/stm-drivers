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
      :right-badge="badge"
      )
        b {{ title }}
        small(v-if="currentRoute") {{ currentRoute.shipmentStats() | routePointStats }}

      .buttons

        mt-button(
        v-for="(value, key) in workflowOptions" :key="key"
        :type="primaryWorkflowOption === key ? 'primary' : 'default'"
        @click = "saveProcessing(key)"
        ) {{ value }}

        route-form(
        v-if="editable"
        :shipment-route="currentRoute"
        )

      route-point-list(
      :reordering="editable"
      v-if="currentRoute"
      :shipment-route-id="currentRouteId"
      )

    router-view(v-else)

  choose-driver(v-else)

</template>
<script>

import { mapState, mapActions, mapGetters } from 'vuex';
import { SET_DATE, LAST_DATE } from '@/store/driver';

import find from 'lodash/find';

import { dateFormat, serverDateFormat, tomorrow } from '@/config/moments';
import nsDebug from '@/services/debug';

import ChooseDriver from '@/components/ChooseDriver';
import RoutePointList from '@/components/RoutePointList';
import RouteForm from '@/components/RouteForm';

import ShipmentRoute from '@/models/ShipmentRoute';
import ShipmentPosition from '@/models/ShipmentPosition';

const name = 'RoutePage';
const debug = nsDebug('route-page');

export default {

  name,

  data() {
    return {
      shipmentRoutes: [],
      currentRoute: undefined,
      nextRoute: undefined,
      prevRoute: undefined,
      popupVisible: false,
    };
  },

  components: { RoutePointList, ChooseDriver, RouteForm },

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

    editable() {
      return this.currentRoute && this.currentRoute.workflow().editable;
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

    currentRouteId() {
      return this.currentRoute && this.currentRoute.id;
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

        debug('setCurrentRoute', this.currentRoute.date);

      } else {
        debug('setCurrentRoute', '!route');
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

      if (!driverId) {

        ShipmentRoute.unbindAll(this);
        this.shipmentRoutes = [];

        return;

      }

      const filter = { driverId, orderBy: [['date', 'DESC']] };

      ShipmentRoute.bindAll(this, filter, 'shipmentRoutes');

      const loading = this.$loading.show();

      try {
        await ShipmentRoute.findAll({ limit: 50, ...filter });
      } catch (e) {
        debug(e.name, e.message);
      }

      loading.hide();

      debug('refresh end');

    },

  },

  created() {
    ShipmentPosition.bind(this);
    return this.refresh();
  },

  beforeDestroy() {
    ShipmentPosition.unbindAll(this);
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

.nav-header {
  b {
    font-size: 85%;
  }
  small {
    color: $gray;
    font-size: 70%;
  }
}

</style>
