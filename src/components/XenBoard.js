import HexagonKey from './hex-key.vue'
import NotesPolygon from "./P5/notes-polygon.vue";
import * as Tone from 'tone'
import Tune from "./tune.js"
import DissonanceGraph from "./P5/dissonance-graph.vue";

let tune = new Tune();
tune.mode.output = "frequency";

let synth =  [new Array(12), new Array(12)]
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
let compressor = new Tone.Compressor(-30, 20);
compressor.connect(Tone.Destination);
let vibrato = new Tone.Vibrato(0,0).connect(compressor);
let tremolo = new Tone.Tremolo(0, 0).connect(compressor).start();
let distortion = new Tone.Distortion(0).connect(compressor);
let chorus = new Tone.Chorus(0,0,0).connect(compressor).start();
let reverb = new Tone.JCReverb(0).connect(compressor);
let waveform = ["triangle", "triangle"];
let lastVol = 0;
let mute = false;

let recorder = new Tone.Recorder();
Tone.Destination.connect(recorder);
let url;

let lastnote = 0;

export default {
    name: 'XenBoard',

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
            hystTune: "",
            isRecording: false,
            hasRecorded: false,
            keyOn: keyboardon,
            mouseOn: keymouseon,
            innerDarkOn: this.darkOn,
            avgdiss: 0,
            meldiss: 0,
            harmdiss: 0,
            muteOsc: [false, true],
            synthType: ["",""],
            partials: ["0","0"]
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
            for (let i = 0; i < synth[0].length; i++) {
                if (synth[0][i] !== null) {
                    synth[0][i].dispose()
                    synth[1][i].dispose()
                }
            }
            synth[0].length = this.hexNumber * this.octaves;
            synth[1].length = this.hexNumber * this.octaves;
            ageofsynth.length = this.hexNumber * this.octaves;
            ageofsynth.fill(0);
            this.played = 0;
            synth[0].fill(null)
            synth[1].fill(null)
        },

        playOscillator(n) {
            if ((keymouseon[n] === false || isNaN(keymouseon[n])) && keyboardon[n] !== true) {

                this.update_melodic_dissonance(this.notes[n]);

                keymouseon[n] = true
                this.played++
                ageofsynth[n] = this.played
                this.pauseOldOscillator()

                for (let k = 0; k < 2; k++) {
                    if (synth[k][n]===null) {
                        synth[k][n] = new this.$tone.Synth().connect(compressor);
                        if (effectsAddedList != []) {
                            for (let i = 0; i < effectsAddedList.length; i++) {
                                synth[k][n].chain(eval(effectsAddedList[i])).connect(compressor);
                            }
                        }
                    }

                    synth[k][n].oscillator.type = this.synthType[k]+waveform[k]+this.partials[k].replace('0','');
                    synth[k][n].triggerAttack(this.notes[n], this.$tone.now(),
                        document.getElementById('volume').value*!this.muteOsc[k]);
                }

                this.update_harmonic_dissonance();
          }
        },

        stopOscillator(n) {
            if (keymouseon[n] === true && keyboardon[n] !== true) {
                keymouseon[n] = false
                synth[0][n].triggerRelease(this.$tone.now());
                synth[1][n].triggerRelease(this.$tone.now());
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
                synth[0][num].triggerRelease(this.$tone.now());
                synth[1][num].triggerRelease(this.$tone.now());
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

        startRecording() {
            this.isRecording = !this.isRecording;
            recorder.start().then(()=> {
                console.log("Recording has started");
            });
        },

        async stopRecording() {
            this.hasRecorded = true;
            this.isRecording = !this.isRecording;
            const recording = await recorder.stop();
            console.log("Recording has stopped");
            url = URL.createObjectURL(recording);
            document.getElementById("audio").src = url;
        },

        downloadMp3() {
            const anchor = document.createElement("a");
            anchor.download = "recording.mp3";
            anchor.href = url;
            anchor.click();
        },

        changeWave(wavename, osc) {
            if(waveform[osc] !== wavename) {
                document.getElementById(waveform[osc]+osc).style.backgroundColor = "#71717a";
                document.getElementById(wavename+osc).style.backgroundColor = "#3cb371";
                waveform[osc] = wavename;
            }
        },

        volumeToggle() {
            mute = !mute;
            if (mute === true) {
                lastVol = document.getElementById("volume").value;
                document.getElementById("volume").value = 0;
                document.getElementById("volume-button").style.backgroundColor = "#71717a";
            } else {
                document.getElementById("volume").value = lastVol;
                document.getElementById("volume-button").style.backgroundColor = "#3cb371";
            }
        },

        effectToggle(effect) {
            this.addRemoveEffects(effect);
            document.getElementById(effect+"-button").style.backgroundColor = effectsAddedList.includes(effect) ? "#3cb371" : "#71717a";
            if (effect==="reverb") {
                for (let i=0; i<synth[0].length; i++) {
                    if (synth[0][i] != null) {
                        if (effectsAddedList.includes("reverb")) {
                            synth[0][i].chain(reverb).connect(compressor);
                            synth[1][i].chain(reverb).connect(compressor);
                        } else {
                            synth[0][i].disconnect(reverb);
                            synth[1][i].disconnect(reverb);
                        }
                    }
                }
            } else {
                this.muteEffect(eval(effect));
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
            for (let i=0; i<synth[0].length; i++) {
                if (synth[0][i] != null) {
                    if (effectsAddedList.includes((effect.toString()).toLowerCase())) {
                        synth[0][i].chain(effect).connect(compressor);
                        synth[1][i].chain(effect).connect(compressor);
                    } else {
                        synth[0][i].disconnect(effect);
                        synth[1][i].disconnect(effect);
                    }
                }
            }
        },

        muteSecondOsc() {
            this.muteOsc[1]=!this.muteOsc[1];
            if (this.muteOsc[1]) {
                document.getElementById("oscillator2").style.backgroundColor = "#71717a";
                return
            }
            document.getElementById("oscillator2").style.backgroundColor = "#3cb371";
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

        setharesFormula_helper(f11, f22){
            let f1 = Math.min(f11, f22);
            let f2 = Math.max(f11, f22);

            let b1 = 3.5;
            let b2 = 5.75;
            let s1 = 0.0207;
            let s2 = 18.96;
            let x = 0.24;
            //let x = Math.abs(f1 - f2) / Math.min((f1, f2));

            let s = x / ((s1 * f1) + s2);
            let z1 = Math.exp(-b1 * s * (f2 - f1));
            let z2 = Math.exp(-b2 * s * (f2 - f1));

            return z1 - z2;
        },

        setharesFormula(tones){
            let dissonance = 0;
            for (let a = 0; a < tones.length; a++) {
                for (let i = 1; i < tones.length; i++) {
                    dissonance = dissonance + this.setharesFormula_helper(tones[a], tones[i]);
                }
            }

            return dissonance;//0.5*dissonance;
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
            this.harmdiss = parseFloat(this.setharesFormula(tones).toFixed(6));
        }
    },

    created() {

        for (let i=0; i<12; i++) {
            synth[0][i] = new Tone.Synth().connect(compressor);
            synth[1][i] = new Tone.Synth().connect(compressor);
            this.notes[i] = 440 * 2 ** (i / 12)
        }

        window.addEventListener("change", e => {
            if (e.target.type === 'vibrato') {
                return;
            }

            mute = document.getElementById("volume").value === 0;
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

                for (let k = 0; k < 2; k++) {
                    if (synth[k][index]===null) {
                        synth[k][index] = new this.$tone.Synth().connect(compressor);
                        if (effectsAddedList != []) {
                            for (let i = 0; i < effectsAddedList.length; i++) {
                                synth[k][index].chain(eval(effectsAddedList[i])).connect(compressor);
                            }
                        }
                    }

                    synth[k][index].oscillator.type = this.synthType[k]+waveform[k]+this.partials[k].replace('0','');
                    synth[k][index].triggerAttack(this.notes[index], this.$tone.now(),
                        document.getElementById('volume').value*!this.muteOsc[k]);
                }

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
                synth[0][index].triggerRelease(this.$tone.now());
                synth[1][index].triggerRelease(this.$tone.now());
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
        NotesPolygon,
        DissonanceGraph
    },

    watch:{
        darkOn(newValue) {
            this.innerDarkOn = newValue;
        },
    }

}