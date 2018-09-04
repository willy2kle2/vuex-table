/**
 * @requires [LodashPlugin]{@link https://lodash.com/}
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.css';
import './assets/styles/datatable.scss';
import './assets/styles/paginator.scss';
import App from './App';
import LodashPlugin from './plugins/lodash';

Vue.use(BootstrapVue);
Vue.use(LodashPlugin);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
