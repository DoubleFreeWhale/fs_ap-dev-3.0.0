<template>
  <transition :name="currentTransition">
    <div v-show="currentValue" class="mint-popup" :class="[position ? 'mint-popup-' + position : '']">
      <slot></slot>
    </div>
  </transition>
</template>

<style>
  .v-modal-enter {
    animation: v-modal-in .2s ease;
  }

  .v-modal-leave {
    animation: v-modal-out .2s ease forwards;
  }

  @keyframes v-modal-in {
    0% {
      opacity: 0;
    }
    100% {
    }
  }

  @keyframes v-modal-out {
    0% {
    }
    100% {
      opacity: 0;
    }
  }

  .v-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
  }

</style>

<script type="text/babel">
  import Popup from 'ifbp-element/src/utilsM/popup';

  export default {
    name: 'mt-popup',

    mixins: [Popup],

    props: {
      modal: {
        default: true
      },

      modalFade: {
        default: false
      },

      lockScroll: {
        default: false
      },

      closeOnClickModal: {
        default: true
      },

      popupTransition: {
        type: String,
        default: 'popup-slide'
      },

      position: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        currentValue: false,
        currentTransition: this.popupTransition
      };
    },

    watch: {
      currentValue(val) {
        this.$emit('input', val);
      },

      value(val) {
        this.currentValue = val;
      }
    },

    beforeMount() {
      if (this.popupTransition !== 'popup-fade') {
        this.currentTransition = `popup-slide-${ this.position }`;
      }
    },

    mounted() {
      if (this.value) {
        this.rendered = true;
        this.currentValue = true;
        this.open();
      }
    }
  };
</script>
