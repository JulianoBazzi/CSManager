}
<template>
  <div>
    <b-card header-tag="header" bg-variant="dark" text-variant="white">
      <template #header>
        <h3 class="mb-0">{{ title }}</h3>
      </template>
      <!-- Login -->
      <b-form @submit.prevent="handleLogin" v-if="login">
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
            minlength="6"
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
        <b-button class="ml-2" @click="toggleButton" variant="info">
          <b-icon icon="person-plus"/>
            Registrar-se
        </b-button>
      </b-form>

      <!-- Register -->
      <b-form @submit.prevent="handleRegister" v-else>
        <b-form-group
          id="register-group-name"
          label="Nome Completo"
          label-for="register-name"
        >
          <b-form-input
            id="register-name"
            v-model="name"
            minlength="3"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="register-group-email"
          label="E-mail"
          label-for="register-email"
        >
          <b-form-input
            id="register-email"
            v-model="email"
            type="email"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="register-group-password"
          label="Senha"
          label-for="register-password">
          <b-form-input
            id="register-password"
            v-model="password"
            type="password"
            minlength="6"
            required
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="success">
          <b-icon icon="person-plus"/>
            Registrar-se
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script lang="ts">
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  data: {

  },
})
export default class Login extends Vue {
  login = true;

  title = 'Entrar';

  remember = false;

  name = '';

  email = '';

  password = '';

  toggleButton(): void {
    this.login = !this.login;
    this.title = this.login ? 'Entrar' : 'Registrar-se';
    this.name = '';
    this.email = '';
    this.password = '';
  }

  async handleLogin(): Promise<void> {
    if (!this.email || !this.password) {
      throw new AppError('Efetuar Login', 'O e-mail e senha é obrigatório', ToastsTypeEnum.Warning);
    }

    // Validar principais rejeições do Firebase
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth?hl=pt-br#signinwithemailandpassword
    // auth/invalid-email
    // auth/user-not-found
    // auth/wrong-password
  }

  async handleRegister(): Promise<void> {
    if (!this.name || !this.email || !this.password) {
      throw new AppError('Efetuar Registro', 'O nome, e-mail e senha é obrigatório', ToastsTypeEnum.Warning);
    }

    // Principais rejeições do Firebase Auth
    // https://firebase.google.com/docs/auth/admin/errors?hl=pt-br
    // auth/email-already-exists
    // auth/invalid-email
  }
}
</script>
