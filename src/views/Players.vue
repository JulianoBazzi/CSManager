<template>
  <div class="players">
    <Card
      title="Jogadores"
      :busy="isBusy"
      :displayAddButton="true"
      @onClickAdd="showModal = true">
      <Modal
        title="Jogador"
        :show.sync="showModal"
        :busy="isBusy"
        @handleHidden="handleHidden"
        @handleSubmit="handleSubmit"
        >
        <b-form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            id="modal-group-name"
            label="Nome Completo"
            label-for="modal-name">
            <b-form-input
              id="modal-name"
              v-model.trim="selectedPlayer.name"
              required
              autocomplete="off"
              autofocus
              :disabled="isBusy">
              </b-form-input>
          </b-form-group>

          <b-form-group
            id="modal-group-username"
            label="Nome de Usuário na Steam"
            label-for="modal-username">
            <b-form-input
              id="modal-username"
              v-model.trim="selectedPlayer.username"
              required
              autocomplete="off"
              spellcheck="false"
              :disabled="isBusy">
              </b-form-input>
          </b-form-group>

          <b-form-group
            id="modal-group-patent"
            label="Patente (CS:GO)"
            label-for="modal-patent">
            <PatentComboBox
              id="modal-patent"
              :model.sync="selectedPlayer.patent"
              :busy="isBusy">
            </PatentComboBox>
          </b-form-group>

          <b-form-checkbox
            v-model="selectedPlayer.active"
            :disabled="isBusy">
            Ativo
          </b-form-checkbox>
        </b-form>
      </Modal>
      <b-form class="form-group row">
          <b-form-group
            id="player-group-search"
            class="col-sm-12 col-md-4"
            label="Pesquisar"
            label-for="player-search">
            <b-form-input
              id="player-search"
              v-model.trim="searchText"
              placeholder="Nome Completo, Steam"
              autocomplete="off"
              :disabled="isBusy"
            />
          </b-form-group>

          <b-form-group
            id="player-group-situation-type"
            class="col-sm-6 col-md-2"
            label="Situação"
            label-for="player-situation-type">
            <SituationComboBox
              id="player-situation-type"
              :model.sync="searchSituation"
              :busy="isBusy" />
          </b-form-group>

          <b-form-group
            id="player-group-patent-type"
            class="col-sm-6 col-md-2"
            label="Patente"
            label-for="player-patent-type">
            <PatentComboBox
              id="player-patent-type"
              :model.sync="searchPatent"
              :busy="isBusy">
              <option
                value="null">
                Todas
              </option>
            </PatentComboBox>
          </b-form-group>

          <b-col class="mt-sm-1 mt-md-3 align-self-md-center">
            <b-button
              class="col-sm-12 col-md-3"
              @click="cleanFilters"
              :disabled="isBusy">
              Limpar
            </b-button>
          </b-col>
      </b-form>
      <Table
        id="tablePlayers"
        :displayEditButton="true"
        :items="itemsFiltered"
        :fields="fields"
        :busy="isBusy"
        @onClickEdit="edit">
        <template #cell(patent)="row">
          <img
            v-if="row.item.patent"
            width="70"
            :alt="`${row.item.patent}`"
            :src=" require(`@/assets/cs-go/competitive/${row.item.patent}.png`) ">
        </template>
        <template #cell(active)="row">
          <b-icon icon="check-square-fill" v-if="row.item.active"/>
          <b-icon icon="square" v-else/>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase';
import { v4 } from 'uuid';
import { Component } from 'vue-property-decorator';
import Base from '@/views/Base';
import Card from '@/components/Card.vue';
import PatentComboBox from '@/components/ComboBox/Patent.vue';
import SituationComboBox from '@/components/ComboBox/Situation.vue';
import Modal from '@/components/Modal.vue';
import Table from '@/components/Table.vue';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import IPlayerDTO from '../dtos/IPlayerDTO';
import ITableFieldsDTO from '../dtos/ITableFieldsDTO';

@Component({
  components: {
    Card,
    Modal,
    Table,
    PatentComboBox,
    SituationComboBox,
  },
})
export default class Players extends Base {
  showModal = false;

  players: IPlayerDTO[] = [];

  selectedPlayer: IPlayerDTO = {
    name: '',
    username: '',
    patent: 'unknown',
    active: true,
  };

  searchText = '';

  searchSituation: boolean | null = null;

  searchPatent = null;

  fields: ITableFieldsDTO[] = [{
    key: 'name',
    label: 'Nome Completo',
    sortable: true,
  },
  {
    key: 'username',
    label: 'Steam',
    sortable: true,
  },
  {
    key: 'patent',
    label: 'Patente',
    sortable: true,
  },
  {
    key: 'active',
    label: 'Ativo',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Ações',
  }];

  async created(): Promise<void> {
    this.isBusy = true;
    this.players = [];

    const user = firebase.auth().currentUser;

    const docs = await firebase
      .firestore()
      .collection('players')
      .where('userId', '==', user?.uid)
      .orderBy('updated', 'desc')
      .get();

    docs.forEach((player) => {
      this.players.push({
        id: player.id,
        name: player.data().name,
        username: player.data().username,
        patent: player.data().patent,
        active: player.data().active,
        created: player.data().created,
      });
    });

    this.isBusy = false;
  }

  get itemsFiltered(): IPlayerDTO[] {
    let items = [];

    items = this.players.filter((item) => (
      item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
        || item.username.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
    ));

    items = items.filter((item) => (this.searchSituation === null
      ? item
      : item.active === this.searchSituation));

    items = items.filter((item) => (this.searchPatent === null || this.searchPatent === 'null'
      ? item
      : item.patent === this.searchPatent));

    return items;
  }

  handleHidden(): void {
    this.selectedPlayer = {
      name: '',
      username: '',
      patent: 'unknown',
      active: true,
    };
    this.showModal = false;
  }

  handleSubmit(): void {
    if (!this.selectedPlayer.name) {
      throw new AppError('Jogador', 'O nome é obrigatório!', ToastsTypeEnum.Warning);
    }

    if (!this.selectedPlayer.username) {
      throw new AppError('Jogador', 'O nome de usuário na Steam é obrigatório!', ToastsTypeEnum.Warning);
    }

    if (!this.selectedPlayer.patent) {
      throw new AppError('Jogador', 'A patente é obrigatória!', ToastsTypeEnum.Warning);
    }

    const existsUsername = this.players.find((player) => (
      player.username.toLowerCase() === this.selectedPlayer.username.toLowerCase()
      && player.id !== this.selectedPlayer.id
    ));
    if (existsUsername) {
      throw new AppError('Jogador', 'Nome de usuário já cadastrado!', ToastsTypeEnum.Warning);
    }

    this.isBusy = true;
    try {
      const user = firebase.auth().currentUser;
      const id = this.selectedPlayer?.id ? this.selectedPlayer?.id : v4();
      const {
        name, username, patent, active, created,
      } = this.selectedPlayer;

      firebase.firestore().collection('players')
        .doc(id).set({
          userId: user?.uid,
          created: created ?? new Date(),
          updated: new Date(),
          name,
          username,
          patent,
          active,
        })
        .then(() => {
          this.players = this.players.filter((player) => player.id !== id);
          this.players.unshift({
            id,
            name,
            username,
            patent,
            active,
            created,
          });
        });
    } finally {
      this.isBusy = false;
      this.showModal = false;
    }
  }

  cleanFilters(): void {
    this.searchText = '';
    this.searchSituation = null;
    this.searchPatent = null;
  }

  async edit(obj: IPlayerDTO): Promise<void> {
    this.selectedPlayer = obj;
    this.showModal = true;
  }
}
</script>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>
