<template>
  <div class="manager-card">
    <b-card header-tag="header" bg-variant="dark" text-variant="white">
      <template #header>
        <div class="top">
          <h3 class="mb-0">{{ title }}</h3>
          <b-button
            size="sm"
            variant="success"
            @click="$emit('onClickAdd')"
            :disabled="busy"
            v-if="displayAddButton">
            <b-icon icon="plus" scale="1.5"/>
          </b-button>
        </div>
      </template>
      <slot></slot>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: {
    title: {
      type: String,
      required: true,
    },
    busy: {
      type: Boolean,
      required: false,
    },
    displayAddButton: {
      type: Boolean,
      required: false,
    },
  },
})
export default class Card extends Vue {
}
</script>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
