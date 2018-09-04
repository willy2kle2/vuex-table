import Utils from '../utils/Utils';

export default {
  methods: {
    _oa_find(obj, path, defaultValue = null) {
      const result = Utils.findValueWithPath(obj, path.split('.'));
      if (!result) {
        return defaultValue;
      }
      return result;
    },
  },
};
