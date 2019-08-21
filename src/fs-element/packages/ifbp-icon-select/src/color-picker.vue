<template>
    <div class="color-picker">
        <div class="header">
            <i class="ifbp-icon-caret-down"></i>选色器
        </div>
        <div>
          <el-color-picker v-model="color" show-alpha></el-color-picker>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    color: {
      type: String,
      default: ""
    }
  }
};
</script>

<style>
.color-picker {
  width: 304px;
  height: 370px;
}
.color-picker .header {
    height: 40px;
    line-height: 40px;
    width: 100%;
}
</style>
