<template>
  <Panel>
    <SectionHeader>Buttons</SectionHeader>

    <p class="paragraph">
      Specify which actions to perform when clicking or long pressing module buttons.
    </p>

    <Content>
      <ButtonsTable />
    </Content>

    <Actions>
      <Button type="primary">
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
import Actions from '@/components/Actions.vue'
import Button from '@/components/Button.vue'
</script>
