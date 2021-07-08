<template>
  <div class="manager-table">
    <b-table
      sticky-header
      striped
      hover
      dark
      no-border-collapse
      show-empty
      :items="items"
      :fields="fields"
      :busy="isBusy">
      <template #table-busy>
        <div class="text-center text-light my-2">
          <b-spinner class="align-middle"></b-spinner>
        </div>
      </template>
      <template #empty>
        <div align="center">
          <p>Nenhum Registro Cadastrado</p>
        </div>
      </template>
      <template #emptyfiltered>
        <div align="center">
          <p>Nenhum Registro Encontrado</p>
        </div>
      </template>
      <template v-for="(_, slotName) of $scopedSlots" v-slot:[slotName]="scope">
        <slot :name="slotName" v-bind="scope"/>
      </template>
      <template #cell(actions)="row" v-if="displayEditButton">
        <b-button
          size="sm"
          variant="light"
          @click="$emit('onClickEdit', row.item)">
          <b-icon class="button" icon="pencil" scale="0.9"/>
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: {
    items: {
      type: [],
      required: true,
    },
    fields: {
      type: [],
      required: true,
    },
    busy: {
      type: Boolean,
      required: true,
    },
    displayEditButton: {
      type: Boolean,
      required: false,
    },
  },
})
export default class Table extends Vue {
  domElement = this.$el;
}
</script>

<style scoped>

</style>
