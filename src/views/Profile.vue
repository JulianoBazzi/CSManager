}
<template>
  <div>
    <Card title="Meu Perfil">
      <b-form @submit.prevent="handleUpdate">
        <b-form-group
          id="profile-group-name"
          label="Nome Completo"
          label-for="profile-name"
        >
          <b-form-input
            id="profile-name"
            v-model="name"
            minlength="3"
            required
            autofocus
            autocomplete="name"
            :disabled="isBusy"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="profile-group-game-type"
          label="Jogo Padrão"
          label-for="profile-game-type"
        >
          <b-form-select
          id="profile-game-type"
          v-model="gameSelected"
          :disabled="isBusy">
            <option
              value="null">
              Indefinido
            </option>
           <option
              v-bind:value="game.value"
              v-for="game in games"
              v-bind:key="game.value">
              {{ game.text }}
            </option>
          </b-form-select>
        </b-form-group>

        <b-button type="submit" variant="success" :disabled="isBusy">
          <b-spinner small v-if="isBusy"></b-spinner>
          <b-icon icon="check-circle" v-else/>
            Atualizar
        </b-button>
      </b-form>
    </Card>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase';
import { Component } from 'vue-property-decorator';
import Base from '@/views/Base';
import Card from '@/components/Card.vue';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import IFilterComboBoxStringDTO from '@/dtos/IFilterComboBoxStringDTO';
import gamesJson from '../assets/games.json';

@Component({
  components: {
    Card,
  },
})
export default class Profile extends Base {
  user = firebase.auth().currentUser;

  name = this.user?.displayName;

  games: IFilterComboBoxStringDTO[] = [];

  gameSelected = null;

  async created(): Promise<void> {
    this.isBusy = true;
    this.games = [];

    this.gameSelected = this.$store.state.game;

    if (gamesJson) {
      gamesJson.forEach((game) => {
        this.games.push({
          value: game.id,
          text: game.name,
          shortText: game.shortName,
        });
      });
    }

    this.isBusy = false;
  }

  async handleUpdate(): Promise<void> {
    if (!this.name) {
      throw new AppError('Meu Perfil', 'O nome é obrigatório!', ToastsTypeEnum.Warning);
    }

    try {
      this.isBusy = true;

      await this.user?.updateProfile({
        displayName: this.name,
      });

      await firebase.firestore().collection('users')
        .doc(this.user?.uid).set({
          updated: new Date(),
          gameType: this.gameSelected,
        });

      await firebase.auth().currentUser?.reload;

      this.$store.commit('setUser', firebase.auth().currentUser);
      this.$store.commit('setGame', this.gameSelected);

      throw new AppError('Meu Perfil', 'Perfil atualizado com sucesso!', ToastsTypeEnum.Success);
    } finally {
      this.isBusy = false;
    }
  }
}
</script>
