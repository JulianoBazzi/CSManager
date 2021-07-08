<template>
  <div class="forgotMyPassword">
    <Card title="Esqueci Minha Senha">
      <p>This is an forgot my password page.</p>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Base from '@/views/Base';
import Card from '@/components/Card.vue';

@Component({
  components: {
    Card,
  },
})
export default class EmailConfirmation extends Base {}
</script>
