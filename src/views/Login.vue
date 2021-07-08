}
<template>
  <div>
    <Card :title="title">
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
    </Card>
  </div>
</template>

<script lang="ts">
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import firebase from 'firebase';
import { Component, Vue } from 'vue-property-decorator';
import Card from '@/components/Card.vue';

@Component({
  components: {
    Card,
  },
})
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
      throw new AppError(this.title, 'O e-mail e senha é obrigatório!', ToastsTypeEnum.Warning);
    }

    this.isLoading = true;
    try {
      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password);

      if (!user) {
        throw new AppError(this.title, 'Usuário não encontrado!', ToastsTypeEnum.Warning);
      }

      this.$store.commit('setUser', user);
      this.isLoading = false;

      if (!user?.emailVerified) {
        this.$router.push('/emailConfirmation');
        return;
      }

      this.$router.push('/');
    } catch (error) {
      this.isLoading = false;
      if (error.code === 'auth/invalid-email') {
        throw new AppError(this.title, 'E-mail inválido!', ToastsTypeEnum.Warning);
      } else if (error.code === 'auth/too-many-requests') {
        throw new AppError(this.title, 'Você enviou muitas solicitações, aguarde alguns minutos e tente novamente.', ToastsTypeEnum.Secondary);
      } else if ((error.code === 'auth/user-disabled')
                 || (error.code === 'auth/user-not-found')
                 || (error.code === 'auth/wrong-password')) {
        throw new AppError(this.title, 'E-mail ou senha inválido!', ToastsTypeEnum.Warning);
      }
      throw new AppError(this.title, error.message, ToastsTypeEnum.Warning);
    }
  }

  async handleRegister(): Promise<void> {
    if (!this.name || !this.email || !this.password || !this.passwordRepeat) {
      throw new AppError(this.title, 'O nome, e-mail e senha é obrigatório!', ToastsTypeEnum.Warning);
    }

    if (this.password !== this.passwordRepeat) {
      throw new AppError(this.title, 'As senhas não conferem!', ToastsTypeEnum.Warning);
    }

    try {
      this.isLoading = true;

      const { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password);

      await user?.updateProfile({
        displayName: this.name,
      });

      await user?.sendEmailVerification();
      this.$store.commit('setUser', user);
      this.isLoading = false;

      this.$router.push('/emailConfirmation');
    } catch (error) {
      this.isLoading = false;
      if (error.code === 'auth/too-many-requests') {
        throw new AppError(this.title, 'Você enviou muitas solicitações, aguarde alguns minutos e tente novamente.', ToastsTypeEnum.Secondary);
      } else if ((error.code === 'auth/email-already-in-use') || (error.code === 'auth/email-already-exists')) {
        throw new AppError(this.title, 'E-mail já registrado!', ToastsTypeEnum.Warning);
      } else if (error.code === 'auth/invalid-email') {
        throw new AppError(this.title, 'E-mail inválido!', ToastsTypeEnum.Warning);
      } else if (error.code === 'auth/weak-password') {
        throw new AppError(this.title, 'A senha deve ter pelo menos 6 caracteres!', ToastsTypeEnum.Warning);
      }
      throw new AppError(this.title, error.message, ToastsTypeEnum.Warning);
    }
  }
}
</script>
