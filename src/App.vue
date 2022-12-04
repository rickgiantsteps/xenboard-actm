<template>
  <header>
    <h1>XenBoard</h1>
    <p>Microtonal keyboard test</p>
  </header>

  <XenBoard/>

  <footer>
    <p>ACTM Project - a.a. 2022/2023</p>
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
@import "./assets/styles/styles.scss";
</style>