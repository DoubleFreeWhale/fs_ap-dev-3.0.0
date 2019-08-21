<template>
  <li
    class="el-dropdown-menu__item"
    :class="{
      'is-disabled': disabled,
      'el-dropdown-menu__item--divided': divided
    }"
    @click="handleClick"
  >
    <slot></slot>
  </li>
</template>
<script>
  import Emitter from 'ifbp-element/src/mixins/emitter';

  export default {
    name: 'ElDropdownItem',

    mixins: [Emitter],

    props: {
      command: [String, Object],
      disabled: Boolean,
      divided: Boolean
    },

    methods: {
      handleClick(e) {
        this.dispatch('ElDropdown', 'menu-item-click', [this.command, this]);
      }
    }
  };
</script>
