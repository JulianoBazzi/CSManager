<template>
  <div class="manager-modal">
    <b-modal
        v-model="show"
        header-bg-variant="dark"
        header-text-variant="light"
        body-bg-variant="dark"
        body-text-variant="light"
        footer-bg-variant="dark"
        footer-text-variant="light"
        @hidden="$emit('onClickHidden')"
        @ok="$emit('onClickOk')"
        :title="title">
      <slot></slot>
      <template v-slot:modal-footer="{ hide, ok }">
        <b-button @click="hide()">Fechar</b-button>
        <b-button variant="primary" @click="ok()">Salvar</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
})
export default class Modal extends Vue {
}
</script>

<style scoped>
</style>
