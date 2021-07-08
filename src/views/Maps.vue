<template>
  <div class="maps">
    <Card title="Mapas">
      <p>This is an maps page.</p>
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
export default class Maps extends Base {}
</script>
