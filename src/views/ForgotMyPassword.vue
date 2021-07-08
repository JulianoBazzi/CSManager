<template>
  <div class="forgotMyPassword">
    <Card title="Esqueci Minha Senha">
      <p>This is an forgot my password page.</p>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Card from '@/components/Card.vue';

@Component({
  components: {
    Card,
  },
})
export default class EmailConfirmation extends Vue {}
</script>
