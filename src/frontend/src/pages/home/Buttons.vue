<template>
  <Panel>
    <SectionHeader>Buttons</SectionHeader>

    <p class="paragraph">
      Specify which actions to perform when clicking or long pressing module buttons.
    </p>

    <Content />

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
import Actions from '@/components/Actions.vue'
</script>
