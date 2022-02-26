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
        <template #cell(created)="row">
          {{ getDateFormat(row.item.created) }}
        </template>
        <template #cell(gameType)="row">
          {{ getGameTypeShortName(row.item.gameType) }}
        </template>
        <template #cell(considerPatents)="row">
          <b-icon icon="check-square-fill" v-if="row.item.considerPatents"/>
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
import firebase from 'firebase';
import moment from 'moment';

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
    key: 'created',
    label: 'Data/Hora Sorteio',
    sortable: true,
  },
  {
    key: 'gameType',
    label: 'Tipo de Jogo',
    sortable: true,
  },
  {
    key: 'considerPatents',
    label: 'Considerar Patentes',
    sortable: true,
  },
  {
    key: 'quantityPlayers',
    label: 'Qtd Jogadores',
  },
  {
    key: 'quantityMaps',
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

    const user = firebase.auth().currentUser;

    const docs = await firebase
      .firestore()
      .collection('sweepstakes')
      .where('userId', '==', user?.uid)
      .orderBy('updated', 'desc')
      .get();

    docs.forEach((sweepstake) => {
      this.sweepstakes.push({
        id: sweepstake.id,
        userId: sweepstake.data()?.usetId,
        created: (sweepstake.data()?.created as firebase.firestore.Timestamp).toDate(),
        updated: (sweepstake.data()?.updated as firebase.firestore.Timestamp).toDate(),
        departure: (sweepstake.data()?.departure as firebase.firestore.Timestamp).toDate(),
        gameType: sweepstake.data()?.gameType,
        quantityPlayers: sweepstake.data()?.quantityPlayers,
        quantityMaps: sweepstake.data()?.quantityMaps,
        considerPatents: sweepstake.data()?.considerPatents,
        considerPreviousRankings: sweepstake.data()?.considerPreviousRankings,
        teams: sweepstake.data()?.teams,
        maps: sweepstake.data()?.maps,
      });
    });

    this.isBusy = false;
  }

  get itemsFiltered(): ISweepstakeDTO[] {
    let items = this.sweepstakes;

    items = items.filter((item) => this.searchDate === null
      || moment(item.created).format('DD/MM/YYYY') === moment(this.searchDate).format('DD/MM/YYYY'));

    items = items.filter((item) => (this.searchGameType === null || this.searchGameType === 'null'
      ? item
      : item.gameType === this.searchGameType));

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

      await firebase
        .firestore()
        .collection('sweepstakes')
        .doc(id)
        .delete();

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
