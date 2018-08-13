import _ from 'lodash';

export default {
  methods: {
    install(Vue) {
      Object.defineProperty(Vue.prototype, '$lodash', { value: _ });
    },
  }
};
