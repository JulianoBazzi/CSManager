<template>
  <div class="players">
    <b-card header-tag="header" bg-variant="dark" text-variant="white">
      <b-modal
        id="modalcrud"
        header-bg-variant="dark"
        header-text-variant="light"
        body-bg-variant="dark"
        body-text-variant="light"
        footer-bg-variant="dark"
        footer-text-variant="light"
        title="Cadastrar"
        >
          <!-- <b-form-group
            id="modal-group-name"
            label="Nome Completo"
            label-for="modal-name">
            <b-form-input
              id="modal-name"
              v-model="name"
              required
              :disabled="isLoading">
              </b-form-input>
          </b-form-group>

          <b-form-group
            id="modal-group-username"
            label="Username"
            label-for="modal-username">
            <b-form-input
              id="modal-username"
              v-model="username"
              required
              :disabled="isLoading">
              </b-form-input>
          </b-form-group>

          <b-form-group
            id="modal-group-patent"
            label="Patente (CS:GO)"
            label-for="modal-patent">
            <b-form-input
              id="modal-patent"
              v-model="patent"
              required
              :disabled="isLoading">
              </b-form-input>
          </b-form-group>

          <b-form-checkbox
            id="checkbox-1"
            v-model="active"
            value="true"
            unchecked-value="false"
          >Ativo
          </b-form-checkbox> -->
        </b-modal>
      <template #header>
        <div class="top">
          <h3 class="mb-0">Jogadores</h3>
          <b-button
            size="sm"
            variant="success"
            v-b-modal.modalcrud
            :disabled="isBusy">
            <b-icon icon="plus" scale="1.5"/>
          </b-button>
        </div>
      </template>
      <b-form class="mb-3" inline>
          <b-form-input
            class="mr-2"
            v-model="searchText"
            placeholder="Pesquisar"
          ></b-form-input>

          <b-form-select
          class="mr-2"
          v-model="searchSituation"
          :options="situations">
          </b-form-select>

          <b-form-select
          class="mr-3"
          v-model="searchPatent"
          :options="loadPatents">
          </b-form-select>

          <b-button @click="cleanFilters">Limpar</b-button>
      </b-form>
      <b-table
        sticky-header
        striped
        hover
        dark
        no-border-collapse
        show-empty
        :items="itemsFiltered"
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
       <template #cell(patent)="row">
          <img
          width="70"
            :alt="`${row.item.patent}`"
            :src=" require(`@/assets/cs-go/competitive/${row.item.patent}.png`) ">
        </template>
        <template #cell(active)="row">
          <b-icon icon="check-square-fill" v-if="row.item.active"/>
          <b-icon icon="square" v-else/>
        </template>
        <template #cell(actions)="row">
          <b-button
            size="sm"
            variant="light"
            @click="edit(row.item)">
            <b-icon class="button" icon="pencil" scale="0.9"/>
          </b-button>
        </template>
      </b-table>
    <!-- <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      align="right"
    ></b-pagination> -->
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import rakingsCsGo from '../assets/cs-go/rakings.json';
import IFilterComboBoxBooleanDTO from '../dtos/IFilterComboBoxBooleanDTO';
import IFilterComboBoxStringDTO from '../dtos/IFilterComboBoxStringDTO';
import IPlayerDTO from '../dtos/IPlayerDTO';
import ITableFieldsDTO from '../dtos/ITableFieldsDTO';

@Component
export default class Players extends Vue {
  searchText = '';

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

  searchSituation: boolean | null = null;

  patents: IFilterComboBoxStringDTO[] = []

  searchPatent = null;

  isBusy = false;

  fields: ITableFieldsDTO[] = [{
    key: 'name',
    label: 'Nome Completo',
    sortable: true,
  },
  {
    key: 'username',
    label: 'Nick Steam',
    sortable: true,
  },
  {
    key: 'patent',
    label: 'Patente',
    sortable: true,
  },
  {
    key: 'active',
    label: 'Ativo',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Ações',
  }];

  players: IPlayerDTO[] = [{
    id: '1',
    name: 'Juliano Bazzi',
    username: 'Bazzi',
    patent: 's2',
    active: true,
  },
  {
    id: '2',
    name: 'Henrique Boniatti',
    username: 'Reuri',
    patent: 'gn1',
    active: false,
  },
  {
    id: '3',
    name: 'Pedro da Silva',
    username: 'PedroSilva',
    patent: 'unknown',
    active: true,
  },
  {
    id: '3',
    name: 'Ricardo Mella',
    username: 'FeraSokeRuim',
    patent: 'gn3',
    active: false,
  }];

  get loadPatents(): IFilterComboBoxStringDTO[] {
    if (this.patents.length <= 0) {
      this.patents.push({
        value: null,
        text: 'Todas',
      });

      const competitive = rakingsCsGo.find((rank) => rank.type === 'competitive');
      if (competitive) {
        competitive.items.forEach((patent) => {
          this.patents.push({
            value: patent.id,
            text: patent.name['pt-BR'],
          });
        });
      }
    }

    return this.patents;
  }

  get itemsFiltered(): IPlayerDTO[] {
    let items = [];

    items = this.players.filter((item) => (
      item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
        || item.username.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
    ));

    items = items.filter((item) => (this.searchSituation === null
      ? item
      : item.active === this.searchSituation));

    items = items.filter((item) => (this.searchPatent === null
      ? item
      : item.patent === this.searchPatent));

    return items;
  }

  cleanFilters(): void {
    this.searchText = '';
    this.searchSituation = null;
    this.searchPatent = null;
  }

  async add(): Promise<void> {
    this.isBusy = true;
    this.isBusy = false;
  }

  async edit(obj: IPlayerDTO): Promise<void> {
    this.isBusy = true;
    this.isBusy = false;
  }
}
</script>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>
