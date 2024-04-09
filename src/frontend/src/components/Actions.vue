<template>
  <div class="actions">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
}
</style>
