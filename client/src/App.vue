<template>
  <main id="app">
    <router-view />
    <SnackBar />
  </main>
</template>

<script>
import SnackBar from '@/components/SnackBar.vue'
export default {
  name: 'App',

  components: {
    SnackBar
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  background-color: #F9F9F9;
}

button,
button:active,
button:focus {
  outline: none !important;
  border: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .wrapper {
    display: flex;
    padding: 0 10px 90px 10px;
    flex-direction: column;
    align-items: center;
    gap: 35px;
  }

  [class*="__container"] {
    max-width: 90rem;
    box-sizing: content-box;
    margin: 0 auto;
    padding: 0 .9rem;
  }
}
</style>
