/* eslint-disable */

import Vue from 'vue';

// VUIKit
// import VKHeightViewport from 'vuikit/lib/height-viewport';
// Vue.directive('HeightViewport', VKHeightViewport);

// ElementUI
import { Breadcrumb, BreadcrumbItem } from 'element-ui';
import ru from 'element-ui/lib/locale/lang/ru-RU';
import locale from 'element-ui/lib/locale';

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);

locale.use(ru);

// MintUI
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

Vue.use(Mint);

// Loading overlay
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';

Vue.use(Loading);
