<template>
  <el-dialog
      class="ifbp-del-dialog"
      :title="title"
      :visible="this.value"
      @update:visible="val => this.$emit('input', val)"
      :modal="true"
      size="tiny">
      <span><i class="ifbp-icon-warning del-dialog-icon"></i><span class="del-detail">{{message}}</span></span>
      <span slot="footer" class="dialog-footer" v-if="footer">
        <el-button @click="cancelClick">取 消</el-button>
        <el-button type="primary" @click="deleteClick">确 定</el-button>
      </span>
    </el-dialog>
</template>
<script>
export default {
  name: "IfbpDelDialog",
  props: {
    value: {},
    title: {
      type: String,
      default: '删除'
    },
    message: String,
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
    deleteClick() {
      this.$emit("click");
    }
  }
};
</script>