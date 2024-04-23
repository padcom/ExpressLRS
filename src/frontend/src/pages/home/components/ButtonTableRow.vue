<template>
  <tr>
    <td class="button">
      Button {{ index + 1 }}
    </td>
    <td class="action">
      <ButtonActionSelect v-model="action.action" />
    </td>
    <td class="press">
      <ButtonPressSelect v-if="action.action > 0" v-model="action['is-long-press']" />
    </td>
    <td class="count">
      <template v-if="action.action > 0">
        <ButtonDelaySelect v-if="action['is-long-press']" v-model="action.count" />
        <ButtonCountSelect v-else v-model="action.count" />
      </template>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import ButtonActionSelect from './ButtonActionSelect.vue'
import ButtonPressSelect from './ButtonPressSelect.vue'
import ButtonCountSelect from './ButtonCountSelect.vue'
import ButtonDelaySelect from './ButtonDelaySelect.vue'
import { type ButtonAction } from '@/api'

defineProps({
  index: { type: Number, default: 0 },
  action: { type: Object as PropType<ButtonAction>, required: true },
})
</script>

<style lang="postcss" scoped>
td {
  padding: 8px 0;
}

.button {
  width: 10%;
}

.action {
  width: 40%;
}

.press {
  width: 25%;
}

.count {
  width: 25%;
}
</style>
