/* eslint-disable */

import Vue from 'vue';

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
