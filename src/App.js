import XenBoard from './components/XenBoard.vue'
import P5 from "./components/P5/P5";

document.body.classList.toggle("ligh");
document.body.classList.toggle("bg-[#ffb30024]");


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.toggle("dark")
    document.body.classList.toggle("dark");
    document.body.classList.toggle("dark:bg-slate-900");
}

export default {
    name: 'App',
    components: {
        XenBoard,
        P5: P5
    },
    data() {
        return {
            darkOn: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
        };
    },

    methods: {
        darkModeSwitch() {
            document.documentElement.classList.toggle("dark");
            document.body.classList.toggle("dark");
            document.body.classList.toggle("dark:bg-slate-900");
            if(this.darkOn === false){
                this.darkOn = true;
            }
            else if(this.darkOn === true) {
                this.darkOn = false;
            }
        },
    },

    created() {

    }

}