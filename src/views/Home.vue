<template>
  <div class="home">
    <Card title="Início">
      <p>This is an home page.</p>
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
export default class Home extends Vue {}
</script>
