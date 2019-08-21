<template>
  <el-collapse
    v-model="activeCollapseNames"
    class="selected-panel"
    @change="selectedPanelCollapse">
    <el-collapse-item :title="'已选' + (Array.isArray(selected) && selected.length ? '(' + selected.length + ')' : '')" name="selected">
      <el-tag
        class="selected-tag"
        v-for="(tag, index) in selected"
        :key="index"
        type="primary-outline"
        closable
        closeTransition
        @close="removeSelected(index)">{{ tag.refname || tag.name }}</el-tag>
      <span
        v-if="selected.length"
        class="btn-clear-selected"
        @click="clearSelected">清空</span>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
  export default {
    name: 'IfbpSelectedRef',
    props: {
      selected: Array,
    },
    data() {
      return {
        // names of activating items
        activeCollapseNames: [],
      };
    },
    methods: {
      selectedPanelCollapse(val) {
        this.$emit('collapse', val);
      },
      removeSelected(tagIndex) {
        let localSelected = this.selected.slice();
        localSelected.splice(tagIndex, 1);
        this.$emit('selectChange', localSelected);
      },
      clearSelected() {
        this.$emit('selectChange', []);
      },
    }
  };
</script>
<style scoped>
  .panel-container .selected-panel {
    margin-top: 14px;
    border: none;
  }
  .selected-tag {
    margin-right: 16px;
    margin-bottom: 12px;
  }
  .btn-clear-selected {
    color: #75787B;
    font-size: 14px;
    cursor: pointer;
  }
  .btn-clear-selected:hover {
    color: #2d2d2d;
  }
</style>
<style>
  .panel-container .selected-panel .el-collapse-item__header {
    height: 48px;
    line-height: 48px;
    border: none;
    background: #F0F5FA;
  }
  .panel-container .selected-panel .el-collapse-item__wrap {
    transition: none;
  }
  .panel-container .selected-panel .el-collapse-item__content {
    box-sizing: border-box;
    height: 102px;
    overflow-y: auto;
    padding: 0 16px;
    background: #F0F5FA;
  }
  .panel-container .selected-panel .el-collapse-item__content::-webkit-scrollbar-track-piece {
    background: #F0F5FA;
  }
</style>