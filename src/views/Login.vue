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
            :disabled="isLoading"
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
            :disabled="isLoading"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="success" :disabled="isLoading">
          <b-spinner small v-if="isLoading"></b-spinner>
          <b-icon icon="box-arrow-in-right" v-else/>
            Entrar
        </b-button>
        <b-button class="ml-2" @click="toggleButton" variant="info" :disabled="isLoading">
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
            :disabled="isLoading"
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
            :disabled="isLoading"
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
            :disabled="isLoading"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="register-group-password-repeat"
          label="Repetir Senha"
          label-for="register-password-repeat">
          <b-form-input
            id="register-password-repeat"
            v-model="passwordRepeat"
            type="password"
            minlength="6"
            required
            :disabled="isLoading"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="success" :disabled="isLoading">
          <b-spinner small v-if="isLoading"></b-spinner>
          <b-icon icon="person-plus" v-else/>
            Registrar-se
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script lang="ts">
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import firebase from 'firebase';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  isLoading = false;

  login = true;

  title = 'Entrar';

  remember = false;

  name = '';

  email = '';

  password = '';

  passwordRepeat = '';

  toggleButton(): void {
    this.login = !this.login;
    this.title = this.login ? 'Entrar' : 'Registrar-se';
    this.name = '';
    this.email = '';
    this.password = '';
    this.passwordRepeat = '';
  }

  async handleLogin(): Promise<void> {
    if (!this.email || !this.password) {
      throw new AppError('Login', 'O e-mail e senha é obrigatório!', ToastsTypeEnum.Warning);
    }

    this.isLoading = true;
    try {
      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password);

      if (!user) {
        throw new AppError('Login', 'Usuário não encontrado!', ToastsTypeEnum.Warning);
      }

      if (!user?.emailVerified) {
        await user?.sendEmailVerification();
      }

      this.$store.commit('setUser', user);

      this.isLoading = false;
      this.$router.push('/');
    } catch (error) {
      this.isLoading = false;
    }

    // Validar principais rejeições do Firebase
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth?hl=pt-br#signinwithemailandpassword
    // auth/invalid-email
    // auth/user-not-found
    // auth/wrong-password
  }

  async handleRegister(): Promise<void> {
    if (!this.name || !this.email || !this.password || !this.passwordRepeat) {
      throw new AppError('Registrar-se', 'O nome, e-mail e senha é obrigatório!', ToastsTypeEnum.Warning);
    }

    if (this.password !== this.passwordRepeat) {
      throw new AppError('Registrar-se', 'As senhas não conferem!', ToastsTypeEnum.Warning);
    }

    this.isLoading = true;

    // Principais rejeições do Firebase Auth
    // https://firebase.google.com/docs/auth/admin/errors?hl=pt-br
    // auth/email-already-exists
    // auth/invalid-email
  }
}
</script>
