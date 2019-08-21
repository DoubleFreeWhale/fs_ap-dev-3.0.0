export default {
  data: function(){
    return{
      pageMixinAutoCreate: true,
      pageMixinIfbpTemplates: [],
      pageMixinAllIfbpTemplates: [],
      pageMixinIfbpDynamicPanels: [],
      pageMixinAllIfbpDynamicPanels: [],
      pageMixinIfbpTemplatesSort: []
    }
  },
  watch:{
    pageMixinIfbpTemplatesSort(){
      this.pageMixinIfbpTemplatesInit();
    }
  },
  mounted(){
    // console.log('page mounted');
    // 按照顺序获取UI模板和动态组件，为动态组件添加事件获取内部的UI模板
    this.pageMixinGetAllTemplateAndDynamic();
    // console.log("page mounted length:" + this.pageMixinIfbpTemplatesSort.length);
  },
  destroyed(){
    // console.log('page destroy')
  },
  methods:{
    pageMixinGetAllTemplateAndDynamic(){
      let $doms = $(this.$el).find('.yon-uitemplate,.ifbp-dynamic-panel');
      this.pageMixinIfbpDynamicPanels = [];
      this.pageMixinIfbpTemplates = [];
      this.pageMixinAllIfbpTemplates = [];
      this.pageMixinAllIfbpDynamicPanels = [];
      this.pageMixinIfbpTemplatesSort = [];
      for(let i = 0; i < $doms.length; i++){
        let dom = $doms[i];
        let vueComp = dom.__vue__;
        try{
          if(vueComp.$vnode.componentOptions.tag === "ifbp-dynamic-panel"){
            vueComp.$on('dynamic-data-change', this.pageMixinDynamicDataChange)
            vueComp.$on('template-after-create', this.pageMixinTemplateAfterCreated);
            this.pageMixinIfbpDynamicPanels.push(vueComp);
            this.pageMixinAllIfbpTemplates.push(null);
            this.pageMixinAllIfbpDynamicPanels.push(vueComp);
            this.pageMixinIfbpTemplatesSort = this.pageMixinIfbpTemplatesSort.concat(vueComp.getIfbpTemplates());
          }else if(vueComp.$vnode.componentOptions.tag === "ifbp-template"){
            this.pageMixinIfbpTemplates.push(vueComp);
            this.pageMixinAllIfbpTemplates.push(vueComp);
            this.pageMixinAllIfbpDynamicPanels.push(null);
            this.pageMixinIfbpTemplatesSort.push(vueComp);
            vueComp.$on('after-create', this.pageMixinTemplateAfterCreated)
          }
        }catch(e){
        }
      }
    },

    pageMixinTemplateAfterCreated(oT){
      // console.log('after created:' + oT.tplId  + '----' + ((new Date()).getTime() - window.beforeCreate));
      this.pageMixinIfbpTemplatesInit();
    },

    pageMixinDynamicDataChange(){
      if(this.pageMixinDynamicDataChangeTimeout)
        this.clearTimeout(this.pageMixinDynamicDataChangeTimeout)
      this.pageMixinDynamicDataChangeTimeout = setTimeout(() =>{
        this.pageMixinDynamicDataChangeFun();
      },100)
    },

    pageMixinDynamicDataChangeFun(){
      this.pageMixinIfbpTemplatesSort = [];
      for(let i = 0; i < this.pageMixinAllIfbpTemplates.length; i++){
        if(this.pageMixinAllIfbpTemplates[i]){
          this.pageMixinIfbpTemplatesSort.push(this.pageMixinAllIfbpTemplates[i])
        }else{
          if(this.pageMixinAllIfbpDynamicPanels[i]){
            this.pageMixinIfbpTemplatesSort = this.pageMixinIfbpTemplatesSort.concat(this.pageMixinAllIfbpDynamicPanels[i].getIfbpTemplates());
          }
        }
      }
      // console.log( 'sort: ' + this.pageMixinIfbpTemplatesSort.length);
    },

    pageMixinIfbpTemplatesInit(){
      if(this.pageMixinIfbpTemplatesInitTimeout)
        clearTimeout(this.pageMixinIfbpTemplatesInitTimeout);
      this.pageMixinIfbpTemplatesInitTimeout = setTimeout(() =>{
        this.pageMixinIfbpTemplatesInitFun()
      },200);
    },

    pageMixinIfbpTemplatesInitFun(){
      for(let i = 0; i < this.pageMixinIfbpTemplatesSort.length; i++){
        let nowTemplate = this.pageMixinIfbpTemplatesSort[i];
        // if (i > 1)
        //   return;
        if(!nowTemplate.hasInit()){
          console.log('init fun 22:' + nowTemplate.tplId + ':time-' + ((new Date()).getTime() - window.beforeCreate));
          nowTemplate.init();
          if (i > 0) {
            // 加载前两个
            return;
          }
        }
      }
    }
  }
}
