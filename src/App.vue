<template>
  <div id="app">
    <datatable>
    </datatable>
  </div>
</template>

<script>
  import Datatable from '../src/components/datatable/Datatable.vue';

  export default {
    name: 'app',
    components: {
      Datatable,
    },
    data() {
      return {
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
