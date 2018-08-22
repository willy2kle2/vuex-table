# Getting started

> Pss...it's easy! 😎

## Quick start

### Install

```
npm install --save vuex-table
```

or
```
yarn add vuex-table
```


### Import

```
import Vue from 'vue';
const VuexTable = require('vuex-table');

Vue.use(VuexTable);
```

### Example

```
<template>
  <div id="app">
    <datatable :rows="state.rows" :columns="state.columns"
               :itemsPerPage="state.itemsPerPage"
               :current-page.sync="state.currentPage"
               :selected.sync="state.selected" :checked-rows.sync="state.checkedRows" checkable
               :default-sort-direction="state.defaultSortOrder"
               :default-sort="[state.sortField, state.sortOrder]"
    >
    </datatable>

  </div>
</template>

<script>
  import Datatable from 'vuex-table';

  export default {
    name: 'app',
    components: {
      Datatable,
    },
    data() {
      return {
        state: {
          columns: [
            {label: 'ID', field: 'id', visible: true},
            {label: 'First Name', field: 'first_name', visible: true},
            {label: 'Last Name', field: 'last_name', visible: true},
            {label: 'Date', field: 'date', visible: true},
            {label: 'Gender', gender: 'gender', visible: true},
          ],
          rows: [
            {id: 1, first_name: 'Jesse', last_name: 'Simmons', date: '2016-10-15 13:43:27', gender: 'Male'},
            {id: 2, first_name: 'John', last_name: 'Jacobs', date: '2016-12-15 06:00:53', gender: 'Male'},
            {id: 3, first_name: 'Tina', last_name: 'Gilbert', date: '2016-04-26 06:26:28', gender: 'Female'},
            {id: 4, first_name: 'Clarence', last_name: 'Flores', date: '2016-04-10 10:28:46', gender: 'Male'},
            {id: 5, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 6, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 7, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 8, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 9, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 10, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 11, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 12, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 13, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 14, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 15, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
            {id: 16, first_name: 'Anne', last_name: 'Lee', date: '2016-12-06 14:38:38', gender: 'Female'},
          ],
          itemsPerPage: 10,
          itemsPerRow: 1,
          currentPage: 1,
          selected: true,
          checkedRows: [],
          sortField: 'name',
          sortOrder: 'desc',
          defaultSortOrder: 'desc',

        }
      }
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

```
