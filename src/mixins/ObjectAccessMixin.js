import Utils from '../utils/Utils';

const _ = require('lodash');

export default {
  methods: {
    _oa_find(obj, path, default_value = null) {
      const result = Utils.find_value_with_path(obj, path.split('.'));
      if (!result) {
        return default_value;
      }
      return result;
    },
  },
};
