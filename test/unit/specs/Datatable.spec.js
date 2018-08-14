import Vue from 'vue';
import { shallowMount, mount } from '@vue/test-utils';
import Datatable from '../../../src/components/datatable/Datatable.vue';
import LodashPlugin from '../../../src/plugins/lodash';

// Need to inject Lodash Plugin to test Datatable.vue
Vue.use(LodashPlugin);

// const wrapper = shallowMount(Datatable);
//
// // EVENTS TESTS
//
// wrapper.vm.$emit('checkbox');
// wrapper.vm.$emit('check');
// wrapper.vm.$emit('check-all');
// wrapper.vm.$emit('change-page');
//
// expect(wrapper.emitted().checkbox).toBeTruthy();
// expect(wrapper.emitted().check).toBeTruthy();
// expect(wrapper.emitted().checkAll).toBeTruthy();
// expect(wrapper.emitted().changePage.length).toBe(2);

// PROPS TESTS

describe('Datatable.vue', () => {
  it('gets all basic props for rendering', () => {
    const props = {
      rows: [
        { id: 1, first_name: 'Jesse', last_name: 'Simmons', date: '2016-10-15 13:43:27', gender: 'Male' },
        { id: 2, first_name: 'John', last_name: 'Jacobs', date: '2016-12-15 06:00:53', gender: 'Male' },
        { id: 3, first_name: 'Tina', last_name: 'Gilbert', date: '2016-04-26 06:26:28', gender: 'Female' },
      ],
      columns: [
        { label: 'ID', field: 'id' },
        { label: 'First Name', field: 'first_name' },
        { label: 'Last Name', field: 'last_name' },
        { label: 'Date', field: 'date' },
        { label: 'Gender', gender: 'gender' },
      ],
      itemsPerPage: 3,
      currentPage: 1,
      selected: true,
      sortField: 'first_name',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      visible: true,
    };
    const wrapper = mount(Datatable, { propsData: props });
    expect(wrapper.vm.paginate_data).toEqual(3);
    expect(wrapper.vm.is_all_checked).toBe(true);
    expect(wrapper.vm.search_data.length).toEqual(1);
  });
});
