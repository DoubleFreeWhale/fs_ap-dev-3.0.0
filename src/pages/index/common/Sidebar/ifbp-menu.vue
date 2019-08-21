<template>
	<ul  style="height: 100%;
    display: block;
    overflow-y: auto !important;
    position: relative;">
		<ifbp-menu-bar @handleClick="handleClick" 
			:unique-opened = "uniqueOpened" 
			:index="index" 
			@menuLinkClick = "menuLinkClick"
			v-for="(item,index) in menuData"
			:key="index" 
			:menuObj = "item" 
			:currentActive = "currentIndex"
			:currentIndex = "activeIndex"			
			>
		
		</ifbp-menu-bar>
	
	</ul>
	
	
</template>

<script>

	import ifbpMenuBar from './ifbp-menu-bar'
	export default{
	    name: 'IfbpMenu',
    	componentName: 'IfbpMenu',
		data(){
			return{
				openedMenus: this.defaultOpeneds ? this.defaultOpeneds.slice(0) : [],
				currentIndex:0,
				activeIndex:""
			}
		},
		props:{
			menuData:{
				type:Array,
				dafault:[]
			},
			uniqueOpened: {
				type:Boolean,
				dafault:true
			},//是否手风琴显示
			defaultOpeneds: Array,
		},
	    components: {
	      ifbpMenuBar
	    },
	    methods:{
	    	handleClick(submenu){
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
		    menuLinkClick(index,inx){
		    	this.currentIndex = index;
		    	this.activeIndex = inx		    	
		    }
	    }
       
	}
	
</script>

<style>

	
</style>