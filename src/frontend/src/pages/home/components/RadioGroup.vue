<template>
  <div class="radio-group">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
