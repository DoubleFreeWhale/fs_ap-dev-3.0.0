<template>
  <div
    class="el-select-dropdown"
    :class="[{ 'is-multiple': $parent.multiple }, popperClass]"
    :style="{ minWidth: minWidth }">
    <slot></slot>
  </div>
</template>

<script type="text/babel">
  import Popper from 'ifbp-element/src/utils/vue-popper';

  export default {
    name: 'ElSelectDropdown',

    componentName: 'ElSelectDropdown',

    mixins: [Popper],

    props: {
      placement: {
        default: 'bottom-start'
      },

      boundariesPadding: {
        default: 0
      },

      popperOptions: {
        default() {
          return {
            forceAbsolute: true,
            gpuAcceleration: false
          };
        }
      }
    },

    data() {
      return {
        minWidth: ''
      };
    },

    computed: {
      popperClass() {
        return this.$parent.popperClass;
      }
    },

    watch: {
      '$parent.inputWidth'() {
        this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
      }
    },

    mounted() {
      try{
        this.referenceElm = this.$parent.$refs.reference.$el;
        this.$parent.popperElm = this.popperElm = this.$el;
        this.$on('updatePopper', this.updatePopper);
        this.$on('destroyPopper', this.destroyPopper);
      }catch(e){

      }
      
    }
  };
</script>
