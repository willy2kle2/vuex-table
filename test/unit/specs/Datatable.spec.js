import Vue from 'vue';
import Vuex from 'vuex';
import {shallowMount, mount, createLocalVue} from '@vue/test-utils';
import Datatable from '../../../src/components/datatable/Datatable.vue';
import LodashPlugin from '../../../src/plugins/lodash';
import Store from '../../../src/store';

const localVue = createLocalVue();
localVue.use(Vuex);

//Need to inject Lodash Plugin to test Datatable.vue
Vue.use(LodashPlugin);

const state = {};
const store = new Vuex.Store({ state });
const wrapper = shallowMount(Datatable, { store });

// EVENTS TESTS

wrapper.vm.$emit('checkbox');
wrapper.vm.$emit('check');
wrapper.vm.$emit('check-all');
wrapper.vm.$emit('change-page');

expect(wrapper.emitted().checkbox).toBeTruthy();
expect(wrapper.emitted().check).toBeTruthy();
expect(wrapper.emitted().checkAll).toBeTruthy();
expect(wrapper.emitted().changePage.length).toBe(2);

// PROPS TESTS


describe('Datatable.vue', () => {
  it('should  render content correctly', () => {
    const Constructor = Vue.extend(Datatable);
    const vm = new Constructor().$mount();
    expect(vm.$el)
      .toMatchSnapshot();
  });
  it('gets all basic props for rendering', () => {
    const props = {
      rows: [
        {id: 1, first_name: 'Jesse', last_name: 'Simmons', date: '2016-10-15 13:43:27', gender: 'Male'},
        {id: 2, first_name: 'John', last_name: 'Jacobs', date: '2016-12-15 06:00:53', gender: 'Male'},
        {id: 3, first_name: 'Tina', last_name: 'Gilbert', date: '2016-04-26 06:26:28', gender: 'Female'},
      ],
      columns: [
        {label: 'ID', field: 'id'},
        {label: 'First Name', field: 'first_name'},
        {label: 'Last Name', field: 'last_name'},
        {label: 'Date', field: 'date'},
        {label: 'Gender', gender: 'gender'},
      ],
      itemsPerPage: 3,
      currentPage: 1,
      selected: true,
      sortField: 'first_name',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      visible: true,
    };
    const Constructor = Vue.extend('Datatable');
    const component = new Constructor({propsData: props}).$mount;

    column.propsData({ visible: true });

    component.setData({
      state: {
        newRows: [
          {id: 1, first_name: 'Jesse', last_name: 'Simmons', date: '2016-10-15 13:43:27', gender: 'Male'},
          {id: 2, first_name: 'John', last_name: 'Jacobs', date: '2016-12-15 06:00:53', gender: 'Male'},
          {id: 3, first_name: 'Tina', last_name: 'Gilbert', date: '2016-04-26 06:26:28', gender: 'Female'},
        ],
        newCheckedRows: [
          {id: 1, first_name: 'Jesse', last_name: 'Simmons', date: '2016-10-15 13:43:27', gender: 'Male'},
          {id: 2, first_name: 'John', last_name: 'Jacobs', date: '2016-12-15 06:00:53', gender: 'Male'},
          {id: 3, first_name: 'Tina', last_name: 'Gilbert', date: '2016-04-26 06:26:28', gender: 'Female'},
        ],
        search: 'Jesse',
      }
    });
// TESTING BASIC COMPUTED PROPERTIES

    expect(component.vm.paginate_data).toEqual(3);
    expect(component.vm.is_all_checked).toBe(true);
    expect(component.vm.search_data.length).toEqual(1);
  });

// METHODS TESTS
});
