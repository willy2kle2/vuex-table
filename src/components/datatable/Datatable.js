/**
 * @name Datatable
 * @author Federica Alfano <federica.alfano@superpitch.fr>
 * @author Corentin Ribeyre <corentin.ribeyre@superpitch.fr>
 * @fileOverview This file contains all methods, props, computed properties and watchers that are necessary for datatable to work correctly.
 * Basic functions:
 * @see [paginate_data]{@link Datatable#paginate_data}
 * @see [search_data]{@link Datatable#search_data}
 * @see [change_page]{@link Datatable#change_page}
 * @see [check_row]{@link Datatable#check_row}
 * @see [check_all]{@link Datatable#check_all}
 * @see [check_column]{@link Datatable#check_column}
 * @see [check_details]{@link Datatable#check_details}
 */

import OAMixin from '../../mixins/ObjectAccessMixin';
import Column from '../column/Column.vue';
import Paginator from '../paginator/Paginator.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.css';
export default {
  name: 'datatable',
  components: {Column, Paginator},
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
        _isTable: true,
        search: '',
        currentCard: 0,
        mobile: false,
        visibleDetailRows: this.detailsOpened,
        newValue: this.value,
        visibilities: this.columns.reduce((obj, v) => {
          obj[v.field] = v.visible || true;
          return obj;
        }, {}),
      },

    };
  },
  props: {
    rows: {type: [Array, Object], default: () => []},
    columns: {type: Array, default: () => []},
    paginated: {type: Boolean, default: true},
    checkable: Boolean,
    currentPage: {type: Number, default: 1},
    itemsPerPage: {type: Number, default: 5},
    isSortable: {type: Boolean, default: true},
    displaySearchbar: {type: Boolean, default: true},
    defaultSort: [String, Array],
    defaultSortDirection: {type: String, default: 'asc'},
    backendSorting: {type: Boolean},
    backendPagination: {type: Boolean},
    backendSearch: {type: Boolean},
    total: {type: [Number, String], default: 0},
    selected: {type: Boolean},
    rowClass: {type: Function, default: () => ''},
    selectedRows: {type: Object},
    isRowCheckable: {type: Function, default: () => true},
    checkedRows: {type: Array, default: () => []},
    customIsChecked: Function,
    showDetails: {type: Boolean, default: false},
    detailsOpened: {type: Array, default: () => []},
    detailKey: {type: String, default: ''},
    detailsVisible: {type: Function, default: () => true},
    isColumnCheckable: {type: Boolean, default: true},
    loading: {type: Boolean},


  },
  computed: {
    /**
     *  Function for pagination.
     *  @property itemsPerPage, number of rows displayed in every page.
     *  @param  Start point, provided by pagination offset
     *  @param End point, corresponding to itemsPerPage
     *  @returns {array} Rows between start
     */
    paginate_data() {
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
    is_all_checked() {
      const validVisibleData = this.search_data.filter(
        row => this.isRowCheckable(row));
      if (validVisibleData.length === 0) {
        return false;
      }
      const isAllChecked = validVisibleData.some(currentVisibleRow => this.state.newCheckedRows.indexOf(currentVisibleRow, this.customIsChecked) < 0);
      return !isAllChecked;
    },
    /**
     * Function filtering on all rows to detect rows that can be unchecked.
     * @returns {boolean}
     */
    is_all_uncheckable() {
      const validVisibleData = this.paginate_data.filter(row => this.isRowCheckable(row));
      return validVisibleData.length === 0;
    },

    /**
     * Function filtering on rows displaying results that match with search input value.
     * @default When search input is empty, all rows of paginate_date are displayed.
     * @returns {array}
     */

    search_data() {
      if (this.state.search !== '') {
        const matcher = new RegExp(this.state.search, 'gmi');
        return this.state.newRows.filter(row => (_.map(row, value => matcher.test(`${value}`))).some(val => val));
      }
      else {
        return this.paginate_data;
      }
    },
    has_sortable_new_columns() {
      return this.newColumns.some(column => column.sortable);
    },

    /**
     * Function that checks whether user device is mobile or not
     * @returns {boolean}
     */

    is_mobile() {
      window.innerWidth < 768 ? this.state.mobile = true : this.state.mobile = false;
      return this.state.mobile;
    },
  },
  watch: {
    /**
     * Watcher for setting columns and rows after user interaction
     * @param value
     */
    set_data(value) {
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
    new_columns(newColumns) {
      if (newColumns.length && this.state.firstTimeSort) {
        this.initialize_sort();
        this.state.firstTimeSort = false;
      } else if (newColumns.length) {
        if (this.state.currentSortColumn.field) {
          this.state.currentSortColumn =
            newColumns.find(nc => nc.field === this.state.currentSortColumn.field);
        }
      }
    },
    /**
     * Getting current page for @function change_page
     * @param value
     * @see change_page
     */
    current_page(value) {
      this.state.newCurrentPage = value;
    },
    rows(newRows) {
      this.state.newRows = newRows || [];
    },

    opened_detailed(expandedRows) {
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

    // SORTING FUNCTIONS
    sort_by(data, key, func, ascendant) {
      let sorted = [];
      if (func && typeof func === 'function') {
        sorted = [...data].sort((a, b) => func(a, b, ascendant));
      } else {
        sorted = [...data].sort((a, b) => {
          let saveA = this.get_value_by_path(a, key);
          let saveB = this.get_value_by_path(b, key);
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

    sort(column, updatingData = false) {
      if (!this.isSortable) {
        return;
      }
      if (!updatingData) {
        this.state.ascendant = column === this.state.currentSortColumn ? !this.state.ascendant : (this.defaultSortDirection.toLowerCase() !== 'desc');
      }
      if (this.backendSorting) {
        this.$emit('sort', column.field, this.state.ascendant ? 'asc' : 'desc');
      }
      else {
        this.state.newRows = this.sort_by(
          this.state.newRows,
          column.field,
          column.customSort,
          this.state.ascendant,
        );
      }
      this.state.currentSortColumn = column;
    },


    initialize_sort() {
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
    change_page(page) {
      this.state.newCurrentPage = page.current_page > 0 ? page.current_page : 1;
      this.$emit('page-change', this.state.newCurrentPage);
      this.$emit('update:currentPage', this.state.newCurrentPage);
    },

    // SELECT ROW

    is_row_checked(row) {
      return this.state.newCheckedRows.indexOf(row, this.customIsChecked) >= 0;
    },

    remove_checked_row(row) {
      const index = this.state.newCheckedRows.indexOf(row, this.customIsChecked);
      if (index >= 0) {
        this.state.newCheckedRows.splice(index, 1);
      }
    },
    check_row(row) {
      if (!this.is_row_checked(row)) {
        this.state.newCheckedRows.push(row);
      } else {
        this.remove_checked_row(row);
      }
      this.$emit('check', this.state.newCheckedRows, row);
      this.$emit('update:checkedRows', this.state.newCheckedRows);
    },

    check_all() {
      const is_all_checked = this.is_all_checked;
      this.search_data.forEach((currentRow) => {
        this.remove_checked_row(currentRow);
        if (!is_all_checked) {
          if (this.isRowCheckable(currentRow)) {
            this.state.newCheckedRows.push(currentRow);
          }
        }
      });
      this.$emit('check', this.state.newCheckedRows);
      this.$emit('check-all', this.state.newCheckedRows);
      this.$emit('update:checkedRows', this.state.newCheckedRows);
    },
    get_value_by_path(obj, path) {
      const value = path.split('.').reduce((o, i) => o[i], obj);
      return value;
    },
    // SELECT COLUMN
    check_column(column) {
      column.visible = !column.visible;
      this.state.visibilities[column.field] = column.visible;
      this.$emit('check-column', column.visible, column.field);
    },

    // MOBILE
    next_card() {
      this.state.currentCard++;
      if (this.state.currentCard >= this.search_data.length) {
        this.state.currentCard = 0;
      }
    },
    previous_card() {
      this.state.currentCard--;
      if (this.state.currentCard < 0) {
        this.state.currentCard = this.search_data.length - 1;
      }
    },

    // SHOW DETAILS

    toggle_details(obj) {
      const item = this.is_visible_detail_row(obj);

      if (item) {
        this.close_detail_row(obj);
        this.$emit('details-close', obj);
      } else {
        this.open_detail_row(obj);
        this.$emit('details-open', obj);
      }
      this.$emit('update:openedDetailed', this.state.visibleDetailRows);
    },

    open_detail_row(obj) {
      const index = this.handle_detail_key(obj);
      this.state.visibleDetailRows.push(index);
    },

    close_detail_row(obj) {
      const index = this.handle_detail_key(obj);
      const i = this.state.visibleDetailRows.indexOf(index);
      this.state.visibleDetailRows.splice(i, 1);
    },

    is_visible_detail_row(obj) {
      const index = this.handle_detail_key(obj);
      const result = this.state.visibleDetailRows.indexOf(index) >= 0;
      return result;
    },

    handle_detail_key(idx) {
      const key = this.detailKey;
      return !key.length ? idx : idx[key];
    },
  },
}
