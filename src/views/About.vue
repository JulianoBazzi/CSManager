<template>
  <div class="about">
    <Card title="Sobre">
      <p>This is an about page.</p>
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
export default class About extends Vue {
}
</script>
