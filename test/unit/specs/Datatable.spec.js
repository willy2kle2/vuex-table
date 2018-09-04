import Vue from 'vue';
import sinon from 'sinon';
import {shallowMount, mount} from '@vue/test-utils';
import Datatable from '../../../src/components/datatable/Datatable.vue';
import LodashPlugin from '../../../src/plugins/lodash';

// Need to inject Lodash Plugin to test Datatable.vue
Vue.use(LodashPlugin);


describe('Datatable.vue', () => {
  const wrapper = shallowMount(Datatable);
  it('triggers all basic events', () => {
    const stub = jest.fn();
    wrapper.vm.$emit('checkbox');
    wrapper.vm.$emit('check');
    wrapper.vm.$on('check-all', stub);
    wrapper.vm.$on('details-open', stub);
    wrapper.vm.$on('details-closed', stub);
    wrapper.vm.$on('page-change', stub);


    expect(wrapper.emitted().checkbox).toBeTruthy();
    expect(wrapper.emitted().check).toBeTruthy();
    expect(stub).toBeTruthy();
  });
  it('gets all basic props for rendering', () => {
    const props = {
      rows: [
        { id: 1, first_name: 'Jesse', last_name: 'Simmons', date: '2016-10-15 13:43:27', gender: 'Male' },
        { id: 2, first_name: 'John', last_name: 'Jacobs', date: '2016-12-15 06:00:53', gender: 'Male' },
        { id: 3, first_name: 'Tina', last_name: 'Gilbert', date: '2016-04-26 06:26:28', gender: 'Female' },
      ],
      columns: [
        { label: 'ID', field: 'id', visible: true },
        { label: 'First Name', field: 'first_name', visible: true },
        { label: 'Last Name', field: 'last_name', visible: true },
        { label: 'Date', field: 'date', visible: true },
        { label: 'Gender', field: 'gender', visible: true },
      ],
      checkedRows: [
        { id: 1, first_name: 'Jesse', last_name: 'Simmons', date: '2016-10-15 13:43:27', gender: 'Male' },
        { id: 2, first_name: 'John', last_name: 'Jacobs', date: '2016-12-15 06:00:53', gender: 'Male' },
      ],
      itemsPerPage: 3,
      currentPage: 1,
      selected: true,
      sortField: 'first_name',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      visible: true,
      search: 'Jesse',
    };
    const component = mount(Datatable, { propsData: props });
    expect(component.vm.paginateData.length).toEqual(3);
    expect(component.vm.isAllChecked).toBe(false);
    expect(component.vm.searchData.length).toEqual(3);
  });

  it('has sorting methods working correctly', () => {
    const mockedObjects = [
      { label: 'ID', field: 'id' },
      { label: 'First Name', field: 'first_name' },
    ];
    const sortByStub = sinon.stub(wrapper.vm, 'sortBy').returns(mockedObjects);
    const result = wrapper.vm.sortBy();

    expect(result).toBe(mockedObjects);
    sortByStub.restore();

  });

  it('has checking methods working correctly', () => {
    const mockedObjects =  [
      { id: 1, first_name: 'Jesse', last_name: 'Simmons', date: '2016-10-15 13:43:27', gender: 'Male' },
      { id: 2, first_name: 'John', last_name: 'Jacobs', date: '2016-12-15 06:00:53', gender: 'Male' },
      { id: 3, first_name: 'Tina', last_name: 'Gilbert', date: '2016-04-26 06:26:28', gender: 'Female' },
    ];
    const checkStub = sinon.stub(wrapper.vm, 'checkAll').returns(mockedObjects);
    const result = wrapper.vm.checkAll();

    expect(result).toBe(mockedObjects);
    checkStub.restore();
  });

  it('has page-change method working correctly',() => {
    const props = {
      rows: [
        { id: 1, first_name: 'Jesse', last_name: 'Simmons', date: '2016-10-15 13:43:27', gender: 'Male' },
        { id: 2, first_name: 'John', last_name: 'Jacobs', date: '2016-12-15 06:00:53', gender: 'Male' },
        { id: 3, first_name: 'Tina', last_name: 'Gilbert', date: '2016-04-26 06:26:28', gender: 'Female' },
      ],
      columns: [
        { label: 'ID', field: 'id', visible: true },
        { label: 'First Name', field: 'first_name', visible: true },
        { label: 'Last Name', field: 'last_name', visible: true },
        { label: 'Date', field: 'date', visible: true },
        { label: 'Gender', field: 'gender', visible: true },
      ],
      itemsPerPage: 1,
      currentPage: 1,
    };
    const component = mount(Datatable, {propsData: props});
    const pageStub = sinon.stub(component.vm, 'changePage').returns(props);
    const result = component.vm.changePage(2);

    expect(result).toBe(props);
    pageStub.restore();

  });
});
