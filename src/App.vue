<template>
  <div id="app">
    <div
      v-if="drawerOpen"
      class="drawer-mask"
      @click="handleToggleDrawer"
    ></div>
    <aside
      class="drawer"
      :class="{ open: drawerOpen }"
    >
      <sidebar />
    </aside>
    <main class="drawer-content">
      <header class="drawer-content-header" @click="handleToggleDrawer">
        <span class="drawer-content-title menu_item">极客MD编辑器</span>
      </header>
      <markdown />
    </main>
  </div>
</template>

<script>
import markdown from './components/markdown.vue';
import sidebar from './components/sidebar/index.vue';

export default {
  components: {
    markdown,
    sidebar,
  },
  data() {
    return {
      drawerOpen: false,
    };
  },
  methods: {
    handleToggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
  },
};
</script>

<style lang='scss'>
  @import 'highlight.js/styles/github.css';

  #app {
    width: 100%;
    height: 100vh;
    font-family: "SF Pro SC", "SF Pro Display", "SF Pro Icons",
    "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    overflow: hidden;
    .drawer {
      background: #ffffff;
      box-shadow: 2px 0 2px 2px white;
      height: 100vh;
      left: 0;
      position: fixed;
      top: 0;
      transform: translateX(-100%);
      transition: transform 0.2s ease-in-out;
      width: 300px;
      z-index: 10001;
    }
    .drawer.open {
      transform: translateX(0);
    }
    .drawer-mask {
      background: rgba(0, 0, 0, 0.4);
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 10000;
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
