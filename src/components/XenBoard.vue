<template>
  <header>
    <h1>XenBoard</h1>
    <p>Microtonal keyboard test</p>
  </header>
  <input
      type="number"
      id="hexnum"
      name="hexnum"
      v-model.number = "hexNumber"
      min="1"
      max="100" />

  <div class="grid" id='hexgrid'>
    <HexagonKey v-bind:key="n" v-text="n-1" v-bind:id="n" v-for="n in hexNumber"></HexagonKey>
  </div>

  <p>ACTM Project - a.a. 2022/2023</p>
</template>

<script>
import HexagonKey from './hex.vue'

//@Component({ components: { hexagonKey } })

export default {
  data() {
    return {
      hexNumber: '',
    };
  },

  beforeMount: function() {
    this.hexNumber = 12;
  },

  name: 'XenBoard',
  props: {
  },

components: {
    HexagonKey
}


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../assets/styles/styles.scss";
</style>
