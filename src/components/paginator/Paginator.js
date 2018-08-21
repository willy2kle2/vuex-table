export default {
  name: 'paginator',
  props: ['numberOfItems', 'itemsPerPage', 'skip'],
  data() {
    return {
      state: {
        first_page: 1,
        current_page: 1,
        last_page: 1,
      },
    };
  },
  methods: {
    goto(page, e) {
      e.preventDefault();
      if (page < 1) {
        return;
      }
      if (page > this.state.last_page) {
        return;
      }
      this.state.current_page = page;
      const new_skip = (page * this.itemsPerPage) - this.itemsPerPage;
      this.$emit('page-change', { skip: new_skip, current_page: page });
    },
  },
  watch: {
    numberOfItems(newNumber) {
      this.state.last_page = Math.ceil(newNumber / this.itemsPerPage);
    },
    skip(newSkip) {
      this.state.current_page = parseInt((newSkip + this.itemsPerPage)
        / this.itemsPerPage, 10);
    },
  },
  mounted() {
    this.state.last_page = Math.ceil(this.numberOfItems / this.itemsPerPage);
    this.state.current_page = parseInt((this.skip + this.itemsPerPage) / this.itemsPerPage, 10);
    this.goto(1, { preventDefault() {} });
  },
}