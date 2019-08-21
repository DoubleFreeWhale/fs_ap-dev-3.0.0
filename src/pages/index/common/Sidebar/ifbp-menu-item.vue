<template>
	
	
	 <li
	    :class="{
	      'ifbp-submenu-item': true,
	      'is-active': active,
	      'is-opened': opened
	    }"
        
	  >
    <div class="ifbp-submenu__title-item" @click="handleClick" ref="submenu-title" >

       <span>{{menuItem.label}}</span>
      <i :class="{
        'ifbp-submenu__icon-arrow': true,
        'ifbp-icon-angle-right el-icon-arrow-right': true
      }"
      >
      </i>
    </div>
    <template >
      <transition name="el-zoom-in-top">
        <ul  :id="'openeditem'+index" style="display: none;">
        	<li :class="{'ifbp-menu-item':true,'is-active':activeIndex == inx && activePath==item.path && index == currentActive}" @click="menuLinkClick(item,inx)" v-for = "(item,inx) in menuItem.children">{{item.label}}</li>        	
        </ul>
      </transition>
    </template>
    </li>
</template>

<script>
	import menuMixin from './menu-mixin';
	
	export default{
		data(){
			return {
				activeIndex:0,
				activePath:"",
			
			}
		},
		mixins: [menuMixin],
		props:{
			menuItem:{
				type:Object,
				required: true
			},
			index:{
				type:String,
				required: true,

			},
			currentActive:{
				type:String,
				required: true,
			},
				

		},
	    computed: {
	    
	    	active(){
	    		return this.index == this.currentActive  && this.opened;
	    	},    
	    	opened() {
		        return this.rootMenuItem.openedMenus.indexOf(this.index) > -1;
		    },
		    
		   
	    },
	    watch: {
		    opened(val, oldVal) {
		    	if(val == true){
		    		$("#openeditem"+this.index).show(300)
		    	}else{
		    		$("#openeditem"+this.index).hide(300)
		    	}
		    }
		      
	    },
	    methods:{
	    	handleClick(){
	    		this.activeIndex = 0 
				this.activePath = ""
	    		this.$emit('handleItemClick',this);
	    	},
	    	
		    menuLinkClick(item,index) {
		      const path = item.path;
		      this.activeIndex = index;
		      this.activePath = path;	
		      if(path){		      		 	
		      	 if (this.$context.getApp() && this.$context.getApp().showTabs === false){		
		      	 	this.$context.destroyAllTiles();
		      	 	this.$context.destroyTileByCode(item.code);
		      	 }
      	 			if(this.$context.getPlatform() == "fbp"){
							window.vueInstance.$children[0].openNewFun(path, item);
					}else{						
						
						window.vueInstance.$children[0].addEditableTabs(path, item);
					}         
		      }
		      // 清空第三级和第二级菜单，使其隐藏
			  this.$emit("menuLinkClick",this.index)

		    },
	    }
	}
	
</script>

<style>	
	.ifbp-submenu-item{
	    list-style: none;
	    margin: 0;
	    padding-left: 0;
	}

   .ifbp-submenu-item.is-active>.ifbp-submenu__title-item {
    	background: #f9f9f9;
    	color: #393C3E;
	}
	.ifbp-submenu__title-item{
		height: 40px;
	    line-height: 40px;
	    font-size: 14px;
	    color: #71787E;
	    padding-left: 48px;
	    list-style: none;
	    cursor: pointer;
	    position: relative;
	    transition: border-color .3s,background-color .3s,color .3s;
	    box-sizing: border-box;
	    white-space: nowrap;
	}
	.ifbp-submenu__title-item:hover{
		 background-color: #F9F9F9;
	}		
	.ifbp-submenu__title-item.is-active {
    	background-color: #F9F9F9;
    	color: #393C3E;
	}
	.ifbp-submenu__title-item span{
	    width: 156px;
	    display: inline-block;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	}
	
	.ifbp-submenu__title-item i {
		font-size: 14px;

	}

    .ifbp-submenu__icon-arrow{
	    position: absolute;
	    top: 50%;
	    right: 8px;
	    margin-top: -7px;
	    transition: transform .3s;
	    font-size: 16px;
    }
    .ifbp-submenu-item.is-opened>.ifbp-submenu__title-item .ifbp-submenu__icon-arrow {
    	transform: rotate(-90deg);
	}

	li.ifbp-menu-item{
	    height: 40px;
	    line-height: 40px;
	 	font-size: 13px;
		color: #71787E;
	    padding-left: 56px;
        text-overflow: ellipsis;
	    white-space: nowrap;	   
	    overflow: hidden;	    
	} 
	li.ifbp-menu-item:hover{
		background: #FFF1F3;
		color: #E50113;
	}
	li.ifbp-menu-item.is-active{
		background: #FFF1F3;
		color: #E50113;
	}	
</style>