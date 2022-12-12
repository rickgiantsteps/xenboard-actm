<template>
  <div ref="canvasOutlet"></div>
</template>

<script>

//calculate dissonance with Euler's gradus function E(n) = ∑ p|n e(p)(p−1)

const sketch = function(p) {

  p.setup = function () {

    let canvas = p.createCanvas(p.windowWidth / 4, p.windowHeight / 2);

    canvas.parent('sketch-holder-2');
    canvas.style("display", "block");

        p.windowResized = function () {
          p.resizeCanvas(p.windowWidth / 4, p.windowHeight / 2);
        }

    let valueY = [];
    let numPts = 12;
    //let numPts = hexNumber
    //console.log(this.hexNumber)
    let dissonanceValues = [];
    let gradus = [];

    for (let i in 12) {
      //dissonanceValues[i] = notes[0] / notes[1]
      gradus[i] = dissonanceValues[i]
    }


    for (let i = 0; i < numPts; i++) {
      valueY.push(p.random(100,300));
    }

    p.draw = function () {
      p.background(220);

      drawLines();
      drawEllipses();
    }

    function drawEllipses() {
      p.noStroke();
      // draw ellipses
      for (let i = 0; i < valueY.length; i++) {
        let x = i * (p.width / (numPts - 1));
        let y = valueY[i];
        p.ellipse(x, y, 7);
      }
    }

    function drawLines() {
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
}

export default {
  name: "dissonance-graph",

  mounted() {
    setTimeout(()=> {

      this.mySketch = new this.$p5(sketch, this.$refs.canvasOutlet);

    });
  },

  props: ["hexN"],

  data() {
    return {
    };
  },

  methods: {

    eulerGradus(decimalRatio) {

      let fraction = this.decimalToFraction(decimalRatio)
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
      const factors = [];
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

}
</script>

<style scoped>

</style>