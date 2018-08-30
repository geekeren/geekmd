<template>
  <div id='app'>
    <markdown/>
  </div>
</template>

<script lang='ts'>
  import {Vue} from 'vue-property-decorator';
  import Component from 'vue-class-component';
  import markdown from './components/markdown.vue';

  @Component({
    components: {markdown},
  })
  export default class App extends Vue {

  }
</script>

<style lang='scss'>
  @import '~highlight.js/styles/github.css';

  #app {
    width: 100%;
    height: 100vh;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    overflow: hidden;
  }

  body {
    overflow: hidden;
    margin: 0px;
    padding: 0px;
  }
</style>
