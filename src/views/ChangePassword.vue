<template>
  <div class="changePassword">
    <Card title="Alterar Senha">
      <b-form @submit.prevent="handleChangePassword">
        <b-form-group
          id="change-password-group-password"
          label="Nova Senha"
          label-for="change-password">
          <b-form-input
            id="change-password"
            v-model="newPassword"
            type="password"
            minlength="6"
            required
            autofocus
            :disabled="isBusy"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="change-password-group-password"
          label="Confirmar Nova Senha"
          label-for="change-password-repeat">
          <b-form-input
            id="change-password-repeat"
            v-model="newPasswordRepeat"
            type="password"
            minlength="6"
            required
            :disabled="isBusy"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="success" :disabled="isBusy">
          <b-spinner small v-if="isBusy"></b-spinner>
          <b-icon icon="key" v-else/>
            Alterar Senha
        </b-button>
      </b-form>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Base from '@/views/Base';
import Card from '@/components/Card.vue';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import firebase from 'firebase';

@Component({
  components: {
    Card,
  },
})
export default class ChangePassword extends Base {
  newPassword = '';

  newPasswordRepeat = '';

  async handleChangePassword(): Promise<void> {
    try {
      this.isBusy = true;

      if (this.newPassword !== this.newPasswordRepeat) {
        throw new AppError('Alterar Senha', 'A nova senha informada não confere!', ToastsTypeEnum.Warning);
      }

      const user = firebase.auth().currentUser;

      if (!user) {
        throw new AppError('Alterar Senha', 'Usuário não localizado!', ToastsTypeEnum.Warning);
      }

      await user.updatePassword(this.newPassword).then(async () => {
        await firebase.auth().signOut();
        this.isBusy = false;
        this.$store.commit('setGame', null);
        this.$store.commit('setUser', null);
        this.$router.push('/');
      });
    } catch (error) {
      throw new AppError('Alterar Senha', error.message, ToastsTypeEnum.Warning);
    } finally {
      this.isBusy = false;
    }
  }
}
</script>
