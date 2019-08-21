<template>
    <iframe ref="iframe" style="width:100%;height:100%;" v-bind:src="iframe_src" v-show="iframe_src"></iframe>
</template>

<script>
    export default {
       data: function(){
           return {
             iframe_src: '',
           };
       },
       props:['indexa'],
       computed:{
       },
       watch:{
         $route(){
          let src = window.location.href;
          if(src.indexOf('useCache=true') < 0){
            if(!(this.indexa > -1) ||  (this.indexa > -1 && window.vueInstance.$children[0].tabIndex === this.indexa)){
              this.iframe_src = ''
              setTimeout(() =>{
                this.iframe_src = this.getFrameUrl();
              })
            }
          }
         }
       },
       created() {
         this.iframe_src = this.getFrameUrl();
       },
       mounted(){
        //
        // if(document.getElementById("organization_page")){
        //   document.getElementById("organization_page").style.display = "none";
        // }
        var frame = this.$refs.iframe;
        frame.onload = function(){
          // var frameDom = window.parent.frames[0].document;
          // if(frameDom.styleSheets.length) {
          //   // frameDom.styleSheets[0].insertRule('.btn.btn-default.btn-sm.backbutton,button[data-role="returnbtn"],button.u-button.btn-back.font-size-14.margin-left-10.backBtn, span.btn.btn-default.btn-sm.backbutton,button[data-role="treereturnbtn"],button[data-role="mapreturnbtn"].u-button.u-button-accent.whitebutton.u-left,button.backBtn.btn-back{display: none!important;}',frameDom.styleSheets[0].rules.length);
          // }
        };
       },
       methods:{
          ifbpPageInit(){
            let src = window.location.href;
            if(src.indexOf('useCache=true') < 0){
              this.iframe_src = ''
              setTimeout(() =>{
                this.iframe_src = this.getFrameUrl();
              })
            }
          },
         getFrameUrl() {
            var path = this.$route.path;
            var hash = window.location.hash;
            var url;
            if (path.indexOf('lgc/') > -1) {
              url = './legacy.html?page=' + this.$route.params.appcode;
            } else if (this.$route.params && this.$route.params.appcode && this.$route.params.appcode.indexOf('http') !== -1) {
              url = hash.replace('#/ifr/', '');
              url = url.split('$').join('/').split('+').join('#');
            } else {
              if(this.$route.params && this.$route.params.appcode){
                url = '/' + this.$route.params.appcode.split('$').join('/').split('+').join('#');
              }
            }
            return url;
        }
      }
    };
</script>
<style>
  iframe{
    height:100%;
  }
</style>
