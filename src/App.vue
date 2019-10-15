<template>
  <div id='app'>
    <vue-drawer-layout
      ref="drawer"
      :drawer-width="300"
      :enable="false"
      :animatable="true"
      :z-index="0"
      :drawable-distance="Math.floor(200/3)"
      :content-drawable="true"
      :backdrop="true"
      :backdrop-opacity-range="[0,0.4]"
      @mask-click="handleToggleDrawer"
    >
      <div class="drawer" slot="drawer" style="height: 100vh">
        <div class="text">请登录</div>
      </div>
      <div class="drawer-content" slot="content">
        <header class="drawer-content-header">
          <span class='drawer-content-title menu_item'>极客MD编辑器</span>
        </header>
        <markdown/>
      </div>
    </vue-drawer-layout>
  </div>
</template>

<script>
import Vue from 'vue';
import { DrawerLayout } from 'vue-drawer-layout';

import Component from 'vue-class-component';

import markdown from './components/markdown.vue';

Vue.component(DrawerLayout.name, DrawerLayout);


  @Component({
    components: {
      markdown,
      'vue-drawer-layout': DrawerLayout,
    },
  })
export default class App extends Vue {
  handleToggleDrawer(toggled) {
    this.$refs.drawer.toggle();
  }
}
</script>

<style lang='scss'>
  @import '~highlight.js/styles/github.css';

  #app {
    width: 100%;
    height: 100vh;
    font-family: "SF Pro SC", "SF Pro Display", "SF Pro Icons",
    "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    overflow: hidden;
    .drawer-wrap {
      background: #ffffff;
      box-shadow: 2px 0 2px 2px white;
    }
    .drawer-mask {
      transition: opacify ease-in-out 0.5s;
    }
    .drawer-content {
      height: 100vh;
    }
    .drawer-content-header {
      padding: 10px 20px;
      position: absolute;
      top: 0;
      z-index: 10000;
    }
  }

  body {
    overflow: hidden;
    margin: 0px;
    padding: 0px;
  }
</style>
