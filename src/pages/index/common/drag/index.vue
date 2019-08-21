<template>
	
	<div style="text-align: center;">
		<el-input
			  placeholder="搜索收藏名称"
			  icon="search"
			  v-model="input2"
			  style="width: 288px;margin-bottom: 16px;"
			  :on-icon-click="handleIconClick"
			  @change="handleIconClick"
			  >
		</el-input>
		
		 <draggable v-model="dragData" @update="datadragEnd" :options = "{handle:'.ifbp-icon-menu'}" :move="checkMove">
            <transition-group>
            <li
               	:key ="index"
				class="dragclass"
				v-if = "!item.isAdd"
				v-for="(item,index) in dragData">
			    <i :class="['ifbp-icon-menu el-icon-menu','coll-left']" style="cursor:pointer"></i>
			    <i v-if = "item.icon" :class="[item.icon,'coll-left','coll-left-icon','iconfont','iconfont_form']" ></i>
			    <i v-else class="ifbp-icon-patch coll-left iconfont iconfont_form" style="color: rgb(142, 142, 147);" ></i>
			   
			    <div class="coll-right" v-if="collShow && activeIndex == index">
					<el-input style="width: auto;" v-model="item.title" ></el-input>
				</div>
				<div class="coll-right" v-else>
					<div :class="item.subtitle?'coll-title':'coll-title-single'" ><span>{{item.title}}</span></div>
					<div v-show="item.subtitle" class="coll-subtitle" ><span>{{item.subtitle}}</span></div>				    					
				</div>
				
				<div class="coll-edit"  v-if="collShow && activeIndex == index">
					<el-button type="text" @click="updateCollTitle(item)" >保存</el-button>
		
				</div>
				<div class="coll-edit" v-else>
					<i class="ifbp-icon-edit" @click="editCollect(item,index)" title="编辑"></i>
					<i class="ifbp-icon-delete" @click="removeCollect(item)" title = "删除"></i>
				</div>
				
			</li>
			
            </transition-group>
    	</draggable>
	</div>

</template>

<script>
    export default{
        data(){
            return{
        		dragElement:null,
				input2:"",
				activeIndex:"",
				collShow:false,
				dargDataCopy:[],
				innerVisible:false
            	
            }
        },
    	props:{
			dragData:{
				type:Array,
				required:true
			},
			editFlag:{
				type:Boolean
			}
		},
		watch:{
			editFlag(val){
				if(!val){
					
					this.collShow = false;
				}
			}
		},
        methods:{
			checkMove(){
				this.collShow = false;
                $('.dragclass').addClass('dragclasscheck')
            },
            getdata (evt) {
          
            },
            datadragEnd (evt) {	
                evt.preventDefault();              
                var item1 = this.dragData[evt.newIndex]
                var item2 = this.dragData[evt.oldIndex]
                var sort = item1['sort'];
                item1['sort'] = item2['sort']
                item2['sort'] = sort;
				var arr = [item1,item2];
				$('.dragclass').removeClass('dragclasscheck')
                this.$emit("datadragEnd",arr);
                
            },
            //模糊查询
            handleIconClick(){           	
				this.$emit("findCollByTitle",this.input2)
			},
			removeCollect(item){
				this.collShow = false;
				this.$emit("removeCollect",item);	
			},
			editCollect(item,index){
				this.collShow = true;
				this.activeIndex = index; 
			},
			updateCollTitle(item){
				this.collShow = false;
				this.$emit("updateCollTitle",item);
			}
        },
        mounted () {

            //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
            document.body.ondrop = function (event) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }
</script>

<style>
   	.dragclass:first-child{
		
		border-top: 1px solid #F0F0F5;
	}
	.dragclass:first-letter {
		text-transform: uppercase;
	 }
	
	.sortable-ghost {
		opacity: 0.5;
		background-color: #FFF !important;
	}
    .sortable-ghost i{
        display: none !important;
    }
    .sortable-ghost div{
        display: none !important;
    }
	.dragclass{
		height: 64px;
		line-height: 64px;
		text-align: center;
		border-bottom: 1px solid #F0F0F5;
		list-style: none;
	}
.dragclass i:first-child{
    color: #75787B;;
    display: block;
    float: left;
    line-height: 64px;
    font-size: 18px;
    text-align: center;
    vertical-align: inherit;
}
.dragclass i:first-child{
    color: #75787B;;
    font-size: 18px;
    text-align: center;
    vertical-align: inherit;
    margin-left: 16px;
    margin-right: 8px;
}
.dragclass i{
    font-size: 32px;
    text-align: center;
    vertical-align: inherit;
    margin-left: 8px;
    margin-right: 16px;
    
}
.coll-left{
	height: 64px;
	line-height: 64px;
	display: block;
	float: left;
}
i.coll-left-icon{
	height: 64px;
	line-height: 64px;
}
	.coll-right{
    	margin-left: 16px;
		float: left;
	}
	.coll-title{
	    height: 24px;
	    line-height: 24px;
	    font-size: 16px;
	    color: rgb(51, 51, 51);
	    margin-top: 8px;
	    text-align: left;
	}
	.coll-title-single{
	    height: 48px;
	    line-height: 48px;
	    font-size: 16px;
	    color: rgb(51, 51, 51);
	    margin-top: 8px;
	    text-align: left;
	}
	.coll-subtitle{
		height: 24px; 
		line-height: 24px; 
		font-size: 14px; 
		color: rgb(136, 136, 136);
		text-align: left;
	}
	.coll-edit{
		float: right;
		line-height: 64px;
		display: none;
	}
	.coll-edit i{
		height: 64px;
		line-height: 64px;		
		font-size: 18px;
		color: #75787B;
		margin-right: 16px;
		cursor: pointer;
	}
	.coll-edit i:hover{
		color: #5CB0E6;
	}
	.dragclass:hover{
		background: #EAF9FF;
	}
    .dragclass.dragclasscheck:hover{
		background: #fff;
	}
	.dragclass:hover .coll-edit{
		display: block;
	}
</style>