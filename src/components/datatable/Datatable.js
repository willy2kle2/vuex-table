/**
 * @name Datatable
 * @author Federica Alfano <federica.alfano@superpitch.fr>
 * @author Corentin Ribeyre <corentin.ribeyre@superpitch.fr>
 * @fileOverview This file contains all methods, props,
 * computed properties and watchers that are necessary for datatable to work correctly.
 * Basic functions:
 * @see [paginateData]{@link Datatable#paginateData}
 * @see [searchData]{@link Datatable#searchData}
 * @see [changePage]{@link Datatable#changePage}
 * @see [checkRow]{@link Datatable#checkRow}
 * @see [checkAll]{@link Datatable#checkAll}
 * @see [toggleColumn]{@link Datatable#toggleColumn}
 * @see [check_details]{@link Datatable#toggleDetails}
 */
import _ from 'lodash';
import OAMixin from '../../mixins/ObjectAccessMixin';
import Column from '../column/Column.vue';
import Paginator from '../paginator/Paginator.vue';

export default {
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
  props: {
    rows: { type: [Array, Object], default: () => [] },
    columns: { type: Array, default: () => [] },
    paginated: { type: Boolean, default: true },
    checkable: Boolean,
    currentPage: { type: Number, default: 1 },
    itemsPerPage: { type: Number, default: 5 },
    isSortable: { type: Boolean, default: true },
    displaySearchbar: { type: Boolean, default: true },
    defaultSort: [String, Array],
    defaultSortDirection: { type: String, default: 'asc' },
    backendSorting: { type: Boolean },
    backendPagination: { type: Boolean },
    backendSearch: { type: Boolean },
    total: { type: [Number, String], default: 0 },
    selected: { type: Boolean },
    rowClass: { type: Function, default: () => '' },
    selectedRows: { type: Object },
    isRowCheckable: { type: Function, default: () => true },
    checkedRows: { type: Array, default: () => [] },
    checkedColumns: { type: Array, default: () => [] },
    customIsChecked: Function,
    showDetails: { type: Boolean, default: false },
    detailsOpened: { type: Array, default: () => [] },
    detailKey: { type: String, default: '' },
    detailsVisible: { type: Function, default: () => true },
    isColumnHidable: { type: Boolean, default: true },
    loading: { type: Boolean },
    isColumnCheckable: { type: Boolean, default: false },


  },
  computed: {
    /**
     *  Function for pagination.
     *  @property itemsPerPage, number of rows displayed in every page.
     *  @param  Start point, provided by pagination offset
     *  @param End point, corresponding to itemsPerPage
     *  @returns {array} Rows between start
     */
    paginateData() {
      if (!this.paginated) {
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
     * @returns {boolean}
     */
    isAllUncheckable() {
      const validVisibleData = this.paginateData.filter(row => this.isRowCheckable(row));
      return validVisibleData.length === 0;
    },

    /**
     * Function filtering on rows displaying results that match with search input value.
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
    hasSortableNewColumns() {
      return this.newColumns.some(column => column.sortable);
    },

    /**
     * Function that checks whether user device is mobile or not
     * @returns {boolean}
     */

    isMobile() {
      // eslint-disable-next-line no-unused-expressions
      window.innerWidth < 768 ? this.state.mobile = true : this.state.mobile = false;
      return this.state.mobile;
    },
  },
  watch: {
    /**
     * Watcher for setting columns and rows after user interaction
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
     * @param newTotal
     * @see backendPagination
     *
     */
    total(newTotal) {
      if (!this.backendPagination) return;
      this.state.newRowsTotal = newTotal;
    },
    columns(value) {
      this.state.newColumns = [...value];
    },
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
     * @param value
     * @see changePage
     */
    currentPage(value) {
      this.state.newCurrentPage = value;
    },
    rows(newRows) {
      this.state.newRows = newRows || [];
    },

    openedDetailed(expandedRows) {
      this.state.visibleDetailRows = expandedRows;
    },

    value(value) {
      this.state.newValue = value;
    },

    newValue(value) {
      this.$emit('checkbox', value);
    },


  },
  methods: {

    /**
     * Function for sorting according to params
     * @param data
     * @param key
     * @param func
     * @param ascendant
     * @returns {Array}
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
     * @param column
     * @param updatingData
     * @returns {object}
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
     * @param row
     * @returns {boolean}
     */
    isRowChecked(row) {
      return this.state.newCheckedRows.indexOf(row, this.customIsChecked) >= 0;
    },

    removeCheckedRow(row) {
      const index = this.state.newCheckedRows.indexOf(row, this.customIsChecked);
      if (index >= 0) {
        this.state.newCheckedRows.splice(index, 1);
      }
    },

    /**
     * Function to check row
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
     * @param column
     * @returns {boolean}
     */
    isColumnChecked(column) {
      return this.state.newCheckedColumns.indexOf(column, this.customIsChecked) >= 0;
    },

    removeCheckedColumn(column) {
      const index = this.state.newCheckedColumns.indexOf(column, this.customIsChecked);
      if (index >= 0) {
        this.state.newCheckedColumns.splice(index, 1);
      }
    },
    /**
     * Function to check column
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
    getValueByPath(obj, path) {
      const value = path.split('.').reduce((o, i) => o[i], obj);
      return value;
    },
    // SELECT COLUMN

    /**
     * Function to check a column
     * @param column
     * @event check-column
     */
    toggleColumn(column) {
      column.visible = !column.visible; // eslint-disable-line no-param-reassign
      this.state.visibilities[column.field] = column.visible;
      this.$emit('toggle-column', column.visible, column.field);
    },

    /**
     * Functions called when datatable is displayed on a mobile device
     * and user browses different rows
     */
    // MOBILE
    /**
     * Function to display next row
     */
    nextCard() {
      this.state.currentCard += 1;
      if (this.state.currentCard >= this.searchData.length) {
        this.state.currentCard = 0;
      }
    },
    /**
     * Function to display previous row
     */
    previousCard() {
      this.state.currentCard -= 1;
      if (this.state.currentCard < 0) {
        this.state.currentCard = this.searchData.length - 1;
      }
    },

    // SHOW DETAILS

    /**
     * Function that show and hides details
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
     * Function to show details
     * @param obj
     */
    openDetailRow(obj) {
      const index = this.handleDetailKey(obj);
      this.state.visibleDetailRows.push(index);
    },
    /**
     * Function to hide details
     * @param obj
     */
    closeDetailRow(obj) {
      const index = this.handleDetailKey(obj);
      const i = this.state.visibleDetailRows.indexOf(index);
      this.state.visibleDetailRows.splice(i, 1);
    },
    /**
     * Function to check whether a row contains details to show or not
     * @param obj
     * @returns {boolean}
     */
    isVisibleDetailRow(obj) {
      const index = this.handleDetailKey(obj);
      const result = this.state.visibleDetailRows.indexOf(index) >= 0;
      return result;
    },

    handleDetailKey(idx) {
      const key = this.detailKey;
      return !key.length ? idx : idx[key];
    },
  },
};
