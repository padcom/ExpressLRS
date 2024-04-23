<template>
  <Panel>
    <SectionHeader>Buttons</SectionHeader>

    <p class="paragraph">
      Specify which actions to perform when clicking or long pressing module buttons.
    </p>

    <Content>
      <ButtonsTable />
      <SectionHeader>Button Colors</SectionHeader>
      <ButtonColors />
    </Content>

    <Actions>
      <Button type="primary" @click="saveButtons">
        Save
      </Button>
    </Actions>
  </Panel>
</template>

<script lang="ts" setup>
import Panel from '@/components/Panel.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import Content from '@/components/Content.vue'
import ButtonsTable from './components/ButtonsTable.vue'
import ButtonColors from './components/ButtonColors.vue'
import Actions from '@/components/Actions.vue'
import Button from '@/components/Button.vue'
import { useConfig } from '@/composables/config'

const { saveButtons } = useConfig()
</script>
