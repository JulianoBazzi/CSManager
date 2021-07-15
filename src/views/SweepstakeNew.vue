}
<template>
  <div>
    <Card title="Novo Sorteio">
      <b-form @submit.prevent="handleRaffle">
        <div class="row">
          <b-form-group
            id="sweepstake-group-game-type"
            class="col-4"
            label="Tipo de Jogo"
            label-for="sweepstake-game-type">
            <GameComboBox
              id="sweepstake-game-type"
              :model.sync="gameSelected"
              :disabled="isBusy"/>
          </b-form-group>

          <b-form-group
            id="sweepstake-group-count-players"
            class="col-2"
            label="Qtd. Jogadores"
            title="Quantidade de Jogadores Selecionados"
            label-for="sweepstake-count-players">
            <b-form-input
              id="sweepstake-count-players"
              type="number"
              :value="playersSelected.length"
              disabled/>
          </b-form-group>

          <b-form-group
            id="sweepstake-group-count-maps"
            class="col-2"
            label="Qtd. Mapas"
            label-for="sweepstake-count-maps"
            title="Quantidade de Mapas Selecionados">
            <b-form-input
              id="sweepstake-count-maps"
              type="number"
              :value="mapsSelected.length"
              disabled/>
          </b-form-group>

          <b-button
            class="col-2 mr-2"
            type="submit"
            variant="success"
            :disabled="isBusy">
            <b-spinner small v-if="isBusy"></b-spinner>
            <b-icon icon="people" v-else/>
              Sortear Times
          </b-button>

          <b-button @click="cleanFilters" :disabled="isBusy">Limpar</b-button>
        </div>
        <div class="row">
          <b-form-checkbox class="ml-3" disabled>
          Considerar patentes (em breve)
          </b-form-checkbox>

          <b-form-checkbox class="ml-3" disabled>
          Considerar ranking de partidas anteriores (em breve)
          </b-form-checkbox>
        </div>
      </b-form>
    </Card>

    <div class="mt-2 row">
      <Card class="col-6 pr-0" title="Jogadores">
        <Table
          id="tablePlayers"
          :items="players"
          :fields="fieldsPlayer"
          :busy="isBusy"
          small
          selectable
          :recordsPerPage=12
          @onRowSelected="onRowPlayerSelected">
          <template #cell(selected)="{ rowSelected }">
            <b-icon icon="check-square-fill" v-if="rowSelected"/>
            <b-icon icon="square" v-else/>
          </template>
          <template #cell(patent)="row">
            <img
              v-if="row.item.patent"
              width="50"
              :alt="`${row.item.patent}`"
              :src=" require(`@/assets/cs-go/competitive/${row.item.patent}.png`) ">
          </template>
        </Table>
      </Card>
      <Card class="col-6" style="padding-left: 0.5rem;" title="Mapas">
        <Table
          id="tableMaps"
          :items="maps"
          :fields="fieldsMap"
          :busy="isBusy"
          small
          selectable
          :recordsPerPage=12
          @onRowSelected="onRowMapSelected">
          <template #cell(selected)="{ rowSelected }">
            <b-icon icon="check-square-fill" v-if="rowSelected"/>
            <b-icon icon="square" v-else/>
          </template>
          <template #cell(mapType)="row">
            {{getMapName(row.item.mapType)}}
          </template>
        </Table>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase';
import { Component, Watch } from 'vue-property-decorator';
import Base from '@/views/Base';
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import GameComboBox from '@/components/ComboBox/Game.vue';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import IPlayerDTO from '@/dtos/IPlayerDTO';
import IMapDTO from '@/dtos/IMapDTO';
import ITableFieldsDTO from '@/dtos/ITableFieldsDTO';
import IFilterComboBoxStringDTO from '@/dtos/IFilterComboBoxStringDTO';
import mapsJson from '../assets/maps.json';

@Component({
  components: {
    Card,
    Table,
    GameComboBox,
  },
})
export default class SweepstakeNew extends Base {
  user = firebase.auth().currentUser;

  name = this.user?.displayName;

  gameSelected = null;

  players: IPlayerDTO[] = [];

  playersSelected: IPlayerDTO[] = [];

  maps: IMapDTO[] = [];

  mapsSelected: IMapDTO[] = [];

  fieldsPlayer: ITableFieldsDTO[] = [
    {
      key: 'selected',
      label: '',
    },
    {
      key: 'name',
      label: 'Nome',
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
  ];

  fieldsMap: ITableFieldsDTO[] = [
    {
      key: 'selected',
      label: '',
    },
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
  ];

  mapsCombo: IFilterComboBoxStringDTO[] = [];

  async created(): Promise<void> {
    this.isBusy = true;

    this.players = [];

    await firebase
      .firestore()
      .collection('players')
      .where('userId', '==', this.user?.uid)
      .where('active', '==', true)
      .orderBy('name', 'asc')
      .get()
      .then((docs) => {
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
      });

    if (mapsJson) {
      mapsJson.forEach((map) => {
        this.mapsCombo.push({
          value: map.id,
          text: map.name['pt-BR'],
        });
      });
    }

    this.gameSelected = this.$store.state.game ? this.$store.state.game : 'cs';

    this.isBusy = false;
  }

  @Watch('gameSelected')
  async onGameSelectedChanged(value: string, oldValue: string): Promise<void> {
    if (value === oldValue) {
      return;
    }

    this.maps = [];
    this.mapsSelected = [];

    if (value) {
      await firebase
        .firestore()
        .collection('maps')
        .where('userId', '==', this.user?.uid)
        .where('active', '==', true)
        .where('gameType', '==', value)
        .orderBy('name', 'asc')
        .get()
        .then((docs) => {
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
        });
    }
  }

  async handleRaffle(): Promise<void> {
    if (!this.gameSelected) {
      throw new AppError('Novo Sorteio', 'O tipo de jogo é obrigatório!', ToastsTypeEnum.Warning);
    }

    if (this.playersSelected.length <= 2) {
      throw new AppError('Novo Sorteio', 'É obrigatório selecionar ao menos três jogadores!', ToastsTypeEnum.Warning);
    }

    if (this.mapsSelected.length <= 0) {
      throw new AppError('Novo Sorteio', 'É obrigatório selecionar ao menos um mapa!', ToastsTypeEnum.Warning);
    }

    try {
      this.isBusy = true;

      await this.user?.updateProfile({
        displayName: this.name,
      });

      await firebase.auth().currentUser?.reload;

      this.$router.push('sweepstakes/123456');
      throw new AppError('Novo Sorteio', 'Sorteio realizado com sucesso!', ToastsTypeEnum.Success);
    } finally {
      this.isBusy = false;
    }
  }

  getMapName(id: string): string | undefined {
    return this.mapsCombo.find((map) => map.value === id)?.text;
  }

  cleanFilters(): void {
    this.gameSelected = this.$store.state.game ? this.$store.state.game : 'cs';
    this.playersSelected = [];
    this.mapsSelected = [];
  }

  onRowPlayerSelected(items: IPlayerDTO[]): void {
    this.playersSelected = items;
  }

  onRowMapSelected(items: IMapDTO[]): void {
    this.mapsSelected = items;
  }
}
</script>

<style scoped>
  input:disabled {
    background-color: #6c757d !important;
    color: #fff;
  }
</style>
