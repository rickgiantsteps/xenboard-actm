<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <XenBoard msg="Welcome to Your Vue.js App"/>
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

<style>
@import "./assets/styles/styles.scss";
</style>