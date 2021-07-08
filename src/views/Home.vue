<template>
  <div class="home">
    <Card title="Início">
      <p>This is an home page.</p>
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
export default class Home extends Base {}
</script>
