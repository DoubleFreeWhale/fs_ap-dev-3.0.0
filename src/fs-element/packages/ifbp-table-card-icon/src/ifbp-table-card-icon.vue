<template>
    <label>
        <i class="ifbp-icon-view-headline" :class='{"active":showTable}' @click='tabFn("table")' title="列表"></i>
        <i class="ifbp-icon-view-module" :class='{"active":!showTable}' @click='tabFn("card")' title="卡片"></i>
    </label>
</template>
<script>
  export default {
    name: 'IfbpTableCardIcon',
    props: {
        //传布尔值,true为显示表格，false为显示卡片,默认为true
        showTable: {
            type:Boolean,
            default:true
        }
    },
    methods: {
        tabFn(name){
            if(name=="table"){
                this.$emit('update:showTable', true);
            }else if(name=="card"){
                this.$emit('update:showTable', false);
            }
        }
    },
  };
</script>