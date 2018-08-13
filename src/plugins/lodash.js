import _ from 'lodash';

module.exports = {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$lodash', { value: _ });
  },
};
