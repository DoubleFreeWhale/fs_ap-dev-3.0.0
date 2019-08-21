<template>
  <div class='fomula-container'>
    <el-input
      :readonly="true"
      placeholder="请选择"
      icon="menu"
      v-model="value"
      @blur="fomulaStrChange"
      :onIconClick="showFormulaDialog">
    </el-input>
    <fomulaDialog
      :inputValue="value"
      :fomulaDialogVisible="fomulaDialogVisible"
      :parserFunction="parserFunction"
      :validateFunction="validateFunction"
      :getFomulaTplsFunction="getFomulaTplsFunction"
      :getDatabaseFunction="getDatabaseFunction"
      :getDatabaseTablesFunction="getDatabaseTablesFunction"
      :getTableFieldsFunction="getTableFieldsFunction"
      @confirm="fomulaDialogConfirm"
      @cancel="closeFomulaDialog">
    </fomulaDialog>
  </div>
</template>
<script>
import fomulaDialog from './ifbp-fomula-dialog.vue';
export default {
  name: 'IfbpFomulaDesigner',
  data() {
    return {
      fomulaDialogVisible: false,
      // localValue: ''
    };
  },
  props: {
    value: {},
    //TODO 废弃
    validateFunction: {
      type: Function
    },
    parserFunction: {
      type: Function
    },
    getFomulaTplsFunction: {
      type: Function
    },
    getDatabaseFunction: {
      type: Function
    },
    getDatabaseTablesFunction: {
      type: Function
    },
    getTableFieldsFunction: {
      type: Function
    }
  },
  components: {
    fomulaDialog
  },
  methods: {
    // initInput() {
    //   this.localValue = this.value;
    // },
    showFormulaDialog() {
      this.fomulaDialogVisible = true;
    },
    closeFomulaDialog() {
      this.fomulaDialogVisible = false;
    },
    fomulaDialogConfirm(parserData) {
      // this.localValue = parserData.originalFormulas;
      this.fomulaStrChange(parserData);
      this.closeFomulaDialog();
    },
    fomulaStrChange(parserData) {
      // this.$emit('input', this.localValue);
      this.$emit('fomulachange',parserData);
    }
  },
  created() {
    // this.initInput();
  }
};
</script>


