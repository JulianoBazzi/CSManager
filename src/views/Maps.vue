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
            <GameComboBox
              id="modal-game-type"
              :model.sync="selectedMap.gameType"
              :busy="isBusy">
            </GameComboBox>
          </b-form-group>

          <b-form-group
            id="modal-group-map-type"
            label="Tipo de Mapa"
            label-for="modal-map-type">
            <MapComboBox
              id="modal-map-type"
              :model.sync="selectedMap.mapType"
              :busy="isBusy">
            </MapComboBox>
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
      <b-form class="form-group row">
          <b-form-group
            id="map-group-search"
            class="col-sm-12 col-md-3"
            label="Pesquisar"
            label-for="map-search">
            <b-form-input
              id="map-search"
              v-model="searchText"
              placeholder="Descrição"
              autocomplete="off"
              :disabled="isBusy"
            />
          </b-form-group>

          <b-form-group
            id="map-group-situation-type"
            class="col-sm-6 col-md-2"
            label="Situação"
            label-for="map-situation-type">
            <SituationComboBox
              id="map-situation-type"
              :model.sync="searchSituation"
              :busy="isBusy" />
          </b-form-group>

          <b-form-group
            id="map-group-game-type"
            class="col-sm-6 col-md-2"
            label="Jogo"
            label-for="map-game-type">
            <GameComboBox
              id="map-game-type"
              :model.sync="searchGameType"
              :busy="isBusy"
              shortText>
              <option
                value="null">
                Todas
              </option>
            </GameComboBox>
          </b-form-group>

          <b-form-group
            id="map-group-map-type"
            class="col-sm-12 col-md-2"
            label="Mapa"
            label-for="map-map-type">
            <MapComboBox
              id="map-map-type"
              :model.sync="searchMapType"
              :busy="isBusy">
              <option
                value="null">
                Todos
              </option>
            </MapComboBox>
          </b-form-group>

          <b-col class="mt-sm-1 mt-md-3 align-self-md-center">
            <b-button
              class="col-sm-12 col-md-4"
              @click="cleanFilters"
              :disabled="isBusy">
              Limpar
            </b-button>
          </b-col>
      </b-form>
      <Table
        id="tableMaps"
        :displayEditButton="true"
        :items="itemsFiltered"
        :fields="fields"
        :busy="isBusy"
        @onClickEdit="edit">
        <template #cell(gameType)="row">
          {{getGameShortName(row.item.gameType)}}
        </template>
        <template #cell(mapType)="row">
          {{getMapName(row.item.mapType)}}
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
import GameComboBox from '@/components/ComboBox/Game.vue';
import MapComboBox from '@/components/ComboBox/Map.vue';
import SituationComboBox from '@/components/ComboBox/Situation.vue';
import IMapDTO from '@/dtos/IMapDTO';
import ITableFieldsDTO from '@/dtos/ITableFieldsDTO';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import IFilterComboBoxStringDTO from '@/dtos/IFilterComboBoxStringDTO';
import gamesJson from '../assets/games.json';
import mapsJson from '../assets/maps.json';

@Component({
  components: {
    Card,
    Modal,
    Table,
    GameComboBox,
    MapComboBox,
    SituationComboBox,
  },
})
export default class Maps extends Base {
  showModal = false;

  maps: IMapDTO[] = [];

  selectedMap: IMapDTO = {
    gameType: this.$store.state.game ? this.$store.state.game : 'cs',
    mapType: 'bomb',
    name: '',
    link: '',
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
      link: '',
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
      throw new AppError('Mapa', 'Mapa já cadastrado!', ToastsTypeEnum.Warning);
    }

    this.isBusy = true;
    try {
      const user = firebase.auth().currentUser;
      const id = this.selectedMap?.id ? this.selectedMap?.id : v4();
      const {
        name, gameType, mapType, link, active, created,
      } = this.selectedMap;

      firebase.firestore().collection('maps')
        .doc(id).set({
          userId: user?.uid,
          created: created ?? new Date(),
          updated: new Date(),
          name,
          gameType,
          mapType,
          link,
          active,
        })
        .then(() => {
          this.maps = this.maps.filter((map) => map.id !== id);
          this.maps.unshift({
            id,
            name,
            gameType,
            mapType,
            active,
            link,
            created,
          });
        });
    } finally {
      this.isBusy = false;
      this.showModal = false;
    }
  }
}
</script>
