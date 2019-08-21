<template>
    <div class="print-pre" :class="printClassName">
       <el-popover
        ref="printPopover"
        placement="bottom-start"
        :visible-arrow="false"
        trigger="click"
        :disabled="printDropdownDisabled"
        popper-class="print-popover"
        >
            <ul>
                <li v-for="(item,index) in printTemplateArray" :key="item" v-if="printTemplateArray&&printTemplateArray.length>0" @click="printSelect(item)">{{printTemplateMap[item]}}</li>
            </ul>
        </el-popover>
        <el-button v-popover:printPopover @click="printPreFn" :disabled="disabled" v-if="show">{{buttonName}}</el-button>
    </div>
</template>
<script>
  export default {
    name: 'ifbpPrintPre',
    props: {
        funcode:{
            type:String,
            default:''
        },
        nodekey:{
            type:String,
            default:''
        },
        queryParams:{
            type:Object,
            default:null
        },
        buttonName:{
            type:String,
            default:"打印预览"
        },
        printClassName:{
            type:String,
            default:""
        },
        disabled:{
            type:Boolean,
            default:false
        },
        show:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            printDropdownDisabled:true,
            printTemplateMap:{},
            printTemplateArray:[],
            resultMap:{},
            localUrl:{}
        };
    },
    methods: {
        printPreFn(){
            if(this.printTemplateArray.length>1){
                this.printDropdownDisabled=false;
                return;
            }else if(this.printTemplateArray.length==1){
                let printUrl = this.localUrl[this.this.printTemplateArray[0]];
                window.open(printUrl, '_blank');
                return;
            }
            this.$http({
                url: '/riart/printtemplate/getPreviewUrlNew',
                method: 'post',
                dataType: 'json',
                data: {
                    'funcode': this.funcode,
                    'nodekey': this.nodekey,
                    'queryParams': this.queryParams
                }
            }).then((res) => {
                if (res.data.status||res.data.success) {
                    this.resultMap = res.data.data;
                    this.printTemplateMap = this.resultMap.templateIDMap;
                    this.localUrl = this.resultMap.localUrl;
                    this.printTemplateArray = Object.keys(this.printTemplateMap);
                    if(this.printTemplateArray.length==0){
                        this.$message.error('没有找到有效的打印模板');
                        return;
                    }
                    if(this.printTemplateArray.length>1){
                        this.printDropdownDisabled=false;
                    }else if(this.printTemplateArray.length==1){
                        let printUrl = this.localUrl[this.this.printTemplateArray[0]];
                        window.open(printUrl, '_blank');
                    }
                } else {
                    this.$message.error(res.data.message);
                }
            }).catch((e) => {
                console.error(e);
                this.$message.error('操作失败');
            });
        },
        printSelect(item){
            let printUrl = this.localUrl[item];
            window.open(printUrl, '_blank');
        }
    },
  };
</script>
<style>
.print-pre{
    display: inline-block;
}
.print-popover.el-popover{
  font-size: 14px;
  border: 1px solid #d1dbe5;
  padding: 6px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.12);
  min-width: 100px;
  border-radius: 4px;
}
.print-popover.el-popover[x-placement^="top"]{
  margin-bottom: 4px;
}
.print-popover.el-popover[x-placement^="bottom"]{
  margin-top: 4px;
}
.print-popover ul li{
  list-style: none;
  line-height: 32px;
  padding: 0 16px;
  margin: 0;
  cursor: pointer;
  font-size: 14px;
}
.print-popover ul li:hover{
  background: #f0f5fa;
  color: #48586a;
}
</style>