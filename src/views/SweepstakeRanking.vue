<template>
  <div class="sweepstakes">
    <div v-if="isBusy">
      <Card title="Sorteio">
        <b-skeleton width="30%"/>
        <b-skeleton width="25%"/>
        <b-skeleton width="30%"/>
      </Card>
      <Card
        class="mt-2"
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
        class="mt-2"
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
    <div v-else>
      <Card
        :title="`${sweepstakeMap.maps.name} - ${departureDate}`"
        :busy="isBusy">
        <p class="mb-0">
          <b-icon class="mr-2" icon="info-circle"/>
          {{getMapTypeName(sweepstakeMap.maps.map_type)}} -
          {{ sweepstakeMap.sweepstakes.quantity_players }} jogadores
        </p>
        <p class="mb-0">
          <b-icon
            class="mr-2"
            icon="people"
            :variant="sweepstakeMap.team_start_from_terrorist === 0 ? 'danger' : 'light'"
          />
          {{ sweepstakeMap.team_one_score_1 }} + {{ sweepstakeMap.team_one_score_2 }}
          <b-icon
            class="ml-1"
            icon="trophy-fill"
            scale="0.9"
            :style="getWinnerStyle(0, sweepstakeMap)"
          />
        </p>
        <p class="mb-0">
          <b-icon
            class="mr-2"
            icon="people-fill"
            :variant="sweepstakeMap.team_start_from_terrorist === 1 ? 'danger' : 'light'"
          />
          {{ sweepstakeMap.team_two_score_1 }} + {{ sweepstakeMap.team_two_score_2 }}
          <b-icon
            class="ml-1"
            icon="trophy-fill"
            scale="0.9"
            :style="getWinnerStyle(1, sweepstakeMap)"
          />
        </p>
      </Card>
      <Card
        class="mt-2"
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
          </p>
          <div class="row d-flex justify-content-around">
            <div
              class="d-flex align-items-center"
              v-for="(rank, indexRank) in
                ranking.filter(score => score.player_id === sweepstakePlayer.player_id)"
              :key="`${rank.player_id}-${indexRank}`"
            >
              <b-icon
                class="mt-4"
                icon="people"
                :variant="rank.side === 'tr' ? 'danger' : 'light'"
              />
              <div class="ml-2">
                <b-form-group
                  :id="`input-kill-group-${rank.player_id}-${indexRank}`"
                  label-size="sm"
                  label="Vítimas"
                  :label-for="`input-kill-${rank.player_id}-${indexRank}`">
                  <b-form-input
                    :id="`input-kill-${rank.player_id}-${indexRank}`"
                    v-model.number="rank.kill"
                    required
                    type="number"
                    min="0"
                    max="999"
                    pattern="\d*"
                    onfocus="this.select();"
                    :disabled="isBusySubmit"
                  />
                </b-form-group>
              </div>
              <div class="ml-2">
                <b-form-group
                  :id="`input-assistance-group-${rank.player_id}-${indexRank}`"
                  label-size="sm"
                  label="Assistências"
                  :label-for="`input-assistance-${rank.player_id}-${indexRank}`">
                  <b-form-input
                    :id="`input-assistance-${rank.player_id}-${indexRank}`"
                    v-model.number="rank.assistance"
                    required
                    type="number"
                    min="0"
                    max="999"
                    pattern="\d*"
                    onfocus="this.select();"
                    :disabled="isBusySubmit"
                  />
                </b-form-group>
              </div>
              <div class="ml-2">
                <b-form-group
                  :id="`input-death-group-${rank.player_id}-${indexRank}`"
                  label-size="sm"
                  label="Mortes"
                  :label-for="`input-death-${rank.player_id}-${indexRank}`">
                  <b-form-input
                    :id="`input-death-${rank.player_id}-${indexRank}`"
                    v-model.number="rank.death"
                    required
                    type="number"
                    min="0"
                    max="999"
                    pattern="\d*"
                    onfocus="this.select();"
                    :disabled="isBusySubmit"
                  />
                </b-form-group>
              </div>
              <div class="ml-2">
                <b-form-group
                  :id="`input-score-group-${rank.player_id}-${indexRank}`"
                  label-size="sm"
                  label="Pontos"
                  :label-for="`input-score-${rank.player_id}-${indexRank}`">
                  <b-form-input
                    :id="`input-score-${rank.player_id}-${indexRank}`"
                    v-model.number="rank.score"
                    required
                    type="number"
                    min="0"
                    max="999"
                    pattern="\d*"
                    onfocus="this.select();"
                    :disabled="isBusySubmit"
                  />
                </b-form-group>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="mt-2"
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
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Base from '@/views/Base';
import Card from '@/components/Card.vue';
import IMapResumeDTO from '@/dtos/IMapResumeDTO';
import AppError, { ToastsTypeEnum } from '@/errors/AppError';
import supabase from '@/services/supabase';
import ISweepstakeMapDTO from '@/dtos/ISweepstakeMapDTO';
import ISweepstakePlayerDTO from '@/dtos/ISweepstakePlayerDTO';
import IRankingDTO from '@/dtos/IRankingDTO';
import moment from 'moment';

@Component({
  components: {
    Card,
  },
})
export default class SweepstakeRanking extends Base {
  id = this.$route.params.id;

  isBusySubmit = false;

  sweepstakeMap: ISweepstakeMapDTO | null = null;

  sweepstakePlayers: ISweepstakePlayerDTO[] = [];

  ranking: IRankingDTO[] = [];

  user = supabase.auth.user();

  title = '';

  departureDate = '';

  maps: IMapResumeDTO[] = [];

  async created(): Promise<void> {
    this.isBusy = true;

    await this.loadSweepstakeMap();
    await this.loadSweepstakePlayer();

    this.isBusy = false;
  }

  async loadSweepstakePlayer(): Promise<void> {
    this.ranking = [];
    this.sweepstakePlayers = [];

    const { data: dataRanking, error: errorRanking } = await supabase
      .from('ranking')
      .select('*, players (*)')
      .eq('sweepstake_id', this.sweepstakeMap?.sweepstake_id);

    if (errorRanking) {
      throw new AppError('Ranking', errorRanking.message, ToastsTypeEnum.Warning);
    }

    if (dataRanking && dataRanking.length > 0) {
      this.ranking = dataRanking;
    }

    const { data, error } = await supabase
      .from('sweepstake_players')
      .select('*, players (*)')
      .eq('sweepstake_id', this.sweepstakeMap?.sweepstake_id);

    if (error) {
      throw new AppError('Jogadores', error.message, ToastsTypeEnum.Warning);
    }

    if (data && data.length > 0) {
      this.sweepstakePlayers = data;
      data.forEach((sweepstakePlayer) => {
        const index = this.ranking.findIndex((ranking) => (
          ranking.player_id === sweepstakePlayer.player_id
        ));

        if (index < 0) {
          this.ranking.push({
            user_id: sweepstakePlayer.user_id,
            sweepstake_id: this.sweepstakeMap?.sweepstake_id,
            map_id: this.sweepstakeMap?.map_id,
            player_id: sweepstakePlayer.player_id,
            team: sweepstakePlayer.team,
            side: 'ct',
            kill: 0,
            assistance: 0,
            death: 0,
            score: 0,
            players: sweepstakePlayer.players,
          });

          this.ranking.push({
            user_id: sweepstakePlayer.user_id,
            sweepstake_id: this.sweepstakeMap?.sweepstake_id,
            map_id: this.sweepstakeMap?.map_id,
            player_id: sweepstakePlayer.player_id,
            team: sweepstakePlayer.team,
            side: 'tr',
            kill: 0,
            assistance: 0,
            death: 0,
            score: 0,
            players: sweepstakePlayer.players,
          });
        }
      });
    }
  }

  async loadSweepstakeMap(): Promise<void> {
    this.sweepstakeMap = null;
    const { data, error } = await supabase
      .from('sweepstake_maps')
      .select('*, maps (*), sweepstakes (*)')
      .eq('id', this.id);

    if (error) {
      throw new AppError('Mapas', error.message, ToastsTypeEnum.Warning);
    }

    if (data && data.length > 0) {
      const [map] = data;
      this.sweepstakeMap = map;
      this.departureDate = moment(this.sweepstakeMap?.sweepstakes?.departure_at).format('DD/MM/YYYY HH:mm');
    }
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

  // async handleHidden(): Promise<void> {
  //   this.maps = [];
  //   this.showModal = false;
  // }

  // async handleSubmit(): Promise<void> {
  //   try {
  //     this.isBusyModal = true;

  //     if (!this.sweepstake) {
  //       return;
  //     }

  //     const updatedMaps: ISweepstakeMapDTO[] = [];

  //     this.cloneSweepstakeMaps.forEach((sweepstakeMap) => {
  //       updatedMaps.push({
  //         id: sweepstakeMap.id,
  //         user_id: sweepstakeMap.user_id,
  //         sweepstake_id: sweepstakeMap.sweepstake_id,
  //         map_id: sweepstakeMap.map_id,
  //         team_start_from_terrorist: sweepstakeMap.team_start_from_terrorist,
  //         team_one_score_1: sweepstakeMap.team_one_score_1,
  //         team_one_score_2: sweepstakeMap.team_one_score_2,
  //         team_two_score_1: sweepstakeMap.team_two_score_1,
  //         team_two_score_2: sweepstakeMap.team_two_score_2,
  //         selected_at: sweepstakeMap.selected_at,
  //       });
  //     });

  //     const { error } = await supabase.from('sweepstake_maps').upsert(updatedMaps);

  //     if (error) {
  //       throw new AppError('Sortear Times', error.message, ToastsTypeEnum.Warning);
  //     }

  //     this.showModal = false;
  //     throw new AppError('Sorteio', 'Placares atualizados com sucesso!', ToastsTypeEnum.Success);
  //   } finally {
  //     this.isBusyModal = false;
  //     this.maps = [];
  //   }
  // }
}
</script>

<style scoped>
  a {
    text-decoration: none;
    color: #FFF;
  }
</style>
