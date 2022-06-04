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
          <template #cell(selected_date)="{ item, field: { key } }">
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
          <template #cell(selected_date)="{ item, field: { key } }">
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
import { Component, Watch } from 'vue-property-decorator';
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import GameComboBox from '@/components/ComboBox/Game.vue';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import IPlayerResumeDTO from '@/dtos/IPlayerResumeDTO';
import IMapResumeDTO from '@/dtos/IMapResumeDTO';
import ITableFieldsDTO from '@/dtos/ITableFieldsDTO';
import IFilterComboBoxStringDTO from '@/dtos/IFilterComboBoxStringDTO';
import SplitArray from '@/tools/SplitArray';
import { orderBy } from 'lodash';
import RandomUnique from '@/tools/RandomUnique';
import supabase from '@/services/supabase';
import mapsJson from '@/assets/maps.json';

@Component({
  components: {
    Card,
    Table,
    GameComboBox,
  },
})
export default class SweepstakeNew extends Base {
  gameSelected = null;

  departureDate: Date | null = null;

  players: IPlayerResumeDTO[] = [];

  maps: IMapResumeDTO[] = [];

  fieldsPlayer: ITableFieldsDTO[] = [
    {
      key: 'selected_date',
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
      key: 'selected_date',
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

    const { data, error } = await supabase
      .from('players')
      .select()
      .eq('active', true)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new AppError('Jogadores', error.message, ToastsTypeEnum.Warning);
    }

    if (data && data.length > 0) {
      data.forEach((player) => {
        this.players.push({
          id: player.id,
          name: player.name,
          username: player.username,
          patent: player.patent,
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
      const { data, error } = await supabase
        .from('maps')
        .select()
        .eq('game_type', value)
        .eq('active', true)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new AppError('Mapas', error.message, ToastsTypeEnum.Warning);
      }

      if (data && data.length > 0) {
        data.forEach((map) => {
          this.maps.push({
            id: map.id,
            map_type: map.map_type,
            name: map.name,
            link: map.link,
            team_start_from_terrorist: RandomUnique(2, 1)[0] - 1,
          });
        });
      }
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

      if (!this.gameSelected) {
        throw new AppError('Novo Sorteio', 'Tipo de jogo não selecionado!', ToastsTypeEnum.Warning);
      }

      if (!this.departureDate) {
        throw new AppError('Novo Sorteio', 'A data/hora da partida é obrigatória!', ToastsTypeEnum.Warning);
      }

      if (new Date(this.departureDate) < new Date()) {
        throw new AppError('Novo Sorteio', 'A data/hora da partida deve ser superior a data/hora atual!', ToastsTypeEnum.Warning);
      }

      const divisionTeams = SplitArray(orderBy(this.players
        .filter((player) => player.selected_date), ['selected_date'], ['asc']));

      const user = supabase.auth.user();

      const { data, error } = await supabase
        .from('sweepstakes')
        .insert({
          user_id: user?.id,
          game_type: this.gameSelected ?? 'cs',
          departure_at: this.departureDate,
          consider_patents: false,
          consider_previous_rankings: false,
          quantity_players: this.numberSelectedPlayers,
          quantity_maps: this.numberSelectedMaps,
        });

      if (error) {
        throw new AppError('Novo Sorteio', error.message, ToastsTypeEnum.Warning);
      }

      if (data) {
        const { id } = data[0];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const players: any = [];
        for (let i = 0; i < divisionTeams.length;) {
          divisionTeams[i].forEach((player) => {
            players.push({
              user_id: user?.id,
              sweepstake_id: id,
              player_id: player.id,
              team: i,
            });
          });
          i += 1;
        }

        await supabase.from('sweepstake_players').insert(players);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maps: any = [];
        orderBy(this.maps.filter((map) => map.selected_date), ['selected_date'], ['asc']).forEach((map) => {
          maps.push({
            user_id: user?.id,
            sweepstake_id: id,
            map_id: map.id,
            team_start_from_terrorist: map.team_start_from_terrorist,
            selected_at: map.selected_date,
          });
        });

        await supabase.from('sweepstake_maps').insert(maps);

        this.$router.push({ name: 'Sweepstake', params: { id } });
        throw new AppError('Novo Sorteio', 'Sorteio realizado com sucesso!', ToastsTypeEnum.Success);
      }
    } finally {
      this.isBusy = false;
    }
  }

  get numberSelectedPlayers(): number {
    return this.players.filter((player) => player.selected_date).length;
  }

  get numberSelectedMaps(): number {
    return this.maps.filter((map) => map.selected_date).length;
  }

  getMapName(id: string): string | undefined {
    return this.mapsCombo.find((map) => map.value === id)?.text;
  }

  cleanFilters(): void {
    this.isBusy = true;
    try {
      this.gameSelected = this.$store.state.game ? this.$store.state.game : 'cs';
      this.players.filter((player) => player.selected_date).forEach((player) => {
        this.$set(player, 'selected_date', undefined);
      });
      this.maps.filter((map) => map.selected_date).forEach((map) => {
        this.$set(map, 'selected_date', undefined);
      });
    } finally {
      this.isBusy = false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  tbodyRowClass(item: IPlayerResumeDTO | IMapResumeDTO): string[] {
    if (item?.selected_date) {
      return ['cursor-pointer', 'b-table-row-selected', 'bg-active'];
    }
    return ['cursor-pointer'];
  }

  onRowClicked(item: IPlayerResumeDTO | IMapResumeDTO): void {
    this.$set(item, 'selected_date', item.selected_date ? undefined : new Date());
  }
}
</script>

<style scoped>
  input:disabled {
    background-color: #6c757d !important;
    color: #fff;
  }
</style>
