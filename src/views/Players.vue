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
              v-model="selectedPlayer.name"
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
              v-model="selectedPlayer.username"
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
            <b-form-select
              id="modal-patent"
              v-model="selectedPlayer.patent"
              :disabled="isBusy">
             <option
                v-bind:value="patent.value"
                v-for="patent in patents"
                v-bind:key="patent.value">
                {{ patent.text }}
              </option>
            </b-form-select>
          </b-form-group>

          <b-form-checkbox v-model="selectedPlayer.active">Ativo</b-form-checkbox>
        </b-form>
      </Modal>
      <b-form class="mb-3" inline>
          <b-form-input
            class="mr-2"
            v-model="searchText"
            placeholder="Pesquisar"
            autocomplete="off"
            :disabled="isBusy"
          ></b-form-input>

          <b-form-select
          class="mr-2"
          v-model="searchSituation"
          :options="situationsFilter"
          :disabled="isBusy">
          </b-form-select>

          <b-form-select
          class="mr-3"
          v-model="searchPatent"
          :disabled="isBusy">
           <option
              value="null">
              Todas
            </option>
           <option
              v-bind:value="patent.value"
              v-for="patent in patents"
              v-bind:key="patent.value">
              {{ patent.text }}
            </option>
          </b-form-select>

          <b-button @click="cleanFilters" :disabled="isBusy">Limpar</b-button>
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
import Modal from '@/components/Modal.vue';
import Table from '@/components/Table.vue';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import rakingsCsGo from '../assets/cs-go/rakings.json';
import IFilterComboBoxBooleanDTO from '../dtos/IFilterComboBoxBooleanDTO';
import IFilterComboBoxStringDTO from '../dtos/IFilterComboBoxStringDTO';
import IPlayerDTO from '../dtos/IPlayerDTO';
import ITableFieldsDTO from '../dtos/ITableFieldsDTO';

@Component({
  components: {
    Card,
    Modal,
    Table,
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

  situationsFilter: IFilterComboBoxBooleanDTO[] = [
    {
      value: null,
      text: 'Todos',
    },
    {
      value: true,
      text: 'Ativos',
    },
    {
      value: false,
      text: 'Inativos',
    },
  ]

  searchSituation: boolean | null = null;

  patents: IFilterComboBoxStringDTO[] = [];

  searchPatent = null;

  fields: ITableFieldsDTO[] = [{
    key: 'name',
    label: 'Nome Completo',
    sortable: true,
  },
  {
    key: 'username',
    label: 'Nick Steam',
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
    this.patents = [];

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

    const competitive = rakingsCsGo.find((rank) => rank.type === 'competitive');
    if (competitive) {
      competitive.items.forEach((patent) => {
        this.patents.push({
          value: patent.id,
          text: patent.name['pt-BR'],
        });
      });
    }

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

      firebase.firestore().collection('players')
        .doc(id).set({
          userId: user?.uid,
          created: this.selectedPlayer?.created ? this.selectedPlayer?.created : new Date(),
          updated: new Date(),
          name: this.selectedPlayer?.name,
          username: this.selectedPlayer?.username,
          patent: this.selectedPlayer?.patent,
          active: this.selectedPlayer?.active,
        })
        .then(() => {
          this.players = this.players.filter((player) => player.id !== id);
          this.players.unshift({
            id,
            name: this.selectedPlayer?.name,
            username: this.selectedPlayer.username,
            patent: this.selectedPlayer.patent,
            active: this.selectedPlayer.active,
            created: this.selectedPlayer.created,
          });
          this.isBusy = false;
          this.showModal = false;
        });
    } catch (error) {
      this.isBusy = false;
      this.showModal = false;
      throw new AppError('Jogador', error.message, ToastsTypeEnum.Warning);
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
