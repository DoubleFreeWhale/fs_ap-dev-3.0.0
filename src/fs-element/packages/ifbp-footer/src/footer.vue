<template>
  <div>
    <div ref="footer" class="ifbp-footer" :class="{'min-ifbp-footer':width}">
      <div class="left-area"  >
        <slot name="left"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name:'IfbpFooter',
    props:{
      width:{
        type:Number
      }
    },
    data: function(){
      return {}
    },
    methods:{
      checkRemoveEl(){
        if($(this.$el).closest('.list-complete-item').css('display') === 'none' || $(this.$el).closest('.list-complete-item').hasClass('displaynone')|| $(this.$el).closest('body').length < 1){
          $(this.$refs["footer"]).css('display','none');
        }else{
          let dom = this.$el;
          let hiddenFlag = $(dom).is(":hidden");
          if(hiddenFlag)   {
            $(this.$refs["footer"]).css('display','none');
          }else{
            $(this.$refs["footer"]).css('display','flex');
          }
        }
      },

      destroyEl(){
        $(this.$refs["footer"]).remove();
      }
    },
    beforeDestroy(){
      this.destroyEl();
      window.ifbpFooters = window.ifbpFooters || [];
      let i = window.ifbpFooters.indexOf(this);
      if(i  > -1){
        window.ifbpFooters.splice(i);
      }
    },
    mounted() {
      window.ifbpFooters = window.ifbpFooters || [];
      window.ifbpFooters.push(this);
      document.body.appendChild(this.$refs["footer"]);
      if(this.width){
        $(".min-ifbp-footer").css({width:this.width});
      }
    }
  }
</script>

