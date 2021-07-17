<template>
  <div class="sweepstakes">
    <Card title="Sorteio" :busy="isBusy" v-if="isBusy">
      <b-skeleton width="40%"></b-skeleton>
      <b-skeleton width="60%"></b-skeleton>
    </Card>
    <div v-else>
      <Card :title="title" :busy="isBusy">
        <p class="mb-0">Data/Hora do Sorteio: <strong>{{ dateTimeCreated }}</strong></p>
        <p class="mb-0">
          Quantidade de Mapas: <strong>{{ sweepstake.quantityMaps }} mapas</strong>
        </p>
        <p class="mb-0">
          Quantidade de Jogadores: <strong>{{ sweepstake.quantityPlayers }} jogadores</strong>
        </p>
      </Card>
      <div class="row">
        <Card
          class="mt-2 col-sm-12 col-md-6"
          :busy="isBusy"
          v-for="team in sweepstake.teams"
          :key="team.description"
          :title="team.description">
          <div v-for="(player, index) in team.players" :key="player.id">
            <p class="m-0" >
              {{ index + 1 }} - {{ player.name }} ({{ player.username }})
              &nbsp;
              <img
                v-if="player.patent"
                width="50"
                :alt="`${player.patent}`"
                :src=" require(`@/assets/cs-go/competitive/${player.patent}.png`) " />
            </p>
            <hr class="m-1">
          </div>
        </Card>
      </div>
      <Card class="mt-2" title="Mapas" :busy="isBusy">
          <!-- Fazer visual igual o utilizado no papel com nome e placares -->
          <p
            class="mb-0"
            v-for="(map, index) in sweepstake.maps"
            :key="map.id">
            {{ index + 1 }} - <strong>{{ map.name }}</strong>
          </p>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Base from '@/views/Base';
import Card from '@/components/Card.vue';
import ISweepstakeDTO from '@/dtos/ISweepstakeDTO';
import firebase from 'firebase';
import moment from 'moment';

@Component({
  components: {
    Card,
  },
})
export default class Sweepstake extends Base {
  id = this.$route.params.id;

  sweepstake: ISweepstakeDTO | null = null;

  title = '';

  dateTimeCreated = '';

  async created(): Promise<void> {
    this.isBusy = true;
    this.sweepstake = null;

    await firebase
      .firestore()
      .collection('sweepstakes')
      .doc(this.id)
      .onSnapshot((doc) => {
        this.sweepstake = {
          id: this.id,
          userId: doc.data()?.usetId,
          created: (doc.data()?.created as firebase.firestore.Timestamp).toDate(),
          updated: (doc.data()?.updated as firebase.firestore.Timestamp).toDate(),
          gameType: doc.data()?.gameType,
          quantityPlayers: doc.data()?.quantityPlayers,
          quantityMaps: doc.data()?.quantityMaps,
          considerPatents: doc.data()?.considerPatents,
          considerPreviousRankings: doc.data()?.considerPreviousRankings,
          teams: doc.data()?.teams,
          maps: doc.data()?.maps,
        };

        this.title = `${this.sweepstake.gameType} - ${moment(this.sweepstake.created).format('DD/MM/YYYY')}`;
        this.dateTimeCreated = moment(this.sweepstake.created).format('DD/MM/YYYY HH:mm');

        this.isBusy = false;
      });
  }
}
</script>
