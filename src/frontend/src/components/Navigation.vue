<template>
  <ul class="navigation">
    <li>
      <Link href="/">Settings</Link>
    </li>
    <li>
      <Link href="/hardware.html">Hardware</Link>
    </li>
    <li>
      <Link href="/cw.html">Constant Wave</Link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import Link from './navigation/Link.vue'
</script>

<style lang="postcss" scoped>
.navigation {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  list-style: none;
}
</style>
