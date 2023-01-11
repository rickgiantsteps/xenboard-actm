<template>

  <div class="justify-center flex flex-row content-center gap-x-10">
    <div id="sketch-holder">
      <P5 v-model:hexNumber="hexNumber"
          v-model:squareRoot="rootn"
          v-model:keyOn="keyOn"
          v-model:mouseOn="mouseOn"
          v-model:darkOn="innerDarkOn"/>
    </div>
    <div id="sketch-holder-2">
      <dissonance-graph v-model:hexNumber="hexNumber"/>
    </div>
  </div>


  <button @click="tune = !tune; this.hexNumber=0;">Toggle tunings creation</button>
  <div class="p-3" v-if="tune">
    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Main Tunings: </label>
    <select class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
        v-model.number = "hexNumber" v-on:change="this.rootn=2; createNotes()">
      <option style="text-align: center;" disabled value="">Please select one</option>
      <option style="text-align: center;" value="12">12EDO</option>
      <option style="text-align: center;" value="19">19EDO</option>
      <option style="text-align: center;" value="24">24EDO</option>
      <option style="text-align: center;" value="31">31EDO</option>
    </select>

    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Central frequency (Hz): </label>
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

  <div class="p-3" v-else>
    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Main Tunings: </label>
    <select class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
    v-model="hystTune" @change="createNotesFromTune()">
      <option style="text-align: center;" disabled value="">Please select one</option>
      <option style="text-align: center;" value="ji_12">Basic just intonation</option>
      <option style="text-align: center;" value="harm30">First 30 harm.s and subharm.s</option>
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
    </select>
    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Central frequency (Hz): </label>
    <input type="number" id="freqhz" name="freqhz" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "centerfreq" min="1" v-on:change="createNotesFromTune()"/>
    <label class="text-base px-0.5 pl-5 dark:text-slate-200">Number of octaves: </label>
    <input type="number" id="octnum" name="octnum" class="shadow shadow-neutral-900/50 dark:shadow-md dark:shadow-sky-400/50 rounded w-20 dark:bg-slate-200 dark:text-slate-900"
           v-model.number = "octaves" min="1" max="10" v-on:change="createNotesFromTune()"/>

  </div>

  <div class="grid" id='hexgrid'>
    <HexagonKey class="bg-[#ffd085] hover:bg-[#ffbe5b] active:bg-[#ffd700] dark:text-slate-50 dark:bg-slate-500
                dark:hover:bg-sky-700 dark:active:bg-sky-500 " @mousedown="playOscillator(n-1)" @mouseup="stopOscillator(n-1)"
                @mouseleave="stopOscillator(n-1)" v-bind:key="n" v-text="n-1" v-bind:id="n" v-for="n in hexNumber*octaves"/>
  </div>
</template>


<script src="./XenBoard.js"> </script>