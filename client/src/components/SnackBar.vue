<template>
  <div id="snackbar" />
</template>

<script>
export default {
  name: 'SnackBar',

  methods: {
    showSnackBar({ message, type })
    {
      const bar = document.getElementById('snackbar')

      bar.textContent = message || type || 'Unknown error...'
      bar.classList.add('show')

      setTimeout(() => {
        bar.classList.remove('show')

      }, 5000)
    }
  },
  mounted()
  {
    this.$bus.$on('show:snack', this.showSnackBar)
  }
}
</script>

<style lang="scss" scoped>
#snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #cd4747;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 16px;
  position: fixed;
  z-index: 999999;
  left: 50%;
  bottom: 30px;
  font-size: 17px;

  &.show {
    visibility: visible;
    animation: slidein .5s, slideout .5s 4.5s;
  }
}

@keyframes slidein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes slideout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}
</style>
