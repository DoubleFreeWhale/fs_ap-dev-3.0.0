<template>
	 <li
	    :class="{
	      'ifbp-submenu': true,
	      'is-active': active,
	      'is-opened': opened
	    }"
	  >
    <div class="ifbp-submenu__title"  @click="handleClick(menuObj)"  ref="submenu-title" >
       <i class="ifbp-icon-patch"></i>
       <span>{{menuObj.label}}</span>
      <i :class="{
        'ifbp-submenu__icon-arrow': true,
        'ifbp-icon-angle-right el-icon-arrow-right': true
      }"
      >
      </i>
    </div>
  
    
        <ul :id="'opened'+index" style="display: none;" >
        	<ifbp-menu-item 
        		:index="index+'-'+inx" 
        		@handleItemClick ="handleItemClick" 
        		 v-for = "(menu,inx) in menuObj.children"
				 :key="inx" 
        		 @menuLinkClick = "menuLinkClick"
        		 :menuItem="menu" 
        		 :current-active = "currentIndex"
        		 ></ifbp-menu-item>
        </ul>


    </li>
</template>

<script>
	import menuMixin from './menu-mixin';
	import ifbpMenuItem from './ifbp-menu-item'
	export default{
		
	    name: 'IfbpMenuBar',

    	componentName: 'IfbpMenuBar',
		components: {
	      ifbpMenuItem
	    },
	    mixins: [menuMixin],
		data(){
			return {
			   	openedMenus: this.defaultOpeneds ? this.defaultOpeneds.slice(0) : [],
			   	
			}
		},
		props:{
			menuObj:{
				type:Object,
				required: true
			},
			index:{
				type:Number,
				required: true
			},			
			uniqueOpened: {
				type:Boolean,
				dafault:true
			},//是否手风琴显示
			defaultOpeneds: Array,
			currentActive:{
				type:Number,
				required: true
			},
			
			
			currentIndex:{
				type:String,
				required: true
			}
		},
		 watch: {
		    opened(val, oldVal) {
		    	if(val == true){
		    		$("#opened"+this.index).show(300)
		    	}else{
		    		$("#opened"+this.index).hide(300)
		    	}
		    }
		      
	    },
	    computed: {	    
	    	active(){
	    		
	    		
	    		return this.opened && this.index === this.currentActive;
	    	},
    	    opened() {
		        return this.rootMenu.openedMenus.indexOf(this.index) > -1;
		    },
		    
	    },
	    methods:{
	    	handleClick(item,index){
	    		//this.opened = !this.opened
	    	    this.$emit('handleClick',this);
	    	 
	    	},
	    	handleItemClick(submenu){
    			const { index, indexPath } = submenu;
    			
		        let isOpened = this.openedMenus.indexOf(index) !== -1;
		
		        if (isOpened) {
		          this.closeMenu(index, indexPath);
		        } else {
		          this.openMenu(index, indexPath);
		        }	
	    	},
	    	openMenu(index, indexPath) {
		        let openedMenus = this.openedMenus;
		        if (openedMenus.indexOf(index) !== -1) return;
		        // 将不在该菜单路径下的其余菜单收起
		        if (this.uniqueOpened) {
		          this.openedMenus = openedMenus.filter(index => {
		            return indexPath.indexOf(index) !== -1;
		          });
		        }
		        this.openedMenus.push(index);
	        },
		    closeMenu(index, indexPath) {
		    	
		        this.openedMenus.splice(this.openedMenus.indexOf(index), 1);
		    },
		    menuLinkClick(index){
		    	this.$emit('menuLinkClick',this.index,index);
		    }
	    }
	}
	
</script>

<style>	
	.ifbp-submenu{
	    list-style: none;
	    margin: 0;
	    padding-left: 0;
	}
	.ifbp-submenu__title{
		height: 48px;
	    line-height: 48px;
	    font-size: 14px;
	    color: #71787E;
	    padding-left: 16px;
	    padding-right: 8px;
	    list-style: none;
	    cursor: pointer;
	    position: relative;
	    transition: border-color .3s,background-color .3s,color .3s;
	    box-sizing: border-box;
	    white-space: nowrap;
	}
    .ifbp-submenu.is-active.is-opened>.ifbp-submenu__title{
    	 background-color: #F9F9F9;
		 color: #393C3E;
    }
    .ifbp-submenu__title span{
    	padding-left: 8px;
    }
    
	.ifbp-submenu__title:hover{
		 background-color: #F9F9F9;
	}
	
   .ifbp-submenu.is_active>.ifbp-submenu__title{
    	 background-color: #F9F9F9;
		 color: #393C3E;
	}
	.ifbp-submenu__title i:first-of-type {
		font-size: 16px;
	    vertical-align: sub;
	}
	.ifbp-submenu__title i:first-of-type {
		font-size: 16px;
	    vertical-align: sub;
	}
    .ifbp-submenu__icon-arrow{
	    position: absolute;
	    top: 50%;
	    right: 8px;
	    margin-top: -7px;
	    transition: transform .3s;
	    font-size: 16px;
    }
    .ifbp-submenu.is-opened>.ifbp-submenu__title .ifbp-submenu__icon-arrow {
    	transform: rotate(-90deg);
	}

</style>