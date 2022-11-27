<template>
  <header>
    <h1>XenBoard</h1>
    <p>Microtonal keyboard test</p>
  </header>
  <label>Number of notes: </label>
  <input
      type="number"
      id="hexnum"
      name="hexnum"
      v-model.number = "hexNumber"
      min="1"
      max="100"
      v-on:change="createOsc(hexNumber)"
      />

  <div class="grid" id='hexgrid'>
    <HexagonKey @click="playOscillator(n)" v-bind:key="n" v-text="n-1" v-bind:id="n" v-for="n in hexNumber"></HexagonKey>
  </div>

  <p>ACTM Project - a.a. 2022/2023</p>
</template>

<script>
import * as Tone from 'tone'
import HexagonKey from './hex.vue'

let synth = new Array(12)
let note = new Array(12)
let octave = 0;

for (let i=0; i<=12; i++) {
  synth[i] = new Tone.Synth().toDestination();
  note[i] = 440 * 2 ** ((i + (octave * 12)) / 12)
}

export default {

  data() {
    return {
      hexNumber: 12,
    };
  },

  methods: {
    createOsc(hexNumber) {
      for (let i=0; i<=hexNumber; i++) {
        synth[i] = new Tone.Synth().toDestination();
        note[i] = 440 * 2**((i + (octave*hexNumber))/hexNumber)
      }
    },

    playOscillator(n) {
      synth[n].triggerAttackRelease(note[n], "8n");
    }
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
