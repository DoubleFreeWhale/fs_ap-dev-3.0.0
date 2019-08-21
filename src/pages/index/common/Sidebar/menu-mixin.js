export default {
  computed: {
    indexPath() {
      var path = [this.index];
      var parent = this.$parent;
      while (parent.$options.componentName !== 'IfbpMenu') {
        if (parent.index) {
          path.unshift(parent.index);
        }
        parent = parent.$parent;
      }
      return path;
    },
    rootMenu() {
      var parent = this.$parent;
      while (
        parent &&
        parent.$options.componentName !== 'IfbpMenu' 
      ) {
        parent = parent.$parent;
      }
      return parent;
    },
		rootMenuItem() {
      var parent = this.$parent;
      while (
        parent &&
        parent.$options.componentName !== 'IfbpMenuBar' 
      ) {
        parent = parent.$parent;
      }
      return parent;
    }     
  }
};
