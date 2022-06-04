<template>
  <div class="sweepstakes">
    <Modal
      title="Atualizar Placares"
      :show.sync="showModal"
      :busy="isBusyModal"
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
            v-for="sweepstakeMap in cloneSweepstakeMaps"
            :key="sweepstakeMap.id">
            <template #header>
              <p class="mb-0 text-center">
                <strong>{{ sweepstakeMap.maps.name }}</strong>
              </p>
            </template>
            <div class="row ml-1 d-flex align-items-center">
              <b-icon class="align-middle" icon="people"/>
              <b-form-input
                class="col-sm ml-2"
                v-model.number="sweepstakeMap.team_one_score_1"
                required
                type="number"
                min="0"
                max="99"
                pattern="\d*"
                onfocus="this.select();"
                :disabled="isBusyModal"
              />
              <b-form-input
                class="col-sm ml-2"
                v-model.number="sweepstakeMap.team_one_score_2"
                required
                type="number"
                min="0"
                max="99"
                pattern="\d*"
                onfocus="this.select();"
                :disabled="isBusyModal"
              />
            </div>
            <hr class="m-1">
            <div class="row ml-1 d-flex align-items-center">
              <b-icon class="align-middle" icon="people-fill"/>
              <b-form-input
                class="col-sm ml-2"
                v-model.number="sweepstakeMap.team_two_score_1"
                required
                type="number"
                min="0"
                max="99"
                pattern="\d*"
                onfocus="this.select();"
                :disabled="isBusyModal"
              />
              <b-form-input
                class="col-sm ml-2"
                v-model.number="sweepstakeMap.team_two_score_2"
                required
                type="number"
                min="0"
                max="99"
                pattern="\d*"
                onfocus="this.select();"
                :disabled="isBusyModal"
              />
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
        :title="getGameTypeName(sweepstake.game_type)"
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
          {{ sweepstake.quantity_maps }} mapas
        </p>
        <p class="mb-0">
          <b-icon class="mr-2" icon="people"/>
          {{ sweepstake.quantity_players }} jogadores
        </p>
      </Card>
      <div class="row">
        <Card
          class="mt-2 col-sm-12 col-md-6"
          :busy="isBusy"
          title="Time 1"
          icon="people">
          <div
            v-for="(sweepstakePlayer, index) in
              sweepstakePlayers.filter(player => player.team === 0)"
            :key="sweepstakePlayer.id"
          >
            <hr v-if="index !== 0" class="m-1">
            <p class="m-0" >
              {{ index + 1 }} - {{ sweepstakePlayer.players.name }}
              ({{ sweepstakePlayer.players.username }})
              <img
                v-if="sweepstakePlayer.players.patent"
                width="50"
                :alt="`${sweepstakePlayer.players.patent}`"
                :src="require(`@/assets/cs-go/competitive/${sweepstakePlayer.players.patent}.png`)"
              />
            </p>
          </div>
        </Card>
        <Card
          class="mt-2 col-sm-12 col-md-6"
          :busy="isBusy"
          title="Time 2"
          icon="people-fill">
          <div
            v-for="(sweepstakePlayer, index) in
              sweepstakePlayers.filter(player => player.team === 1)"
            :key="sweepstakePlayer.id"
          >
            <hr v-if="index !== 0" class="m-1">
            <p class="m-0" >
              {{ index + 1 }} - {{ sweepstakePlayer.players.name }}
              ({{ sweepstakePlayer.players.username }})
              <img
                v-if="sweepstakePlayer.players.patent"
                width="50"
                :alt="`${sweepstakePlayer.players.patent}`"
                :src="require(`@/assets/cs-go/competitive/${sweepstakePlayer.players.patent}.png`)"
              />
            </p>
          </div>
        </Card>
      </div>
      <Card
        class="mt-2 mb-2"
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
            v-for="sweepstakeMap in sweepstakeMaps"
            :key="sweepstakeMap.id">
            <template #header>
              <p class="mb-0 text-center">
                <strong>{{ sweepstakeMap.maps.name }}</strong>
                <a v-if="sweepstakeMap.maps.link" :href="sweepstakeMap.maps.link" target="_blank">
                  <b-icon class="ml-2" icon="download" variant="secondary"/>
                </a>
              </p>
            </template>
            <p class="text-center">{{getMapTypeName(sweepstakeMap.maps.map_type)}}</p>
            <div>
              <div class="row m-0" :id="`teamOne-${sweepstakeMap.id}`">
                <b-icon
                  class="ml-1 mt-1 mr-2"
                  icon="people"
                  :variant="sweepstakeMap.team_start_from_terrorist === 0 ? 'danger' : 'light'"
                />
                <p class="m-0">
                  {{ sweepstakeMap.team_one_score_1 }} + {{ sweepstakeMap.team_one_score_2 }}
                </p>
                <b-icon
                  class="ml-1 mt-1 mr-2"
                  icon="trophy-fill"
                  scale="0.9"
                  :style="getWinnerStyle(0, sweepstakeMap)"
                />
              </div>
              <hr class="m-1">
              <div class="row m-0" :id="`teamTwo-${sweepstakeMap.id}`">
                <b-icon
                  class="ml-1 mt-1 mr-2"
                  icon="people-fill"
                  :variant="sweepstakeMap.team_start_from_terrorist === 1 ? 'danger' : 'light'"
                />
                <p class="m-0">
                  {{ sweepstakeMap.team_two_score_1 }} + {{ sweepstakeMap.team_two_score_2 }}
                </p>
                <b-icon
                  class="ml-1 mt-1 mr-2"
                  icon="trophy-fill"
                  scale="0.9"
                  :style="getWinnerStyle(1, sweepstakeMap)"
                />
              </div>
            </div>
          </b-card>
        </div>
        <p class="mt-1 mb-0">
          <b-icon icon="people" variant="danger"/>
          <b-icon icon="dot" scale="0.5"/>
          <b-icon icon="people-fill" variant="danger"/>
          <b-icon icon="chevron-right" scale="0.5"/>Terrorista
          |
          <b-icon icon="trophy-fill" variant="secondary"/>
          <b-icon icon="chevron-right" scale="0.5"/>Empate
          |
          <b-icon icon="trophy-fill" variant="warning"/>
          <b-icon icon="chevron-right" scale="0.5"/>Vencedor
        </p>
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
import ISweepstakePlayerDTO from '@/dtos/ISweepstakePlayerDTO';
import moment from 'moment';
import IMapResumeDTO from '@/dtos/IMapResumeDTO';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import supabase from '@/services/supabase';
import ISweepstakeMapDTO from '@/dtos/ISweepstakeMapDTO';
import SplitArray from '@/tools/SplitArray';
import CloneObject from '@/tools/CloneObject';

@Component({
  components: {
    Card,
    Modal,
  },
})
export default class Sweepstake extends Base {
  showModal = false;

  isBusyModal = false;

  id = this.$route.params.id;

  sweepstake: ISweepstakeDTO | null = null;

  sweepstakePlayers: ISweepstakePlayerDTO[] = [];

  sweepstakeMaps: ISweepstakeMapDTO[] = [];

  cloneSweepstakeMaps: ISweepstakeMapDTO[] = [];

  isFromLoggerUser = false;

  user = supabase.auth.user();

  title = '';

  departureDate = '';

  maps: IMapResumeDTO[] = [];

  async created(): Promise<void> {
    this.isBusy = true;

    await this.loadSweepstake();
    await this.loadSweepstakePlayer();
    await this.loadSweepstakeMap();

    supabase
      .from(`sweepstakes:id=eq.${this.id}`)
      .on('UPDATE', (payload) => {
        if (!payload) {
          this.$router.push('/');
        }

        this.handleSweepstakeUpdate(payload?.new);
      })
      .subscribe();

    supabase
      .from(`sweepstake_players:sweepstake_id=eq.${this.id}`)
      .on('UPDATE', (payload) => {
        if (!payload) {
          this.$router.push('/');
        }

        this.handleSweepstakePlayerUpdate(payload?.new);
      })
      .subscribe();

    supabase
      .from(`sweepstake_maps:sweepstake_id=eq.${this.id}`)
      .on('UPDATE', (payload) => {
        if (!payload) {
          this.$router.push('/');
        }

        this.handleSweepstakeMapUpdate(payload?.new);
      })
      .subscribe();

    this.isBusy = false;
  }

  async loadSweepstake(): Promise<void> {
    const { data, error } = await supabase
      .from('sweepstakes')
      .select()
      .eq('id', this.id);

    if (error) {
      throw new AppError('Sorteio', error.message, ToastsTypeEnum.Warning);
    }

    if (data && data.length > 0) {
      this.handleSweepstakeUpdate(data[0]);
    }
  }

  handleSweepstakeUpdate(sweepstake: ISweepstakeDTO): void {
    this.isFromLoggerUser = false;
    this.sweepstake = null;

    this.sweepstake = sweepstake;

    this.departureDate = moment(this.sweepstake.departure_at).format('DD/MM/YYYY HH:mm');

    if (this.sweepstake && this.user) {
      this.isFromLoggerUser = this.sweepstake.user_id === this.user.id;
    }
  }

  async loadSweepstakePlayer(): Promise<void> {
    const { data, error } = await supabase
      .from('sweepstake_players')
      .select('*, players (*)')
      .eq('sweepstake_id', this.id);

    if (error) {
      throw new AppError('Jogadores', error.message, ToastsTypeEnum.Warning);
    }

    if (data && data.length > 0) {
      this.sweepstakePlayers = data;
    }
  }

  handleSweepstakePlayerUpdate(sweepstakePlayer: ISweepstakePlayerDTO): void {
    const index = this.sweepstakePlayers.findIndex((player) => (
      player.id === sweepstakePlayer.id
    ));

    if (index > -1) {
      this.sweepstakePlayers[index].team = sweepstakePlayer.team;
    }
  }

  async loadSweepstakeMap(): Promise<void> {
    const { data, error } = await supabase
      .from('sweepstake_maps')
      .select('*, maps (*)')
      .eq('sweepstake_id', this.id);

    if (error) {
      throw new AppError('Mapas', error.message, ToastsTypeEnum.Warning);
    }

    if (data && data.length > 0) {
      this.sweepstakeMaps = data;
    }
  }

  handleSweepstakeMapUpdate(sweepstakeMap: ISweepstakeMapDTO): void {
    const index = this.sweepstakeMaps.findIndex((map) => (
      map.id === sweepstakeMap.id
    ));

    if (index > -1) {
      this.sweepstakeMaps[index]
        .team_start_from_terrorist = sweepstakeMap.team_start_from_terrorist;
      this.sweepstakeMaps[index].team_one_score_1 = sweepstakeMap.team_one_score_1;
      this.sweepstakeMaps[index].team_two_score_1 = sweepstakeMap.team_two_score_1;
      this.sweepstakeMaps[index].team_one_score_2 = sweepstakeMap.team_one_score_2;
      this.sweepstakeMaps[index].team_two_score_2 = sweepstakeMap.team_two_score_2;
    } else {
      this.sweepstakeMaps.push(sweepstakeMap);
    }
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

  // eslint-disable-next-line class-methods-use-this
  getWinnerStyle(index: number, sweepstakeMap: ISweepstakeMapDTO): string {
    if (index < 0 || !sweepstakeMap) {
      return 'display: none;';
    }

    const sumTeamOne = sweepstakeMap.team_one_score_1 + sweepstakeMap.team_one_score_2;
    const sumTeamTwo = sweepstakeMap.team_two_score_1 + sweepstakeMap.team_two_score_2;

    if ((index === 0 && sumTeamOne > sumTeamTwo) || (index === 1 && sumTeamOne < sumTeamTwo)) {
      return 'color: #ffc107 !important;';
    }

    if (sumTeamOne > 0 && sumTeamOne === sumTeamTwo) {
      return 'color: #6c757d !important;';
    }

    return 'display: none;';
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

      const divisionTeams = SplitArray(this.sweepstakePlayers);
      const newTeams: ISweepstakePlayerDTO[] = [];

      for (let i = 0; i < divisionTeams.length;) {
        divisionTeams[i].forEach((sweepstakePlayer) => {
          newTeams.push({
            id: sweepstakePlayer.id,
            user_id: sweepstakePlayer.user_id,
            sweepstake_id: sweepstakePlayer.sweepstake_id,
            player_id: sweepstakePlayer.player_id,
            team: i,
          });
        });
        i += 1;
      }

      const { error } = await supabase.from('sweepstake_players').upsert(newTeams);

      if (error) {
        throw new AppError('Sortear Times', error.message, ToastsTypeEnum.Warning);
      }

      await this.loadSweepstakePlayer();
    } finally {
      this.isBusy = false;
    }
  }

  async updateMatch(): Promise<void> {
    if (!this.sweepstake) {
      return;
    }

    this.cloneSweepstakeMaps = CloneObject(this.sweepstakeMaps);

    this.showModal = true;
  }

  async handleHidden(): Promise<void> {
    this.maps = [];
    this.showModal = false;
  }

  async handleSubmit(): Promise<void> {
    try {
      this.isBusyModal = true;

      if (!this.sweepstake) {
        return;
      }

      const updatedMaps: ISweepstakeMapDTO[] = [];

      this.cloneSweepstakeMaps.forEach((sweepstakeMap) => {
        updatedMaps.push({
          id: sweepstakeMap.id,
          user_id: sweepstakeMap.user_id,
          sweepstake_id: sweepstakeMap.sweepstake_id,
          map_id: sweepstakeMap.map_id,
          team_start_from_terrorist: sweepstakeMap.team_start_from_terrorist,
          team_one_score_1: sweepstakeMap.team_one_score_1,
          team_one_score_2: sweepstakeMap.team_one_score_2,
          team_two_score_1: sweepstakeMap.team_two_score_1,
          team_two_score_2: sweepstakeMap.team_two_score_2,
          selected_at: sweepstakeMap.selected_at,
        });
      });

      const { error } = await supabase.from('sweepstake_maps').upsert(updatedMaps);

      if (error) {
        throw new AppError('Sortear Times', error.message, ToastsTypeEnum.Warning);
      }

      this.showModal = false;
      throw new AppError('Sorteio', 'Placares atualizados com sucesso!', ToastsTypeEnum.Success);
    } finally {
      this.isBusyModal = false;
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
