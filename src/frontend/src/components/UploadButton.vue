<template>
  <Button v-bind="$attrs">
    <label>
      <slot />
      <input ref="file" type="file" @change="upload()">
    </label>
  </Button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Button from './Button.vue'

const emit = defineEmits<{(e: 'upload', data: FileList): void}>()

const file = ref<HTMLInputElement>()

function upload() {
  if (file.value && file.value?.files && file.value?.files?.length > 0) {
    emit('upload', file.value?.files)
  }
}
</script>

<style lang="postcss" scoped>
label {
  cursor: pointer;
}

input[type=file] {
  opacity: 0;
  width: 0;
}
</style>
