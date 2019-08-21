<template>
    <div class="md-child-page" :class="this.containerClass">
       <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'MdChildPage',
    props:{
        width:{
            type:Number,
            default:function(){
                let asideWidth=this.$parent.asideWidth;
                let windowWidth=$(window).width();
                return  (windowWidth>768) ? windowWidth-asideWidth:windowWidth;
            },
            validator: function (value) {
                return value >0 && value <$(window).width();
            }
        },
        fullscreen:{
            type:Boolean,
            default:false
        },
        containerClass:{
            type:Array
        }
    },
    data(){
      return {
          currentWidth:this.width,
      };
    },
    created(){
    },
    mounted(){
        if(this.fullscreen){
          let winHeight=$(window).height();
          let winWidth=$(window).width();
          this.currentWidth=winWidth;
          $(this.$el).css({"z-index":1910,"position":"fixed"});
        }
        $(this.$el).css({"right":this.currentWidth*(-1),"width":this.currentWidth});
    },
    watch:{
        
    },
    methods: {
      hideChildPage(){
        $(this.$el).css("right",this.currentWidth*(-1));
        this.$emit("close");
      },
      showChildPage(){
        //$('.md-child-page').css("right",0);
          $(this.$el).css("right",0);
      }
      
    }    
  };

</script>
<style>
    .md-child-page{
        display:block;
        height:auto;
        min-height:100%;
        background: #ffffff;;
        transition: all 300ms;
        position: absolute;
        top:0;
        transform: translate3d(0px, 0px, 0px);
        box-shadow:rgb(191, 191, 191) -1px -1px 10px;
        z-index:2;
    }
</style>
