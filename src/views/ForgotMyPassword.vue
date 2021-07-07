<template>
  <div class="forgotMyPassword">
    <b-card header-tag="header" bg-variant="dark" text-variant="white">
      <template #header>
        <h3 class="mb-0">Esqueci Minha Senha</h3>
      </template>
      <p>This is an forgot my password page.</p>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EmailConfirmation extends Vue {}
</script>
