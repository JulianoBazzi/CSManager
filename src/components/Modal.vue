<template>
  <div class="manager-modal">
    <b-modal
        v-model="showProp"
        header-bg-variant="dark"
        header-text-variant="light"
        body-bg-variant="dark"
        body-text-variant="light"
        footer-bg-variant="dark"
        footer-text-variant="light"
        @hidden="$emit('handleHidden')"
        @ok="handleOk"
        :title="title"
        @handleSubmit="$emit('handleSubmit')">
      <slot></slot>
      <template v-slot:modal-footer="{ hide, ok }">
        <b-button @click="hide()" :disabled="busy">Fechar</b-button>
        <b-button variant="primary" @click="ok()">
          <b-spinner small v-if="busy"/>
          Salvar
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { BvEvent } from 'bootstrap-vue';
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
    busy: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    showProp: {
      get() { return this.$props.show; },
      set(value) { this.$emit('update:show', value); },
    },
  },
})
export default class Modal extends Vue {
  handleOk(bvModalEvent: BvEvent): void {
    bvModalEvent.preventDefault();
    this.$emit('handleSubmit');
  }
}
</script>

<style scoped>
</style>
