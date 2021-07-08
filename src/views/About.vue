<template>
  <div class="about">
    <Card title="Sobre">
      <p align="center">
        <a href="https://github.com/JulianoBazzi" class="mr-2">
          <img alt="Author Juliano Bazzi" src="https://img.shields.io/badge/author-Juliano%20Bazzi-%23ffb84d?color=01579b&style=for-the-badge" target="_blank">
        </a>
        <a href="https://github.com/JulianoBazzi/CSManager" class="mr-2">
        <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/JulianoBazzi/CSManager?color=01579b&style=for-the-badge" target="_blank">
        </a>
        <a href="https://github.com/JulianoBazzi/CSManager/stargazers" class="mr-2">
          <img alt="Stargazers" src="https://img.shields.io/github/stars/JulianoBazzi/CSManager?color=01579b&style=for-the-badge" target="_blank">
        </a>
        <a href="https://github.com/JulianoBazzi/CSManager/LICENSE.md" class="mr-2">
          <img alt="License MIT" src="https://img.shields.io/badge/license-MIT-%2304D361?color=01579b&style=for-the-badge" target="_blank">
        </a>
      </p>
      <hr/>
      <p>Tecnologias utilizadas:</p>
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
