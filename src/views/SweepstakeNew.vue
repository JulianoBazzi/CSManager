}
<template>
  <div>
    <Card title="Novo Sorteio">
      <b-form @submit.prevent="handleRaffle">
        <div class="row">
          <b-form-group
            id="sweepstake-group-game-type"
            class="col-sm-12 col-md-4"
            label="Jogo"
            label-for="sweepstake-game-type">
            <GameComboBox
              id="sweepstake-game-type"
              :model.sync="gameSelected"
              :disabled="isBusy"/>
          </b-form-group>

          <b-form-group
            id="player-group-search"
            class="col-sm-12 col-md-3"
            label="Data/Hora da Partida"
            label-for="player-search">
            <b-form-input
              id="player-search"
              v-model="departureDate"
              type="datetime-local"
              autocomplete="off"
              :disabled="isBusy"
            />
          </b-form-group>

          <b-form-group
            id="sweepstake-group-count-players"
            class="col-sm-6 col-md-2"
            label="Qtd. Jogadores"
            title="Quantidade de Jogadores Selecionados"
            label-for="sweepstake-count-players">
            <b-form-input
              id="sweepstake-count-players"
              type="number"
              :value="numberSelectedPlayers"
              disabled/>
          </b-form-group>

          <b-form-group
            id="sweepstake-group-count-maps"
            class="col-sm-6 col-md-2"
            label="Qtd. Mapas"
            label-for="sweepstake-count-maps"
            title="Quantidade de Mapas Selecionados">
            <b-form-input
              id="sweepstake-count-maps"
              type="number"
              :value="numberSelectedMaps"
              disabled/>
          </b-form-group>
        </div>
        <!-- <div class="row">
          <b-form-checkbox class="ml-3" disabled>
          Considerar patentes (em breve)
          </b-form-checkbox>

          <b-form-checkbox class="ml-3" disabled>
          Considerar ranking de partidas anteriores (em breve)
          </b-form-checkbox>
        </div> -->
        <div class="form-group">
          <b-button
            class="col-sm-12 mt-2 col-md-2 mr-2"
            type="submit"
            variant="success"
            :disabled="isBusy">
            <b-spinner small v-if="isBusy"></b-spinner>
            <b-icon icon="people" v-else/>
              Sortear Times
          </b-button>

          <b-button
            class="col-sm-12 mt-2 col-md-1"
            @click="cleanFilters"
            :disabled="isBusy">
            Limpar
          </b-button>
        </div>
      </b-form>
    </Card>

    <div class="row">
      <Card class="mt-2 col-sm-12 col-md-6" title="Jogadores">
        <Table
          id="tablePlayers"
          :tbodyRowClass="tbodyRowClass"
          :items="players"
          :fields="fieldsPlayer"
          :busy="isBusy"
          small
          :recordsPerPage=12
          @onRowClicked="onRowClicked">
          <template #cell(selectedDate)="{ item, field: { key } }">
            <b-icon icon="check-square-fill" v-if="item[key]"/>
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
      <Card class="mt-2 col-sm-12 col-md-6" title="Mapas">
        <Table
          id="tableMaps"
          :tbodyRowClass="tbodyRowClass"
          :items="maps"
          :fields="fieldsMap"
          :busy="isBusy"
          small
          :recordsPerPage=12
          @onRowClicked="onRowClicked">
          <template #cell(selectedDate)="{ item, field: { key } }">
            <b-icon icon="check-square-fill" v-if="item[key]"/>
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
import Base from '@/views/Base';
import firebase from 'firebase';
import { Component, Watch } from 'vue-property-decorator';
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import GameComboBox from '@/components/ComboBox/Game.vue';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import IPlayerResumeDTO from '@/dtos/IPlayerResumeDTO';
import IMapResumeDTO from '@/dtos/IMapResumeDTO';
import ITableFieldsDTO from '@/dtos/ITableFieldsDTO';
import ISweepstakeDTO from '@/dtos/ISweepstakeDTO';
import IFilterComboBoxStringDTO from '@/dtos/IFilterComboBoxStringDTO';
import ITeamDTO from '@/dtos/ITeamDTO';
import SplitArray from '@/tools/SplitArray';
import _ from 'lodash';
import RandomUnique from '@/tools/RandomUnique';
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

  departureDate: Date | null = null;

  players: IPlayerResumeDTO[] = [];

  maps: IMapResumeDTO[] = [];

  fieldsPlayer: ITableFieldsDTO[] = [
    {
      key: 'selectedDate',
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
      key: 'selectedDate',
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

    this.isBusy = true;
    this.maps = [];

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
              mapType: map.data().mapType,
              name: map.data().name,
              link: map.data().link ?? '',
              startFromTerrorist: RandomUnique(2, 1)[0] - 1,
              matches: [],
              winner: -2,
            });
          });
        });
    }
    this.isBusy = false;
  }

  async handleRaffle(): Promise<void> {
    try {
      this.isBusy = true;
      if (!this.gameSelected) {
        throw new AppError('Novo Sorteio', 'O tipo de jogo é obrigatório!', ToastsTypeEnum.Warning);
      }

      if (this.numberSelectedPlayers <= 1) {
        throw new AppError('Novo Sorteio', 'É obrigatório selecionar ao menos dois jogadores!', ToastsTypeEnum.Warning);
      }

      if (this.numberSelectedMaps <= 0) {
        throw new AppError('Novo Sorteio', 'É obrigatório selecionar ao menos um mapa!', ToastsTypeEnum.Warning);
      }

      if (!this.user) {
        throw new AppError('Novo Sorteio', 'Usuário logado não localizado!', ToastsTypeEnum.Warning);
      }

      if (!this.gameSelected) {
        throw new AppError('Novo Sorteio', 'Tipo de jogo não selecionado!', ToastsTypeEnum.Warning);
      }

      if (!this.departureDate) {
        throw new AppError('Novo Sorteio', 'A data/hora da partida é obrigatória!', ToastsTypeEnum.Warning);
      }

      if (new Date(this.departureDate) < new Date()) {
        throw new AppError('Novo Sorteio', 'A data/hora da partida deve ser superior a data/hora atual!', ToastsTypeEnum.Warning);
      }

      const divisionTeams = SplitArray(_.orderBy(this.players
        .filter((player) => player.selectedDate), ['selectedDate'], ['asc']));

      const teamOne: ITeamDTO = {
        description: 'Time 1',
        quantityPlayers: divisionTeams[0].length,
        players: divisionTeams[0],
      };

      const teamTwo: ITeamDTO = {
        description: 'Time 2',
        quantityPlayers: divisionTeams[1].length,
        players: divisionTeams[1],
      };

      const teams: ITeamDTO[] = [teamOne, teamTwo];

      this.maps.filter((map) => map.selectedDate).forEach((map) => {
        teams.forEach((team) => {
          map.matches.push({
            description: team.description,
            scores: [0, 0],
          });
        });
      });

      const sweepstake: ISweepstakeDTO = {
        userId: this.user.uid,
        created: new Date(),
        updated: new Date(),
        departure: new Date(this.departureDate),
        gameType: this.gameSelected ?? 'cs',
        considerPatents: false,
        considerPreviousRankings: false,
        quantityPlayers: this.numberSelectedPlayers,
        quantityMaps: this.numberSelectedMaps,
        teams,
        maps: _.orderBy(this.maps.filter((map) => map.selectedDate), ['selectedDate'], ['asc']),
      };

      const doc = await firebase.firestore().collection('sweepstakes').add(sweepstake);

      this.$router.push({ name: 'Sweepstake', params: { id: doc.id } });
      throw new AppError('Novo Sorteio', 'Sorteio realizado com sucesso!', ToastsTypeEnum.Success);
    } finally {
      this.isBusy = false;
    }
  }

  get numberSelectedPlayers(): number {
    return this.players.filter((player) => player.selectedDate).length;
  }

  get numberSelectedMaps(): number {
    return this.maps.filter((map) => map.selectedDate).length;
  }

  getMapName(id: string): string | undefined {
    return this.mapsCombo.find((map) => map.value === id)?.text;
  }

  cleanFilters(): void {
    this.isBusy = true;
    try {
      this.gameSelected = this.$store.state.game ? this.$store.state.game : 'cs';
      this.players.filter((player) => player.selectedDate).forEach((player) => {
        this.$set(player, 'selectedDate', undefined);
      });
      this.maps.filter((map) => map.selectedDate).forEach((map) => {
        this.$set(map, 'selectedDate', undefined);
      });
    } finally {
      this.isBusy = false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  tbodyRowClass(item: IPlayerResumeDTO | IMapResumeDTO): string[] {
    if (item?.selectedDate) {
      return ['cursor-pointer', 'b-table-row-selected', 'bg-active'];
    }
    return ['cursor-pointer'];
  }

  onRowClicked(item: IPlayerResumeDTO | IMapResumeDTO): void {
    this.$set(item, 'selectedDate', item.selectedDate ? undefined : new Date());
  }
}
</script>

<style scoped>
  input:disabled {
    background-color: #6c757d !important;
    color: #fff;
  }
</style>
