<template>
  <a :href="target(href)" :class="{ active: isCurrentPath(href) }">
    <slot />
  </a>
</template>

<script lang="ts" setup>
import { getBaseURL } from '@/lib/http-client'

defineProps({
  href: { type: String, default: '/' },
})

function target(path: string) {
  const baseUrl = getBaseURL()

  if (baseUrl) return `${path}?base-url=${baseUrl}`
  else return path
}

function isCurrentPath(path: string) {
  return location.pathname === path
}
</script>

<style lang="postcss" scoped>
a {
  color: black;
  text-decoration: none;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
}

a.active {
  -webkit-text-stroke-width: 0.25px;
}
</style>
