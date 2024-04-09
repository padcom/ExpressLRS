<template>
  <Panel>
    <SectionHeader>Import/Export</SectionHeader>

    <Actions>
      <Button type="secondary" small @click="download()">Save model configuration file</Button>
      <UploadButton type="primary" small @upload="upload($event)">
        Upload model configuration file
      </UploadButton>
    </Actions>
  </Panel>
</template>

<script lang="ts" setup>
import Panel from '@/components/Panel.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import Actions from '@/components/Actions.vue'
import Button from '@/components/Button.vue'
import UploadButton from '@/components/UploadButton.vue'

import { useConfig } from '@/composables/config'
import { useAlert } from '@/composables/alert'
import { downloadBlob } from '@/lib/file-download'

const { download: downloadConfig } = useConfig()
const { error } = useAlert()

async function download() {
  const result = await downloadConfig()
  if (result.status === 'ok' && result.data) {
    downloadBlob('models.json', new Blob([result.data]))
  } else {
    error('Error downloading configuration', result.msg)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function upload(files: FileList) {
  error('Temporary', 'Not implemented yet')
}
</script>
