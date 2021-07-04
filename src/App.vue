<template>
  <div id="app">
    <NavBar />
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavBar from '@/components/NavBar.vue';

@Component({
  components: {
    NavBar,
  },
})
export default class App extends Vue {}
</script>

<style>

</style>
