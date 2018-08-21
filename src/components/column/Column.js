export default {
  name: 'column',
  data() {
    return {
      state: {
        newKey: this.customKey || this.label,
      },
    };
  },
  props: {
    label: String,
    customKey: [String, Number],
    field: String,
    meta: [String, Number, Boolean, Function, Object, Array, Symbol],
    width: [Number, String],
    sortable: Boolean,
    visible: {
      type: Boolean,
      default: true,
    },
    customSort: Function,
  },
}