<template>
  <div ref="canvasOutlet"></div>
</template>

<script>

//calculate dissonance with Euler's gradus function E(n) = ∑ p|n e(p)(p−1)

function eulerGradus(decimalRatio) {
  let fraction = decimalToFraction(decimalRatio.toFixed(6))
  let n = fraction[0]
  let d = fraction[1]
  let gradus = 1
  let count = 1

  for (let i in primeFactors(d*n)) {
    gradus += count*(i-1)
    count++
  }

  return gradus
}

function primeFactors(n) {
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
}

function decimalToFraction(_decimal) {
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

    let x = Math.abs(gcd(top, bottom));
    return [(top / x), (bottom / x)]
  }
}

function gcd(a, b) {
  return (b) ? gcd(b, a % b) : a;
}


const sketch = function(p) {

  let valueY = [];
  let numPts = [];

  p.setup = function () {

    let canvas = p.createCanvas(p.windowWidth / 4, (p.windowHeight / 2)+20);

    p.frameRate(10);

    canvas.parent('sketch-holder-2');
    canvas.style("display", "block");

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth / 4, p.windowHeight / 2);
    }

  }




    p.draw = function () {

      p.background(220);

      numPts = p.p5notes.length-1;
      valueY=[]

      for (let i = 0; i < numPts; i++) {
        //makes values fit in range of the canvas
        // (https://stackoverflow.com/questions/11607228/how-can-i-make-an-array-of-integers-fit-within-a-range)
        valueY.push(((p.windowHeight / 2)+10)-((p.windowHeight / 2))*(gradusValues[i]-Math.min(...gradusValues))
                      /(Math.max(...gradusValues)-Math.min(...gradusValues)))
      }

      p.noStroke();
      // draw ellipses
      for (let i = 0; i < valueY.length; i++) {
        let x = i * (p.width / (numPts - 1));
        let y = valueY[i];
        p.ellipse(x, y, 7);
      }


      p.strokeWeight(2);
      p.stroke(0);
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

  }
}

let dissonanceValues = []
let gradusValues = []
export default {
  name: "dissonance-graph",

  props: {
    freqs: {
      type: Array
    }
  },

  data() {
    return {
    };
  },

  mounted() {
    setTimeout(()=> {
      this.mySketch = new this.$p5(sketch, this.$refs.canvasOutlet);
      this.mySketch.p5notes = this.notefrequencies;
      this.mySketch.gradusval = gradusValues;
    });
  },

  created() {
    this.notefrequencies = this.freqs;
    for (let i = 1; i <= this.notefrequencies.length-1; i++) {
      dissonanceValues[i-1] = this.notefrequencies[0] / this.notefrequencies[i]
      gradusValues[i-1] = eulerGradus(dissonanceValues[i-1])
    }
    console.log(gradusValues)

  },

  watch: {

    freqs: {
      handler(newValue) {
        this.notefrequencies = newValue;
        this.mySketch.p5notes = this.notefrequencies;
        for (let i = 1; i <= this.notefrequencies.length-1; i++) {
          dissonanceValues[i-1] = this.notefrequencies[0] / this.notefrequencies[i]
          gradusValues[i-1] = eulerGradus(dissonanceValues[i-1])
        }
        this.mySketch.gradusval = gradusValues
      },
      deep: true
    },

  }

}
</script>

<style scoped>

</style>