<template>
  <li
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    v-show="visible"
    class="el-select-dropdown__item"
    :class="{
      'hover': parent.hoverIndex === index
    }">
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script type="text/babel">
  import Emitter from 'ifbp-element/src/mixins/emitter';

  export default {
    mixins: [Emitter],

    name: 'ElOption',

    componentName: 'ElOption',

    props: {
      value: {
        required: true
      },
      label: [String, Number],
      item: {

      },
      created: Boolean,
      disabled: {
        type: Boolean,
        default: false
      },
      query: String
    },

    data() {
      return {
        index: -1,
        groupDisabled: false,
        hitState: false,
        visible: true
      };
    },

    computed: {
      currentLabel() {
        let showLabel = '';
        if (this.label) {
          showLabel += this.label;
        }
        if (this.query) {
          showLabel += ': ' + this.query;
        }
        if (showLabel) {
          this.visible = true;
        } else {
          this.visible = false;
        }
        return showLabel;
      },

      parent() {
        let result = this.$parent;
        while (!result.isSelect) {
          result = result.$parent;
        }
        return result;
      }
    },

    watch: {
      currentLabel() {
        if (!this.created && !this.parent.remote) this.dispatch('ElSelect', 'setSelected');
      },
      value() {
        if (!this.created && !this.parent.remote) this.dispatch('ElSelect', 'setSelected');
      }
    },

    methods: {
      hoverItem() {
        if (!this.disabled && !this.groupDisabled) {
          this.parent.hoverIndex = this.parent.options.indexOf(this);
        }
      },

      selectOptionClick() {
        if (this.disabled !== true && this.groupDisabled !== true) {
          this.dispatch('ElSelect', 'handleOptionClick', this);
        }
      },

      resetIndex() {
        this.$nextTick(() => {
          this.index = this.parent.options.indexOf(this);
        });
      }
    },

    created() {
      this.parent.options.push(this);
      this.parent.cachedOptions.push(this);
      this.parent.optionsCount++;
      this.parent.filteredOptionsCount++;
      this.index = this.parent.options.indexOf(this);

      this.$on('resetIndex', this.resetIndex);
    },

    beforeDestroy() {
      this.dispatch('ElSelect', 'onOptionDestroy', this);
    }
  };
</script>
