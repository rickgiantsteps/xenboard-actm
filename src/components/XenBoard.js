import HexagonKey from './hex.vue'
import P5 from "@/components/P5/P5-multi.vue";
import * as Tone from 'tone'
import DissonanceGraph from "@/components/P5/dissonance-graph.vue";
import Tune from "./tune.js"

let tune = new Tune();
tune.mode.output = "frequency";

let synth = new Array(12)
let note = new Array(12)
let ageofsynth = new Array(12).fill(0);
let keymouseon = new Array(12).fill(false);
let keyboardon = new Array(12).fill(false);
let keyboard = ["q","w","e","r","t","y","u","i","o","p","è","+","ù","a","s","d","f","g","h","j","k","l","ò","à",
                "z","x","c","v","b","n","m",",",".","-","1","2","3","4","5","6","7","8","9","0"]

let octave_colors = ["bg-[#ffd085]", "bg-[#D8BFD8]", "bg-[#FF6347]"];
let octave_colors_On = ["bg-[#ffd700]", "bg-[#ab76ab]", "bg-[#bd1d00]"];
let octave_colors_Mid = ["bg-[#ffbe5b]", "bg-[#c9a7c9]", "bg-[#ff846e]"];

let octave_colors_dark = ["bg-slate-500", "bg-[#D8BFD8]", "bg-[#FF6347]"];
let octave_colors_dark_On = ["bg-sky-500", "bg-[#ab76ab]", "bg-[#bd1d00]"];
let octave_colors_dark_Mid= ["bg-sky-700", "bg-[#c9a7c9]", "bg-[#ff846e]"];


for (let i=0; i<12; i++) {
  synth[i] = new Tone.Synth().toDestination();
  note[i] = 440 * 2 ** (i / 12)
}

export default {
  name: 'XenBoard',

    data() {
        return {
            tune: true,
            played: 0,
            hexNumber: 12,
            octaves: 1,
            high: 0,
            low: 0,
            centerfreq: 440,
            rootn: 2,
            poly: 12,
            colorOn: "bg-[#ffd700]",
            darkColorOn: "dark:bg-sky-500",
            hystTune: "",

            keyOn: keyboardon,
            mouseOn: keymouseon,
            innerDarkOn: this.darkOn,
            synths: synth,
            notes: note,
        };
    },

    methods: {
        createNotes() {
            this.octaves = this.high + this.low + 1;
            note.length = this.hexNumber * this.octaves;

            let counter;
            let position = 0;
            for(let i=0;i<this.low;i++) {
                counter = 0;
                while(counter < this.hexNumber) {
                    note[position + counter] = (this.centerfreq / (this.rootn ** (this.low - i))) * this.rootn ** (counter / this.hexNumber);
                    counter++;
                }
                position += counter;
            }

            for(let i=0;i<this.hexNumber;i++) {
                note[position + i] = this.centerfreq * this.rootn ** (i/this.hexNumber);
            }
            position += this.hexNumber;

            for(let i=0;i<this.high;i++) {
                counter = 0;
                while(counter < this.hexNumber) {
                    note[position + counter] = (this.centerfreq *  (this.rootn**(i+1)) * this.rootn ** (counter / this.hexNumber));
                    counter++;
                }
                position += counter;
            }

            this.createOsc();
            this.$nextTick(function () {this.changeOctaveColor(this.hexNumber, this.octaves)})
            keyboardon.length = note.length;
            keyboardon[note.length-1] = false;
            keymouseon.length = note.length;
            keymouseon[note.length-1] = false;
        },
        createNotesFromTune() {
            this.octaves = this.high + this.low + 1;
            tune.loadScale(this.hystTune);
            tune.tonicize(this.centerfreq);
            this.hexNumber = tune.scale.length;
            let counter;
            let position = 0;
            for(let i=this.low;i>0;i--) {
                counter = 0;
                while(counter<this.hexNumber) {
                    note[counter] = tune.note(counter, -i);
                    counter++;
                }
                position += counter;
            }
            for(let i=0;i<this.hexNumber;i++) {
                note[position + i] = tune.note(i, 0);
            }
            position += this.hexNumber;
            for(let i=0;i<this.high;i++) {
                counter = 0;
                while(counter < this.hexNumber) {
                    note[position + counter] = tune.note(counter, i+1);
                    counter++;
                }
            }
            this.createOsc();
            this.$nextTick(function () {this.changeOctaveColor(this.hexNumber, this.octaves)})
            keyboardon.length = note.length;
            keyboardon[note.length-1] = false;
            keymouseon.length = note.length;
            keymouseon[note.length-1] = false;
        },
        changeOctaveColor(note_number, octave_number){
            for(let i = 0; i < note_number * octave_number; i++) {
                if (keymouseon[i] !== true && keyboardon[i] !== true) {
                    document.getElementById((i + 1).toString()).classList.remove("bg-[#ffd085]");
                    document.getElementById((i + 1).toString()).classList.remove("dark:bg-slate-500");
                    document.getElementById((i + 1).toString()).classList.remove("active:bg-[#ffd700]");
                    document.getElementById((i + 1).toString()).classList.remove("dark:active:bg-sky-500");
                    document.getElementById((i + 1).toString()).classList.remove("hover:bg-[#ffbe5b]");
                    document.getElementById((i + 1).toString()).classList.remove("dark:hover:bg-sky-700");
                    for (let j = 0; j < octave_colors.length; j++) {
                        document.getElementById((i + 1).toString()).classList.remove(octave_colors[j]);
                        document.getElementById((i + 1).toString()).classList.remove("dark:" + octave_colors_dark[j]);
                        document.getElementById((i + 1).toString()).classList.remove("active:" + octave_colors_On[j]);
                        document.getElementById((i + 1).toString()).classList.remove("dark:active:" + octave_colors_dark_On[j]);
                        document.getElementById((i + 1).toString()).classList.remove("hover:" + octave_colors_Mid[j]);
                        document.getElementById((i + 1).toString()).classList.remove("dark:hover:" + octave_colors_dark_Mid[j]);
                    }
                }
            }

            for (let i = 0; i < note_number * octave_number; i++) {
                if (keymouseon[i] !== true && keyboardon[i] !== true) {
                    let octave_pos = Math.floor(i / note_number) % octave_colors.length;
                    document.getElementById((i + 1).toString()).classList.add(octave_colors[octave_pos]);
                    document.getElementById((i + 1).toString()).classList.add("dark:" + octave_colors_dark[octave_pos]);
                    document.getElementById((i + 1).toString()).classList.add("active:" + octave_colors_On[octave_pos]);
                    document.getElementById((i + 1).toString()).classList.add("dark:active:" + octave_colors_dark_On[octave_pos]);
                    document.getElementById((i + 1).toString()).classList.add("hover:" + octave_colors_Mid[octave_pos]);
                    document.getElementById((i + 1).toString()).classList.add("dark:hover:" + octave_colors_dark_Mid[octave_pos]);
                }
            }
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
          synth[n] = new this.$tone.Synth().toDestination();
        }
        synth[n].triggerAttack(note[n], this.$tone.now());
      }
    },

        stopOscillator(n) {
            if (keymouseon[n] === true && keyboardon[n] !== true) {
                keymouseon[n] = false
                synth[n].triggerRelease(this.$tone.now());
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
                synth[num].triggerRelease(this.$tone.now());
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
        /*document.getElementById((index).toString()).classList.toggle("bg-[#ffd085]");
        document.getElementById((index).toString()).classList.toggle(this.colorOn);*/
        /*document.getElementById((index).toString()).classList.toggle("dark:bg-slate-500");
        document.getElementById((index).toString()).classList.toggle(this.darkColorOn);*/
        let idx_col = 0;
        let idx_col_dark = 0;
        for (let j = 0; j < octave_colors.length; j++) {
            if (document.getElementById((index).toString()).classList.contains(octave_colors[j])) {
                idx_col = j;
            }
            if (document.getElementById((index).toString()).classList.contains(octave_colors_On[j])) {
                idx_col = j;
            }
            if (document.getElementById((index).toString()).classList.contains("dark:" + octave_colors_dark[j])) {
                idx_col_dark = j;
            }
            if (document.getElementById((index).toString()).classList.contains("dark:" + octave_colors_dark_On[j])) {
                idx_col_dark = j;
            }
        }
        document.getElementById((index).toString()).classList.toggle(octave_colors[idx_col]);
        document.getElementById((index).toString()).classList.toggle(octave_colors_On[idx_col]);
        document.getElementById((index).toString()).classList.toggle("dark:" + octave_colors_dark[idx_col_dark]);
        document.getElementById((index).toString()).classList.toggle("dark:" + octave_colors_dark_On[idx_col_dark]);
    },

    },

    created() {

        /*for (let i=0; i<12; i++) {
            synth[i] = new Tone.Synth().toDestination();
            note[i] = 440 * 2 ** (i / 12)
        }*/

        window.addEventListener("keydown", e => {
            if(e.target.type === 'number') {
                return;
            }

            const key = e.key.toLowerCase();
            const index = keyboard.indexOf(key);

            if (!isNaN(index) && (index+1) <= this.hexNumber*this.octaves && (isNaN(keyboardon[index])||keyboardon[index]===false)
                && keymouseon[index] !== true) {

                this.keyColorOnOff(index+1)
                console.log(index+1)

                keyboardon[index] = true
                this.played++
                ageofsynth[index] = this.played
                this.pauseOldOscillator()
                if (synth[index]===null) {
                    synth[index] = new this.$tone.Synth().toDestination();
                }
                synth[index].triggerAttack(note[index], this.$tone.now());
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
                synth[index].triggerRelease(this.$tone.now());
            }
        });
    },

    props:{
      darkOn:{
          type: Boolean
      }
    },

    components: {
        DissonanceGraph,
        HexagonKey,
        P5
    },

    watch:{
        darkOn(newValue) {
            this.innerDarkOn = newValue;
        },
    }

}