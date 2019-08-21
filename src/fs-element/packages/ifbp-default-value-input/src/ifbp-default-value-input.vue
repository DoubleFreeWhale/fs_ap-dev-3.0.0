<template>
  <div class="el-input-number"
       :class="[
    { 'is-disabled': disabled }
  ]">
    <span
            class="el-input-number__increase"
            :class="{'is-disabled': disabled}"
            @click="showDialog">
      <i class="ifbp-icon-calculator"></i>
    </span>
    <el-input
            v-model="currentShowValue"
            @blur="handleBlur"
            @change="handleChange"
            :disabled="disabled"
            ref="input">
    </el-input>
    <ifbp-dialog
            title="系统函数"
            v-model="dialogTableVisible"
            @click="clickFun">
      <el-table
              :data="gridData"
              :showHeader="false"
              :adaptation="false"
              @row-click="rowClick"
              @row-dblclick="rowDblclick">
        <el-table-column prop="showValue" label="显示值"></el-table-column>
      </el-table>
    </ifbp-dialog>
  </div>
</template>
<script>
  export default {
    name: 'IfbpDefaultValueInput',
    props: {
      showValue: {
        default: ''
      },
      realValue: {
        default: ''
      },
      disabled: Boolean
    },
    data() {
      return {
        currentShowValue: this.showValue.toString(),
        currentRealValue: this.realValue.toString(),
        tableCurrentShowValue: '',
        tableCurrentRealValue: '',
        dialogTableVisible: false,
        gridData: [{
          showValue: '当前日期',
          realValue: '(new Date()).setHours(0,0,0,0)'
        }, {
          showValue: '当前时间',
          realValue: '(new Date()).getTime()'
        }, {
          showValue: '当前登录人',
          realValue: 'vueInstance.$context.getUserId()'
        }]
      };
    },
    methods: {
      handleChange() {
        this.currentRealValue = '';
      },
      handleBlur() {
        this.emitChange();
      },
      emitChange() {
        let val = this.currentShowValue;
        if (typeof (this.showValue)==='boolean'){
          if (this.currentShowValue === 'false'||this.currentShowValue==='0') {
            val=false
          }else{
            val=Boolean(this.currentShowValue)
          }
        }
        this.$emit('change', val, this.currentRealValue);
      },
      showDialog() {
        this.dialogTableVisible = true;
        this.tableCurrentShowValue = '';
        this.tableCurrentRealValue = '';
      },
      rowClick(row) {
        this.tableCurrentShowValue = row.showValue;
        this.tableCurrentRealValue = row.realValue;
      },
      rowDblclick(row) {
        this.rowClick(row);
        this.clickFun();
      },
      clickFun() {
        this.currentShowValue = this.tableCurrentShowValue;
        this.currentRealValue = this.tableCurrentRealValue;
        this.dialogTableVisible = false;
        this.emitChange();
      },
      cancelClick() {
        this.dialogTableVisible = false;
      }
    }
  };
</script>
