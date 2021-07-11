<template>
  <div class="maps">
    <Card
      title="Mapas"
      :busy="isBusy"
      :displayAddButton="true"
      @onClickAdd="showModal = true">
      <Modal
        title="Mapa"
        :show.sync="showModal"
        @handleHidden="handleHidden"
        @handleSubmit="handleSubmit"
        >
        <b-form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            id="modal-group-game-type"
            label="Tipo de Jogo"
            label-for="modal-game-type">
            <b-form-select
              id="modal-game-type"
              v-model="selectedMap.gameType"
              autofocus
              :disabled="isBusy">
              <option
                v-bind:value="game.value"
                v-for="game in gamesCombo"
                v-bind:key="game.value">
                {{ game.text }}
              </option>
            </b-form-select>
          </b-form-group>

          <b-form-group
            id="modal-group-map-type"
            label="Tipo de Mapa"
            label-for="modal-map-type">
            <b-form-select
              id="modal-map-type"
              v-model="selectedMap.mapType"
              :disabled="isBusy">
              <option
                v-bind:value="map.value"
                v-for="map in mapsCombo"
                v-bind:key="map.value">
                {{ map.text }}
              </option>
            </b-form-select>
          </b-form-group>

          <b-form-group
            id="modal-group-name"
            label="Nome do Mapa"
            label-for="modal-name">
            <b-form-input
              id="modal-name"
              v-model="selectedMap.name"
              required
              autocomplete="off"
              spellcheck="false"
              :disabled="isBusy">
              </b-form-input>
          </b-form-group>

          <b-form-group
            id="modal-group-link"
            label="Link para Download"
            label-for="modal-link">
            <b-form-input
              id="modal-link"
              v-model="selectedMap.link"
              required
              autocomplete="off"
              spellcheck="false"
              :disabled="isBusy">
              </b-form-input>
          </b-form-group>

          <b-form-checkbox v-model="selectedMap.active">Ativo</b-form-checkbox>
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
          class="mr-2"
          v-model="searchGameType"
          :disabled="isBusy">
           <option
              value="null">
              Todos
            </option>
           <option
              v-bind:value="game.value"
              v-for="game in gamesCombo"
              v-bind:key="game.value">
              {{ game.shortText }}
            </option>
          </b-form-select>

          <b-form-select
          class="mr-3"
          v-model="searchMapType"
          :disabled="isBusy">
           <option
              value="null">
              Todos
            </option>
           <option
              v-bind:value="map.value"
              v-for="map in mapsCombo"
              v-bind:key="map.value">
              {{ map.text }}
            </option>
          </b-form-select>

          <b-button @click="cleanFilters" :disabled="isBusy">Limpar</b-button>
      </b-form>
      <Table
        id="tableMaps"
        :displayEditButton="true"
        :items="itemsFiltered"
        :fields="fields"
        :busy="isBusy"
        @onClickEdit="edit">
        <template #cell(gameType)="row">
          <p>{{getGameShortName(row.item.gameType)}}</p>
        </template>
        <template #cell(mapType)="row">
          <p>{{getMapName(row.item.mapType)}}</p>
        </template>
        <template #cell(active)="row">
          <b-icon icon="check-square-fill" v-if="row.item.active"/>
          <b-icon icon="square" v-else/>
        </template>
        <template v-slot:actions>
          <b-button
            class="ml-2"
            size="sm"
            variant="primary"
            title="Abrir link para download do mapa">
            <b-icon class="button" icon="link45deg" scale="0.9"/>
          </b-button>
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
import IMapDTO from '@/dtos/IMapDTO';
import ITableFieldsDTO from '@/dtos/ITableFieldsDTO';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import IFilterComboBoxStringDTO from '@/dtos/IFilterComboBoxStringDTO';
import IFilterComboBoxBooleanDTO from '@/dtos/IFilterComboBoxBooleanDTO';
import gamesJson from '../assets/games.json';
import mapsJson from '../assets/maps.json';

@Component({
  components: {
    Card,
    Modal,
    Table,
  },
})
export default class Maps extends Base {
  showModal = false;

  maps: IMapDTO[] = [];

  selectedMap: IMapDTO = {
    gameType: this.$store.state.game ? this.$store.state.game : 'cs',
    mapType: 'bomb',
    name: '',
    active: true,
  };

  fields: ITableFieldsDTO[] = [
    {
      key: 'name',
      label: 'Mapa',
      sortable: true,
    },
    {
      key: 'mapType',
      label: 'Tipo de Mapa',
      sortable: true,
    },
    {
      key: 'gameType',
      label: 'Tipo de Jogo',
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
    },
  ];

  mapsCombo: IFilterComboBoxStringDTO[] = [];

  gamesCombo: IFilterComboBoxStringDTO[] = [];

  searchText = '';

  searchSituation: boolean | null = null;

  searchGameType = null;

  searchMapType = null;

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

  async created(): Promise<void> {
    this.isBusy = true;
    this.maps = [];
    this.mapsCombo = [];
    this.gamesCombo = [];

    const user = firebase.auth().currentUser;

    const docs = await firebase
      .firestore()
      .collection('maps')
      .where('userId', '==', user?.uid)
      .orderBy('updated', 'desc')
      .get();

    docs.forEach((map) => {
      this.maps.push({
        id: map.id,
        gameType: map.data().gameType,
        mapType: map.data().mapType,
        name: map.data().name,
        link: map.data().link,
        active: map.data().active,
        created: map.data().created,
      });
    });

    this.searchGameType = this.$store.state.game ? this.$store.state.game : null;

    if (gamesJson) {
      gamesJson.forEach((game) => {
        this.gamesCombo.push({
          value: game.id,
          text: game.name,
          shortText: game.shortName,
        });
      });
    }

    if (mapsJson) {
      mapsJson.forEach((map) => {
        this.mapsCombo.push({
          value: map.id,
          text: map.name['pt-BR'],
        });
      });
    }

    this.isBusy = false;
  }

  get itemsFiltered(): IMapDTO[] {
    let items = [];

    items = this.maps.filter((item) => (
      item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
    ));

    items = items.filter((item) => (this.searchSituation === null
      ? item
      : item.active === this.searchSituation));

    items = items.filter((item) => (this.searchGameType === null || this.searchGameType === 'null'
      ? item
      : item.gameType === this.searchGameType));

    items = items.filter((item) => (this.searchMapType === null || this.searchMapType === 'null'
      ? item
      : item.mapType === this.searchMapType));

    return items;
  }

  getGameShortName(id: string): string | undefined {
    return this.gamesCombo.find((game) => game.value === id)?.shortText;
  }

  getMapName(id: string): string | undefined {
    return this.mapsCombo.find((map) => map.value === id)?.text;
  }

  cleanFilters(): void {
    this.searchText = '';
    this.searchSituation = null;
    this.searchGameType = this.$store.state.game ? this.$store.state.game : null;
    this.searchMapType = null;
  }

  async edit(obj: IMapDTO): Promise<void> {
    this.selectedMap = obj;
    this.showModal = true;
  }

  handleHidden(): void {
    this.selectedMap = {
      gameType: this.$store.state.game ? this.$store.state.game : 'cs',
      mapType: 'bomb',
      name: '',
      active: true,
    };
    this.showModal = false;
  }

  handleSubmit(): void {
    if (!this.selectedMap.name) {
      throw new AppError('Mapa', 'O nome é obrigatório!', ToastsTypeEnum.Warning);
    }

    if (!this.selectedMap.gameType) {
      throw new AppError('Mapa', 'O tipo de jogo é obrigatório!', ToastsTypeEnum.Warning);
    }

    if (!this.selectedMap.mapType) {
      throw new AppError('Mapa', 'O tipo de mapa é obrigatório!', ToastsTypeEnum.Warning);
    }

    const existsUsername = this.maps.find((map) => (
      map.gameType === this.selectedMap.gameType
      && map.mapType === this.selectedMap.mapType
      && map.name.toLowerCase() === this.selectedMap.name.toLowerCase()
      && map.id !== this.selectedMap.id
    ));
    if (existsUsername) {
      throw new AppError('Mapa', 'Napa já cadastrado!', ToastsTypeEnum.Warning);
    }

    this.isBusy = true;
    try {
      const user = firebase.auth().currentUser;
      const id = this.selectedMap?.id ? this.selectedMap?.id : v4();

      firebase.firestore().collection('maps')
        .doc(id).set({
          userId: user?.uid,
          created: this.selectedMap?.created ? this.selectedMap?.created : new Date(),
          updated: new Date(),
          name: this.selectedMap?.name,
          gameType: this.selectedMap?.gameType,
          mapType: this.selectedMap?.mapType,
          link: this.selectedMap?.link,
          active: this.selectedMap?.active,
        })
        .then(() => {
          this.maps = this.maps.filter((map) => map.id !== id);
          this.maps.unshift({
            id,
            name: this.selectedMap?.name,
            gameType: this.selectedMap?.gameType,
            mapType: this.selectedMap?.mapType,
            active: this.selectedMap?.active,
            created: this.selectedMap.created,
          });
          this.isBusy = false;
          this.showModal = false;
        });
    } catch (error) {
      this.isBusy = false;
      this.showModal = false;
      throw new AppError('Mapa', error.message, ToastsTypeEnum.Warning);
    }
  }
}
</script>
