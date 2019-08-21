<template>
  <li
    @mouseenter="hoverItem"
    @click="clickItem"
    class="s-select__item"
    v-show="visible"
    :class="{
      'selected': itemSelected,
      'is-disabled': disabled || groupDisabled,
      'hover': parent.hoverIndex === index
    }">
    <slot>
      <span>{{ label }}</span>
    </slot>
  </li>
</template>
<script>
  export default {
    name: 'ElSelectItem',
    props: {
      value: {
        required: true
      },
      label: [String, Number],
      disabled: {
        type: Boolean,
        default: false
      },
      index: {
        type: Number,
        default: -1
      },
      selectedOption: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        groupDisabled: false,
        visible: true,
        hitState: false
      };
    },
    computed: {
      parent() {
        return this.$parent;
      },
      itemSelected() {
        return this.selectedOption ? (this.selectedOption.value === this.value) : false;
      }
    },
    methods: {
      hoverItem(e) {
        const target = e.target;
        const childNodes = target.parentElement.children;
        for (let i = 0; i < childNodes.length; i++) {
          if (target !== childNodes[i]) {
            childNodes[i].classList.remove('hover');
          } else {
            childNodes[i].classList.add('hover');
          }
        }
      },
      clickItem() {
        this.$emit('clickItem', this.index);
      }
    }
  };
</script>

