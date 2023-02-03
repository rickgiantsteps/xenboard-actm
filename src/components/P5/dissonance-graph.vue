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

  let valueY = [(p.windowHeight / 2)+20];
  let numPts = [];

  p.setup = function () {

    let canvas = p.createCanvas(p.windowWidth / 4, (p.windowHeight / 2)+20);

    canvas.parent('sketch-holder-2');
    canvas.style("display", "block");

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth / 4, p.windowHeight / 2);
    }

  }




    p.draw = function () {

      p.background(220);


      numPts = p.p5notes.length/p.p5octaves;
      valueY=[(p.windowHeight / 2)+20]


      for (let i = 0; i < numPts-1; i++) {
        //makes values fit in range of the canvas
        // (https://stackoverflow.com/questions/11607228/how-can-i-make-an-array-of-integers-fit-within-a-range)
        valueY.push(((p.windowHeight / 2)+10)-((p.windowHeight / 2))*(gradusValues[i]-Math.min(...gradusValues))
                      /(Math.max(...gradusValues)-Math.min(...gradusValues)))
      }

      console.log(valueY)

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
        p.text(Math.max(...gradusValues), 5, 15)
      }


        p.strokeWeight(2);
      p.stroke(0);
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

  }
}

let dissonanceValues = []
let gradusValues = []
export default {
  name: "dissonance-graph",

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

    octaves: {
      type: Number
    },
  },

  data() {
    return {
    };
  },

  mounted() {
    setTimeout(()=> {
      this.mySketch = new this.$p5(sketch, this.$refs.canvasOutlet);
      this.mySketch.p5notes = this.freqs;
      this.mySketch.p5octaves = this.octaves;
    });
  },

  created() {
    for (let i = 1; i < this.hexNumber; i++) {
      dissonanceValues[i-1] = this.freqs[0] / this.freqs[i]
      gradusValues[i-1] = eulerGradus(dissonanceValues[i-1])
    }
  },

  watch: {

    //calcoli corretti ma il watch non segue cambiamenti nell'array freqs

    freqs: {
      handler() {
        this.mySketch.p5notes = this.freqs;
        console.log(this.mySketch.p5notes.length)
        console.log(this.freqs.length)
        for (let i = 1; i < this.hexNumber; i++) {
          dissonanceValues[i - 1] = this.freqs[0] / this.freqs[i]
          gradusValues[i - 1] = eulerGradus(dissonanceValues[i - 1])
        }
      },
      deep: true
    },

      octaves(newValue) {
        this.mySketch.p5octaves = newValue;
      }
  }

}
</script>

<style scoped>

</style>