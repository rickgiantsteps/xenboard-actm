function gcd(a, b) {
    return (b) ? gcd(b, a % b) : a;
}

function decimalToFraction(_decimal) {

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
        let x = gcd(top, bottom);
        return {
            top		: (top / x),
            bottom	: (bottom / x),
            display	: (top / x) + ':' + (bottom / x)
        };
    }
}
const sketch = function(p) {

    let scale = [];
    let keyOnP5 = [];
    let mouseOnP5 = [];
    let darkOnP5;
    //let octave;

    //------------------------------------------------------------
    p.setup = function() {
        //let canvas_horizontal_offset = p.windowWidth;
        /*let canvas = p.createCanvas(p.windowWidth/1.25, 500);
        canvas.center();
        canvas.position(p.x, p.windowHeight/1.7);*/

        let canvas = p.createCanvas(p.windowWidth/4 + 200, p.windowHeight/2);
        //let canvas_horizontal_offset = (p.windowWidth - p.width) / 2;
        //let elem = document.getElementsByClassName("posSketch")[0];
        //canvas.position(canvas_horizontal_offset, elem.getBoundingClientRect().y + 90);


        //console.log(p.hexNumberID);

        canvas.parent('sketch-holder');
        canvas.style("display", "block");



        /*        p.createCanvas(p.windowWidth, p.windowHeight);

                scale = Tonal.Scale.get("C4 major").notes;

                /*for (let i = 0; i < scale.length; i++) {
                    randomColor[i] = "#" + ((1<<24)*Math.random() | 0).toString(16);
                }*/
        /*
                document.getElementById("ButtonTest").onclick = function(){
                    scale[scale.length] = Tonal.transpose(scale[scale.length-1], "2M");
                };

                document.getElementById("ButtonRandom").onclick = function (){
                    const rndInt = Math.floor(Math.random() * scale.length-1) + 1;
                    randomNote = scale[rndInt];
                }
        */
    }

    //------------------------------------------------------------
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth/4 + 200, p.windowHeight/2);
    }

    //------------------------------------------------------------
    p.draw = function() {

        scale = [];
        keyOnP5 = p.keyOnID;
        mouseOnP5 = p.mouseOnID;
        darkOnP5 = p.darkOnID;

        for (let i = 0; i < p.hexNumberID; i++) {
            scale[i] = decimalToFraction((p.root ** (i/p.hexNumberID)).toFixed(2));
        }

       // octave = keyOnP5.length / scale.length;

        p.background('#fff4db');

        if(darkOnP5 === true){
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
        if(darkOnP5 === true){
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

            if (i > 0 && darkOnP5 === true){
                p.push();
                p.fill('white');
                p.stroke('white');
                p.strokeWeight(2);
                p.line(x_coordinate[i-1], y_coordinate[i-1], x_coordinate[i], y_coordinate[i]);
                p.pop();
            }

            if (i > 0 && darkOnP5 === false){
                p.push();
                p.fill('#303c54')
                p.stroke('#303c54');
                p.strokeWeight(2);
                p.line(x_coordinate[i-1], y_coordinate[i-1], x_coordinate[i], y_coordinate[i]);
                p.pop();
            }

            if (i === scale.length-1 && darkOnP5 === true){
                p.push();
                p.fill('white');
                p.stroke('white');
                p.strokeWeight(2);
                p.line(x_coordinate[i], y_coordinate[i], x_coordinate[0], y_coordinate[0]);
                p.pop();
            }

            if (i === scale.length-1 && darkOnP5 === false){
                p.push();
                p.fill('#303c54');
                p.stroke('#303c54');
                p.strokeWeight(2);
                p.line(x_coordinate[i], y_coordinate[i], x_coordinate[0], y_coordinate[0]);
                p.pop();
            }
        }
        for (let ii = 0; ii < mouseOnP5.length; ii++){
            let octave_colors_On = ["#ffd700", "#ab76ab", "#bd1d00"];
            let octave_pos = Math.floor(ii / scale.length) % octave_colors_On.length;

            if (keyOnP5[ii] === true || mouseOnP5[ii] === true) {
                /*p.push(); // Start another new drawing state

                p.fill('#001133');
                if(darkOnP5 === true){
                    p.fill('white');
                }
                p.stroke('#001133');
                if(darkOnP5 === true){
                    p.stroke('white');
                }
                p.text(noteName[ii-scale.length*octave_pos], x_coordinate[ii-scale.length*octave_pos], y_coordinate[ii-scale.length*octave_pos]);
                p.pop();*/

                p.push(); // Start another new drawing state
                p.stroke(octave_colors_On[octave_pos]);
                if(darkOnP5 === true && octave_pos === 0){
                    p.stroke("#0EA5E9");
                }
                p.strokeWeight(2);
                p.line(x_coordinate[ii-scale.length*Math.floor(ii / scale.length)], y_coordinate[ii-scale.length*Math.floor(ii / scale.length)], 0, 0);
                p.pop();

            }
        }
    }

}

export default {
    name: "P5",

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
            this.mySketch.hexNumberID = this.testingVar;
            this.mySketch.root = this.rootValue;
            this.mySketch.keyOnID = this.testingKey;
            this.mySketch.mouseOnID = this.testingMouse;
            this.mySketch.darkOnID = this.testingDark;
        });
    },

    created() {
        this.testingVar = this.hexNumber;
        this.rootValue = this.squareRoot;
        this.testingKey = this.keyOn;
        this.testingMouse = this.mouseOn;
        this.testingDark = this.darkOn;
    },

    computed: {
        keysLength() {
            return this.keyOn.length;
        },
        mouseLength() {
            return this.mouseOn.length;
        }
    },

    watch:{

        hexNumber(newValue) {
            this.testingVar = newValue;
            this.mySketch.hexNumberID = this.testingVar;//this.hexNumberNew;
        },

        squareRoot(sr) {
            this.mySketch.root = sr;
        },

        keyOn: {
            handler(newValue) {
                this.testingKey = newValue;//newValue;
                this.mySketch.keyOnID = this.testingKey;

            },
            deep: true
        },

        mouseOn: {
            handler(newValue) {
                this.testingMouse = newValue;//newValue;
                this.mySketch.mouseOnID = this.testingMouse;

            },
            deep: true
        },

        darkOn(newValue) {
            this.testingDark = newValue;
            this.mySketch.darkOnID = this.testingDark;
        },

    }

}

