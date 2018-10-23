
import _ from 'lodash';
import OAMixin from '../../mixins/ObjectAccessMixin';
import Column from '../column/Column.vue';
import Paginator from '../paginator/Paginator.vue';

/** @namespace */
const Datatable = {
  name: 'datatable',
  components: { Column, Paginator },
  mixins: [OAMixin],
  data() {
    return {
      state: {
        newColumns: [...this.columns],
        newRows: [...this.rows],
        newRowsTotal: this.backendPagination ? this.total : this.rows.length,
        newCurrentPage: this.currentPage,
        currentSortColumn: {},
        firstTimeSort: true,
        ascendant: true,
        newCheckedRows: [...this.checkedRows],
        newCheckedColumns: [...this.checkedColumns],
        _isTable: true,
        search: '',
        currentCard: 0,
        mobile: false,
        visibleDetailRows: this.detailsOpened,
        newValue: this.value,
        visibilities: this.columns.reduce((obj, v) => {
          obj[v.field] = v.visible || true; // eslint-disable-line
          return obj;
        }, {}),
      },

    };
  },
  /** @namespace */
  props: {
    /**
     * Rows of datatable
     *
     * @memberof Datatable.props
     * @type {Array|Object}
     */
    rows: { type: [Array, Object], default: () => [] },
    /**
     * Columns of datatable
     *
     * @memberof Datatable.props
     * @type {Array|Object}
     */
    columns: { type: Array, default: () => [] },
    /**
     * It checks whether datatable is still paginated by third-party code or not
     *
     * @memberof Datatable.props
     * @type {Boolean|Object}
     */
    paginated: { type: Boolean, default: true },
    /**
     * It checks whether rows are checkable or not
     *
     * @memberof Datatable.props
     * @type {Boolean|Object}
     */
    checkable: Boolean,
    /**
     * Page displayed on datatable
     *
     * @memberof Datatable.props
     * @type {Number | Object}
     */
    currentPage: { type: Number, default: 1 },
    /**
     * Number of rows displayed per page
     *
     * @memberof Datatable.props
     * @type {Number | Object}
     */
    itemsPerPage: { type: Number, default: 5 },
    /**
     * Enable or disable sort functions on column
     *
     * @memberof Datatable.props
     * @type {Boolean | Object}
     */
    isSortable: { type: Boolean, default: true },
    /**
     * Show or hide searchbar
     *
     * @memberof Datatable.props
     * @type {Boolean | Object}
     */
    displaySearchbar: { type: Boolean, default: true },
    /**
     * Sort paramater by default
     *
     * @memberof Datatable.props
     * @type {String | Object}
     */
    defaultSort: [String, Array],
    /**
     * Sort direction by default. It can be 'asc' or 'desc'
     *
     * @memberof Datatable.props
     * @type {String | Object}
     */
    defaultSortDirection: { type: String, default: 'asc' },
    /**
     * Enable custom backend sorting functions and disable front sorting (built-in function)
     *
     * @memberof Datatable.props
     * @type {Boolean | Object}
     */
    backendSorting: { type: Boolean },
    /**
     * Enable custom backend pagination functions and disable front pagination (built-in function)
     *
     * @memberof Datatable.props
     * @type {Boolean | Object}
     */
    backendPagination: { type: Boolean },
    /**
     * Enable custom backend search functions and disable front search (built-in function)
     *
     * @memberof Datatable.props
     * @type {Boolean | Object}
     */
    backendSearch: { type: Boolean },
    /**
     * Total of pages. This prop is mandatory if backend pagination is implemented
     *
     * @memberof Datatable.props
     * @type {Number | String | Object}
     */
    total: { type: [Number, String], default: 0 },
    /**
     * It checks whether a row is selected or not
     *
     * @memberof Datatable.props
     * @type {Boolean | Object}
     */
    selected: { type: Boolean },
    /**
     * Custom function to attribute a CSS class on a row
     *
     * @memberof Datatable.props
     * @type {Function | Object}
     */
    rowClass: { type: Function, default: () => '' },
    /**
     * Object containing all selected rows. It's updated dynamically.
     *
     * @memberof Datatable.props
     * @type {Object}
     */
    selectedRows: { type: Object },
    /**
     * Function for checking rows
     *
     * @memberof Datatable.props
     * @type {Function | Object}
     */
    isRowCheckable: { type: Function, default: () => true },
    /**
     * Array containing all rows displayed on datatable.
     *
     * @memberof Datatable.props
     * @type {Array | Object}
     */
    checkedRows: { type: Array, default: () => [] },
    /**
     * Array containing all columns displayed on datatable. Column can be shown or hidden by checkboxes
     * @memberof Datatable.props
     * @type {Array | Object}
     */
    checkedColumns: { type: Array, default: () => [] },
    /**
     * Function to check a row by default when component is mounted.
     *
     * @memberof Datatable.props
     * @type {Function | Object}
     */
    customIsChecked: Function,
    /**
     * Enable details template
     *
     * @memberof Datatable.props
     * @type {Boolean | Object}
     */
    showDetails: { type: Boolean, default: false },
    /**
     * Array containing all details displayed on datatable.
     *
     * @memberof Datatable.props
     * @type {Array | Object}
     */
    detailsOpened: { type: Array, default: () => [] },
    /**
     * Key binding details and rows
     *
     * @memberof Datatable.props
     * @type {String | Object}
     */
    detailKey: { type: String, default: '' },
    /**
     * Function to show details
     *
     * @memberof Datatable.props
     * @type {Function | Object}
     */
    detailsVisible: { type: Function, default: () => true },
    /**
     * When it is set as true, column can be hidden or shown by its own checkbox
     *
     * @memberof Datatable.props
     * @type {Boolean | Object}
     */
    isColumnHidable: { type: Boolean, default: true },
    /**
     * It checks whether content is loading or not (mainly for backend features)
     *
     * @memberof Datatable.props
     * @type {Boolean | Object}
     */
    loading: { type: Boolean },
    /**
     * When it is set as true, column values are checked by column checkbox
     *
     * @memberof Datatable.props
     * @type {Boolean | Object}
     */
    isColumnCheckable: { type: Boolean, default: false },
  },
  /** @namespace */
  computed: {
    /**
     *  Function for pagination.
     *  @memberof Datatable.computed
     *  @property itemsPerPage, number of rows displayed in every page.
     *  @param  Start point, provided by pagination offset
     *  @param End point, corresponding to itemsPerPage
     *  @returns {array} Rows between start
     */
    paginateData() {
      if (!this.paginated || this.isMobile) {
        return this.state.newRows;
      }
      const currentPage = this.state.newCurrentPage;
      const itemsPerPage = this.itemsPerPage;
      if (this.state.newRows.length <= itemsPerPage) {
        return this.state.newRows;
      }
      const start = (currentPage - 1) * itemsPerPage;
      const end = parseInt(start, 10) + parseInt(itemsPerPage, 10);
      return this.state.newRows.slice(start, end);
    },

    /**
     * Function filtering on all rows to see whether all rows are checked or not
     * @memberof Datatable.computed
     * @returns {boolean}
     */
    isAllChecked() {
      const validVisibleData = this.searchData.filter(
        row => this.isRowCheckable(row));
      if (validVisibleData.length === 0) {
        return false;
      }
      const isAllChecked = validVisibleData.some(currentVisibleRow =>
        this.state.newCheckedRows.indexOf(currentVisibleRow, this.customIsChecked) < 0);
      return !isAllChecked;
    },
    /**
     * Function filtering on all rows to detect rows that can be unchecked.
     * @memberof Datatable.computed
     * @returns {boolean}
     */
    isAllUncheckable() {
      const validVisibleData = this.paginateData.filter(row => this.isRowCheckable(row));
      return validVisibleData.length === 0;
    },

    /**
     * Function filtering on rows displaying results that match with search input value.
     * @memberof Datatable.computed
     * @default When search input is empty, all rows of paginate_date are displayed.
     * @returns {array}
     */

    searchData() {
      if (this.state.search !== '') {
        const matcher = new RegExp(this.state.search, 'gmi');
        return this.state.newRows.filter(row => (_.map(row, value => matcher.test(`${value}`))).some(val => val));
      }

      return this.paginateData;
    },
    /**
     * Function checking if new sortable columns have been added
     * @returns {boolean}
     */
    hasSortableNewColumns() {
      return this.newColumns.some(column => column.sortable);
    },

    /**
     * Function that checks whether user device is mobile or not
     * @memberof Datatable.computed
     * @returns {boolean}
     */

    isMobile() {
      // eslint-disable-next-line no-unused-expressions
      window.innerWidth < 768 ? this.state.mobile = true : this.state.mobile = false;
      return this.state.mobile;
    },
  },
  /** @namespace */
  watch: {
    /**
     * Watcher for setting columns and rows after user interaction
     * @memberof Datatable.watch
     * @param value
     */
    setData(value) {
      const saveNewColumns = this.state.newColumns;

      this.state.newColumns = [];
      this.state.newRows = value;
      this.$nextTick(() => {
        if (!this.state.newColumns.length) this.state.newColumns = saveNewColumns;
      });
      if (!this.backendPagination) {
        this.state.newRowsTotal = value.length;
      }
    },

    /**
     * Function for getting number of total pages from backend
     * @memberof Datatable.watch
     * @param newTotal
     * @see backendPagination
     *
     */
    total(newTotal) {
      if (!this.backendPagination) return;
      this.state.newRowsTotal = newTotal;
    },
    /**
     * Function for getting initial number of columns
     * @memberof Datatable.watch
     * @param value
     */
    columns(value) {
      this.state.newColumns = [...value];
    },
    /**
     * Watcher on columns changes
     * @memberof Datatable.watch
     * @param newColumns
     */
    newColumns(newColumns) {
      if (newColumns.length && this.state.firstTimeSort) {
        this.initializeSort();
        this.state.firstTimeSort = false;
      } else if (newColumns.length) {
        if (this.state.currentSortColumn.field) {
          this.state.currentSortColumn =
            newColumns.find(nc => nc.field === this.state.currentSortColumn.field);
        }
      }
    },
    /**
     * Getting current page for @function changePage
     * @memberof Datatable.watch
     * @param value
     * @see changePage
     */
    currentPage(value) {
      this.state.newCurrentPage = value;
    },
    /**
     * Getting current number of rows
     * @memberof Datatable.watch
     * @param newRows
     */
    rows(newRows) {
      this.state.newRows = newRows || [];
    },
    /**
     * Watcher on details toggle function
     * @memberof Datatable.watch
     * @param expandedRows
     * @see toggleDetails
     */

    openedDetailed(expandedRows) {
      this.state.visibleDetailRows = expandedRows;
    },

    /**
     * Initial checkbox value
     * @memberof Datatable.watch
     * @param value
     */
    value(value) {
      this.state.newValue = value;
    },

    /**
     * Watcher on checkbox value change
     * @memberof Datatable.watch
     * @param value
     */
    newValue(value) {
      this.$emit('checkbox', value);
    },


  },
  /** @namespace */
  methods: {

    /**
     * Function for sorting according to params
     * @param data
     * @param key
     * @param func
     * @param ascendant
     * @memberof Datatable.methods
     * @returns {Array} Data sorted
     */
    // SORTING FUNCTIONS
    sortBy(data, key, func, ascendant) {
      let sorted = [];
      if (func && typeof func === 'function') {
        sorted = [...data].sort((a, b) => func(a, b, ascendant));
      } else {
        sorted = [...data].sort((a, b) => {
          let saveA = this.getValueByPath(a, key);
          let saveB = this.getValueByPath(b, key);
          if (!saveA && saveA !== 0) return 1;
          if (!saveB && saveB !== 0) return -1;
          if (saveA === saveB) return 0;
          saveA = (typeof saveA === 'string') ? saveA.toUpperCase() : saveA;
          saveB = (typeof saveB === 'string') ? saveB.toUpperCase() : saveB;
          return ascendant ? saveA.localeCompare(saveB) : saveB.localeCompare(saveA);
        });
      }
      return sorted;
    },

    /**
     * Sorting function
     * @memberof Datatable.methods
     * @param column
     * @param updatingData
     * @returns {object} Column sorted
     * @see sortBy
     */
    sort(column, updatingData = false) {
      if (!this.isSortable) {
        return;
      }
      if (!updatingData) {
        this.state.ascendant = column === this.state.currentSortColumn ? !this.state.ascendant : (this.defaultSortDirection.toLowerCase() !== 'desc');
      }
      if (this.backendSorting) {
        this.$emit('sort', column.field, this.state.ascendant ? 'asc' : 'desc');
      } else {
        this.state.newRows = this.sortBy(
          this.state.newRows,
          column.field,
          column.defaultSort,
          this.state.ascendant,
        );
      }
      this.state.currentSortColumn = column;
    },

    /**
     * Function to initialize sort according to defaultSort property
     * @memberof Datatable.methods
     * @property defaultSort
     */

    initializeSort() {
      if (!this.defaultSort) {
        return;
      }
      let sortField = '';
      let sortDirection = this.defaultSortDirection;
      if (Array.isArray(this.defaultSort)) {
        sortField = this.defaultSort[0];
        if (this.defaultSort[1]) {
          sortDirection = this.defaultSort[1];
        }
      } else {
        sortField = this.defaultSort;
      }
      this.state.newColumns.forEach((column) => {
        if (column.field === sortField) {
          this.state.ascendant = sortDirection.toLowerCase() !== 'desc';
          this.sort(column, true);
        }
      });
    },

    // PAGINATION FUNCTION
    /**
     * Function to change page
     * @memberof Datatable.methods
     * @param page
     * @event page-change
     * @event update:currentPage
     */
    changePage(page) {
      this.state.newCurrentPage = page.currentPage > 0 ? page.currentPage : 1;
      this.$emit('page-change', this.state.newCurrentPage);
      this.$emit('update:currentPage', this.state.newCurrentPage);
    },

    // SELECT ROW
    /**
     * Function to verify whether a row is checked or not
     * @memberof Datatable.methods
     * @param row
     * @returns {boolean}
     */
    isRowChecked(row) {
      return this.state.newCheckedRows.indexOf(row, this.customIsChecked) >= 0;
    },

    /**
     * Function to uncheck a row
     * @memberof Datatable.methods
     * @param row
     * @returns {object}
     */

    removeCheckedRow(row) {
      const index = this.state.newCheckedRows.indexOf(row, this.customIsChecked);
      if (index >= 0) {
        this.state.newCheckedRows.splice(index, 1);
      }
    },

    /**
     * Function to check row
     * @memberof Datatable.methods
     * @param row
     * @event check
     * @event update:checkedRows
     */
    checkRow(row) {
      if (!this.isRowChecked(row)) {
        this.state.newCheckedRows.push(row);
        this.$emit('check-row', this.state.newCheckedRows, row);
        this.$emit('update:checkedRows', this.state.newCheckedRows);
      } else {
        this.removeCheckedRow(row);
        this.$emit('uncheck-row', this.state.newCheckedRows, row);
      }
    },

    // SELECT COLUMN
    /**
     * Function to verify whether a column is checked or not
     * @memberof Datatable.methods
     * @param column
     * @returns {boolean}
     */
    isColumnChecked(column) {
      return this.state.newCheckedColumns.indexOf(column, this.customIsChecked) >= 0;
    },

    /**
     * Function to uncheck a column
     * @memberof Datatable.methods
     * @param column
     * @returns {object}
     */
    removeCheckedColumn(column) {
      const index = this.state.newCheckedColumns.indexOf(column, this.customIsChecked);
      if (index >= 0) {
        this.state.newCheckedColumns.splice(index, 1);
      }
    },
    /**
     * Function to check column
     * @memberof Datatable.methods
     * @param column
     * @event check
     * @event update:checkedColumns
     */
    checkColumn(column) {
      if (!this.isColumnChecked(column)) {
        this.state.newCheckedColumns.push(column);
        this.$emit('check-column', this.state.newCheckedColumns, column);
        this.$emit('update:checkedColumns', this.state.newCheckedColumns);
      } else {
        this.removeCheckedColumn(column);
        this.$emit('uncheck-column', this.state.newCheckedColumns, column);
      }
    },

    /**
     * Function for checking all rows at once
     * @memberof Datatable.methods
     * @event check
     * @event check-all
     * @event update:checkedRows
     */


    checkAll() {
      const isAllChecked = this.isAllChecked;
      this.searchData.forEach((currentRow) => {
        this.removeCheckedRow(currentRow);
        if (!isAllChecked) {
          if (this.isRowCheckable(currentRow)) {
            this.state.newCheckedRows.push(currentRow);
          }
        }
      });
      this.$emit('check', this.state.newCheckedRows);
      this.$emit('check-all', this.state.newCheckedRows);
      this.$emit('update:checkedRows', this.state.newCheckedRows);
    },

    /**
     * Get value on an object according to a specific path
     * @memberof Datatable.utils
     * @param obj
     * @param path
     * @returns {*}
     */
    getValueByPath(obj, path) {
      const value = path.split('.').reduce((o, i) => o[i], obj);
      return value;
    },
    // SELECT COLUMN

    /**
     * Function to check a column
     * @memberof Datatable.methods
     * @param column
     * @event check-column
     */
    toggleColumn(column) {
      column.visible = !column.visible; // eslint-disable-line no-param-reassign
      this.state.visibilities[column.field] = column.visible;
      this.$emit('toggle-column', column.visible, column.field);
    },

    // MOBILE
    /**
     * Function to display next row
     * @memberof Datatable.methods
     */
    nextCard() {
      this.state.currentCard += 1;
      if (this.state.currentCard >= this.searchData.length) {
        this.state.currentCard = 0;
      }
    },
    /**
     * Function to display previous row
     * @memberof Datatable.methods
     */
    previousCard() {
      this.state.currentCard -= 1;
      if (this.state.currentCard < 0) {
        this.state.currentCard = this.searchData.length - 1;
      }
    },

    // SHOW DETAILS

    /**
     * Function to show and hide details
     * @memberof Datatable.methods
     * @param obj
     * @function openDetailRow
     * @function closeDetailRow
     * @event details-open
     * @event details-close
     * @event update:openedDetailed
     */

    toggleDetails(obj) {
      const item = this.isVisibleDetailRow(obj);

      if (item) {
        this.closeDetailRow(obj);
        this.$emit('details-close', obj);
      } else {
        this.openDetailRow(obj);
        this.$emit('details-open', obj);
      }
      this.$emit('update:openedDetailed', this.state.visibleDetailRows);
    },

    /**
     * Function to show details according to row they belong to
     * @memberof Datatable.methods
     * @param obj
     */
    openDetailRow(obj) {
      const index = this.handleDetailKey(obj);
      this.state.visibleDetailRows.push(index);
    },
    /**
     * Function to hide details according to row they belong to
     * @memberof Datatable.methods
     * @param obj
     */
    closeDetailRow(obj) {
      const index = this.handleDetailKey(obj);
      const i = this.state.visibleDetailRows.indexOf(index);
      this.state.visibleDetailRows.splice(i, 1);
    },
    /**
     * Function to check whether a row contains details to show or not
     * @memberof Datatable.methods
     * @param obj
     * @returns {boolean}
     */
    isVisibleDetailRow(obj) {
      const index = this.handleDetailKey(obj);
      const result = this.state.visibleDetailRows.indexOf(index) >= 0;
      return result;
    },

    /**
     * Function to handle key details according to row they belong to
     * @memberof Datatable.methods
     * @param idx
     * @returns {*}
     */
    handleDetailKey(idx) {
      const key = this.detailKey;
      return !key.length ? idx : idx[key];
    },
  },
};

export default Datatable;
