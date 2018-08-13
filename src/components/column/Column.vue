<template>
    <div class="cell" v-if="visible" :data-label="label" >
        <slot/>
    </div>
</template>

<script src="./Column.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
