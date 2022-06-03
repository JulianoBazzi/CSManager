<template>
  <div class="manager-combo-patent">
    <b-form-select
      :id="id"
      v-model="modelProp"
      :disabled="busyProp">
      <slot></slot>
      <option
        v-bind:value="patent.value"
        v-for="patent in patents"
        v-bind:key="patent.value">
        {{ patent.text }}
      </option>
    </b-form-select>
  </div>
</template>

<script lang="ts">
import IFilterComboBoxStringDTO from '@/dtos/IFilterComboBoxStringDTO';
import { Component, Vue } from 'vue-property-decorator';
import rakingsCsGo from '../../assets/cs-go/rakings.json';

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
export default class Patent extends Vue {
  patents: IFilterComboBoxStringDTO[] = [];

  async created(): Promise<void> {
    this.$emit('update:busy', true);
    this.patents = [];

    const competitive = rakingsCsGo.find((rank) => rank.type === 'competitive');
    if (competitive) {
      competitive.items.forEach((patent) => {
        this.patents.push({
          value: patent.id,
          text: patent.name['pt-BR'],
        });
      });
    }

    this.$emit('update:busy', false);
  }
}
</script>

<style scoped>

</style>
