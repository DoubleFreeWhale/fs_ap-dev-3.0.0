<template>
  <span class="el-breadcrumb__item">
    <span class="el-breadcrumb__item__inner" ref="link"><slot></slot></span><span class="el-breadcrumb__separator">{{separator}}</span>
  </span>
</template>
<script>
  export default {
    name: 'ElBreadcrumbItem',
    props: {
      to: {},
      replace: Boolean,
      // 是否返回顶层
      toTop: Boolean,
      // 顶层路由数组
      topPaths: {
        type: Array,
        default() {
          return ['/appArea', '/index'];
        }
      },
      // 返回顶层回到方法名
      topCallBack: {
        type: String,
        default: 'openUrl'
      }
    },
    data() {
      return {
        separator: ''
      };
    },
    methods: {
      clickListener(){
        if (this.to && this.to.path) {
          let to = this.to;
          let path = to.path;
          // 对返回顶层路由的特殊处理
          if (this.topPaths.indexOf(path) !== -1 || this.toTop) {
            if (this.$root && this.$root.$children && this.$root.$children[0] && typeof this.$root.$children[0][this.topCallBack] === 'function') {
              this.$root.$children[0][this.topCallBack].call(this, path);
              return;
            }
          }
          if (self.$route && self.$route.query && self.$route.query.tilecode) {
            var tilecode = self.$route.query.tilecode;
            if (path.indexOf('tilecode') === -1) {
              path += path.indexOf('?') === -1 ? ('?tilecode=' + tilecode) : ('&tilecode=' + tilecode);
            }
            to.path = path;
          }
          // self.replace ? self.$router.replace(to) : self.$router.push(to);
        }  
        this.$emit('routerClicked');        
      }
    },
    mounted() {
      this.separator = this.$parent.separator;
      var self = this;
      // if (this.to && this.to.path) {
        let link = this.$refs.link;
        link.addEventListener('click', this.clickListener)
    },
    beforeDestroy() {
      this.$refs.link.removeEventListener('click', this.clickListener)
    },
  };
</script>
