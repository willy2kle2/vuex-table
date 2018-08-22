const _ = require('lodash');
import Utils from '../utils/Utils';

export default {
    _oa_find(obj, path, default_value = null) {
      const result = Utils.find_value_with_path(obj, path.split('.'));
      if (!result) {
        return default_value;
      }
      return result;
    },
};
