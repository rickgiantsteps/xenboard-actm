<template>
  <header><h1>XenBoard</h1>
    <p>Microtonal keyboard test</p>
  </header>
  <input type="number" id="hexnum" name="hexnum"
         min="1" max="100" v-on:change="drawHex()">
  <div class="grid" id='hexgrid'>
    <div class="block">0</div>

  </div>

  <p>ACTM Project  -  a.a. 2022/2023</p>
</template>

<script>
export default {
  name: 'XenBoard',
  props: {
    msg: String,
  },

  methods: {
    drawHex() {
      document.getElementById('hexgrid').innerHTML = "";
      for (let i = 0; i < document.getElementById('hexnum').value; i++) {
        var hex = document.createElement("div");
        hex.classList.add("block");
        hex.id="block"+i;
        hex.innerHTML =i.toString();document.getElementById('hexgrid').appendChild(hex);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
