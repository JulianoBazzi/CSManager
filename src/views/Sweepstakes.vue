<template>
  <div class="sweepstakes">
    <Card
      title="Sorteios"
      :busy="isBusy"
      :displayAddButton="true"
      @onClickAdd="newSweepstake">
      <Table
        id="tableSweepstakes"
        :displayDeleteButton="true"
        :items="itemsFiltered"
        :fields="fields"
        :busy="isBusy"
        @onClickRemove="remove">
        <template #cell(active)="row">
          <b-icon icon="check-square-fill" v-if="row.item.active"/>
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
import ITableFieldsDTO from '@/dtos/ITableFieldsDTO';
import ISweepstakeDTO from '@/dtos/ISweepstakeDTO';

@Component({
  components: {
    Card,
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

  async created(): Promise<void> {
    this.isBusy = true;
    this.sweepstakes = [];

    // const user = firebase.auth().currentUser;

    // const docs = await firebase
    //   .firestore()
    //   .collection('sweepstakes')
    //   .where('userId', '==', user?.uid)
    //   .orderBy('updated', 'desc')
    //   .get();

    // docs.forEach((player) => {
    //   this.sweepstakes.push({
    //     id: player.id,
    //     name: player.data().name,
    //     username: player.data().username,
    //     patent: player.data().patent,
    //     active: player.data().active,
    //     created: player.data().created,
    //   });
    // });

    this.isBusy = false;
  }

  get itemsFiltered(): ISweepstakeDTO[] {
    const items = this.sweepstakes;

    // items = this.players.filter((item) => (
    //   item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
    //     || item.username.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
    // ));

    // items = items.filter((item) => (this.searchSituation === null
    //   ? item
    //   : item.active === this.searchSituation));

    // items = items.filter((item) => (this.searchPatent === null || this.searchPatent === 'null'
    //   ? item
    //   : item.patent === this.searchPatent));

    return items;
  }

  newSweepstake(): void {
    this.$router.push('sweepstakes/new');
  }

  async remove(): Promise<void> {
    this.isBusy = true;
    this.isBusy = false;
  }
}
</script>
