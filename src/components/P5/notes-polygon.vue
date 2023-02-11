<template>
  <div ref="canvasOutlet"></div>
</template>

<script>

const sketch = function(p) {

  p.setup = function() {

    let canvas = p.createCanvas(p.windowWidth/4 + 200, p.windowHeight/2);

    canvas.parent('sketch-holder-3');
    canvas.style("display", "block");

    p.frameRate(30)

  }


  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth/4 + 200, p.windowHeight/2);
  }


  p.draw = function() {

    p.background('#fff4db');

    if(p.darkOnP5 === true){
      p.background('#0f172a');
    }

    // define the text size based on the window height
    let tSize = p.min(p.windowWidth, p.windowHeight) / 50;

    // Array for coordinate x
    let x_coordinate = [];

    // Array for coordinate y
    let y_coordinate = [];

    // Array nomi
    let noteName = [];

    p.textSize(tSize);
    p.fill('#001133');
    if(p.darkOnP5 === true){
      p.fill('white');
    }
    p.textAlign(p.CENTER, p.CENTER);

    p.translate(p.width / 2, p.height / 2);
    // let's draw the whole scale in a circle pattern
    for (let i = 0; i < scale.length; i++) {
      // calculate a position along a circle
      let angle = p.map(i, 0, scale.length, -p.PI / 2, p.TWO_PI - p.PI / 2);
      let radius = p.min(p.windowWidth, p.windowHeight) / 4.2;
      let x = Math.cos(angle) * radius;
      let y = Math.sin(angle) * radius;

      x_coordinate[i] = x / 1.2;
      y_coordinate[i] = y / 1.2;

      noteName[i] = scale[i].display.toString();

      p.text(noteName[i], x, y);

      if (i > 0 && p.darkOnP5 === true){
        p.push();
        p.fill('white');
        p.stroke('white');
        p.strokeWeight(2);
        p.line(x_coordinate[i-1], y_coordinate[i-1], x_coordinate[i], y_coordinate[i]);
        p.pop();
      }

      if (i > 0 && p.darkOnP5 === false){
        p.push();
        p.fill('#303c54')
        p.stroke('#303c54');
        p.strokeWeight(2);
        p.line(x_coordinate[i-1], y_coordinate[i-1], x_coordinate[i], y_coordinate[i]);
        p.pop();
      }

      if (i === scale.length-1 && p.darkOnP5 === true){
        p.push();
        p.fill('white');
        p.stroke('white');
        p.strokeWeight(2);
        p.line(x_coordinate[i], y_coordinate[i], x_coordinate[0], y_coordinate[0]);
        p.pop();
      }

      if (i === scale.length-1 && p.darkOnP5 === false){
        p.push();
        p.fill('#303c54');
        p.stroke('#303c54');
        p.strokeWeight(2);
        p.line(x_coordinate[i], y_coordinate[i], x_coordinate[0], y_coordinate[0]);
        p.pop();
      }
    }
    for (let ii = 0; ii < p.mouseOnP5.length; ii++){
      let octave_colors_On = ["#ffd700", "#ab76ab", "#bd1d00"];
      let octave_pos = Math.floor(ii / scale.length) % octave_colors_On.length;

      if (p.keyOnP5[ii] === true || p.mouseOnP5[ii] === true) {

        p.push(); // Start another new drawing state
        p.stroke(octave_colors_On[octave_pos]);
        if(p.darkOnP5 === true && octave_pos === 0){
          p.stroke("#0EA5E9");
        }
        p.strokeWeight(2);
        p.line(x_coordinate[ii-scale.length*Math.floor(ii / scale.length)], y_coordinate[ii-scale.length*Math.floor(ii / scale.length)], 0, 0);
        p.pop();

      }
    }
  }

}

let scale = []

export default {
  name: "NotesPolygon",

  props: {
    hexNumber: {
      type: Number,
      default: 12,
      required: true
    },
    squareRoot: {
      type: Number,
      default: 2,
      required: true
    },
    modelValue: {

    },
    keyOn:{
      type: Array,
    },
    mouseOn:{
      type: Array,
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
      this.mySketch.hexNumberP5 = this.hexNumber;
      this.mySketch.root = this.squareRoot;
      this.mySketch.keyOnP5 = this.keyOn;
      this.mySketch.mouseOnP5 = this.mouseOn;
      this.mySketch.darkOnP5 = this.darkOn;
    });
  },

  created() {
    this.updateFractions()
  },

  methods: {
    updateFractions() {
      scale = []
      for (let i = 0; i < this.hexNumber; i++) {
        scale[i] = this.decimalToFraction((this.squareRoot ** (i/this.hexNumber)).toFixed(2));
      }
    },

    gcd(a, b) {
      return (b) ? this.gcd(b, a % b) : a;
    },

    decimalToFraction(_decimal) {

      if (_decimal == 1){
        return {
          top		: 1,
          bottom	: 1,
          display	: 1 + ':' + 1
        };
      }  else {

        let top		= _decimal.toString().replace(/\d+[.]/, '');
        let bottom	= Math.pow(10, top.length);
        if (_decimal > 1) {
          top	= +top + Math.floor(_decimal) * bottom;
        }
        let x = this.gcd(top, bottom);
        return {
          top		: (top / x),
          bottom	: (bottom / x),
          display	: (top / x) + ':' + (bottom / x)
        };
      }
    }

  },

  watch:{

    hexNumber(newValue) {
      this.mySketch.hexNumberP5 = newValue;
      this.updateFractions()
    },

    squareRoot(sr) {
      this.mySketch.root = sr;
      this.updateFractions()
    },

    keyOn: {
      handler(newValue) {
        this.mySketch.keyOnP5 = newValue;
      },
      deep: true
    },

    mouseOn: {
      handler(newValue) {
        this.mySketch.mouseOnP5 = newValue;
      },
      deep: true
    },

    darkOn(newValue) {
      this.mySketch.darkOnP5 = newValue;
    },

  }

}

</script>