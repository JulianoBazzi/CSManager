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
        :busy="isBusy"
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
              :model.sync="selectedMap.game_type"
              :busy="isBusy">
            </GameComboBox>
          </b-form-group>

          <b-form-group
            id="modal-group-map-type"
            label="Tipo de Mapa"
            label-for="modal-map-type">
            <MapComboBox
              id="modal-map-type"
              :model.sync="selectedMap.map_type"
              :busy="isBusy">
            </MapComboBox>
          </b-form-group>

          <b-form-group
            id="modal-group-name"
            label="Nome do Mapa"
            label-for="modal-name">
            <b-form-input
              id="modal-name"
              v-model.trim="selectedMap.name"
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
              v-model.trim="selectedMap.link"
              required
              autocomplete="off"
              spellcheck="false"
              :disabled="isBusy">
              </b-form-input>
          </b-form-group>

          <b-form-checkbox
            v-model="selectedMap.active"
            :disabled="isBusy">
            Ativo
            </b-form-checkbox>
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
              v-model.trim="searchText"
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
                Todos
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
        <template #cell(game_type)="row">
          {{getGameTypeShortName(row.item.game_type)}}
        </template>
        <template #cell(map_type)="row">
          {{getMapTypeName(row.item.map_type)}}
        </template>
        <template #cell(link)="row">
          <b-icon icon="check-square-fill" v-if="row.item.link"/>
          <b-icon icon="square" v-else/>
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
import supabase from '@/services/supabase';

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
    game_type: this.$store.state.game ? this.$store.state.game : 'cs',
    map_type: 'bomb',
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
      key: 'map_type',
      label: 'Tipo de Mapa',
      sortable: true,
    },
    {
      key: 'game_type',
      label: 'Tipo de Jogo',
      sortable: true,
    },
    {
      key: 'link',
      label: 'Link',
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

  searchText = '';

  searchSituation: boolean | null = null;

  searchGameType = null;

  searchMapType = null;

  async created(): Promise<void> {
    this.isBusy = true;
    this.maps = [];

    const user = supabase.auth.user();

    const { data, error } = await supabase
      .from('maps')
      .select()
      .eq('user_id', user?.id)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new AppError('Mapas', error.message, ToastsTypeEnum.Warning);
    }

    if (data && data.length > 0) {
      this.maps = data;
    }

    this.searchGameType = this.$store.state.game ? this.$store.state.game : null;

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
      : item.game_type === this.searchGameType));

    items = items.filter((item) => (this.searchMapType === null || this.searchMapType === 'null'
      ? item
      : item.map_type === this.searchMapType));

    return items;
  }

  getGameTypeShortName(id: string): string | undefined {
    return this.$store.getters.getGameTypeShortName(id);
  }

  getMapTypeName(id: string): string | undefined {
    return this.$store.getters.getMapTypeName(id);
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
      game_type: this.$store.state.game ? this.$store.state.game : 'cs',
      map_type: 'bomb',
      name: '',
      link: '',
      active: true,
    };
    this.showModal = false;
  }

  async handleSubmit(): Promise<void> {
    if (!this.selectedMap.name) {
      throw new AppError('Mapa', 'O nome é obrigatório!', ToastsTypeEnum.Warning);
    }

    if (!this.selectedMap.game_type) {
      throw new AppError('Mapa', 'O tipo de jogo é obrigatório!', ToastsTypeEnum.Warning);
    }

    if (!this.selectedMap.map_type) {
      throw new AppError('Mapa', 'O tipo de mapa é obrigatório!', ToastsTypeEnum.Warning);
    }

    const existsUsername = this.maps.find((map) => (
      map.game_type === this.selectedMap.game_type
      && map.map_type === this.selectedMap.map_type
      && map.name.toLowerCase() === this.selectedMap.name.toLowerCase()
      && map.id !== this.selectedMap.id
    ));
    if (existsUsername) {
      throw new AppError('Mapa', 'Mapa já cadastrado!', ToastsTypeEnum.Warning);
    }

    this.isBusy = true;
    try {
      const user = supabase.auth.user();
      const {
        // eslint-disable-next-line camelcase
        id = v4(), name, game_type, map_type, link, active,
      } = this.selectedMap;

      const { data, error } = await supabase.from('maps').upsert({
        id,
        user_id: user?.id,
        name,
        game_type,
        map_type,
        link,
        active,
      });

      if (error) {
        throw new AppError('Mapa', error.message, ToastsTypeEnum.Warning);
      }

      if (data) {
        this.maps = this.maps.filter((map) => map.id !== id);
        this.maps.unshift({
          id,
          name,
          game_type,
          map_type,
          active,
          link,
        });
        this.showModal = false;
      }
    } finally {
      this.isBusy = false;
    }
  }
}
</script>
