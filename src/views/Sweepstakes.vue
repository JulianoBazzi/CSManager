<template>
  <div class="sweepstakes">
    <Card
      title="Sorteios"
      :busy="isBusy"
      :displayAddButton="true"
      @onClickAdd="newSweepstake">
      <b-form class="form-group row">
          <b-form-group
            id="player-group-search"
            class="col-sm-12 col-md-3"
            label="Data do Sorteio"
            label-for="player-search">
            <b-form-input
              id="player-search"
              v-model="searchDate"
              placeholder="dd/mm/yyyy"
              type="date"
              autocomplete="off"
              :disabled="isBusy"
            />
          </b-form-group>

          <b-form-group
            id="map-group-game-type"
            class="col-sm-12 col-md-4"
            label="Jogo"
            label-for="map-game-type">
            <GameComboBox
              id="map-game-type"
              :model.sync="searchGameType"
              :busy="isBusy">
              <option
                value="null">
                Todos
              </option>
            </GameComboBox>
          </b-form-group>

          <b-col class="mt-sm-1 mt-md-3 align-self-md-center">
            <b-button
              class="col-sm-12 col-md-4"
              @click="cleanFilters"
              :disabled="isBusy">
              Limpar
            </b-button>
          </b-col>

          <div class="col-md-2" />
      </b-form>
      <Table
        id="tableSweepstakes"
        :displayEditButton="true"
        :displayDeleteButton="true"
        :items="itemsFiltered"
        :fields="fields"
        :busy="isBusy"
        @onClickEdit="edit"
        @onClickRemove="remove">
        <template #cell(created_at)="row">
          {{ getDateFormat(row.item.created_at) }}
        </template>
        <template #cell(game_type)="row">
          {{ getGameTypeShortName(row.item.game_type) }}
        </template>
        <template #cell(consider_patents)="row">
          <b-icon icon="check-square-fill" v-if="row.item.consider_patents"/>
          <b-icon icon="square" v-else/>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Base from '@/views/Base';
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import GameComboBox from '@/components/ComboBox/Game.vue';
import ITableFieldsDTO from '@/dtos/ITableFieldsDTO';
import ISweepstakeDTO from '@/dtos/ISweepstakeDTO';
import moment from 'moment';
import supabase from '@/services/supabase';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';

@Component({
  components: {
    Card,
    Table,
    GameComboBox,
  },
})
export default class Sweepstakes extends Base {
  sweepstakes: ISweepstakeDTO[] = [];

  fields: ITableFieldsDTO[] = [{
    key: 'created_at',
    label: 'Data/Hora Sorteio',
    sortable: true,
  },
  {
    key: 'game_type',
    label: 'Tipo de Jogo',
    sortable: true,
  },
  {
    key: 'consider_patents',
    label: 'Considerar Patentes',
    sortable: true,
  },
  {
    key: 'quantity_players',
    label: 'Qtd Jogadores',
  },
  {
    key: 'quantity_maps',
    label: 'Qtd Mapas',
  },
  {
    key: 'actions',
    label: 'Ações',
  }];

  searchDate: Date | null = null;

  searchGameType = null;

  async created(): Promise<void> {
    this.isBusy = true;
    this.sweepstakes = [];

    const user = supabase.auth.user();

    const { data, error } = await supabase
      .from('sweepstakes')
      .select()
      .eq('user_id', user?.id)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new AppError('Sorteios', error.message, ToastsTypeEnum.Warning);
    }

    if (data && data.length > 0) {
      data.forEach((sweepstake) => {
        this.sweepstakes.push(sweepstake);
      });
    }

    this.isBusy = false;
  }

  get itemsFiltered(): ISweepstakeDTO[] {
    let items = this.sweepstakes;

    items = items.filter((item) => this.searchDate === null
      || moment(item.created_at).format('DD/MM/YYYY') === moment(this.searchDate).format('DD/MM/YYYY'));

    items = items.filter((item) => (this.searchGameType === null || this.searchGameType === 'null'
      ? item
      : item.game_type === this.searchGameType));

    return items;
  }

  newSweepstake(): void {
    this.$router.push({ name: 'NewSweepstake' });
  }

  cleanFilters(): void {
    this.searchDate = null;
    this.searchGameType = null;
  }

  async edit(obj: ISweepstakeDTO): Promise<void> {
    if (obj && obj.id) {
      this.$router.push({ name: 'Sweepstake', params: { id: obj.id } });
    }
  }

  async remove(id: string): Promise<void> {
    const { isConfirmed } = await this.$swal.fire({
      scrollbarPadding: false,
      title: 'Você tem certeza?',
      text: 'Confirma a exclusão permanentemente deste registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    });

    if (isConfirmed) {
      this.isBusy = true;

      const { error: errorMap } = await supabase.from('sweepstake_maps')
        .delete()
        .match({ sweepstake_id: id });

      if (errorMap) {
        throw new AppError('Mapas - Sorteio', errorMap.message, ToastsTypeEnum.Warning);
      }

      const { error: errorPlayer } = await supabase.from('sweepstake_players')
        .delete()
        .match({ sweepstake_id: id });

      if (errorPlayer) {
        throw new AppError('Jogadores - Sorteio', errorPlayer.message, ToastsTypeEnum.Warning);
      }

      const { error } = await supabase.from('sweepstakes')
        .delete()
        .match({ id });

      if (error) {
        throw new AppError('Sorteio', error.message, ToastsTypeEnum.Warning);
      }

      this.sweepstakes = this.sweepstakes.filter((sweepstake) => sweepstake.id !== id);

      this.isBusy = false;
    }
  }

  getGameTypeShortName(id: string): string | undefined {
    return this.$store.getters.getGameTypeShortName(id);
  }

  getDateFormat(date: Date): string {
    this.isBusy = false;
    return moment(date).format('DD/MM/YYYY HH:mm');
  }
}
</script>
