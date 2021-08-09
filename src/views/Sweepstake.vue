<template>
  <div class="sweepstakes">
    <Modal
      title="Atualizar Placares"
      :show.sync="showModal"
      :busy="isBusy"
      @handleHidden="handleHidden"
      @handleSubmit="handleSubmit">
      <b-form ref="form" @submit.stop.prevent="handleSubmit">
        <div class="row">
          <b-card
            class="ml-1 mt-1"
            header-tag="header"
            bg-variant="dark"
            text-variant="white"
            small
            v-for="map in maps"
            :key="map.id">
            <template #header>
              <p class="mb-0 text-center">
                <strong>{{ map.name }}</strong>
              </p>
            </template>
            <div v-for="(match, matchIndex) in map.matches" :key="matchIndex">
              <hr v-if="matchIndex !== 0" class="m-1">
              <div class="row ml-1 d-flex align-items-center">
                <b-icon class="align-middle" :icon="matchIndex == 0 ? 'people' : 'people-fill'"/>
                <div class="ml-2" v-for="(score, scoreIndex) in match.scores" :key="scoreIndex">
                  <b-form-input
                    class="col-sm"
                    v-model.number="match.scores[scoreIndex]"
                    required
                    type="number"
                    min="0"
                    max="99"
                    pattern="\d*"
                    onfocus="this.select();"
                    :disabled="isBusy"
                  />
                </div>
              </div>
            </div>
            <hr class="m-1">
          </b-card>
        </div>
      </b-form>
    </Modal>
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
      <Card
        :title="getGameTypeName(sweepstake.gameType)"
        :busy="isBusy">
        <template v-slot:button>
          <b-button
            size="sm"
            variant="light"
            @click="sweepstakeAgain"
            :disabled="isBusy"
            v-if="isFromLoggerUser"
            v-b-tooltip.hover
            title="Sortear Times Novamente">
            <b-icon icon="people"/>
          </b-button>
        </template>
        <p class="mb-0">
          <b-icon class="mr-2" icon="calendar"/>
          {{ departureDate }}
        </p>
        <p class="mb-0">
          <b-icon class="mr-2" icon="map"/>
          {{ sweepstake.quantityMaps }} mapas
        </p>
        <p class="mb-0">
          <b-icon class="mr-2" icon="people"/>
          {{ sweepstake.quantityPlayers }} jogadores
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
            <hr v-if="index !== 0" class="m-1">
            <p class="m-0" >
              {{ index + 1 }} - {{ player.name }} ({{ player.username }})
              &nbsp;
              <img
                v-if="player.patent"
                width="50"
                :alt="`${player.patent}`"
                :src=" require(`@/assets/cs-go/competitive/${player.patent}.png`) " />
            </p>
          </div>
        </Card>
      </div>
      <Card
        class="mt-2"
        title="Mapas"
        icon="map"
        :busy="isBusy">
        <template v-slot:button>
          <b-button
            size="sm"
            variant="light"
            @click="updateMatch"
            :disabled="isBusy"
            v-if="isFromLoggerUser"
            v-b-tooltip.hover
            title="Atualizar Placares">
            <b-icon icon="pencil"/>
          </b-button>
        </template>
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
                  <b-icon class="ml-2" icon="download" variant="secondary"/>
                </a>
                <strong v-else>{{ map.name }}</strong>
              </p>
            </template>
            <p class="text-center">{{getMapTypeName(map.mapType)}}</p>
            <div v-for="(match, index) in map.matches" :key="index">
              <div class="mb-0" :id="'team' +(index + 1) +map.id">
                <hr v-if="index !== 0" class="m-1">
                <div class="row m-0">
                  <b-icon class="ml-1 mt-1 mr-2" :icon="index == 0 ? 'people' : 'people-fill'"/>
                  <p class="m-0" v-for="(score, indexScore) in match.scores" :key="indexScore">
                  {{ indexScore === 0 ? '' : '+'  }}&nbsp;{{ score }}&nbsp;
                  </p>
                  <b-icon
                    v-if="map.winner === -1"
                    class="ml-1 mt-1 mr-2"
                    icon="trophy-fill"
                    variant="secondary"
                     scale="0.9"
                  />
                  <b-icon
                    v-else-if="map.winner === index"
                    class="ml-1 mt-1 mr-2"
                    icon="trophy-fill"
                    variant="warning"
                     scale="0.9"
                  />
                </div>
              </div>
              <b-tooltip
                :target="'team' +(index + 1)  +map.id"
                triggers="hover"
                placement="top">
                {{ match.description }}
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
import Modal from '@/components/Modal.vue';
import ISweepstakeDTO from '@/dtos/ISweepstakeDTO';
import firebase from 'firebase';
import moment from 'moment';
import IMapResumeDTO from '@/dtos/IMapResumeDTO';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import CloneObject from '@/tools/CloneObject';
import _ from 'lodash';
import SplitArray from '@/tools/SplitArray';
import ITeamDTO from '@/dtos/ITeamDTO';

@Component({
  components: {
    Card,
    Modal,
  },
})
export default class Sweepstake extends Base {
  showModal = false;

  id = this.$route.params.id;

  sweepstake: ISweepstakeDTO | null = null;

  isFromLoggerUser = false;

  user = firebase.auth().currentUser;

  title = '';

  departureDate = '';

  maps: IMapResumeDTO[] = [];

  async created(): Promise<void> {
    await this.loadSweepstake();
  }

  async loadSweepstake(): Promise<void> {
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
          departure: (doc.data()?.departure as firebase.firestore.Timestamp).toDate(),
          gameType: doc.data()?.gameType,
          quantityPlayers: doc.data()?.quantityPlayers,
          quantityMaps: doc.data()?.quantityMaps,
          considerPatents: doc.data()?.considerPatents,
          considerPreviousRankings: doc.data()?.considerPreviousRankings,
          teams: doc.data()?.teams,
          maps: doc.data()?.maps as IMapResumeDTO[],
        };

        this.departureDate = moment(this.sweepstake.departure).format('DD/MM/YYYY HH:mm');

        if (this.user) {
          this.isFromLoggerUser = this.sweepstake.userId === this.user.uid;
        }

        this.$meta().addApp('sweepstake').set({
          title: `${this.getGameTypeShortName(this.sweepstake?.gameType)} - ${this.departureDate} (CS Manager)`,
          meta: [
            {
              name: 'description',
              content: `Partida de ${this.getGameTypeName(this.sweepstake?.gameType)}, com ${this.sweepstake.quantityPlayers} jogadores e ${this.sweepstake.quantityMaps} mapas, realizada em: ${this.departureDate}.`,
            },
            {
              name: 'og:title',
              content: `${this.getGameTypeShortName(this.sweepstake?.gameType)} - ${this.departureDate} (CS Manager)`,
            },
            {
              name: 'og:description',
              content: `Partida de ${this.getGameTypeName(this.sweepstake?.gameType)}, com ${this.sweepstake.quantityPlayers} jogadores e ${this.sweepstake.quantityMaps} mapas, realizada em: ${this.departureDate}.`,
            },
          ],
        });

        this.isBusy = false;
      });
  }

  getGameTypeShortName(id: string): string | undefined {
    return this.$store.getters.getGameTypeShortName(id);
  }

  getGameTypeName(id: string): string | undefined {
    return this.$store.getters.getGameTypeName(id);
  }

  getMapTypeName(id: string): string | undefined {
    return this.$store.getters.getMapTypeName(id);
  }

  async sweepstakeAgain(): Promise<void> {
    if (!this.sweepstake) {
      return;
    }

    const { isConfirmed } = await this.$swal.fire({
      scrollbarPadding: false,
      title: 'Sortear Times Novamente',
      text: 'Confirma o novo sorteio dos times?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      this.isBusy = true;

      const players = _.union(this.sweepstake.teams[0].players, this.sweepstake.teams[1].players);

      const divisionTeams = SplitArray(players);

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

      this.sweepstake.teams = teams;

      await firebase.firestore().collection('sweepstakes').doc(this.sweepstake.id).set(this.sweepstake);

      throw new AppError('Sorteio', 'Times atualizados com sucesso!', ToastsTypeEnum.Success);
    } finally {
      this.isBusy = false;
    }
  }

  async updateMatch(): Promise<void> {
    if (!this.sweepstake) {
      return;
    }

    this.maps = CloneObject(this.sweepstake.maps);

    this.showModal = true;
  }

  async handleHidden(): Promise<void> {
    this.maps = [];
    this.showModal = false;
  }

  async handleSubmit(): Promise<void> {
    try {
      this.isBusy = true;

      if (!this.sweepstake) {
        return;
      }

      const updatedMaps: IMapResumeDTO[] = [];

      this.maps.forEach((map) => {
        let winner = -2;
        let previousScore = 0;
        map.matches.forEach((match, index) => {
          const score = _.sum(match.scores);
          if (score > previousScore) {
            winner = index;
          } else if (score > 0 && score === previousScore) {
            winner = -1;
          }

          previousScore = score;
        });

        updatedMaps.push({
          ...map,
          winner,
        });
      });

      this.sweepstake.maps = updatedMaps;

      await firebase.firestore().collection('sweepstakes').doc(this.sweepstake.id).set(this.sweepstake);

      throw new AppError('Sorteio', 'Placares atualizados com sucesso!', ToastsTypeEnum.Success);
    } finally {
      this.isBusy = false;
      this.showModal = false;
      this.maps = [];
    }
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
    color: #FFF;
  }
</style>
