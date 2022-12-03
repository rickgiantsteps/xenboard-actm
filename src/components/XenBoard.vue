<template>
  <header>
    <h1>XenBoard</h1>
    <p>Microtonal keyboard test</p>
  </header>

  <div>
    <label>Central frequency (Hz): </label>
    <input type="number" id="freqhz" name="freqhz"
           v-model.number = "centerfreq" min="1" v-on:change="createNotes(hexNumber, octaves, centerfreq, rootn)"/>

    <label>Number of notes: </label>
    <input type="number" id="hexnum" name="hexnum"
           v-model.number = "hexNumber" min="1" max="100" v-on:change="createNotes(hexNumber, octaves, centerfreq, rootn)"/>

    <label>Number of octaves: </label>
    <input type="number" id="octnum" name="octnum"
           v-model.number = "octaves" min="1" max="10" v-on:change="createNotes(hexNumber, octaves, centerfreq, rootn)"/>

    <label>Root: </label>
    <input type="number" id="root" name="root"
           v-model.number = "rootn" min="2" max="5" v-on:change="createNotes(hexNumber, octaves, centerfreq, rootn)"/>

    <label>Polyphony (n of oscillators): </label>
    <input type="number" id="root" name="root"
           v-model.number = "poly" min="1" max="50" v-on:change="createOsc(poly)"/>
  </div>

  <div class="grid" id='hexgrid'>
    <HexagonKey @mousedown="playOscillator(n-1, poly)" @mouseup="stopOscillator(n-1, poly)"
                @mouseleave="stopOscillator(n-1, poly)" v-bind:key="n" v-text="n-1" v-bind:id="n"
                v-for="n in hexNumber*octaves"/>
  </div>

  <p>ACTM Project - a.a. 2022/2023</p>
</template>



<script>
import * as Tone from 'tone'
import HexagonKey from './hex.vue'

let synth = new Array(12)
let note = new Array(12)
let ageofsynth = new Array(12)
let played = 0
let keymouseon = new Array(12).fill(false);
let keyboardon = new Array(12).fill(false);
let keyboard = ["q","w","e","r","t","y","u","i","o","p","è","+","ù","a","s","d","f","g","h","j","k","l","ò","à",
                "z","x","c","v","b","n","m",",",".","-","1","2","3","4","5","6","7","8","9","0"]

Tone.start()

for (let i=0; i<12; i++) {
  synth[i] = new Tone.Synth().toDestination();
  note[i] = 440 * 2 ** (i / 12)
  ageofsynth.fill(0);
}

export default {
  name: 'XenBoard',

  data() {
    return {
      hexNumber: 12,
      octaves: 1,
      centerfreq: 440,
      rootn: 2,
      poly: 12,
    };
  },

  methods: {
    createNotes(hexNumber, octaves, freq, root) {
      for (let j = 0; j < octaves; j++) {
        note.length = hexNumber * octaves
        for (let i = hexNumber * j; i < hexNumber * (j + 1); i++) {
          note[i] = (freq * root ** j) * root ** ((i % hexNumber) / hexNumber)
        }
      }
    },

    createOsc(polyphony) {
      synth.length = 0;
      synth.length = polyphony;
      ageofsynth.length = polyphony
      ageofsynth.fill(0);
      for (let i = 0; i < polyphony; i++) {
        synth[i] = new Tone.Synth().toDestination();
      }
    },

    playOscillator(n, polyphony) {
      if ((keymouseon[n] === false || isNaN(keymouseon[n])) && keyboardon[n] !== true) {
        keymouseon[n] = true
        played++
        ageofsynth[n % this.poly] = played
        this.pauseOldOscillator()
        console.log("poly:"+n % polyphony)
        synth[n % polyphony].triggerAttack(note[n], Tone.now());
      }
    },

    stopOscillator(n, polyphony) {
      if (keymouseon[n] === true && keyboardon[n] !== true) {
        keymouseon[n] = false
        synth[n % polyphony].triggerRelease(Tone.now());
      }
    },

    pauseOldOscillator() {
      let min, num;
      min = Math.min(... ageofsynth)
      num = ageofsynth.indexOf(min)
      console.log(ageofsynth)
      console.log(num)
      synth[num].triggerRelease(Tone.now());
    },

  },

  created() {

    //(mono and low poly still create inconsistencies)
    //in mono keyup stops any currently playing notes
    //in low poly any noteUp can stop notes multiple of released key "n"

    window.addEventListener("keydown", e => {
      const key = e.key;
      const index = keyboard.indexOf(key);
      if (!isNaN(index) && (index+1) <= this.hexNumber*this.octaves && (isNaN(keyboardon[index])||keyboardon[index]===false)
          && keymouseon[index] !== true) {
        document.getElementById((index+1).toString()).classList.toggle("noteOn");
        keyboardon[index] = true
        played++
        ageofsynth[index % this.poly] = played
        this.pauseOldOscillator()
        synth[index % this.poly].triggerAttack(note[index], Tone.now());
      }
    });

    window.addEventListener("keyup", e => {
      const key = e.key;
      const index = keyboard.indexOf(key);
      if (!isNaN(index) && index <= this.hexNumber*this.octaves
          && (keymouseon[index] !== true || keyboardon[index] === true)) {
        document.getElementById((index+1).toString()).classList.toggle("noteOff");
        document.getElementById((index+1).toString()).classList.toggle("noteOff");
        document.getElementById((index+1).toString()).classList.toggle("noteOn");
        keyboardon[index] = false
        synth[index % this.poly].triggerRelease(Tone.now());
      }
    });
  },

  props:{
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