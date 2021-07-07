<template>
  <div class="emailConfirmation">
    <b-card header-tag="header" bg-variant="dark" text-variant="white">
      <template #header>
        <h3 class="mb-0">Confirmação de E-mail</h3>
      </template>
      <b-alert variant="warning" show>
        <strong>
          ATENÇÃO:
        </strong>
          Em alguns casos o e-mail de confirmação pode cair na caixa
        <strong>Lixo Eletrônico</strong> ou <strong>Spam</strong>.
      </b-alert>
      <p>Olá, <strong>{{ user.displayName }}</strong>. Seja bem vindo(a) ao CS Manager.</p>
      <p>
        Para sua segurança, proteção de sua conta e garantir a recuperação da senha em
         caso de problemas estamos solicitando que confirme seu endereço de e-mail.
      </p>
      <p>Por favor confirme seu endereço de e-mail: <strong>{{ user.email }}</strong></p>
      <b-button
        @click="checkEmailVerified"
        variant="success"
        :disabled="isLoading">
          <b-spinner small v-if="isLoading"></b-spinner>
          <b-icon icon="check-circle" v-else/>
            Já confirmei meu e-mail
      </b-button>
      <b-button
        class="ml-2"
        @click="sendConfirmationEmail"
        variant="info"
        :disabled="isLoadingEmail">
        <b-spinner small v-if="isLoadingEmail"></b-spinner>
        <b-icon icon="envelope" v-else/>
          Reenviar e-mail de confirmação
      </b-button>
    </b-card>
  </div>
</template>

<script lang="ts">
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import firebase from 'firebase';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EmailConfirmation extends Vue {
  isLoading = false;

  isLoadingEmail = false;

  user = firebase.auth().currentUser;

  async sendConfirmationEmail(): Promise<void> {
    try {
      this.isLoadingEmail = true;

      this.user = firebase.auth().currentUser;

      if (this.user?.emailVerified) {
        this.isLoadingEmail = false;
        this.$router.push('/');
        throw new AppError('Confirmação de e-mail', 'E-mail verificado com sucesso!', ToastsTypeEnum.Info);
      }

      await this.user?.sendEmailVerification();

      this.isLoadingEmail = false;
      throw new AppError('Confirmação de e-mail', 'E-mail de confirmação foi enviado com sucesso!', ToastsTypeEnum.Success);
    } catch (error) {
      this.isLoadingEmail = false;
      throw new AppError('Confirmação de e-mail', error.message, ToastsTypeEnum.Warning);
    }
  }

  async checkEmailVerified(): Promise<void> {
    try {
      this.isLoading = true;

      this.user = firebase.auth().currentUser;

      if (this.user?.emailVerified) {
        this.isLoading = false;
        this.$router.push('/');
        throw new AppError('Confirmação de e-mail', 'E-mail verificado com sucesso!', ToastsTypeEnum.Info);
      }

      throw new AppError('Confirmação de e-mail', 'Opss.. E-mail ainda não verificado!', ToastsTypeEnum.Warning);
    } catch (error) {
      this.isLoading = false;
      throw new AppError('Confirmação de e-mail', error.message, ToastsTypeEnum.Warning);
    }
  }
}
</script>
