<template>
  <div class="players">
    <b-card header-tag="header" bg-variant="dark" text-variant="white">
      <template #header>
        <h3 class="mb-0">Jogadores</h3>
      </template>
      <p>This is an players page.</p>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Players extends Vue {}
</script>
