<template>
  <div class="sweepstakes">
    <Card
      title="Sorteio"
      :busy="isBusy">
      <p>{{id}}</p>
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
export default class Sweepstake extends Base {
  id = this.$route.params.id;
}
</script>
