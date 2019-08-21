<template>
    <div>
        <el-input v-model="keywords" :size="size" @change="inputChange" :placeholder="placeholder || '请输入内容...'">
            <el-button slot="append" icon="search" @click="searchClick"></el-button>
        </el-input>
    </div>
</template>
<script>
  export default {
    name: 'ElSearchForm',
    data() {
      return {
        keywords: ''
      };
    },
    props: ['size','placeholder'],
    methods: {
      searchClick() {
        this.$emit('searchClick', this.keywords);
      },
      inputChange() {
        this.$emit('inputChange', this.keywords);
      }
    }
  };
</script>

