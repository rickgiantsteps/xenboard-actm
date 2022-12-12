const sketch = function(p) {

    let scale = [];
    let keyOnP5 = [];
    let mouseOnP5 = [];
    let darkOnP5;

    //------------------------------------------------------------
    p.setup = function() {
        //let canvas_horizontal_offset = p.windowWidth;
        /*let canvas = p.createCanvas(p.windowWidth/1.25, 500);
        canvas.center();
        canvas.position(p.x, p.windowHeight/1.7);*/

        let canvas = p.createCanvas(p.windowWidth/4, p.windowHeight/2);
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
        p.resizeCanvas(p.windowWidth/4, p.windowHeight/2);
    }

    //------------------------------------------------------------
    p.draw = function() {

        scale = [];
        keyOnP5 = p.keyOnID;
        mouseOnP5 = p.mouseOnID;
        darkOnP5 = p.darkOnID;

        for (let i = 0; i < p.hexNumberID; i++) {
            scale[i] = (i+1) / p.hexNumberID;
            scale[i] = scale[i].toFixed(2);
        }

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

            x_coordinate[i] = x / 1.1;
            y_coordinate[i] = y / 1.1;

            let noteName = scale[i].toString();

            p.text(noteName, x, y);

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

            if (keyOnP5[i] === true || mouseOnP5[i] === true) {

                p.push(); // Start another new drawing state

                p.fill('#001133');
                if(darkOnP5 === true){
                    p.fill('white');
                }
                p.stroke('#001133');
                if(darkOnP5 === true){
                    p.stroke('white');
                }
                p.text(noteName, x, y);
                p.pop();

                p.push(); // Start another new drawing state
                p.stroke('#001133');
                if(darkOnP5 === true){
                    p.stroke('white');
                }
                p.strokeWeight(2);
                p.line(x_coordinate[i], y_coordinate[i], 0, 0);
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
            this.mySketch.keyOnID = this.testingKey;
            this.mySketch.mouseOnID = this.testingMouse;
            this.mySketch.darkOnID = this.testingDark;
        });
    },

    created() {
        this.testingVar = this.hexNumber;
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

