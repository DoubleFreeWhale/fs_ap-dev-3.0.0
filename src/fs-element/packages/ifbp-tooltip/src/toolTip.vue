<template>
  <div class="tpl-label" :class="{
    'ifbp-tooltip-diff': diff && diff.oldValue !== undefined && diff.newValue !== undefined
  }">
    <!-- 差异化展示 -->
    <template v-if="diff && diff.oldValue !== undefined && diff.newValue !== undefined">
      <!-- 修改 -->
      <template v-if="diff.oldValue !== null && diff.newValue !== null">
        <el-tooltip :content="diff.newValue" effect="normal">
          <span class="diff-new-value" ref="content">{{ diff.newValue }}</span>
        </el-tooltip>
        <el-tooltip :content="diff.oldValue" effect="normal">
          <span class="tooltip-content diff-tooltip" ref="content">(原始值)</span>
        </el-tooltip>
      </template>

      <!-- 新增 -->
      <span v-else-if="diff.newValue !== null">{{ diff.newValue }}</span>

      <!-- 删除 -->
      <span v-else style="text-decoration: line-through; color: #999;">{{ diff.oldValue }}</span>
    </template>
    <el-tooltip v-else :disabled="disabled" :content="title" placement="top" effect="normal">
      <span class="tooltip-content" ref="content"><slot>{{content}}</slot></span>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'IfbpTooltip',
    data() {
      return {
        disabled: true
      };
    },
    props: {
      content: {},
      handler: Function,
      diff: {}
    },
    computed: {
      title() {
        return typeof this.handler === 'function' ? this.handler.call('', this.content) : this.content;
      }
    },
    mounted() {
      var dom = this.$refs.content;
      if (dom && dom.offsetWidth < dom.scrollWidth) {
        this.disabled = false;
      }
    },
    updated() {
      var dom = this.$refs.content;
      if (dom && dom.offsetWidth < dom.scrollWidth) {
        this.disabled = false;
      }
    }
  };
</script>
<style scoped>
  .el-table .tpl-label{
    padding-bottom: 0px;
    padding-top: 0px;
    line-height: 32px;
  }
  .el-table .tableExpandSet .el-form .tpl-label{
    line-height: 32px;
  }
  .tpl-label{
    white-space: nowrap;
    width: 100%;
    padding-bottom: 8px;
    padding-top: 8px;
    line-height: 16px;
    font-size: 14px;
    vertical-align: top;
    display: inline-block;
  }

  .el-textarea .tpl-label{
    width: 100%;
    white-space: normal;
  }
  .tooltip-content {
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    width: 100%;

  }

  /* 差异化表单项样式 */
  .tooltip-content.diff-tooltip {
    display: inline;
    font-size: 0.8em;
    color: #999;
  }

  .el-form-item__label .tooltip-content{
    width: auto;
    max-width: 100%;
  }
  .ifbp-tooltip-diff .diff-new-value {
    max-width: calc(100% - 45px);
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
</style>
