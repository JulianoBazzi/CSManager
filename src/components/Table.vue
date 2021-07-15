<template>
  <div class="manager-table">
    <b-table
      :id="id"
      sticky-header="70vh"
      striped
      hover
      dark
      no-border-collapse
      show-empty
      :small="small"
      select-mode="multi"
      :selectable="selectable"
      responsive="sm"
      :items="items"
      :fields="fields"
      :busy="busy"
      :current-page="currentPage"
      :per-page="perPage"
      @row-selected="$emit('onRowSelected', $event)">
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
      <template #cell(actions)="row">
        <b-button
          v-if="displayEditButton"
          size="sm"
          variant="light"
          @click="$emit('onClickEdit', row.item)"
          title="Editar Registro">
          <b-icon class="button" icon="pencil" scale="0.9"/>
        </b-button>
        <b-button
          v-if="displayDeleteButton"
          size="sm"
          variant="danger"
          @click="$emit('onClickRemove', row.item)"
          title="Remover Registro">
          <b-icon class="button" icon="trash" scale="0.9"/>
        </b-button>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="items.length"
      :per-page="perPage"
      :aria-controls="id"
      align="right"
      variant="danger"
    ></b-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: {
    id: {
      type: String,
      required: false,
    },
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
    small: {
      type: Boolean,
      required: false,
    },
    selectable: {
      type: Boolean,
      required: false,
    },
    recordsPerPage: {
      type: Number,
      required: false,
    },
    displayEditButton: {
      type: Boolean,
      required: false,
    },
    displayDeleteButton: {
      type: Boolean,
      required: false,
    },
  },
})
export default class Table extends Vue {
  perPage = this.$props.recordsPerPage ?? 8;

  currentPage = 1;
}
</script>

<style>

.page-link {
    position: relative;
    display: block;
    padding: .5rem .75rem;
    margin-left: -1px;
    line-height: 1.25;
    color: #d9d9d9 !important;
    background-color: #6c757d !important;
    border: 1px solid #262626 !important;
}
.page-link:hover {
        z-index: 2;
        color: #fff !important;
        text-decoration: none;
        background-color: #32383e !important;
        border-color: #dee2e6;
}
.page-item.active .page-link {
    z-index: 3;
    color: #fff;
    background-color: #3e444a !important;
    border-color: #353535;
}

</style>
