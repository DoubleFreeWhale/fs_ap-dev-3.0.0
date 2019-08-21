<template>
  <div :class="!tabPosition ?  'el-tabs__active-bar' :'el-tabs__active-bar_bottom'" :style="barStyle"></div>
  
  
 
</template>
<script>
  export default {
    name: 'TabBar',

    props: {
      tabs: Array,
    
    },

    created(){
      this.timeCount = 0;
    },

    computed: {
    	tabPosition:{
    		cache: false,
    		get(){
    			return this.$parent && this.$parent.$parent && this.$parent.$parent.tabPositionTop
    		}
    	},
      barStyle: {
        cache: false,
        get() {
          // if (!this.$parent.$refs.tabs) return {};
          let style = {};
          let offset = 0;
          let tabWidth = 0;

          this.tabs.every((tab, index) => {
            if(!this.$parent.$refs.tabs) 
              return false;
            let $el = this.$parent.$refs.tabs[index];
            if (!$el) { return false; }

            if (!tab.active) {
              offset += $el.clientWidth;
              return true;
            } else {
              tabWidth = $el.clientWidth;
              return false;
            }
          });

          const transform = `translateX(${offset}px)`;
          if(tabWidth === 0 && this.timeCount < 10){
            setTimeout(()=>{
              this.$forceUpdate();
              this.timeCount++;
            })
          }else{
            style.width = tabWidth + 'px';
            style.transform = transform;
            style.msTransform = transform;
            style.webkitTransform = transform;
            this.timeCount = 0;
          }
          

          return style;
        }
      }
    }
  };
</script>
