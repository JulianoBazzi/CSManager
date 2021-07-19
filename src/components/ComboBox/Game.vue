<template>
  <div class="manager-combo-game">
    <b-form-select
      :id="id"
      v-model="modelProp"
      :disabled="busyProp">
      <slot></slot>
      <option
        v-bind:value="game.value"
        v-for="game in games"
        v-bind:key="game.value">
        {{ shortText ? game.shortText : game.text }}
      </option>
    </b-form-select>
  </div>
</template>

<script lang="ts">
import IFilterComboBoxStringDTO from '@/dtos/IFilterComboBoxStringDTO';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: {
    id: {
      type: String,
      required: false,
    },
    model: {
      type: String,
      required: false,
    },
    busy: {
      type: Boolean,
      required: false,
    },
    shortText: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    modelProp: {
      get() { return this.$props.model; },
      set(value) { this.$emit('update:model', value); },
    },
    busyProp: {
      get() { return this.$props.busy; },
      set(value) { this.$emit('update:busy', value); },
    },
  },
})
export default class Game extends Vue {
  games: IFilterComboBoxStringDTO[] = [];

  async created(): Promise<void> {
    this.$emit('update:busy', true);

    this.games = this.$store.state.gamesType;

    this.$emit('update:busy', false);
  }
}
</script>

<style scoped>

</style>
