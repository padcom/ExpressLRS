<template>
  <template v-if="data">
    <Header />
    <Navigation />
    <Panel is="main">
      <RouterView />
    </Panel>
    <Footer />
  </template>

  <Alert ref="alert" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import Header from '@/components/Header.vue'
import Navigation from '@/components/Navigation.vue'
import Panel from '@/components/Panel.vue'
import Footer from '@/components/Footer.vue'
import Alert from '@/components/Alert.vue'

import { useTarget } from './composables/target'
import { provideAlert } from './composables/alert'

const alert = ref<InstanceType<typeof Alert>>()
provideAlert(alert)

const { load, data } = useTarget()
onMounted(load)
</script>

<style lang="postcss" scoped>
main {
  margin-block: 24px;
  margin-inline: 0;

  @media screen and (width > 510px) {
    margin-inline: 9%;
  }
}
</style>
