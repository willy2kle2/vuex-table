// Import vue component
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.css';
import './assets/styles/datatable.scss';
import './assets/styles/paginator.scss';
import VuexTable from '../src/components/datatable/Datatable.vue';
import VuexColumn from '../src/components/column/Column.vue';


// Declare install function executed by Vue.use()
export function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('vuex-table', VuexTable);
  Vue.component('vuex-column', VuexColumn);
}

// Create module definition for Vue.use()
const plugin = {
  install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default VuexTable;
