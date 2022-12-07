<template>
  <div class="p-3">
    <label class="text-base px-0.5 dark:text-slate-200">Central frequency (Hz): </label>
    <input type="number" id="freqhz" name="freqhz" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "centerfreq" min="1" v-on:change="createNotes()"/>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Number of notes: </label>
    <input type="number" id="hexnum" name="hexnum" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "hexNumber" min="1" max="100" v-on:change="createNotes()"/>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Number of octaves: </label>
    <input type="number" id="octnum" name="octnum" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "octaves" min="1" max="10" v-on:change="createNotes()"/>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Root: </label>
    <input type="number" id="root" name="root" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "rootn" min="2" max="5" v-on:change="createNotes()"/>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Polyphony (n of oscillators): </label>
    <input type="number" id="root" name="root" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "poly" min="1" max="50" v-on:change="createOsc()"/>
  </div>

  <div class="grid" id='hexgrid'>
    <HexagonKey class="bg-[#ffd085] hover:bg-[#ffbe5b] active:bg-[#ffd700] dark:text-slate-50 dark:bg-slate-500
                dark:hover:bg-sky-700 dark:active:bg-sky-500" @mousedown="playOscillator(n-1)" @mouseup="stopOscillator(n-1)"
                @mouseleave="stopOscillator(n-1)" v-bind:key="n" v-text="n-1" v-bind:id="n" v-for="n in hexNumber*octaves"/>
  </div>
</template>



<script>

// when starting the app sometimes audio plays only on the second click, problem with
// Tone.start() "suspended, requires activation from user input"

import * as Tone from 'tone'
import HexagonKey from './hex.vue'

let synth = new Array(12)
let note = new Array(12)
let ageofsynth = new Array(12).fill(0);
let keymouseon = new Array(12).fill(false);
let keyboardon = new Array(12).fill(false);
let keyboard = ["q","w","e","r","t","y","u","i","o","p","è","+","ù","a","s","d","f","g","h","j","k","l","ò","à",
                "z","x","c","v","b","n","m",",",".","-","1","2","3","4","5","6","7","8","9","0"]

for (let i=0; i<12; i++) {
  synth[i] = new Tone.Synth().toDestination();
  note[i] = 440 * 2 ** (i / 12)
}

Tone.start()

export default {
  name: 'XenBoard',

  data() {
    return {
      played: 0,
      hexNumber: 12,
      octaves: 1,
      centerfreq: 440,
      rootn: 2,
      poly: 12,
      colorOn: "bg-[#ffd700]",
      darkColorOn: "dark:bg-sky-500",
    };
  },

  methods: {

    createNotes() {
      for (let j = 0; j < this.octaves; j++) {
        note.length = this.hexNumber * this.octaves
        for (let i = this.hexNumber * j; i < this.hexNumber * (j + 1); i++) {
          note[i] = (this.centerfreq * this.rootn ** j) * this.rootn ** ((i % this.hexNumber) / this.hexNumber)
        }
      }
      this.createOsc()
    },

    createOsc() {
      for (let i = 0; i < synth.length; i++) {
        if (synth[i] !== null) {
          synth[i].dispose()
        }
      }
      synth.length = this.hexNumber * this.octaves;
      ageofsynth.length = this.hexNumber * this.octaves;
      ageofsynth.fill(0);
      this.played = 0;
      synth.fill(null)
    },

    playOscillator(n) {
      if ((keymouseon[n] === false || isNaN(keymouseon[n])) && keyboardon[n] !== true) {

        keymouseon[n] = true
        this.played++
        ageofsynth[n] = this.played
        this.pauseOldOscillator()
        if (synth[n]===null) {
          synth[n] = new Tone.Synth().toDestination();
        }
        synth[n].triggerAttack(note[n], Tone.now());
      }
    },

    stopOscillator(n) {
      if (keymouseon[n] === true && keyboardon[n] !== true) {
        keymouseon[n] = false
        synth[n].triggerRelease(Tone.now());
      }
    },

    pauseOldOscillator() {
      const count = ageofsynth.filter(ageofsynth => {
        return ageofsynth !== 0;
      }).length;

      if (count > this.poly) {
        let min, num;
        min = Math.min.apply(null, ageofsynth.filter(Boolean))
        num = ageofsynth.indexOf(min)
        synth[num].triggerRelease(Tone.now());
        ageofsynth[num] = 0;

        if (keymouseon[num] === true) {
          keymouseon[num] = false
          this.keyColorOnOff(num+1)
        } else if (keyboardon[num] === true) {
          keyboardon[num] = false
          this.keyColorOnOff(num+1)
        }
      }
    },

    keyColorOnOff(index) {
        document.getElementById((index).toString()).classList.toggle(this.colorOn);
        document.getElementById((index).toString()).classList.toggle(this.darkColorOn);
    },

  },

  created() {

    window.addEventListener("keydown", e => {
      if(e.target.type === 'number') {
        return;
      }

      const key = e.key.toLowerCase();
      const index = keyboard.indexOf(key);

      if (!isNaN(index) && (index+1) <= this.hexNumber*this.octaves && (isNaN(keyboardon[index])||keyboardon[index]===false)
          && keymouseon[index] !== true) {

        this.keyColorOnOff(index+1);

        keyboardon[index] = true
        this.played++
        ageofsynth[index] = this.played
        this.pauseOldOscillator()
        if (synth[index]===null) {
          synth[index] = new Tone.Synth().toDestination();
        }
        synth[index].triggerAttack(note[index], Tone.now());
      }
    });

    window.addEventListener("keyup", e => {
      if(e.target.type === 'number') {
        return;
      }

      const key = e.key.toLowerCase();
      const index = keyboard.indexOf(key);

      if (!isNaN(index) && index <= this.hexNumber*this.octaves
          && keymouseon[index] !== true && keyboardon[index] === true) {

        this.keyColorOnOff(index+1)

        keyboardon[index] = false
        synth[index].triggerRelease(Tone.now());
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