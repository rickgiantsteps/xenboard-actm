import HexagonKey from './hex.vue'
import P5 from "@/components/P5/P5-multi.vue";
import * as Tone from 'tone'
//import DissonanceGraph from "@/components/P5/dissonance-graph.vue";
import Tune from "./tune.js"
import DissonanceGraph from "./P5/dissonance-graph.vue";

let tune = new Tune();
tune.mode.output = "frequency";

let synth = new Array(12)
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

let effectsAddedList = [];
let vibrato = new Tone.Vibrato(0,0).toDestination();
let tremolo = new Tone.Tremolo(0, 0).toDestination().start();
let distortion = new Tone.Distortion(0).toDestination();
let chorus = new Tone.Chorus(0,0,0).toDestination().start();
let reverb = new Tone.JCReverb(0).toDestination();

let lastnote = 0;

export default {
  name: 'XenBoard',
    computed: {
        DissonanceGraph() {
            return DissonanceGraph
        }
    },

    data() {
        return {
            tune: true,
            notes: [],
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
            avgdiss: 0,
            meldiss: 0,
            harmdiss: 0
        };
    },

    methods: {
        createNotes() {
            this.octaves = this.high + this.low + 1;
            this.notes.length = this.hexNumber * this.octaves;
            let counter;
            let position = 0;
            for(let i=0;i<this.low;i++) {
                counter = 0;
                while(counter < this.hexNumber) {
                    this.notes[position + counter] = (this.centerfreq / (this.rootn ** (this.low - i))) * this.rootn ** (counter / this.hexNumber);
                    counter++;
                }
                position += counter;
            }

            for(let i=0;i<this.hexNumber;i++) {
                this.notes[position + i] = this.centerfreq * this.rootn ** (i/this.hexNumber);
            }
            position += this.hexNumber;

            for(let i=0;i<this.high;i++) {
                counter = 0;
                while(counter < this.hexNumber) {
                    this.notes[position + counter] = (this.centerfreq *  (this.rootn**(i+1)) * this.rootn ** (counter / this.hexNumber));
                    counter++;
                }
                position += counter;
            }

            this.afterCreatingNotes();
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
                    this.notes[position + counter] = tune.note(counter, 0-i);
                    counter++;
                }
                position += counter;
            }
            for(let i=0;i<this.hexNumber;i++) {
                this.notes[position + i] = tune.note(i, 0);
            }
            position += this.hexNumber;
            for(let i=0;i<this.high;i++) {
                counter = 0;
                while(counter < this.hexNumber) {
                    this.notes[position + counter] = tune.note(counter, i+1);
                    counter++;
                }
                position += counter;
            }
            this.afterCreatingNotes();
        },

        afterCreatingNotes() {
            this.createOsc();
            this.$nextTick(function () {this.changeOctaveColor(this.hexNumber, this.octaves)})
            keyboardon.length = this.notes.length;
            keyboardon[this.notes.length-1] = false;
            keymouseon.length = this.notes.length;
            keymouseon[this.notes.length-1] = false;
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

            this.update_melodic_dissonance(this.notes[n]);


            keymouseon[n] = true
            this.played++
            ageofsynth[n] = this.played
            this.pauseOldOscillator()
            if (synth[n]===null) {
              synth[n] = new this.$tone.Synth().toDestination();
                if (effectsAddedList != []) {
                    for (let i = 0; i < effectsAddedList.length; i++) {
                        synth[n].chain(eval(effectsAddedList[i])).toDestination();
                    }
                }
            }
            synth[n].triggerAttack(this.notes[n], this.$tone.now(), document.getElementById('volume').value);
            this.update_harmonic_dissonance();
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

        vibratoEffectToggle() {
            this.addRemoveEffects("vibrato");
            document.getElementById("vibrato-button").style.backgroundColor = effectsAddedList.includes("vibrato") ? "#3cb371" : "#8b0000";
            this.muteEffect(vibrato);
        },

        tremoloEffectToggle() {
            this.addRemoveEffects("tremolo");
            document.getElementById("tremolo-button").style.backgroundColor = effectsAddedList.includes("tremolo") ? "#3cb371" : "#8b0000";
            this.muteEffect(tremolo);
        },

        distortionEffectToggle() {
            this.addRemoveEffects("distortion");
            document.getElementById("distortion-button").style.backgroundColor = effectsAddedList.includes("distortion") ? "#3cb371" : "#8b0000";
            this.muteEffect(distortion);
        },

        chorusEffectToggle() {
            this.addRemoveEffects("chorus");
            document.getElementById("chorus-button").style.backgroundColor = effectsAddedList.includes("chorus") ? "#3cb371" : "#8b0000";
            this.muteEffect(chorus);
        },

        reverbEffectToggle() {
            this.addRemoveEffects("reverb");
            document.getElementById("reverb-button").style.backgroundColor = effectsAddedList.includes("reverb") ? "#3cb371" : "#8b0000";
            for (let i=0; i<synth.length; i++) {
                if (synth[i] != null) {
                    if (effectsAddedList.includes("reverb")) {
                        synth[i].chain(reverb).toDestination();
                    } else {
                        synth[i].disconnect(reverb);
                    }
                }
            }
        },

        addRemoveEffects(effect){
            if(effectsAddedList.includes(effect)) {
                let index = effectsAddedList.indexOf(effect)
                effectsAddedList.splice(index, 1);
            } else {
                effectsAddedList.push(effect);
            }
        },

        muteEffect(effect){
            for (let i=0; i<synth.length; i++) {
                if (synth[i] != null) {
                    if (effectsAddedList.includes((effect.toString()).toLowerCase())) {
                        synth[i].chain(effect).toDestination();
                    } else {
                        synth[i].disconnect(effect);
                    }
                }
            }
        },

        averagediss_change($event) {
            this.avgdiss = $event
        },

        eulerGradus(decimalRatio) {
            let fraction = this.decimalToFraction(decimalRatio.toFixed(6))
            let n = fraction[0]
            let d = fraction[1]
            let gradus = 1
            let count = 1

            for (let i in this.primeFactors(d*n)) {
                gradus += count*(i-1)
                count++
            }

            return gradus
        },

        setharesFormula_helper(f1, f2){
            let b1 = 3.5;
            let b2 = 5.75;
            let s1 = 0.0207;
            let s2 = 18.96;
            //let x_cap = 0.24;
            let x = Math.abs(f1 - f2) / Math.min((f1, f2));

            let s = x / ((s1 * f1) + s2);
            let z1 = Math.exp(-b1 * s * (f2 - f1));
            let z2 = Math.exp(-b2 * s * (f2 - f1));

            let z = z1 - z2;


            return z;
        },

        setharesFormula(tones){
            let dissonance = 0;
            for (let a = 0; a < tones.length; a++) {
                for (let i = 1; i < tones.length; i++) {
                    dissonance = dissonance + this.setharesFormula_helper(tones[a], tones[i]);
                    console.log(dissonance);
                }
            }

            return 0.5*dissonance;
        },

        primeFactors(n) {
            let factors = [n];
            let divisor = 2;

            while (n >= 2) {
                if (n % divisor === 0) {
                    factors.push(divisor);
                    n = n / divisor;
                } else {
                    divisor++;
                }
            }

            return factors;
        },

        decimalToFraction(_decimal) {
            if (_decimal === parseInt(_decimal)) {
                return {
                    top: parseInt(_decimal),
                    bottom: 1,
                    display: parseInt(_decimal) + '/' + 1
                };
            }
            else {
                let top = _decimal.toString().includes(".") ? _decimal.toString().replace(/\d+[.]/, '') : 0;
                let bottom = Math.pow(10, top.toString().replace('-','').length);
                if (_decimal >= 1) {
                    top = +top + (Math.floor(_decimal) * bottom);
                }
                else if (_decimal <= -1) {
                    top = +top + (Math.ceil(_decimal) * bottom);
                }

                let x = Math.abs(this.gcd(top, bottom));
                return [(top / x), (bottom / x)]
            }
        },

        gcd(a, b) {
            return (b) ? this.gcd(b, a % b) : a;
        },

        update_melodic_dissonance(playedNote) {
            if(lastnote!=0) {
                if(lastnote<playedNote) {
                    this.meldiss = this.eulerGradus(lastnote/playedNote)
                } else {
                    this.meldiss = this.eulerGradus(playedNote/lastnote)
                }
            }
            lastnote = playedNote
        },

        update_harmonic_dissonance(){
            let tones = [];
            let cont = 0;
            for (let i = 0; i < keymouseon.length; i++) {
                if (keymouseon[i] === true || keyboardon[i] === true){
                    tones[cont] = this.notes[i];
                    cont++;
                }
            }
            this.harmdiss = this.setharesFormula(tones);
            //console.log(this.harmdiss);
        }
    },

    created() {

        for (let i=0; i<12; i++) {
            synth[i] = new Tone.Synth().toDestination();
            this.notes[i] = 440 * 2 ** (i / 12)
        }

        window.addEventListener("change", e => {
            if (e.target.type === 'vibrato') {
                return;
            }
            document.getElementById("volume-button").style.backgroundColor = document.getElementById('volume').value != 0 ? "#3cb371" : "#8b0000";

            vibrato.frequency.value = document.getElementById('vibrato-frequency').value;
            vibrato.depth.value = document.getElementById('vibrato-depth').value;

            tremolo.frequency.value = document.getElementById('tremolo-frequency').value;
            tremolo.depth.value = document.getElementById('tremolo-depth').value;

            distortion.distortion = document.getElementById('distortion').value;

            chorus.frequency.value = document.getElementById('c-frequency').value;
            chorus.delayTime = document.getElementById('c-delay-time').value;
            chorus.depth = document.getElementById('c-depth').value;

            reverb.roomSize.value = document.getElementById('reverb').value;
        });

        window.addEventListener("keydown", e => {
            if(e.target.type === 'number') {
                return;
            }

            const key = e.key.toLowerCase();
            const index = keyboard.indexOf(key);

            if (!isNaN(index) && (index+1) <= this.hexNumber*this.octaves && (isNaN(keyboardon[index])||keyboardon[index]===false)
                && keymouseon[index] !== true) {

                this.update_melodic_dissonance(this.notes[index])
                this.keyColorOnOff(index+1)

                keyboardon[index] = true
                this.played++
                ageofsynth[index] = this.played
                this.pauseOldOscillator()
                if (synth[index]===null) {
                    synth[index] = new this.$tone.Synth().toDestination();
                    if (effectsAddedList != []) {
                        for (let i = 0; i < effectsAddedList.length; i++) {
                            synth[index].chain(eval(effectsAddedList[i])).toDestination();
                        }
                    }
                }
                synth[index].triggerAttack(this.notes[index], this.$tone.now(), document.getElementById('volume').value);
                this.update_harmonic_dissonance();
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