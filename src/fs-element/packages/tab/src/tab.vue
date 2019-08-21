<template>
    <iframe :src="src" width="100%" height="100%"></iframe>
</template>
<script>
  export default {
    name: 'ElTab',
    props: ['url'],
    data() {
      return {
        src: ''
      };
    },
    created() {
      this.src = this.url ? this.url : this.$route.query.url;
    }
  };
</script>
