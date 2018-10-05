/** @module Utils */

const _ = require('lodash');

export default {
  /**
    * Utility function returning an object
    *
    * @param {?Object} object:  object to return (may be null or undefined)
    * @param {Boolean} copy: If true, create a deep copy of the object.
    * @private
    * @return {?Object} (copied) object
    */
  returnInnerObject(object, copy) {
    if (object == null) {
      return null;
    } else if (typeof object === 'object') {
      if (copy) {
        return _.cloneDeep(object);
      }
      return object;
    }
    return object;
  },

  testInnerObject(object, key) {
    if (!isNaN(parseInt(key, 10))) {
      key = parseInt(key, 10); // eslint-disable-line
    }

    if (object === null || object === undefined) {
      return [key, null];
    } else if (object instanceof Array) {
      if (object.length <= key) {
        return [key, null];
      }
    } else if (!(key in object)) {
      return [key, null];
    }
    return [key, object];
  },

  findValueWithPath(object, path) {
    const p = path;
    if (p.length === 0) {
      return this.returnInnerObject(object);
    }

    let key = p[0];
    let result = null;
    [key, result] = this.testInnerObject(object, key);
    if (result == null) {
      return result;
    }
    if (object == null) {
      return object;
    }
    return this.findValueWithPath(object[key], p.slice(1));
  },
};
