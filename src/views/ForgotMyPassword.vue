<template>
  <div class="forgotMyPassword">
    <Card title="Esqueci Minha Senha">
      <b-form @submit.prevent="handleResetPassword">
        <b-form-group
          id="forgot-group-email"
          label="E-mail"
          label-for="forgot-email">
          <b-form-input
            id="forgot-email"
            v-model="email"
            type="email"
            required
            :disabled="isBusy"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="success" :disabled="isBusy">
          <b-spinner small v-if="isBusy"></b-spinner>
          <b-icon icon="envelope" v-else/>
            Recuperar Senha
        </b-button>
      </b-form>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Base from '@/views/Base';
import Card from '@/components/Card.vue';
import supabase from '@/services/supabase';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';

@Component({
  components: {
    Card,
  },
})
export default class ForgotMyPassword extends Base {
  email = '';

  user = supabase.auth.user();

  created(): void {
    if (this.user) {
      this.$router.push('/');
    }
  }

  async handleResetPassword(): Promise<void> {
    try {
      this.isBusy = true;

      if (!this.email) {
        throw new AppError('Esqueci Minha Senha', 'O e-mail é obrigatório!', ToastsTypeEnum.Warning);
      }

      const { error } = await supabase.auth.api.resetPasswordForEmail(this.email);

      if (error) {
        throw new AppError('Esqueci Minha Senha', error.message, ToastsTypeEnum.Warning);
      }

      this.$router.push('/');
    } finally {
      this.isBusy = false;
    }
  }
}
</script>
