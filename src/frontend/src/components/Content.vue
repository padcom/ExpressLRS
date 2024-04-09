<template>
  <div class="content">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}
</style>

