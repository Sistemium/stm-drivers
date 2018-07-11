/* eslint-disable */

import 'es6-promise/auto';

// VUE
import Vue from 'vue';

Vue.config.productionTip = false;

// VUIKit
// import VKHeightViewport from 'vuikit/lib/height-viewport';
// Vue.directive('HeightViewport', VKHeightViewport);

// Axios
import http from 'axios';
const defaultHTTPAdapter = require('axios/lib/adapters/http');
import axiosScriptMessaging from '@/jsdata/axiosScriptMessaging';
import {isNative} from '@/services/native';
if (isNative()){

  http.defaults.adapter = axiosScriptMessaging;

}

// ElementUI
import { Breadcrumb, BreadcrumbItem, Alert } from 'element-ui';
import ru from 'element-ui/lib/locale/lang/ru-RU';
import locale from 'element-ui/lib/locale';

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Alert);

locale.use(ru);

// MintUI
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

Vue.use(Mint);

// Loading overlay
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';

Vue.use(Loading);
