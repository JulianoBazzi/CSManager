<template>
  <div class="sweepstakes">
    <Card title="Sorteios">
      <p>This is an sweepstakes page.</p>
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
export default class Sweepstakes extends Base {}
</script>
