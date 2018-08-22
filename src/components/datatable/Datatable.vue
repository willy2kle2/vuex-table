<template>
  <div class="data-container">
    <div class="data-input"><input type="search" name="search" placeholder="Search" v-model="state.search"
                                   v-if="displaySearchbar"/><i class="fa fa-search" aria-hidden="true"
                                                               @click=""></i></div>
    <div class="checkbox-container" v-if="isColumnCheckable && !is_mobile">
      <div v-for="(column, index) in state.newColumns" :key="index">
        <label>{{column.label}}</label>
        <input type="checkbox" class="datatable-checkbox checkbox-all inline-block" @change.sync="check_column(column)"
               :value="column.field" checked>
      </div>
    </div>
    <table class="table table-striped" v-if="state.visibilities !== false">
      <tbody>
      <tr class="headings" v-if="state.newColumns.length" @keydown.prevent.up="pressedArrow(-1)"
          @keydown.prevent.down="pressedArrow(1)">
        <div class="datatable-checkbox">
          <input type="checkbox" class="datatable-checkbox checkbox-all inline-block" :value="is_all_checked"
                 :disabled="is_all_uncheckable"
                 @change="check_all"/>
        </div>
        <div v-for="column in state.newColumns" :key="index" @click.stop="sort(column)"
             :class="['row-container', state.currentSortColumn === column ? 'current-sort' : '', column ? 'sortable' : '']"
             v-if="column.visible">
          <div class="cell">
            <template>{{ column.label }}</template>
            <i aria-hidden="true" :class="[state.ascendant ? 'fa-chevron-down' : 'fa-chevron-up', 'fa data-icon']"
               v-show="state.currentSortColumn === column"></i>
          </div>
        </div>
      </tr>
      <div v-if="paginate_data.length">
        <div class="mobile-controls">
          <div class="btn btn-primary" @click="previous_card"><i class="fa fa-chevron-left"
                                                                 aria-hidden="true"></i></div>
          <div class="btn btn-primary" @click="next_card"><i class="fa fa-chevron-right"
                                                             aria-hidden="true"></i></div>
        </div>
        <div class="data-body" :class="{ 'loading': loading }">
          <div class="loading-container" v-if="loading">
            <div class="loading-item"></div>
            <div class="loading-item "></div>
            <div class="loading-item"></div>
            <div class="loading-item"></div>
          </div>
          <template v-for="(row, index) in search_data">
            <div :key="index" :class="[rowClass(row, index), {'selected': is_row_checked(row)}]"
                 class=" border-table data-row"
                 v-show="is_mobile? index === state.currentCard : true ">
              <div class="datatable-checkbox">
                <input type="checkbox" class="datatable-checkbox inline-block" :disabled="!isRowCheckable(row)"
                       :value="is_row_checked(row)"
                       @change="check_row(row)" :checked="is_all_checked || is_row_checked(row)"/>
              </div>
              <div class="mobile-label-container">
                <div v-for="column in state.newColumns" :key="column.id" class="mobile-label">
                  <div class="cell-mobile">
                    <span>{{ column.label }}</span>
                  </div>
                </div>
              </div>
              <div class="row-container">
                <a @click.stop="toggle_details(row)" class="details-button">
                  <i v-show="!is_mobile && showDetails"
                     :class="['fa fa-chevron-right', is_visible_detail_row(row) ? 'expanded' : '']"
                     aria-hidden="true"></i>
                </a>
                <div v-for="(column, index) in state.newColumns" :key="index" class="cell"
                     v-if="state.visibilities[column.field]">
                  <slot :name="column.field" :index="index" :data="column.field" :label="column.label"
                        :visible="state.visibilities[column.field]">
                    <column :visible="state.visibilities[column.field]" :label="column.label" :field="column.field">
                      <span class=“cell”>{{_oa_find(row, column.field, "")}}</span>
                    </column>
                  </slot>
                </div>
              </div>
            </div>
            <div class="row-container" v-if="showDetails">
              <div class="details-container" v-if="is_visible_detail_row(row)">
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
        <paginator :number-of-items="this.rows.length" :items-per-page="this.itemsPerPage" :skip="0"
                   v-if="paginated" @page-change="change_page"
                   :current_page="state.newCurrentPage"></paginator>
      </div>
    </div>

  </div>
</template>

<script src="./Datatable.js">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
