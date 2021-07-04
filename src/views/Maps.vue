<template>
  <div class="maps">
    <b-card header-tag="header" bg-variant="dark" text-variant="white">
      <template #header>
        <h3 class="mb-0">Mapas</h3>
      </template>
      <p>This is an maps page.</p>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Maps extends Vue {}
</script>
