<template>
  <el-dialog
    :title="title"
    class="toggle-column-dialog"
    :showClose="false"
    :visible="dialogVisible"
    width="608px"
    size="small"
  >
    <draggable
      v-model="selected"
      :options="{
        draggable: '.toggle-item',
        handle: '.drag-icon'
      }"
    >
      <div
        v-for="(item, index) in selected"
        :key="index"
        class="toggle-item selected"
      >
        <el-checkbox
          v-model="item.show"
          class="toggle-checkbox"
          @change="handleToggle(item, index)"
          :disabled="selected.length === 0"
        ></el-checkbox>
        <span>{{ item.label }}</span>
        <i class="ifbp-icon-menu drag-icon"></i>
      </div>
    </draggable>
    <div
      v-for="(item, index) in notSelected"
      :key="index"
      class="toggle-item"
    >
      <el-checkbox
        v-model="item.show"
        class="toggle-checkbox"
        @change="handleToggle(item, index)"
      ></el-checkbox>
      <span>{{ item.label }}</span>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogCancel">取消</el-button>
      <el-button type="primary" @click="dialogConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable';
export default {
  name: 'IfbpToggleColumn',
  components: {
    draggable
  },
  props: {
    // 弹窗是否可见
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      default: '显示隐藏列'
    },

    removeAll:{
      default: false
    },
    // 全量数组
    data: Array,
    // 已选中
    selectedKeys: Array
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) {
        this.initSelected();
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      // 原被选中数组, 取消用
      _originData: [],
      _originSelected: [],
      notSelected: [],
      selected: []
    };
  },
  created() {
    this.dialogVisible = this.visible;
    this.initSelected();
  },
  methods: {
    dialogConfirm() {
      let selectedKeys = [];
      let selected = this.selected;
      for (let i = 0; i < selected.length; i++) {
        let selectedItem = selected[i];
        if (selectedItem) {
          selectedKeys.push(selectedItem.key);
        }
      }
      let allData = selected.concat(this.notSelected || []).slice();
      allData.forEach(item => {
        delete item.show;
      });
      this.$emit('change', selectedKeys, allData);
    },
    dialogCancel() {
      this.dialogVisible = false;
      this.$emit('cancel');
    },
    initSelected(specificData) {
      let originData = specificData || this.data;
      let originSelected = this.selectedKeys || [];
      this._originData = originData.slice();
      this._originSelected = originSelected.slice();
      let selected = [];
      let notSelected = [];
      for (let i = 0; i < originData.length; i++) {
        let item = originData[i];
        item.show = originSelected.indexOf(item.key) !== -1;
        if (item.show) {
          selected.push(item);
        } else {
          notSelected.push(item);
        }
      }
      this.selected = selected;
      this.notSelected = notSelected;
    },
    handleToggle(item, index) {
      if (item.show) {
        let toggleItem = this.notSelected.splice(index, 1);
        this.selected.push(toggleItem[0]);
      } else {
        if(!this.removeAll){
          if (this.selected.length === 1) {
            this.$message.error('至少显示一列');
            item.show = true;
            return;
          }
        }
        let toggleItem = this.selected.splice(index, 1);
        this.notSelected.push(toggleItem[0]);
      }
    }
  }
};
</script>
