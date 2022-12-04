<template>
  <header>
    <h1 class="font-bold text-6xl py-3">XenBoard</h1>
    <p class="text-lg py-3">Microtonal keyboard test</p>
  </header>

  <XenBoard/>

  <footer>
    <p class="text-base p-6">ACTM Project - a.a. 2022/2023</p>
  </footer>
</template>

<script>
import XenBoard from './components/XenBoard.vue'

export default {
  name: 'App',
  components: {
    XenBoard
  }
}
</script>

<style lang="scss">
@import "assets/styles/styles.scss";
@import "assets/styles/tailwind.css";
</style>