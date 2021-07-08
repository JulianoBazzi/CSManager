<template>
  <div class="sweepstakes">
    <Card title="Sorteios">
      <p>This is an sweepstakes page.</p>
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
export default class Sweepstakes extends Vue {}
</script>
