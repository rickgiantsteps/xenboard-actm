import HexagonKey from './hex.vue'
import P5 from "@/components/P5/P5-multi.vue";
import * as Tone from 'tone'

let synth = new Array(12)
let note = new Array(12)
let ageofsynth = new Array(12).fill(0);
//let played = 0
let keymouseon = new Array(12).fill(false);
let keyboardon = new Array(12).fill(false);
let keyboard = ["q","w","e","r","t","y","u","i","o","p","è","+","ù","a","s","d","f","g","h","j","k","l","ò","à",
                "z","x","c","v","b","n","m",",",".","-","1","2","3","4","5","6","7","8","9","0"]

for (let i=0; i<12; i++) {
  synth[i] = new Tone.Synth().toDestination();
  note[i] = 440 * 2 ** (i / 12)
}

Tone.start();

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

            keyOn: keyboardon,
            mouseOn: keymouseon,
            innerDarkOn: this.darkOn

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
            keyboardon.length = note.length;
            keyboardon[note.length-1] = false;
            keymouseon.length = note.length;
            keymouseon[note.length-1] = false;
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
        document.getElementById((index).toString()).classList.toggle("bg-[#ffd085]");
        document.getElementById((index).toString()).classList.toggle(this.colorOn);
        document.getElementById((index).toString()).classList.toggle("dark:bg-slate-500");
        document.getElementById((index).toString()).classList.toggle(this.darkColorOn);
    },

    },

    created() {

        /*for (let i=0; i<12; i++) {
            synth[i] = new this.$tone.Synth().toDestination();
            note[i] = 440 * 2 ** (i / 12)
        }

        this.$tone.start()*/

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
        HexagonKey,
        P5
    },

    watch:{
        darkOn(newValue) {
            this.innerDarkOn = newValue;
            console.log(this.innerDarkOn);
        },
    }

}