<template>

  <div class="justify-center flex flex-row content-center gap-x-10">

    <div class="gap-x-0 grid-rows-3 w-36 p-0 -mr-16 pl-2">
      <div class="shadow shadow-amber-500 dark:shadow-indigo-500 click-button rec-button red-button text-base text-center"
           :class="{'bg-[#ffd085] dark:bg-slate-500 text-slate-700 dark:text-slate-200 red-button': !isRecording,
            'rec-on shadow-2xl shadow-red-900 dark:shadow-red-900 text-slate-200 top-20': isRecording}"
           v-on:click="!isRecording ?  startRecording() : stopRecording()">
        <img src="../assets/circle-button.png" alt="rec button" class="rec-button-content w-5 h-5"/>
        Toggle recording
      </div>
      <div class="bg-[#ffd085] dark:bg-slate-500 text-slate-700 dark:text-slate-200
        shadow shadow-amber-500 dark:shadow-indigo-500 click-button text-base text-center rec-button w-5"
             v-if="hasRecorded && !isRecording"
             v-on:click="hasRecorded ? downloadMp3() : ''">
          <img src="../assets/download.png" alt="download button" class="rec-button-content w-5 h-5"/>
          Download MP3
      </div>
      <div class="ml-2">
        <audio controls v-if="hasRecorded && !isRecording" id="audio" class="mt-2 mb-1 place-items-center w-36"></audio>
      </div>
      <div class="bg-[#ffd085] dark:bg-slate-500 text-slate-700 dark:text-slate-200
        shadow shadow-amber-500 dark:shadow-indigo-500 click-button rec-button place-items-center col-start-2"
           v-if="hasRecorded && !isRecording" v-on:click="hasRecorded = false">
        <img src="../assets/trash.png" alt="rec button" class="rec-button-content object-center w-5 h-5 mb-1"/>
      </div>
    </div>

    <div id="sketch-holder-3">
      <p class="underline text-lg pb-5 dark:text-slate-200">Notes Polygon</p>
      <NotesPolygon :hexNumber="hexNumber"
                    :squareRoot="rootn"
                    :keyOn="keyOn"
                    :mouseOn="mouseOn"
                    :darkOn="innerDarkOn"/>
    </div>

    <div id="sketch-holder-2">
      <p class="dark:text-slate-200">Scale dissonance values (Euler's Gradus Function)</p>
      <DissonanceGraph :freqs="notes" :darkOn="innerDarkOn" :hexNumber="hexNumber" @averagediss_change="averagediss_change($event)"/>
    </div>

    <div id="dissonance-boxes" class="grid-cols-2 place-content-center">
      <div id="average-temperament-dissonance flex-row">
        <p class="underline text-lg dark:text-slate-200">Scale Dissonance</p>
        <p class="dark:text-slate-200 pb-1">(Euler's Gradus Suavitatis)</p>
        <label class="text-sm dark:text-slate-200">Total:</label>
        <p class="text-xl pb-2 dark:text-slate-200">{{totaldiss}}</p>
        <label class="text-sm -pt-8 dark:text-slate-200">Average:</label>
        <p class="text-xl pb-6 dark:text-slate-200">{{avgdiss}}</p>
      </div>
      <div id="mel-dissonance">
        <p class="underline text-lg dark:text-slate-200">Melodic Dissonance</p>
        <p class="dark:text-slate-200">(Euler's Gradus Suavitatis)</p>
        <p class="text-xl pt-2 pb-6 dark:text-slate-200">{{meldiss}}</p>
      </div>
      <div id="harm-dissonance">
        <p class="underline text-lg dark:text-slate-200">Harmonic Dissonance</p>
        <p class="dark:text-slate-200">(Sethares' Algorithm)</p>
        <p class="text-xl pt-2 dark:text-slate-200">{{harmdiss}}</p>
      </div>
    </div>
  </div>

  <div class="pt-6 pb-2">
    <button class="click-button bg-white gap-x-10 w-44 shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded dark:bg-slate-200 dark:text-slate-900"
            @click="tune = !tune; this.hexNumber=0; textArea=''; hystTune=''">Toggle tuning mode</button>
  </div>

  <label class="text-base dark:text-slate-200 underline bold my-0.5" v-if="tune">Creation mode</label>
  <label class="text-base dark:text-slate-200 underline bold my-0.5" v-else>Exploration mode</label>

  <div class="p-3" v-if="tune">
    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Main tunings: </label>
    <select class="bg-white h-6 shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
        v-model.number = "hexNumber" v-on:change="this.rootn=2; createNotes()">
      <option style="text-align: center;" disabled value="">Please select one</option>
      <option style="text-align: center;" value="5">5EDO</option>
      <option style="text-align: center;" value="7">7EDO</option>
      <option style="text-align: center;" value="12">12EDO</option>
      <option style="text-align: center;" value="19">19EDO</option>
      <option style="text-align: center;" value="22">22EDO</option>
      <option style="text-align: center;" value="24">24EDO</option>
      <option style="text-align: center;" value="31">31EDO</option>
      <option style="text-align: center;" value="41">41EDO</option>
    </select>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Central freq. (Hz): </label>
    <input type="number" id="freqhz" name="freqhz" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "centerfreq" min="1" v-on:change="createNotes()"/>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Number of notes: </label>
    <input type="number" id="hexnum" name="hexnum" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "hexNumber" min="1" max="100" v-on:change="createNotes()"/>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Lower octaves: </label>
    <button class="click-button mr-0.5 bg-white shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-10 dark:bg-slate-200 dark:text-slate-900"
            v-on:click="this.low < 5 ? this.low += 1:'';createNotes()">+</button>
    <button class="click-button bg-white shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-10 dark:bg-slate-200 dark:text-slate-900"
            v-on:click="this.low > 0 ? this.low -= 1:'';createNotes()">-</button>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Higher octaves: </label>
    <button class="click-button mr-0.5 bg-white shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-10 dark:bg-slate-200 dark:text-slate-900"
            v-on:click="this.high < 4 ? this.high += 1:'';createNotes()">+</button>
    <button class="click-button bg-white shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-10 dark:bg-slate-200 dark:text-slate-900"
            v-on:click="this.high > 0 ? this.high -= 1:'';createNotes()">-</button>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Root: </label>
    <input type="number" id="root" name="root" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "rootn" min="2" max="5" v-on:change="createNotes()"/>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Polyphony: </label>
    <input type="number" id="root" name="root" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "poly" min="1" max="20" v-on:change="createOsc()"/>
  </div>

  <div class="p-3" v-else>
    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Main tunings: </label>
    <select class="h-6 bg-white shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
    v-model="hystTune" @change="createNotesFromTune(); textArea=''">
      <option style="text-align: center;" disabled value="">Select...</option>
      <option style="text-align: center;" value="ji_12">Basic just intonation</option>
      <option style="text-align: center;" value="pyth_31">31-tone Pythagorean</option>
      <option style="text-align: center;" value="ptolemy">Zarlino's scale</option>
      <option style="text-align: center;" value="couperin">Couperin meantone</option>
      <option style="text-align: center;" value="helmholtz_pure">Helmholtz</option>
      <option style="text-align: center;" value="partch_43">Partch's 43-tone pure</option>
      <option style="text-align: center;" value="johnston_81">Johnston's 81-note</option>
      <option style="text-align: center;" value="young-lm_piano">Young's well tempered</option>
      <option style="text-align: center;" value="xenakis_chrom">Byzantine Liturgical</option>
      <option style="text-align: center;" value="slendro">Javanese Slendro</option>
      <option style="text-align: center;" value="harrison_5">Harrison's pelog style pentatonic</option>
      <option style="text-align: center;" value="malkauns">Indian Raga Malkauns</option>
      <option style="text-align: center;" value="bohlen-eg">Bohlen-Pierce</option>
    </select>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Explore <a class="underline" href="http://abbernie.github.io/tune/scales.html"
    target="_blank" rel="noopener noreferrer">other tunings:</a></label>
    <input type="text" id="txttune" name="txtune" class="shadow shadow-neutral-900/50 ml-1 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
            v-model="textArea" v-on:input="searchForTune()" v-on:click="hexNumber=0"/>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Central frequency (Hz): </label>
    <input type="number" id="freqhz" name="freqhz" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "centerfreq" min="1" v-on:change="createNotesFromTune()"/>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Lower octaves: </label>
    <button class="click-button mr-0.5 bg-white shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-10 dark:bg-slate-200 dark:text-slate-900"
            v-on:click="this.low < 5 ? this.low += 1:'';createNotesFromTune()">+</button>
    <button class="click-button bg-white shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-10 dark:bg-slate-200 dark:text-slate-900"
            v-on:click="this.low > 0 ? this.low -= 1:'';createNotesFromTune()">-</button>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Higher octaves: </label>
    <button class="click-button mr-0.5 bg-white shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-10 dark:bg-slate-200 dark:text-slate-900"
            v-on:click="this.high < 4 ? this.high += 1:'';createNotesFromTune()">+</button>
    <button class="click-button bg-white shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-10 dark:bg-slate-200 dark:text-slate-900"
            v-on:click="this.high > 0 ? this.high -= 1:'';createNotesFromTune()">-</button>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Polyphony: </label>
    <input type="number" id="root" name="root" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "poly" min="1" max="20" v-on:change="createOsc()"/>

    <div class="list-container">
      <div type="button" v-for="t in list" :key="t" class="click-button shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded
                                                bg-[#ffd085] hover:bg-[#ffbe5b] active:bg-[#ffd700] dark:text-slate-50 dark:bg-slate-500
                                                dark:hover:bg-sky-700 dark:active:bg-sky-500 button-81 mt-6 mr-3"
           v-on:click="this.hystTune = t; createNotesFromTune();this.list = []; textArea = this.hystTune"
           :title="displayDescription(t)"> {{t}} </div>
    </div>
  </div>

  <div class="grid" id='hexgrid'>
    <HexagonKey class="bg-[#ffd085] hover:bg-[#ffbe5b] active:bg-[#ffd700] dark:text-slate-50 dark:bg-slate-500
                dark:hover:bg-sky-700 dark:active:bg-sky-500 " @mousedown="playOscillator(n-1)" @mouseup="stopOscillator(n-1)"
                @mouseleave="stopOscillator(n-1)" v-bind:key="n" v-text="n-1" v-bind:id="n" v-for="n in hexNumber*octaves"/>
  </div>

  <div class="wrapper">

    <div class="effects-board">
      <div class="effects-choice-container bg-[#ffd085] dark:bg-slate-600 shadow shadow-amber-500 dark:shadow-indigo-500">
        <label class="text-3xl dark:text-slate-200">Synth</label>

        <section class="synth-type flex-1">

          <div class="synth-selections shadow shadow-amber-500 dark:shadow-indigo-400">
            <button type="button" class="button-81 shadow shadow-amber-500 dark:shadow-indigo-400" disabled>OSC 1</button>
            <div class="synth-slider-container dark:text-white" v-bind:class="{'synth-slider-container2': synthType[0]==='am'|| synthType[0]==='fat', 'synth-slider-container3': synthType[0]==='fm'}">
              <section>
                <form>
                  <button type="button" class="button-81" name="triangle0" id="triangle0" @mousedown="changeWave('triangle', 0)">Triangle</button>
                  <button type="button" class="button-80" name="sine0" id="sine0" @mousedown="changeWave('sine', 0)">Sine</button>
                  <button type="button" class="button-80" name="square0" id="square0" @mousedown="changeWave('square', 0)">Square</button>
                  <button type="button" class="button-80" name="sawtooth0" id="sawtooth0" @mousedown="changeWave('sawtooth', 0)">Saw</button>
                </form>
              </section>
              <section>
                <form>
                  <input v-model="synthType[0]" type="radio" name="foo" class="mt-3 shadow shadow-amber-500 dark:shadow-indigo-400" v-bind:value="''" checked/> <label class="text-slate-700 dark:text-slate-200">Normal</label>
                  <input v-model="synthType[0]" type="radio" name="foo" class="mt-1 shadow shadow-amber-500 dark:shadow-indigo-400" v-bind:value="'am'"/> <label class="text-slate-700 dark:text-slate-200">AM</label>
                  <input v-model="synthType[0]" type="radio" name="foo" class="mt-1 shadow shadow-amber-500 dark:shadow-indigo-400" v-bind:value="'fm'"/> <label class="text-slate-700 dark:text-slate-200">FM</label>
                  <input v-model="synthType[0]" type="radio" name="foo" class="mt-1 shadow shadow-amber-500 dark:shadow-indigo-400" v-bind:value="'fat'"/> <label class="text-slate-700 dark:text-slate-200">Fat</label>
                </form>
              </section>
              <section>
                <input type="range"
                       v-model="partials[0]"
                       min="0"
                       max="20"
                       step="1"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="partials1">
                <label class="text-base text-slate-700 dark:text-slate-200">Partials</label>
                <p id="valuePar1" class="text-base text-slate-700 dark:text-slate-200" v-if="partials[0]==='0'">ALL</p>
                <p id="valuePartial1" class="text-base text-slate-700 dark:text-slate-200" v-else>{{ partials[0] }}</p>
              </section>
              <section v-if="synthType[0]==='am'">
                <input type="range"
                       v-model="harmonicity[0]"
                       min="0"
                       max="5"
                       step="0.5"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="am1">
                <label class="text-base text-slate-700 dark:text-slate-200">Harm</label>
                <p id="valueam1" class="text-base text-slate-700 dark:text-slate-200">{{ harmonicity[0] }}</p>
              </section>
              <section v-if="synthType[0]==='fm'">
                <input type="range"
                       v-model="harmonicity[0]"
                       min="0"
                       max="5"
                       step="0.5"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="fmh1">
                <label class="text-base text-slate-700 dark:text-slate-200">Harm</label>
                <p id="valuefmh1" class="text-base text-slate-700 dark:text-slate-200">{{ harmonicity[0] }}</p>
              </section>
              <section v-if="synthType[0]==='fm'">
                <input type="range"
                       v-model="modulationIndex[0]"
                       min="0"
                       max="5"
                       step="0.5"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="fmi1">
                <label class="text-base text-slate-700 dark:text-slate-200">Mod</label>
                <p id="valuefmi1" class="text-base text-slate-700 dark:text-slate-200">{{ modulationIndex[0] }}</p>
              </section>
              <section v-if="synthType[0]==='fat'">
                <input type="range"
                       v-model="fatcount[0]"
                       min="1"
                       max="5"
                       step="1"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="fat1">
                <label class="text-base text-slate-700 dark:text-slate-200">Count</label>
                <p id="valuefat1" class="text-base text-slate-700 dark:text-slate-200">{{ fatcount[0] }}</p>
              </section>
              <section>
                <input type="range"
                       v-model="attack[0]"
                       min="0"
                       max="20"
                       step="0.05"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="att1">
                <p class="text-base text-slate-700 dark:text-slate-200">A</p>
                <p id="valueatt1" class="text-base text-slate-700 dark:text-slate-200">{{ attack[0] }}</p>
              </section>
              <section>
                <input type="range"
                       v-model="decay[0]"
                       min="0"
                       max="20"
                       step="0.1"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="dec1">
                <p class="text-base text-slate-700 dark:text-slate-200">D</p>
                <p id="valuedec1" class="text-base text-slate-700 dark:text-slate-200">{{ decay[0] }}</p>
              </section>
              <section>
                <input type="range"
                       v-model="sustain[0]"
                       min="0"
                       max="1"
                       step="0.1"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="sus1">
                <p class="text-base text-slate-700 dark:text-slate-200">S</p>
                <p id="valuesus1" class="text-base text-slate-700 dark:text-slate-200">{{ sustain[0] }}</p>
              </section>
              <section>
                <input type="range"
                       v-model="release[0]"
                       min="0"
                       max="20"
                       step="0.1"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="rel1">
                <p class="text-base text-slate-700 dark:text-slate-200">R</p>
                <p id="valuerel1" class="text-base text-slate-700 dark:text-slate-200">{{ release[0] }}</p>
              </section>
            </div>
          </div>

          <div class="synth-selections shadow shadow-amber-500 dark:shadow-indigo-400">
            <button type="button" class="button-81 shadow shadow-amber-500 dark:shadow-indigo-400 bg-[#71717a] dark:bg-[#71717a]" id="oscillator2"
                    @mousedown="muteSecondOsc();">OSC 2</button>
            <div class="synth-slider-container dark:text-white" v-bind:class="{'synth-slider-container2': synthType[1]==='am'|| synthType[1]==='fat', 'synth-slider-container3': synthType[1]==='fm'}">
              <section>
                <form>
                  <button type="button" class="button-81" name="triangle1" id="triangle1" @mousedown="changeWave('triangle', 1)">Triangle</button>
                  <button type="button" class="button-80" name="sine1" id="sine1" @mousedown="changeWave('sine', 1)">Sine</button>
                  <button type="button" class="button-80" name="square1" id="square1" @mousedown="changeWave('square', 1)">Square</button>
                  <button type="button" class="button-80" name="sawtooth1" id="sawtooth1" @mousedown="changeWave('sawtooth', 1)">Saw</button>
                </form>
              </section>
              <section>
                <form>
                  <input v-model="synthType[1]" type="radio" name="foo" class="mt-3 shadow shadow-amber-500 dark:shadow-indigo-400" v-bind:value="''" checked/> <label class="text-slate-700 dark:text-slate-200">Normal</label>
                  <input v-model="synthType[1]" type="radio" name="foo" class="mt-1 shadow shadow-amber-500 dark:shadow-indigo-400" v-bind:value="'am'"/> <label class="text-slate-700 dark:text-slate-200">AM</label>
                  <input v-model="synthType[1]" type="radio" name="foo" class="mt-1 shadow shadow-amber-500 dark:shadow-indigo-400" v-bind:value="'fm'"/> <label class="text-slate-700 dark:text-slate-200">FM</label>
                  <input v-model="synthType[1]" type="radio" name="foo" class="mt-1 shadow shadow-amber-500 dark:shadow-indigo-400" v-bind:value="'fat'"/> <label class="text-slate-700 dark:text-slate-200">Fat</label>
                </form>
              </section>
              <section>
                <input type="range"
                       v-model="partials[1]"
                       min="0"
                       max="20"
                       step="1"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="partials2">
                <label class="text-base text-slate-700 dark:text-slate-200">Partials</label>
                <p id="valuePar2" class="text-base text-slate-700 dark:text-slate-200" v-if="partials[1]==='0'">ALL</p>
                <p id="valuePartial2" class="text-base text-slate-700 dark:text-slate-200" v-else>{{ partials[1] }}</p>
              </section>
              <section v-if="synthType[1]==='am'">
                <input type="range"
                       v-model="harmonicity[1]"
                       min="0"
                       max="5"
                       step="0.5"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="am2">
                <label class="text-base text-slate-700 dark:text-slate-200">Harm</label>
                <p id="valueam2" class="text-base text-slate-700 dark:text-slate-200">{{ harmonicity[1] }}</p>
              </section>
              <section v-if="synthType[1]==='fm'">
                <input type="range"
                       v-model="harmonicity[1]"
                       min="0"
                       max="5"
                       step="0.5"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="fmh2">
                <label class="text-base text-slate-700 dark:text-slate-200">Harm</label>
                <p id="valuefmh2" class="text-base text-slate-700 dark:text-slate-200">{{ harmonicity[1] }}</p>
              </section>
              <section v-if="synthType[1]==='fm'">
                <input type="range"
                       v-model="modulationIndex[1]"
                       min="0"
                       max="5"
                       step="0.5"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="fmi2">
                <label class="text-base text-slate-700 dark:text-slate-200">Mod</label>
                <p id="valuefmi2" class="text-base text-slate-700 dark:text-slate-200">{{ modulationIndex[1] }}</p>
              </section>
              <section v-if="synthType[1]==='fat'">
                <input type="range"
                       v-model="fatcount[1]"
                       min="1"
                       max="5"
                       step="1"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="fat2">
                <label class="text-base text-slate-700 dark:text-slate-200">Count</label>
                <p id="valuefat2" class="text-base text-slate-700 dark:text-slate-200">{{ fatcount[1] }}</p>
              </section>
              <section>
                <input type="range"
                       v-model="attack[1]"
                       min="0"
                       max="20"
                       step="0.05"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="att2">
                <p class="text-base text-slate-700 dark:text-slate-200">A</p>
                <p id="valueatt2" class="text-base text-slate-700 dark:text-slate-200">{{ attack[1] }}</p>
              </section>
              <section>
                <input type="range"
                       v-model="decay[1]"
                       min="0"
                       max="20"
                       step="0.1"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="dec2">
                <p class="text-base text-slate-700 dark:text-slate-200">D</p>
                <p id="valuedec2" class="text-base text-slate-700 dark:text-slate-200">{{ decay[1] }}</p>
              </section>
              <section>
                <input type="range"
                       v-model="sustain[1]"
                       min="0"
                       max="1"
                       step="0.1"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="sus2">
                <p class="text-base text-slate-700 dark:text-slate-200">S</p>
                <p id="valuesus2" class="text-base text-slate-700 dark:text-slate-200">{{ sustain[1] }}</p>
              </section>
              <section>
                <input type="range"
                       v-model="release[1]"
                       min="0"
                       max="20"
                       step="0.1"
                       class="input2 w-10 mt-14 shadow shadow-amber-500 dark:shadow-indigo-400"
                       id="rel2">
                <p class="text-base text-slate-700 dark:text-slate-200">R</p>
                <p id="valuerel2" class="text-base text-slate-700 dark:text-slate-200">{{ release[1] }}</p>
              </section>
            </div>
            <section>
            </section>
          </div>
        </section>
      </div>
    </div>

    <div class="effects-board">
      <div class="effects-choice-container bg-[#ffd085] dark:bg-slate-600 shadow shadow-amber-500 dark:shadow-indigo-500">
        <label class="text-3xl dark:text-slate-200">Effects</label>

        <section class="effect-type">
          <div class="effect-selections shadow shadow-amber-500 dark:shadow-indigo-400">
            <button type="button" class="button-81 shadow shadow-amber-500 dark:shadow-indigo-400" id="volume-button" @mousedown="volumeToggle()">Volume</button>
            <div class="volume-slider-container">
              <section>
                <input type="range"
                       min="0"
                       max="1"
                       value="0.5"
                       step=".01"
                       class="input"
                       id="volume"
                       oninput="rangeValueVolume.innerText = this.value">
                <label class="text-base text-slate-700 dark:text-slate-200">Volume</label>
                <p id="rangeValueVolume" class="text-base text-slate-700 dark:text-slate-200">0.5</p>
              </section>
            </div>
          </div>

          <div class="effect-selections shadow shadow-amber-500 dark:shadow-indigo-400"
               id="Vibrato">
            <button type="button" class="button-80 shadow shadow-amber-500 dark:shadow-indigo-400" id="vibrato-button" @mousedown="effectToggle('vibrato')">Vibrato</button>
            <div class="vibrato-slider-container">
              <section>
                <input type="range"
                       min="0"
                       max="5"
                       value="0"
                       step=".5"
                       class="input"
                       id="vibrato-frequency"
                       oninput="rangeValueVibFreq.innerText = this.value">
                <label class="text-base text-slate-700 dark:text-slate-200">Frequency</label>
                <p id="rangeValueVibFreq" class="text-base text-slate-700 dark:text-slate-200">0</p>
              </section>
              <section>
                <input type="range"
                       min="0"
                       max="1"
                       value="0"
                       step="0.2"
                       class="input"
                       id="vibrato-depth"
                       oninput="rangeValueVibDepth.innerText = this.value">
                <label class="text-base text-slate-700 dark:text-slate-200">Depth</label>
                <p id="rangeValueVibDepth" class="text-base text-slate-700 dark:text-slate-200">0</p>
              </section>
            </div>
          </div>

          <div class="effect-selections shadow shadow-amber-500 dark:shadow-indigo-400" id="Tremolo">
            <button type="button" class="button-80 shadow shadow-amber-500 dark:shadow-indigo-400" id="tremolo-button" @mousedown="effectToggle('tremolo')">Tremolo</button>
            <div class="tremolo-slider-container">
              <section class="two-sliders">
                <input type="range"
                       min="0"
                       max="50"
                       value="0"
                       step=".1"
                       class="input"
                       id="tremolo-frequency"
                       oninput="rangeValueTremFreq.innerText = this.value">
                <label class="text-base text-slate-700 dark:text-slate-200">Frequency</label>
                <p id="rangeValueTremFreq" class="text-base text-slate-700 dark:text-slate-200">0</p>
              </section>
              <section class="two-sliders">
                <input type="range"
                       min="0"
                       max="1"
                       value="0"
                       step="0.2"
                       class="input"
                       id="tremolo-depth"
                       oninput="rangeValueTremDepth.innerText = this.value">
                <label class="text-base text-slate-700 dark:text-slate-200">Depth</label>
                <p id="rangeValueTremDepth" class="text-base text-slate-700 dark:text-slate-200">0</p>
              </section>
            </div>
          </div>

          <div class="effect-selections shadow shadow-amber-500 dark:shadow-indigo-400"
               id="Distortion">
            <button type="button" class="button-80 shadow shadow-amber-500 dark:shadow-indigo-400" id="distortion-button" @mousedown="effectToggle('distortion')">Distortion</button>
            <div class="distortion-slider-container">
              <section>
                <input type="range"
                       min="0"
                       max="1"
                       value="0"
                       step=".1"
                       class="input"
                       id="distortion"
                       oninput="rangeValueDistortion.innerText = this.value">
                <label class="text-base text-slate-700 dark:text-slate-200">Distortion</label>
                <p id="rangeValueDistortion" class="text-base text-slate-700 dark:text-slate-200">0</p>
              </section>
            </div>
          </div>

          <div class="effect-selections shadow shadow-amber-500 dark:shadow-indigo-400" id="Chorus">
            <button type="button" class="button-80 shadow shadow-amber-500 dark:shadow-indigo-400" id="chorus-button" @mousedown="effectToggle('chorus')">Chorus</button>
            <div class="chorus-slider-container">
              <section>
                <input type="range"
                       min="0"
                       max="20"
                       value="0"
                       step="0.1"
                       class="input"
                       id="c-frequency"
                       oninput="rangeValueCFreq.innerText = this.value">
                <label class="text-base text-slate-700 dark:text-slate-200">Frequency</label>
                <p id="rangeValueCFreq" class="text-base text-slate-700 dark:text-slate-200">0</p>
              </section>
              <section>
                <input type="range"
                       min="0"
                       max="5"
                       value="0"
                       step="0.1"
                       class="input"
                       id="c-delay-time"
                       oninput="rangeValueCDelay.innerText = this.value">
                <label class="text-base text-slate-700 dark:text-slate-200">Delay</label>
                <p id="rangeValueCDelay" class="text-base text-slate-700 dark:text-slate-200">0</p>
              </section>
              <section>
                <input type="range"
                       min="0"
                       max="1"
                       value="0"
                       step="0.1"
                       class="input"
                       id="c-depth"
                       oninput="rangeValueCDepth.innerText = this.value">
                <label class="text-base text-slate-700 dark:text-slate-200">Depth</label>
                <p id="rangeValueCDepth" class="text-base text-slate-700 dark:text-slate-200">0</p>
              </section>
            </div>
          </div>

          <div class="effect-selections shadow shadow-amber-500 dark:shadow-indigo-400" id="Reverb">
            <button type="button" class="button-80 shadow shadow-amber-500 dark:shadow-indigo-400" id="reverb-button" @mousedown="effectToggle('reverb')">Reverb</button>
            <div class="distortion-slider-container">
              <section>
                <input type="range"
                       min="0"
                       max="0.9"
                       value="0"
                       step=".1"
                       class="input"
                       id="reverb"
                       oninput="rangeValueReverb.innerText = this.value">
                <label class="text-base text-slate-700 dark:text-slate-200">Reverb</label>
                <p id="rangeValueReverb" class="text-base text-slate-700 dark:text-slate-200">0</p>
              </section>
            </div>
          </div>

        </section>
      </div>
    </div>
  </div>

</template>


<script src="./XenBoard.js"> </script>