<template>
    <div>        
        <el-input
          :placeholder="placeholder"
          icon="pt-fenlei1"
          v-model="showValue"
          @valuechange = "valueChange"
          v-bind:style="{width:'100%',display:'inline-block'}"
          :width="width"
          :disabled="disabled"
          @blur="handleInputBlur"
          v-if="editable"
          :on-icon-click="showDialog">
        </el-input>
        <ifbp-tooltip :content="showValue" v-else></ifbp-tooltip>
        <address-dialog
                ref="formPanel"
                :size="'small'"
                @closeDialog="closeDialog"
                :dialogVisible="dialogVisible"
                :formValue="formValue"
                :form-value-id="templateValue[this.field]"
                @selectPk="handlePkChange"
                @valueChange="handleChange">
        </address-dialog>
    </div>
</template>
<script>
  import emitter from 'fs-element/src/mixins/emitter';
  import addressDialog from './address-dialog.vue';
  export default {
    name: 'IfbpAddressRef',
    mixins: [emitter],
    props: {
      width: {},      
      field: {
        default: ''
      },      
      templateValue: {},
      placeholder: {},
      editable: {
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      }  
    },
    components: {addressDialog},
    data() {
      return {
        showValue: '',
        pkData: {},
        dialogVisible:false,
        formValue: {},  
        attrName: ['country','province','city','vsection']                   
      }
    }, 
    watch: {
      editable(editable){
        this.dispatch('ElFormItem', 'editableChange', [editable]);
      },
      templateValue: {
        handler() {        
          this.handlePropChange();
        },
        deep: true
      },
      showValue(val) {        
        if(!val){
          this.formValue = {
            district: '',
            detailinfo: '',
            postcode: ''
          },
          this.reset();
          this.handlePkChange();
        }            
        this.$emit('change',val);              
      },
      pkData(val) {        
        this.$emit('getpk',val);        
      }
    },      
    methods: {
      valueChange(val){
      	this.$emit("valuechange",val);
      },
      init() {        
        var tempValue = this.templateValue[this.field];        
        if (tempValue) {          
          this.showValue = this.formatRefName();
          if(!this.showValue){
            this.getBeanMapByPK(tempValue);
          }          
        }
      },  
      /**
       * 格式化非编辑态时参照的显示值
       * val: 参照值
       * beanMap: 对应的beanMap
       * type: diff ref 对应的新值或旧值(oldValue || newValue)
       */
      formatRefName() {        
        if(!this.templateValue){
          return '';
        }         
        try{
          var formData = this.templateValue;        
          this.formValue = {
            detailinfo: formData.beanMap[this.field+'_ref'][formData[this.field]].detailinfo,
            postcode: formData.beanMap[this.field+'_ref'][formData[this.field]].postcode
          }            
          var tmp = this.handleAddress(formData);        
          this.formValue.district = this.transAddress(tmp);
          $.extend(this.formValue,tmp);        
          return `${this.transAddress(tmp)}${this.formValue.detailinfo?","+this.formValue.detailinfo:""}${this.formValue.postcode?","+this.formValue.postcode:""}`;
        } catch(e){
          return ''
        }    
      },
      //取出参照地址
      handleAddress(data){
        var obj = {};        
        this.attrName.forEach(val=>{          
          var beanMap = data.beanMap;
          var refValue = beanMap[this.field+'_ref'];                  
          if(beanMap && refValue && refValue[data[this.field]]){
            obj[val] = refValue[data[this.field]][val];
          }else{
            obj[val] = '';
          }
        });      
        return obj;
      },
      //地址对象转为字符串
      transAddress(data){
        var str="";  
        this.attrName.forEach(val=>{
          if(data[val]){
            str += data[val];
          }
        });                   
        return str;
      },
      // 根据pk获取beanmap
      getBeanMapByPK(pk) {
        if (!pk) {
          return;
        }
        this.$http({
          url: '/wbalone/address/getAddressById',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: pk
        }).then(res => {          
          if (!res || !res.data || !Array.isArray(res.data)) {
            return;
          }
          var resData = res.data.data || '';
          if(resData) {           
            this.templateValue.beanMap = this.templateValue.beanMap || {};
            this.templateValue.beanMap[this.field + '_ref'] = resBeanMap[this.field + '_ref'] || {};
            this.templateValue[this.field] = pk;
            this.templateValue.detailinfo = resData.detailinfo;
            this.templateValue.postcode = resData.postcode;
            // 进入的时候不会触发监听，主动调用
            this.handlePropChange();          
          }
        }).catch(() => {
          this.$message({type: 'error',message: '请求失败!'});
        });                
      },
      // templateValue 或 refCode 变化后处理事件
      handlePropChange() {        
        if (this.templateValue && this.templateValue[this.field]) {
          this.init();
        } else {
          if(this.showValue){
            this.reset();
          }
        }
      },
      reset() {        
        this.showValue = '';                         
        this.templateValue[this.field] = '';
        this.$emit('reset');
      },
      showDialog() {
      	if(window.engine && window.engine.tplData){
      		return;
      	}   	
        this.$refs.formPanel.init();
        this.$refs.formPanel.initRequest();
        this.dialogVisible = true;                
      },
      closeDialog() {
        this.dialogVisible = false;
      },    
      handleChange(formData) {                   
        this.showValue = `${formData.district?formData.district:""}${formData.detailinfo?","+formData.detailinfo:""}${formData.postcode?","+formData.postcode:""}`;
      },
      handlePkChange(selectData) { 
        // debugger;                                               
        if(selectData){
          this.templateValue[this.field]=selectData.field;
          var selectValue = selectData.value;
          this.attrName.forEach(key=>{
            this.templateValue.beanMap = this.templateValue.beanMap || {};
            this.templateValue.beanMap[this.field + '_ref'] = this.templateValue.beanMap[this.field + '_ref'] || {};
            this.templateValue.beanMap[this.field + '_ref'][selectData.field] = this.templateValue.beanMap[this.field + '_ref'][selectData.field] || {};
            this.templateValue.beanMap[this.field + '_ref'][selectData.field][key] = selectValue[key];
          });
          this.templateValue.beanMap[this.field + '_ref'][selectData.field].detailinfo = selectValue.detailinfo || '';
          this.templateValue.beanMap[this.field + '_ref'][selectData.field].postcode = selectValue.postcode || '';
        }else{
          this.templateValue[this.field] = '';
          delete this.templateValue.beanMap[this.field + '_ref'];
        }
      },
      handleInputBlur(){                
        const currentName = this.showValue;
        if (!currentName) {
          // 清空当前值
          this.reset();
          return;
        }
      }      
    },
    created() {
      if(this.templateValue && this.templateValue[this.field]){
        this.init();
      }
    },
    mounted() {       
      
    }
  };
</script>

