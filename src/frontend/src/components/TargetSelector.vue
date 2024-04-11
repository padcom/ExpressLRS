<template>
  <div>
    <button @click="dialog?.showModal()">Select target</button>
  </div>

  <dialog ref="dialog">
    <h2>Select target</h2>
    <Panel>
      <RadioGroup>
        <RadioButton v-model="targetType" value="hardware" label="Hardware" />
        <RadioButton v-model="targetType" value="simulated" label="Simulated" />
      </RadioGroup>
      <div v-if="targetType === 'hardware'">
        <TextInput v-model="host" label="Target host" />
      </div>
      <div v-if="targetType === 'simulated'">
        <Select v-model="vendor" label="Vendor">
          <option v-for="vendorName in vendors" :key="vendorName">{{ vendorName }}</option>
        </Select>
        <Select v-model="selectedModule" label="Module" :disabled="!vendor">
          <optgroup v-if="rxList.length > 0" label="Receivers">
            <option v-for="entry in rxList" :key="entry.definition" :value="entry.definition">
              {{ entry.name }}
            </option>
          </optgroup>
          <optgroup v-if="txList.length > 0" label="Transmitters">
            <option v-for="entry in txList" :key="entry.definition" :value="entry.definition">
              {{ entry.name }}
            </option>
          </optgroup>
        </Select>
      </div>
    </Panel>

    <Actions>
      <Button :disabled="!canSaveSelection" @click="selectTarget">Select</Button>
      <Button type="secondary" @click="dialog?.close()">Cancel</Button>
    </Actions>
  </dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

import RadioGroup from './RadioGroup.vue'
import RadioButton from './RadioButton.vue'
import TextInput from './TextInput.vue'
import Panel from './Panel.vue'
import Select from './Select.vue'
import Actions from './Actions.vue'
import Button from './Button.vue'

import { useAlert } from '@/composables/alert'

type TargetType = 'hardware' | 'simulated'

interface Definition {
  vendor: string
  modules: {
    name: string,
    definition: string
  }[]
}

const dialog = ref<HTMLDialogElement>()
const targetType = ref<TargetType>('hardware')
const host = ref('http://10.0.0.1')

const definitions = ref<Definition[]>([])

const vendor = ref('')
const vendors = computed(() => (definitions.value || []).map(definition => definition.vendor))
const selectedVendor = computed(() => (definitions.value || []).find(definition => definition.vendor === vendor.value))
const rxList = computed(() => selectedVendor.value?.modules.filter(m => m.definition.includes('/rx_')) || [])
const txList = computed(() => selectedVendor.value?.modules.filter(m => m.definition.includes('/tx_')) || [])
const selectedModule = ref('')

const canSaveSelection = computed(() => targetType.value === 'hardware' ? host.value?.length : selectedModule.value)

const { error } = useAlert()

async function selectTarget() {
  const data = {
    type: targetType.value,
    host: host.value,
    vendor: vendor.value,
    module: selectedModule.value,
  }

  const response = await fetch('/set-target', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (response.ok) {
    window.location.reload()
  } else {
    error('Setting target', `Unable to set target: ${response.statusText}`)
  }

  dialog.value?.close()
}

async function loadTargets() {
  const response = await fetch('/list-targets')

  if (response.ok) {
    definitions.value = await response.json()
  } else {
    definitions.value = []
  }
}

async function loadSelectedTarget() {
  const response = await fetch('/get-target')

  if (response.ok) {
    const data = await response.json()
    targetType.value = data.type
    host.value = data.host
    vendor.value = data.vendor
    selectedModule.value = data.module
  } else {
    definitions.value = []
  }
}

onMounted(async () => {
  await loadTargets()
  await loadSelectedTarget()
})
</script>

<style lang="postcss" scoped>
dialog {
  padding: 24px;
  border-radius: 8px;
  width: 50dvw;

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .radio-group {
    margin-bottom: 24px;
  }

  .actions {
    flex-direction: row;
  }
}
</style>
