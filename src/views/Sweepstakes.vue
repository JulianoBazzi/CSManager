<template>
  <div class="sweepstakes">
    <b-card header-tag="header" bg-variant="dark" text-variant="white">
      <template #header>
        <h3 class="mb-0">Sorteios Realizados</h3>
      </template>
      <p>This is an sweepstakes page.</p>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Sweepstakes extends Vue {}
</script>
