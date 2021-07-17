}
<template>
  <div>
    <Card title="Novo Sorteio">
      <b-form @submit.prevent="handleRaffle">
        <div class="row">
          <b-form-group
            id="sweepstake-group-game-type"
            class="col-sm-12 col-md-4"
            label="Tipo de Jogo"
            label-for="sweepstake-game-type">
            <GameComboBox
              id="sweepstake-game-type"
              :model.sync="gameSelected"
              :disabled="isBusy"/>
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
        <div class="row">
          <b-form-checkbox class="ml-3" disabled>
          Considerar patentes (em breve)
          </b-form-checkbox>

          <b-form-checkbox class="ml-3" disabled>
          Considerar ranking de partidas anteriores (em breve)
          </b-form-checkbox>
        </div>
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
          <template #cell(selected)="{ item, field: { key } }">
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
          <template #cell(selected)="{ item, field: { key } }">
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
import ISweepstakeDTO from '@/dtos/ISweepstakeDTO';
import IFilterComboBoxStringDTO from '@/dtos/IFilterComboBoxStringDTO';
import ITeamDTO from '@/dtos/ITeamDTO';
import SplitArray from '@/tools/SplitArray';
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

  maps: IMapDTO[] = [];

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
    this.isBusy = false;
  }

  async handleRaffle(): Promise<void> {
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

    try {
      this.isBusy = true;

      const divisionTeams = SplitArray(this.players.filter((player) => player.selected));

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

      const sweepstake: ISweepstakeDTO = {
        userId: this.user.uid,
        created: new Date(),
        updated: new Date(),
        gameType: this.gameSelected ?? 'cz',
        considerPatents: false,
        considerPreviousRankings: false,
        quantityPlayers: this.numberSelectedPlayers,
        quantityMaps: this.numberSelectedMaps,
        teams: [teamOne, teamTwo],
        maps: this.maps.filter((map) => map.selected),
      };

      const doc = await firebase.firestore().collection('sweepstakes').add(sweepstake);

      this.$router.push({ name: 'Sweepstake', params: { id: doc.id } });
      throw new AppError('Novo Sorteio', 'Sorteio realizado com sucesso!', ToastsTypeEnum.Success);
    } finally {
      this.isBusy = false;
    }
  }

  get numberSelectedPlayers(): number {
    return this.players.filter((player) => player.selected).length;
  }

  get numberSelectedMaps(): number {
    return this.maps.filter((map) => map.selected).length;
  }

  getMapName(id: string): string | undefined {
    return this.mapsCombo.find((map) => map.value === id)?.text;
  }

  cleanFilters(): void {
    this.isBusy = true;
    try {
      this.gameSelected = this.$store.state.game ? this.$store.state.game : 'cs';
      this.players.filter((player) => player.selected).forEach((player) => {
        this.$set(player, 'selected', false);
      });
      this.maps.filter((map) => map.selected).forEach((map) => {
        this.$set(map, 'selected', false);
      });
    } finally {
      this.isBusy = false;
    }
  }

  tbodyRowClass(item: IPlayerDTO | IMapDTO): string[] {
    this.isBusy = false;
    if (item?.selected) {
      return ['cursor-pointer', 'b-table-row-selected', 'bg-active'];
    }
    return ['cursor-pointer'];
  }

  onRowClicked(item: IPlayerDTO | IMapDTO): void {
    this.$set(item, 'selected', !item.selected);
  }
}
</script>

<style scoped>
  input:disabled {
    background-color: #6c757d !important;
    color: #fff;
  }
</style>
