<template>
  <i :class="[
              'el-icon-' + name,
              'ifbp-icon-' + name
            ]"></i>
</template>

<script>
  export default {
    name: 'ElIcon',

    props: {
      name: String
    }
  };
</script>
