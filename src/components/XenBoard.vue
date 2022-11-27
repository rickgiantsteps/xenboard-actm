<template>
  <header>
    <h1>XenBoard</h1>
    <p>Microtonal keyboard test</p>
  </header>

  <label>Central frequency (Hz): </label>
  <input type="number" id="freqhz" name="freqhz"
         v-model.number = "centerfreq" min="1" v-on:change="createOsc(hexNumber, octaves, centerfreq, rootn)"/>

  <label>Number of notes: </label>
  <input type="number" id="hexnum" name="hexnum"
         v-model.number = "hexNumber" min="1" max="100" v-on:change="createOsc(hexNumber, octaves, centerfreq, rootn)"/>

  <label>Number of octaves: </label>
  <input type="number" id="octnum" name="octnum"
         v-model.number = "octaves" min="1" max="10" v-on:change="createOsc(hexNumber, octaves, centerfreq, rootn)"/>

  <label>Root: </label>
  <input type="number" id="root" name="root"
         v-model.number = "rootn" min="2" max="5" v-on:change="createOsc(hexNumber, octaves, centerfreq, rootn)"/>

  <div class="grid" id='hexgrid'>
    <HexagonKey @mousedown="playOscillator(n-1)" v-bind:key="n" v-text="n-1" v-bind:id="n" v-for="n in hexNumber*octaves"/>
  </div>

  <p>ACTM Project - a.a. 2022/2023</p>
</template>



<script>
import * as Tone from 'tone'
import HexagonKey from './hex.vue'

let synth = new Array(12)
let note = new Array(12)
let synthn = 0;
//let keyboard = [q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m,1,2,3,4,5,6,7,8,9,0]

for (let i=0; i<12; i++) {
  synth[i] = new Tone.Synth().toDestination();
  console.log(synth)
  note[i] = 440 * 2 ** (i / 12)
}

export default {
  name: 'XenBoard',

  data() {
    return {
      hexNumber: 12,
      octaves: 1,
      centerfreq: 440,
      rootn: 2,
    };
  },

  methods: {
    createOsc(hexNumber, octaves, freq, root) {
    for (let j=0; j<octaves; j++) {
      note.length = hexNumber * octaves
        for (let i = hexNumber * j ; i<hexNumber*(j+1); i++) {
          note[i] = (freq * root**j) * root**((i%hexNumber)/hexNumber)
        }
        console.log(note)
      }
    },

    playOscillator(n) {
      synth[synthn].triggerAttackRelease(note[n], "8n");
      synthn = (synthn + 1) % 12
      console.log(synthn)
    }
  },

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