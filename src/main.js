import * as Vue from 'vue'
import App from './App.vue'
import "./assets/styles/styles.scss";
import * as Tone from 'tone'
import p5 from "p5";
import * as Tonal from 'tonal'

const app = Vue.createApp(App)
app.config.globalProperties.$tone = Tone;
app.config.globalProperties.$p5 = p5;
app.config.globalProperties.$tonal = Tonal;

app.mount('#app')