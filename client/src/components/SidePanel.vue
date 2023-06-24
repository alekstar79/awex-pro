<template>
  <div class="slide-panel">
    <div
      @click="$emit('onchange', false)"
      :class="{ opened: openPanel }"
      class="background__cover"
    />

    <div class="side-panel" :class="{ opened: openPanel }">
      <span @click="$emit('onchange', false)" class="side-button">
        +
      </span>

      <div class="popup__text">
        <slot v-bind:control="{ openPanel }" />
      </div>
    </div>
  </div>
</template>

<script>
import { SET_MUTATION } from '@/store/types'

export default {
  name: 'SidePanel',

  props: {
    value: {
      types: Boolean,
      default: false
    }
  },
  model: {
    event: 'onchange',
    prop: 'value'
  },
  data() {
    return {
      openPanel: this.value
    }
  },
  computed: {
    need2FA: {
      set(need2FA) {
        this.$store.commit(SET_MUTATION, { need2FA })
      },
      get() {
        return this.$store.state.need2FA
      }
    }
  },
  watch: {
    need2FA(v) {
      this.$emit('onchange', v)
    },
    value(v)
    {
      this.openPanel = v
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-panel {
  .background__cover {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    transition: all .5s;
    visibility: hidden;

    &.opened {
      visibility: visible;
    }
  }

  .side-panel {
    position: fixed;
    z-index: 999;
    top: 0;
    right: -120%;
    background: #FFF;
    transition: all 1s ease-in-out;
    width: clamp(160px, 100%, 540px);
    height: 100vh;
    box-shadow: 10px 0 20px rgba(0,0,0,.4);
    color: #105;
    padding: 40px 20px;

    .side-button {
      font-size: 30px;
      border-radius: 20px;
      position: absolute;
      top: 8px;
      right: 16px;

      cursor: pointer;
      transform: rotate(45deg);
      color: #105;
      transition: all 280ms ease-in-out;
      z-index: 1;
    }
    .side-button:hover {
      transform: rotate(45deg) scale(1.5);
    }
    .popup__text {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &.opened {
      right: 0;
    }
  }
}
</style>
