}
<template>
  <div>
    <!-- Login -->
    <b-card header-tag="header" bg-variant="dark" text-variant="white">
      <template #header>
        <h3 class="mb-0">Entrar</h3>
      </template>
      <b-form @submit.prevent="handleLogin">
        <b-form-group
          id="login-group-email"
          label="E-mail"
          label-for="login-email"
        >
          <b-form-input
            id="login-email"
            v-model="email"
            type="email"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="login-group-password"
          label="Senha"
          label-for="login-password">
          <b-form-input
            id="login-password"
            v-model="password"
            type="password"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-checkbox
          class="mb-4"
          id="checkbox-1"
          v-model="remember"
          name="remember"
          value="accepted"
          unchecked-value="not_accepted"
        >
          Manter-me conectado
        </b-form-checkbox>

        <b-button type="submit" variant="success">
          <b-icon icon="box-arrow-in-right"/>
            Entrar
        </b-button>
        <b-button class="ml-2" @click="handleRegister" variant="info">
          <b-icon icon="person-plus"/>
            Registrar-se
        </b-button>
      </b-form>
    </b-card>

    <!-- Register -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  data: {

  },
})
export default class Login extends Vue {
  login = true;

  remember = false;

  name = '';

  email = '';

  password = '';

  async handleLogin(): Promise<void> {
    this.email = '';
  }

  async handleRegister(): Promise<void> {
    this.email = '';
  }
}
</script>
