# Vuex-table

> Vuex-table is a Vue component created in order to easily fit in any Vue (even with Vuex) project.
> It consists on a table representation of informations whose data can be provided both from frontend or backend.

## Features ⚙

- **Sorting**
    
   Rows can be sorted according to column field (ex. sorting names alphabetically )
   
   [![Image from Gyazo](https://i.gyazo.com/6a3cc6681b07ad7dc17c6b91d6c17542.gif)](https://gyazo.com/6a3cc6681b07ad7dc17c6b91d6c17542)
   
- **Selection**
    
    Rows can checked one by one or all at once by clicking on checkbox.
    
    [![Image from Gyazo](https://i.gyazo.com/f5eac70ce6d980848197703f4ce141dc.gif)](https://gyazo.com/f5eac70ce6d980848197703f4ce141dc)
  
- **Search**
    
    Rows which match with user input in searchbar will be displayed, so that user can easily find the information he/she is looking for.
    
    [![Image from Gyazo](https://i.gyazo.com/686d07aa39d26558eba28e1cc127b879.gif)](https://gyazo.com/686d07aa39d26558eba28e1cc127b879)
    
- **Pagination**

    For better browsing on data, a maximum number of rows is displayed and others can be shown just by changing page.
    
    [![Image from Gyazo](https://i.gyazo.com/f20817f0e25b874664ba9e3503a57303.gif)](https://gyazo.com/f20817f0e25b874664ba9e3503a57303)
    
- **Show/Hide details**

    Each row may contain details that users can show and hide by clicking on the icon.
    
    [![Image from Gyazo](https://i.gyazo.com/065b28eb0df0003551ddb09c65f8cf93.gif)](https://gyazo.com/065b28eb0df0003551ddb09c65f8cf93)
    
- **Show/Hide columns** 

    Each column can be hidden or shown by clicking on the appropriate checkbox.
    
    [![Image from Gyazo](https://i.gyazo.com/22d6d22c537789505a702fa8726f45b1.gif)](https://gyazo.com/22d6d22c537789505a702fa8726f45b1)
    
- **Responsive**
    
    Vuex-table is responsive, with simple and intuitive mobile User Experience.
    
    [![Image from Gyazo](https://i.gyazo.com/8861c6431cbf828f08fdcd314100cfc6.gif)](https://gyazo.com/8861c6431cbf828f08fdcd314100cfc6)
    
## Documentation 📔

Documentation is in the ``docs``` directory.
You can find [here](https://superpitch-agency.github.io/vuex-table/) online documentation.

## Quick start 🚀
> Pss...it's easy! 😎


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
   
## Collaborators 👩🏻‍💻👨🏼‍💻
[Superpitch team](http://superpitch.fr)

## License
Code released under MIT license.

Copyright (c) 2018, [Superpitch](http://superpitch.fr).




