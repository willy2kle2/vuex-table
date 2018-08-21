const _ = require('lodash');

export default {
  methods: {
    truncate(input, size, ellipsis) {
      const total_size = size + ellipsis.length;
      if (input.length > total_size) {
        const char_to_remove = input.length - size;
        const half = Math.floor(input.length / 2.0);
        const first_half = Math.floor(char_to_remove / 2.0);
        const last_half = Math.ceil(char_to_remove / 2.0);

        return input.slice(0, half - first_half)
          + ellipsis
          + input.slice(half + last_half, input.length);
      }
      return input;
    },

    _return_inner_object(object, copy) {
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

    _test_inner_object(object, key) {
      if (!isNaN(parseInt(key, 10))) {
        key = parseInt(key, 10);
      }

      if (object == null) {
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


    find_object_with_path(object, path) {
      const p = path;

      if (p.length === 0) {
        return this._return_inner_object(object, false); // Don't copy
      }

      if (p.length > 1) {
        let key = p[0];
        let result = null;
        [key, result] = this._test_inner_object(object, key);
        if (result == null) {
          return result;
        }
        if (object == null) {
          return object;
        }
        return this.find_object_with_path(object[key], p.slice(1));
      }
      return this.find_object_with_path(object, p.slice(1));
    },

    find_value_with_path(object, path) {
      const p = path;
      if (p.length === 0) {
        return this._return_inner_object(object);
      }

      let key = p[0];
      let result = null;
      [key, result] = this._test_inner_object(object, key);
      if (result == null) {
        return result;
      }
      if (object == null) {
        return object;
      }
      return this.find_value_with_path(object[key], p.slice(1));
    },
    make_nested_object_from_path(path, value, obj) {
      const rpath = _.reverse(path);
      return rpath.reduce((acc, field) => {
        if (Object.keys(acc).length === 0) {
          acc[field] = value;
          return acc;
        }
        const my_obj = {};
        my_obj[field] = acc;
        return my_obj;
      }, obj);
    },

    to_matrix(content, rowLength) {
      return content
        .reduce((rows, key, index) => (index % rowLength === 0 ? rows.push([key])
          : rows[rows.length - 1].push(key)) && rows, []);
    },

    merge_with_replacement(object, source) {
      return Object.keys(source).reduce((obj, key) => {
        if (key in obj) {
          if (source[key] === undefined) { // Remove from object
            delete obj[key];
          } else if (obj[key] instanceof Array) {
            if (source[key] instanceof Array) {
              obj[key] = source[key]; // Replace with new array
            } else {
              // The source is an object, it means that a variadic element
              // has been used, we need to translate the array into an object
              obj[key] = obj[key].reduce((myobj, val, idx) => {
                myobj[`${idx}`] = val;
                return myobj;
              }, {});
              obj[key] = _.merge({}, obj[key], source[key]);
            }
          } else if (obj[key] instanceof Object) {
            obj[key] = this.merge_with_replacement(obj[key], source[key]);
          } else {
            obj[key] = source[key];
          }
        } else {
          obj[key] = source[key];
        }
        return obj;
      }, object);
    },
  },
};
