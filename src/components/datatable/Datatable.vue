<template>
  <div class="data-container">
    <div class="data-input"><input type="search" name="search" placeholder="Search" v-model="state.search"
                                   v-if="displaySearchbar"/><i class="fa fa-search" aria-hidden="true"
                                                               @click=""></i></div>
    <div class="checkbox-container" v-if="isColumnHidable && !isMobile">
      <div v-for="(column, index) in state.newColumns" :key="index">
        <label>{{column.label}}</label>
        <input type="checkbox" class="datatable-checkbox checkbox-all inline-block"
               @change.sync="toggleColumn(column)"
               :value="column.field" checked>
      </div>
    </div>
    <table class="table table-striped" v-if="state.visibilities !== false">
      <tbody>
      <tr class="headings" v-if="state.newColumns.length" @keydown.prevent.up="pressedArrow(-1)"
          @keydown.prevent.down="pressedArrow(1)">
        <div class="datatable-checkbox">
          <input type="checkbox" class="datatable-checkbox checkbox-all inline-block" :value="isAllChecked"
                 :disabled="isAllUncheckable"
                 @change="checkAll"/>
        </div>
        <div v-for="(column, index) in state.newColumns" :key="index" @click.stop="sort(column)" :class="[
                                'cell column-cell',
                                state.currentSortColumn === column ? 'current-sort' : '',
                                column.sortable && isSortable ? 'sortable' : ''
                            ]"
             v-if="column.visible" :style="{ width: column.width + 'px' }">
          <div class="cell">
            <input type="checkbox" class="datatable-checkbox inline-block column-checkbox"
                   :value="isColumnChecked(column)"
                   @change="checkColumn(column)" :checked="isAllChecked || isColumnChecked(column)" v-if="column.isColumnCheckable"/>

            <template>{{ column.label }}</template>
            <i aria-hidden="true"
               :class="[state.ascendant ? 'fa-chevron-down' : 'fa-chevron-up', 'fa data-icon']"
               v-show="state.currentSortColumn === column"></i>
          </div>
        </div>
      </tr>
      <div v-if="paginateData.length">
        <div class="mobile-controls">
          <div class="btn btn-primary" @click="previousCard"><i class="fa fa-chevron-left"
                                                                aria-hidden="true"></i></div>
          <div class="btn btn-primary" @click="nextCard"><i class="fa fa-chevron-right"
                                                            aria-hidden="true"></i></div>
        </div>
        <div class="data-body" :class="{ 'loading': loading }">
          <div class="loading-container" v-if="loading">
            <div class="loading-item"></div>
            <div class="loading-item "></div>
            <div class="loading-item"></div>
            <div class="loading-item"></div>
          </div>
          <template v-for="(row, index) in searchData">
            <div :key="index" :class="[rowClass(row, index), {'selected': isRowChecked(row)}]"
                 class=" border-table data-row"
                 v-show="isMobile? index === state.currentCard : true ">
              <div class="datatable-checkbox">
                <input type="checkbox" class="datatable-checkbox inline-block"
                       :disabled="!isRowCheckable(row)"
                       :value="isRowChecked(row)"
                       @change="checkRow(row)" :checked="isAllChecked || isRowChecked(row)"/>
              </div>
              <div class="mobile-label-container">
                <div v-for="column in state.newColumns" :key="column.id" class="mobile-label">
                  <div class="cell-mobile">
                    <span>{{ column.label }}</span>
                  </div>
                </div>
              </div>
              <div class="row-container">
                <a @click.stop="toggleDetails(row)" class="details-button">
                  <i v-show="!isMobile && showDetails"
                     :class="['fa fa-chevron-right', isVisibleDetailRow(row) ? 'expanded' : '']"
                     aria-hidden="true"></i>
                </a>
                <div v-for="(column, index2) in state.newColumns" :key="index2" class="cell" :style="{ width: column.width + '%' }"
                     v-if="state.visibilities[column.field]">
                  <slot :name="column.field" :indexCol="index2" :indexRow="index" :data="_oa_find(row, column.field)"
                        :label="column.label"
                        :visible="state.visibilities[column.field]">
                    <column :visible="state.visibilities[column.field]" :label="column.label"
                            :field="column.field" >
                      <span>{{_oa_find(row, column.field, '')}}</span>
                    </column>
                  </slot>
                </div>
              </div>
            </div>
            <div class="row-container" v-if="showDetails">
              <div class="details-container" v-if="isVisibleDetailRow(row)">
                <slot :row="row" :index="index" name="details"></slot>
              </div>
            </div>
          </template>
        </div>
      </div>
      </tbody>
    </table>
    <div class="row-container desktop-display">
      <div class="col col-md-12 text-center">
        <paginator :number-of-items="this.backendPagination ? this.total : this.rows.length" :items-per-page="this.itemsPerPage" :skip="0"
                   v-if="paginated" @page-change="changePage"
                   :current-page="this.currentPage"></paginator>
      </div>
    </div>

  </div>
</template>

<script>
  module.exports = require('./Datatable');
</script>

