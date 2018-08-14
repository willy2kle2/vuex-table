/**
 * @requires [LodashPlugin]{@link https://lodash.com/}
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import BootstrapVue from 'bootstrap-vue';
import LodashPlugin from './plugins/lodash';
import store from './store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.css';

Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(LodashPlugin);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
});
