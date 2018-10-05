export default {
  name: 'paginator',
  props: ['numberOfItems', 'itemsPerPage', 'skip'],
  data() {
    return {
      state: {
        firstPage: 1,
        currentPage: 1,
        lastPage: 1,
      },
    };
  },
  methods: {
    goto(page, e) {
      e.preventDefault();
      if (page < 1) {
        return;
      }
      if (page > this.state.lastPage) {
        return;
      }
      this.state.currentPage = page;
      const newSkip = (page * this.itemsPerPage) - this.itemsPerPage;
      this.$emit('page-change', { skip: newSkip, currentPage: page });
    },
  },
  watch: {
    numberOfItems(newNumber) {
      this.state.lastPage = Math.ceil(newNumber / this.itemsPerPage);
    },
    skip(newSkip) {
      this.state.currentPage = parseInt((newSkip + this.itemsPerPage)
        / this.itemsPerPage, 10);
    },
  },
  mounted() {
    this.state.lastPage = Math.ceil(this.numberOfItems / this.itemsPerPage);
    this.state.currentPage = parseInt((this.skip + this.itemsPerPage) / this.itemsPerPage, 10);
    this.goto(1, { preventDefault() {} });
  },
};
