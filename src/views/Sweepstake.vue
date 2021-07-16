<template>
  <div class="sweepstakes">
    <Card
      :title="title"
      :busy="isBusy">
      <p>{{id}}</p>
    </Card>
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

  created(): void {
    this.isBusy = true;
    this.sweepstake = null;

    firebase
      .firestore()
      .collection('sweepstakes')
      .doc(this.id)
      .get()
      .then((doc) => {
        this.sweepstake = {
          id: this.id,
          created: doc.data()?.created,
          gameType: doc.data()?.gameType,
          quantityPlayers: doc.data()?.quantityPlayers,
          quantityMaps: doc.data()?.quantityMaps,
          considerPatents: doc.data()?.considerPatents,
          considerPreviousRankings: doc.data()?.considerPreviousRankings,
        };

        this.title = `${this.sweepstake.gameType} - ${moment(this.sweepstake.created.toDate()).format('DD/MM/YYYY')}`;
      });

    this.isBusy = false;
  }
}
</script>
