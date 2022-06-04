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
          <a href="https://vuex.vuejs.org/" target="_blank">Vuex</a>
        </li>
        <li>
          <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>
        </li>
        <li>
          <a href="https://bootstrap-vue.org/" target="_blank">BootstrapVue</a>
        </li>
        <li>
          <a href="https://supabase.com/" target="_blank">Supabase</a>
        </li>
        <li>
          <a href="https://lodash.com/" target="_blank">Lodash</a>
        </li>
        <li>
          <a href="https://sweetalert2.github.io/" target="_blank">SweetAlert 2</a>
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
