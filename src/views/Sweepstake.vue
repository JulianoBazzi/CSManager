<template>
  <div class="sweepstakes">
    <div v-if="isBusy">
      <Card title="Sorteio">
        <b-skeleton width="30%"/>
        <b-skeleton width="25%"/>
        <b-skeleton width="30%"/>
      </Card>
      <div class="row">
        <Card
          class="mt-2 col-sm-12 col-md-6"
          title="Time 1"
          icon="people">
          <b-skeleton width="50%"/>
          <hr class="m-1">
          <b-skeleton width="30%"/>
          <hr class="m-1">
          <b-skeleton width="60%"/>
          <hr class="m-1">
          <b-skeleton width="40%"/>
          <hr class="m-1">
        </Card>
        <Card
          class="mt-2 col-sm-12 col-md-6"
          title="Time 2"
          icon="people-fill">
          <b-skeleton width="50%"/>
          <hr class="m-1">
          <b-skeleton width="30%"/>
          <hr class="m-1">
          <b-skeleton width="60%"/>
          <hr class="m-1">
          <b-skeleton width="40%"/>
          <hr class="m-1">
        </Card>
      </div>
      <Card class="mt-2" title="Mapas" icon="map">
         <b-skeleton-img no-aspect height="150px"/>
      </Card>
    </div>
    <div v-else>
      <Card :title="getGameTypeName(sweepstake.gameType)" :busy="isBusy">
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
          v-for="(team, index) in sweepstake.teams"
          :key="team.description"
          :title="team.description"
          :icon="index == 0 ? 'people' : 'people-fill'">
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
      <Card class="mt-2" title="Mapas" icon="map" :busy="isBusy">
          <div class="row">
            <b-card
              class="ml-1 mt-1"
              header-tag="header"
              bg-variant="dark"
              text-variant="white"
              v-for="map in sweepstake.maps"
              :key="map.id">
              <template #header>
                <p class="mb-0 text-center">
                  <a v-if="map.link" :href="map.link" target="_blank">
                    <strong>{{ map.name }}</strong>
                  </a>
                  <strong v-else>{{ map.name }}</strong>
                </p>
              </template>
              <p class="text-center">{{getMapTypeName(map.mapType)}}</p>
              <div v-if="isFromLoggerUser">
                <p :id="'teamOne' +map.id" class="mb-0">
                  <b-icon icon="people"/> 8 + 2
                  <b-icon icon="trophy-fill" variant="warning"/>
                </p>
                <b-tooltip
                  :target="'teamOne' +map.id"
                  triggers="hover"
                  placement="top">
                  Time 1
                </b-tooltip>
                <p :id="'teamTwo' +map.id" class="mb-0"><b-icon icon="people-fill"/> 1 + 7</p>
                <b-tooltip
                  :target="'teamTwo' +map.id"
                  triggers="hover"
                  placement="bottom">
                  Time 2
                </b-tooltip>
              </div>
            </b-card>
          </div>
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

  isFromLoggerUser = false;

  user = firebase.auth().currentUser;

  title = '';

  dateTimeCreated = '';

  async created(): Promise<void> {
    this.isBusy = true;
    this.isFromLoggerUser = false;
    this.sweepstake = null;

    await firebase
      .firestore()
      .collection('sweepstakes')
      .doc(this.id)
      .onSnapshot((doc) => {
        this.sweepstake = {
          id: this.id,
          userId: doc.data()?.userId,
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

        this.dateTimeCreated = moment(this.sweepstake.created).format('DD/MM/YYYY HH:mm');

        if (this.user) {
          this.isFromLoggerUser = this.sweepstake.userId === this.user.uid;
        }

        this.isBusy = false;
      });
  }

  getGameTypeName(id: string): string | undefined {
    return this.$store.getters.getGameTypeName(id);
  }

  getMapTypeName(id: string): string | undefined {
    return this.$store.getters.getMapTypeName(id);
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
    color: #FFF;
  }
</style>
