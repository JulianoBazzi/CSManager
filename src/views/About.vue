<template>
  <div class="about">
    <Card title="Sobre">
      <p>Tecnologias Utilizadas:</p>
      <hr/>
      <ul>
        <li>
          <a href="https://vuejs.org/" target="_blank">Vue.js 2</a>
        </li>
        <li>
          <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>
        </li>
        <li>
          <a href="https://bootstrap-vue.org/" target="_blank">BootstrapVue</a>
        </li>
        <li>
          <a href="https://firebase.google.com/" target="_blank">Firebase (Auth and Firestore)</a>
        </li>
      </ul>
      <hr/>
      <p>
        Link do Projeto:
        <a href="https://github.com/JulianoBazzi/CSManager" target="_blank">GitHub</a>
      </p>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Card from '@/components/Card.vue';
import Base from '@/views/Base';

@Component({
  components: {
    Card,
  },
})
export default class About extends Base {
}
</script>
