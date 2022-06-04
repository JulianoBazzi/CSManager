<template>
  <div class="home">
    <Card title="Início">
      <iframe
        width="100%"
        height="600"
        src="https://www.youtube.com/embed/8b4vvPXzJy8"
        title="Como extrair pacote de mapas"
        frameborder="0"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture
        "
        allowfullscreen
      />
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
