<template>
  <footer>
    <FooterItem url="https://github.com/ExpressLRS/ExpressLRS">
      <GitHub />
      <div>GitHub</div>
    </FooterItem>
    <FooterItem url="https://discord.gg/dS6ReFY">
      <Discord />
      <div>Discord</div>
    </FooterItem>
    <FooterItem url="https://www.facebook.com/groups/636441730280366">
      <Facebook />
      <div>Facebook</div>
    </FooterItem>
  </footer>
</template>

<script lang="ts" setup>
import FooterItem from './footer/FooterItem.vue'
import GitHub from './footer/github.svg'
import Discord from './footer/discord.svg'
import Facebook from './footer/facebook.svg'
</script>

<style lang="postcss" scoped>
footer {
  display: flex;
  justify-content: space-around;
}
</style>
