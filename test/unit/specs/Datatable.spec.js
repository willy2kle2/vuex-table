import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import Datatable from '../../../src/components/datatable/Datatable.vue';

const wrapper = shallowMount(Datatable);

// EVENTS TESTS
wrapper.vm.$emit('checkbox');
wrapper.vm.$emit('check');
wrapper.vm.$emit('check-all');

expect(wrapper.emitted().checkbox.toBeTruthy());
expect(wrapper.emitted().check.toBeTruthy());
expect(wrapper.emitted().checkAll.toBeTruthy());


/*
describe('Datatable.vue', () => {
  it('should  render content correctly', () => {
    const Constructor = Vue.extend(Datatable);
    const vm = new Constructor().$mount();
    expect(vm.$el)
      .toMatchSnapshot();
  });
});
*/
