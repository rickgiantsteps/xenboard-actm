<template>
  <div ref="canvasOutlet"></div>
</template>

<script>

const sketch = function(p) {

  let valueY = [(p.windowHeight / 2)+20];
  let numPts;
  let darkOnP5;

  p.setup = function () {

    let canvas = p.createCanvas(p.windowWidth / 4, (p.windowHeight / 2)+20);

    canvas.parent('sketch-holder-2');
    canvas.style("display", "block");

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth / 4, (p.windowHeight / 2)+20);
    }

  }


    p.draw = function () {

      darkOnP5 = p.darkOnID;

      p.background('#fff4db');

      if(darkOnP5 === true){
        p.background('#0f172a');
      }

      numPts = p.p5numbernotes;
      valueY=[(p.windowHeight / 2)+20]

      for (let i = 0; i < numPts-1; i++) {
        //makes values fit in range of the canvas
        // (https://stackoverflow.com/questions/11607228/how-can-i-make-an-array-of-integers-fit-within-a-range)
        valueY.push(((p.windowHeight / 2)+10)-((p.windowHeight / 2))*(gradusValues[i]-Math.min(...gradusValues))
                      /(Math.max(...gradusValues)-Math.min(...gradusValues)))
      }


      p.noStroke();
      // draw ellipses
      for (let i = 0; i < valueY.length; i++) {
        p.text(i)
        let x = i * (p.width / (numPts - 1));
        let y = valueY[i];
        p.ellipse(x, y, 7);
      }

      for (let i = 0; i < valueY.length; i++) {
        //x axis text
        //if (i+1===1 || (i+1)%5===0 || (i+1)===valueY.length) {
        if (i + 1 === 1 || (i + 1) % 5 === 0) {
          p.text(i + 1, (((p.windowWidth / 4) / valueY.length) * i) + 5, p.windowHeight / 2 + 15)
        }

        //y axis text
        if(darkOnP5 === true){
          p.fill('white');
        }
        if(darkOnP5 !== true){
          p.fill('#001133');
        }
        p.text(isNaN(parseInt(Math.max(...gradusValues))) ? 0 : parseInt(Math.max(...gradusValues)), 5, 15)
      }


        p.strokeWeight(2);
      if(darkOnP5 === true){
        p.stroke('white');
      }
      if(darkOnP5 !== true){
        p.stroke('#001133');
      }
      p.textStyle("NORMAL");
      // draw lines
      let px = 0;
      let py = valueY[0];
      for (let i = 0; i < valueY.length; i++) {

        let x = i * (p.width / (numPts - 1));
        let y = valueY[i];

        p.curve(px, py, px, py, x, y, x, y);

        px = x;
        py = y;
      }

      let height_Canvas = (p.windowHeight / 2)+20

      p.push();
      p.strokeWeight(2);
      if(darkOnP5 === true){
        p.stroke('white');
      }
      if(darkOnP5 !== true){
        p.stroke('#001133');
      }
      p.line(1, 1, p.windowWidth / 4, 1);
      p.strokeWeight(2);
      if(darkOnP5 === true){
        p.stroke('white');
      }
      if(darkOnP5 !== true){
        p.stroke('#001133');
      }
      p.line(1, 1, 1, height_Canvas);
      p.strokeWeight(4);
      if(darkOnP5 === true){
        p.stroke('white');
      }
      if(darkOnP5 !== true){
        p.stroke('#001133');
      }
      p.line(p.windowWidth / 4, height_Canvas, (p.windowWidth / 4), 1);
      p.strokeWeight(5);
      if(darkOnP5 === true){
        p.stroke('white');
      }
      if(darkOnP5 !== true){
        p.stroke('#001133');
      }
      p.line(1, height_Canvas, (p.windowWidth / 4), height_Canvas);
      p.pop();

  }
}

let averagediss = 0
let dissonanceValues = []
let gradusValues = []
export default {
  name: "DissonanceGraph",

  props: {

    freqs: {
      type: Array,
      required: true
    },

    hexNumber: {
      type: Number,
      default: 12,
      required: true
    },

    darkOn:{
      type: Boolean,
    }
  },

  data() {
    return {
    };
  },

  mounted() {
    setTimeout(()=> {
      this.mySketch = new this.$p5(sketch, this.$refs.canvasOutlet);
      this.mySketch.p5numbernotes = this.hexNumber;
      this.mySketch.darkOnID = this.testingDark;
    });
  },

  created() {
    for (let i = 1; i < this.hexNumber; i++) {
      dissonanceValues[i-1] = this.freqs[0] / this.freqs[i]
      gradusValues[i-1] = this.eulerGradus(dissonanceValues[i-1])
    }
    averagediss = gradusValues.reduce((partialSum, a) => partialSum + a, 0)/(this.hexNumber-1)
    this.$emit("averagediss_change", parseFloat(averagediss.toFixed(6)))
    this.testingDark = this.darkOn;
  },

  methods: {
    //calculates dissonance with Euler's gradus function E(n) = ∑ p|n e(p)(p−1)
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
    }

  },

  watch: {

    freqs: {
      handler() {
        this.mySketch.p5notes = this.freqs;
        gradusValues = []
        for (let i = 1; i < this.hexNumber; i++) {
          dissonanceValues[i - 1] = this.freqs[0] / this.freqs[i]
          gradusValues[i - 1] = this.eulerGradus(dissonanceValues[i - 1])
        }

        if (this.hexNumber!=1) {
          averagediss = gradusValues.reduce((partialSum, a) => partialSum + a, 0)/(this.hexNumber-1)
        } else {
          averagediss = gradusValues.reduce((partialSum, a) => partialSum + a, 0)/(this.hexNumber)
        }
        this.$emit("averagediss_change", parseFloat(averagediss.toFixed(6)))
      },
      deep: true
    },

    hexNumber(newValue) {
      this.mySketch.p5numbernotes = newValue;
      this.mySketch.p5notes = this.freqs;
      gradusValues = []
      for (let i = 1; i < this.hexNumber; i++) {
        dissonanceValues[i - 1] = this.freqs[0] / this.freqs[i]
        gradusValues[i - 1] = this.eulerGradus(dissonanceValues[i - 1])
      }

      if (this.hexNumber!=1) {
        averagediss = gradusValues.reduce((partialSum, a) => partialSum + a, 0)/(this.hexNumber-1)
      } else {
        averagediss = gradusValues.reduce((partialSum, a) => partialSum + a, 0)/(this.hexNumber)
      }
      this.$emit("averagediss_change", parseFloat(averagediss.toFixed(6)))
    },

    darkOn(newValue) {
      this.testingDark = newValue;
      this.mySketch.darkOnID = this.testingDark;
    },
  }
}
</script>

<style scoped>

</style>