<template>
  <div class="emailConfirmation">
    <Card title="Confirmação de E-mail">
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
        :disabled="isBusy">
          <b-spinner small v-if="isBusy"></b-spinner>
          <b-icon icon="check-circle" v-else/>
            Já confirmei meu e-mail
      </b-button>
      <b-button
        class="ml-2"
        @click="sendConfirmationEmail"
        variant="info"
        :disabled="isBusyEmail">
        <b-spinner small v-if="isBusyEmail"></b-spinner>
        <b-icon icon="envelope" v-else/>
          Reenviar e-mail de confirmação
      </b-button>
    </Card>
  </div>
</template>

<script lang="ts">
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import firebase from 'firebase';
import { Component } from 'vue-property-decorator';
import Base from '@/views/Base';
import Card from '@/components/Card.vue';

@Component({
  components: {
    Card,
  },
})
export default class EmailConfirmation extends Base {
  isBusyEmail = false;

  user = firebase.auth().currentUser;

  created(): void {
    if (this.user?.emailVerified) {
      this.$router.push('/');
    }
  }

  async sendConfirmationEmail(): Promise<void> {
    try {
      this.isBusyEmail = true;

      await firebase.auth().currentUser?.reload;
      this.user = firebase.auth().currentUser;

      if (this.user?.emailVerified) {
        this.isBusyEmail = false;
        this.$router.push('/');
        throw new AppError('Confirmação de e-mail', 'E-mail verificado com sucesso!', ToastsTypeEnum.Info);
      }

      await this.user?.sendEmailVerification();

      this.isBusyEmail = false;
      throw new AppError('Confirmação de e-mail', 'E-mail de confirmação foi enviado com sucesso!', ToastsTypeEnum.Success);
    } catch (error) {
      this.isBusyEmail = false;
      throw new AppError('Confirmação de e-mail', error.message, ToastsTypeEnum.Warning);
    }
  }

  async checkEmailVerified(): Promise<void> {
    try {
      this.isBusy = true;

      await firebase.auth().currentUser?.reload;
      this.user = firebase.auth().currentUser;

      if (this.user?.emailVerified) {
        this.isBusy = false;
        this.$router.push('/');
        throw new AppError('Confirmação de e-mail', 'E-mail verificado com sucesso!', ToastsTypeEnum.Info);
      }

      throw new AppError('Confirmação de e-mail', 'Opss.. E-mail ainda não verificado!', ToastsTypeEnum.Warning);
    } catch (error) {
      this.isBusy = false;
      throw new AppError('Confirmação de e-mail', error.message, ToastsTypeEnum.Warning);
    }
  }
}
</script>
