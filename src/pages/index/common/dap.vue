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
              this.iframe_src = this.getFrameUrl();
            }
           }
         }
       },
       created() {
         this.iframe_src = this.getFrameUrl();
       },
       methods:{
        ifbpPageInit(){
          let src = window.location.href;
          if(src.indexOf('useCache=true') < 0){
            this.iframe_src = this.getFrameUrl();
          }
        },
         getFrameUrl() {
            var path = this.$route.path;
            var hash = window.location.hash;
            var url;
            var hasHttp = false;
            var host = '';
            if (this.$route.params && this.$route.params.appcode && (this.$route.params.appcode.indexOf('http') !== -1 || this.$route.params.appcode.indexOf('https') !== -1)) {
              hasHttp = true;
              url = hash.replace('#/dap/', '');
              url = url.split('$').join('/').split('+').join('#');
            } else {
              if(this.$route.params && this.$route.params.appcode){
                url = '/' + this.$route.params.appcode.split('$').join('/').split('+').join('#');
              }
            }
            if(hasHttp){
                var urlArr = url.split('/');
                host = urlArr[0] +  '//' + urlArr[2];
                urlArr.shift();
                urlArr.shift();
                urlArr.shift();
                url = "/" + urlArr.join('/');
            }
            var urlWithToken = url;
            $.ajax({
                method:'POST',
                url:'/wbalone/open/buildSecurityUrl',
                async:false,
                data:{url: '/dap/#' + url},
                // contentType:'application/json',
                success:function(res){
                    if (res.success == true){
                        urlWithToken = res.data;
                    }else{
                      console.error(res);
                    }
                },
                error:function(res){
                    console.error(res);
                }
            })
            return host +  urlWithToken;
        }
      }
    };
</script>
<style>
  iframe{
    height:100%;
  }
</style>
