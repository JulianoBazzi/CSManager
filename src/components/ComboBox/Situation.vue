<template>
  <div class="manager-combo-situation">
    <b-form-select
      :id="id"
      v-model="modelProp"
      :disabled="busyProp">
      <slot></slot>
      <option
        v-bind:value="situation.value"
        v-for="situation in situations"
        v-bind:key="situation.value">
        {{ situation.text }}
      </option>
    </b-form-select>
  </div>
</template>

<script lang="ts">
import IFilterComboBoxBooleanDTO from '@/dtos/IFilterComboBoxBooleanDTO';
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
export default class Situation extends Vue {
  situations: IFilterComboBoxBooleanDTO[] = [
    {
      value: null,
      text: 'Todos',
    },
    {
      value: true,
      text: 'Ativos',
    },
    {
      value: false,
      text: 'Inativos',
    },
  ]
}
</script>

<style scoped>

</style>
