const _ = require('lodash');
import '../utils/Utils';

export default {
  methods: {
    _oa_find(obj, path, default_value = null) {
      const result = this.find_value_with_path(obj, path.split('.'));
      if (!result) {
        return default_value;
      }
      return result;
    },
  },
};
