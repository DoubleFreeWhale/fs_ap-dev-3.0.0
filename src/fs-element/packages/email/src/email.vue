<template>
  <div :class="[
    'el-input',
    size ? 'el-input--' + size : '',
    {
      'is-disabled': disabled,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend
    }
  ]">
    <template>
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <!-- input 图标 -->
      <slot name="icon">
        <i class="el-input__icon"
           :class="[
            'el-icon-' + icon,
            'ifbp-icon-' + icon,
            onIconClick ? 'is-clickable' : ''
          ]"
           v-if="icon"
           @click="handleIconClick">
        </i>
      </slot>
      <input type="text"
             class="el-input__inner"
             :value="innerValue"
             @input="handleInput"
             @focus="handleFilterFocus($event)"
             @blur="handleFilterBlur($event)">
      <i class="el-input__icon el-icon-loading" v-if="validating"></i>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
  </div>
</template>
<script>
  import elInput from "../../input/src/input.vue";

  export default {
    name: 'ElEmail',

    componentName: 'ElEmail',

    mixins: [elInput],

    data() {
      return {
      };
    },

    props: {
    },

    methods: {
    },


    mounted() {
    }
  };
</script>

<style scoped>
  .errorFormat {border: 1px solid #E60012;}
</style>
