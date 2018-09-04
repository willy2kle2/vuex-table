<template>
    <div>
        <ul class="pagination pagination-split">
            <li :class="{disabled: !(state.currentPage > 1)}"><a href='#' @click="goto(state.currentPage-1, $event)">«</a></li>
            <li v-if="state.currentPage > state.firstPage"><a href='#' @click="goto(1, $event)" aria-label="Goto page 1">1</a></li>
            <li class="disabled" v-if="state.currentPage-1 > 2"><a href='#'>&hellip;</a></li>
            <li v-if="state.currentPage > state.firstPage + 1"><a href='#' @click="goto(state.currentPage-1, $event)" :aria-label="`Goto page ${state.currentPage-1}`">{{state.currentPage-1}}</a></li>
            <li class="active"><a href='#' :aria-label="`Page ${state.currentPage}`" aria-current="page">{{state.currentPage}}</a></li>
            <li v-if="state.currentPage < state.lastPage-1"><a href='#' @click="goto(state.currentPage+1, $event)" :aria-label="`Goto page ${state.currentPage+1}`">{{state.currentPage+1}}</a></li>
            <li class="disabled" v-if="state.currentPage+1 < state.lastPage-1"><a href='#'>&hellip;</a></li>
            <li v-if="state.currentPage < state.lastPage"><a href='#' @click="goto(state.lastPage, $event)" :aria-label="`Goto page ${state.lastPage}`">{{state.lastPage}}</a></li>
            <li :class="{disabled: !(state.currentPage < state.lastPage)}"><a href='#' @click="goto(state.currentPage+1, $event)">»</a></li>
        </ul>
    </div>
</template>

<script src="./Paginator.js">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    @import '../../assets/styles/paginator.scss';
</style>
