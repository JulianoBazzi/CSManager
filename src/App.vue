<template>
  <div id="app">
    <NavBar />
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Base from '@/views/Base';
import NavBar from '@/components/template/NavBar.vue';

@Component({
  components: {
    NavBar,
  },
})
export default class App extends Base {}
</script>

<style>

</style>
