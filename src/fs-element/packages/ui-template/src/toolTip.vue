<template>
  <el-tooltip :disabled="disabled" :content="title" placement="top">
    <span class="tooltip-content" ref="content"><slot>{{content}}</slot></span>
  </el-tooltip>
</template>

<script>
  export default {
    data() {
      return {
        disabled: true
      };
    },
    props: {
      content: String,
      handler: Function
    },
    computed: {
      title() {
        return typeof this.handler === 'function' ? this.handler.call('', this.content) : this.content;
      }
    },
    mounted() {
      var dom = this.$refs.content;
      this.$nextTick(() => {
       if (dom && dom.offsetWidth < dom.scrollWidth) {
           this.disabled = false;
         }
      });
    },
    updated() {
      var dom = this.$refs.content;
       this.$nextTick(() => {
       if (dom && dom.offsetWidth < dom.scrollWidth) {
           this.disabled = false;
         }
      });
    }
  };
</script>
<style scoped>
  .tooltip-content {
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    vertical-align: top;
    width: 100%;
  }

  .el-form-item__label .tooltip-content{
    width: auto;
    max-width: 100%;
  }
</style>
