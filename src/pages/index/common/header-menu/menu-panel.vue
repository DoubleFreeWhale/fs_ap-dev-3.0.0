<template>
<div class="menu-panel">
  <div class="org-list" v-for="org in data" :key="org.areaId">
    <div class="org-label">
      <span>{{org.label}}</span>
    </div>
   <menu-panel-item @handlePanelItemClick="handlePanelItemClick"
                    v-for="group in org.children"
                    :key="group.id" :label="org"  :group = "group" />
  </div>
</div>
</template>
<script>
	import menuPanelItem from './menu-panel-item.vue'
export default {
	 components: {
     menuPanelItem
  },

  data() {
    return {

    };
  },
  props: {
    data: {
      default: [],
    }
  },
  methods: {
    handlePanelItemClick(data,panel,org) {
    	this.$emit("handlePanelItemClick",org);//将头部标题传至父组件
    },
    panelHover(panel,org){
    	console.log(panel+'.....panelHover');
    	console.log(org+'.....org');
    }
  }
};
</script>
<style>
.menu-panel {
  /* height: 368px; */
  /* overflow: auto; */
  padding-bottom: 10px;
}
.menu-panel .menu-panel-item {
  height: 32px; 
  line-height: 32px;
  font-size: 14px;
  cursor: pointer;
  color: #2A9BE3;
  text-align: left;
  padding-left: 8px;
  width:120px;
  overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; 
  float: left;
}
.menu-panel .menu-panel-item:hover {

  text-decoration: underline
}

.menu-panel-empty {
  height: 138px;
  line-height: 138px;
}
.menu-panel .org-list {
  margin: 0 32px 0 16px;
}
.menu-panel .org-list .org-label {
  height: 46px;
  line-height:46px;
  color: #333333;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
}

.menu-panel .group-list {
  overflow: hidden;
	 margin-top: 8px;
}
.menu-panel .group-list .group-label {
	cursor: pointer;
  height: 32px;
  line-height: 32px;
  color: #666666;
  font-size: 14px;
  text-align: left;
  clear: both;
  margin-left: 4px;
}
.group-label i {
	font-size: 16px;
	vertical-align: text-bottom;
	transition: transform .3s;
}
.group-label.is-show i{
	transform: rotate(90deg);
}


.menu-panel .group-list .group-label span{
	  margin-left: 4px;
}

</style>
