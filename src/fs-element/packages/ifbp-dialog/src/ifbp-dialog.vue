<template>
  <el-dialog
      :title="title"
      :visible="this.value"
      @update:visible="val => this.$emit('input', val)"
      :modal="true"
      size="tiny">
      <slot></slot>
      <span slot="footer" class="dialog-footer" v-if="footer">
        <el-button @click="cancelClick">取 消</el-button>
        <el-button type="primary" @click="confirmClick">确 定</el-button>
      </span>
    </el-dialog>
</template>
<script>
export default {
  name: "IfbpDialog",
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {},
    footer:{
      type: Boolean,
      default: true
    }
  },
  methods: {
    cancelClick() {
      this.$emit("input", false);
      this.$emit("cancel-click");
    },
    confirmClick() {
      this.$emit("click");
    }
  }
};
</script>