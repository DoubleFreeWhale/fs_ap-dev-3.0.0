<template>
  <el-dialog class="fomula-dialog"
    title="公式编辑器"
    :visible="fomulaDialogVisible"
    :close-on-click-modal="false"
    size="full"
    width="1000px"
    :before-close="dialogCancel">
    <div class="layout-top">
      <!-- textarea -->
      <div class="fomula-textarea-and-btns">
        <el-input ref="fomulaTextarea"
          class="fomula-textarea"
          type="textarea"
          :rows="10"
          v-model="fomulaStr"
          resize="none"
          @blur="textareaBlur">
        </el-input>
        <div class="fomula-textarea-btns">
          <el-button @click="textareaClearAll">清空</el-button>
          <el-button @click="textareaSelectAll">全选</el-button>
          <el-button @click="textareaValidate">验证</el-button>
          <el-button @click="textareaCancel">取消</el-button>
          <el-button type="primary" @click="textareaConfirm">确定</el-button>
        </div>
      </div>
      <!-- calculator -->
      <div class="fomula-calculator">
        <!-- numbers -->
        <div class="fomula-calculator-numbers">
          <div v-for="(row, rowIndex) in calcNumbers"
            :key="rowIndex"
            class="row"
          >
            <span v-for="(item, index) in row" :key="index"
              :span="6"
              @click="calculatorClick(item)">
              {{ item }}
            </span>
          </div>
        </div>

        <!-- operators -->
        <div class="fomula-calculator-operators">
          <div v-for="(row, rowIndex) in calcOperators"
            :key="rowIndex"
            class="row"
          >
            <span v-for="(item, index) in row" :key="index"
              :span="6"
              @click="calculatorClick(item)">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <el-row :gutter="16" class="fomula-tpls-and-dbrelated">
      <!-- 公式模板 -->
      <el-col :span="12">
        <el-tabs v-if="fomulaTpls && fomulaTpls.length" type="border-card" class="fomula-tpls">
          <el-tab-pane v-for="(tplTab, tabIndex) in fomulaTpls" :key="tabIndex"
            v-if="tplTab.show"
            :label="tplTab.typeName">
            <ul>
              <li v-for="(fomula, fomulaIndex) in tplTab.fomulaItems" :key="fomulaIndex"
                :class="{ 'fomula-tpl-current': currentFomulaTpl === fomula }"
                @click="fomulaTplClick(fomula)"
                @dblclick="fomulaTplDblClick(fomula)">
                {{ fomula.displayName }}
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <div v-else class="fomula-no-result">未获取到公式模板</div>
      </el-col>
      <!-- 数据库相关 -->
      <el-col :span="12">
        <el-tabs v-if="database || databaseTables" type="border-card" class="fomula-dbrelated">
          <!-- 表体相关 -->
          <el-tab-pane v-if="database"
            :label="database.tableName ? ('表体--' + database.tableName) : '表体'">
            <ul v-if="database.fields && database.fields.length">
              <li v-for="(field, fieldIndex) in database.fields"
                :key="fieldIndex"
                @dblclick="fieldDblClick(field.inputSig)">
                {{ field.inputSig }}
                <span v-if="field.displayName">{{ '&lt;' + field.displayName + '&gt;' }}</span>
              </li>
            </ul>
            <div v-else class="fomula-no-result__inner">未获取到当前表体相关信息</div>
          </el-tab-pane>
          <!-- 表和字段相关 -->
          <el-tab-pane v-if="databaseTables && databaseTables.length" label="表和字段">
            <el-row class="fomula-tables-and-fields">
              <!-- 表 -->
              <el-col :span="12" class="fomula-tables">
                <ul>
                  <li v-for="(table, tableIndex) in databaseTables"
                    :key="tableIndex"
                    v-if="table.name"
                    :class="{
                      'fomula-table-current': currentTable === table
                    }"
                    @click="tableClick(table)">
                    {{ table.name }}
                    <span v-if="table.displayName">{{ '&lt;' + table.displayName + '&gt;' }}</span>
                  </li>
                </ul>
              </el-col>
              <el-col :span="12" class="fomula-fields">
                <ul v-if="tableFields && tableFields.length">
                  <li v-for="(field, fieldIndex) in tableFields"
                    :key="fieldIndex"
                    @dblclick="fieldDblClick(field.inputSig)">
                    {{ field.inputSig }}
                    <span v-if="field.displayName">{{ '&lt;' + field.displayName + '&gt;' }}</span>
                  </li>
                </ul>
                <div v-else class="fomula-no-result__inner">请选择表</div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <div v-else class="fomula-no-result">未获取到表和字段相关信息</div>
      </el-col>
    </el-row>
    <div class="fomula-tips">{{ fomulaTips }}</div>
  </el-dialog>
</template>
<script>
export default {
  name: 'IfbpFomulaDialog',
  props: {
    fomulaDialogVisible: {
      type: Boolean,
      default: false
    },
    inputValue: {},
    // TODO 废弃
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
  data() {
    return {
      // 公式结果字符串
      fomulaStr: '',
      // 计算器数字
      calcNumbers: [
        [ '7', '8', '9', '0' ],
        [ '4', '5', '6', '.' ],
        [ '1', '2', '3', '00' ]
      ],
      // 计算器操作符
      calcOperators: [
        [ '+', '-', '*', '/' ],
        [ '->', '==', '(', ')' ],
        [ '<', '>', '<=', '>=' ]
      ],
      // 当前光标起始和结束位置
      selectionStartIndex: 0,
      selectionEndIndex: 0,
      // 用于防止 textarea@focus 光标自动移动至末尾
      focusTimer: null,

      // 公式模板
      fomulaTpls: null,
      // 当前注释
      fomulaTips: null,
      // 当前选中的模板 (用于高亮显示)
      currentFomulaTpl: null,

      // 表体 tab 对象
      database: null,
      // 表和字段 tab 中的表数组
      databaseTables: null,
      // 表和字段 tab 中的字段数组
      tableFields: null,
      // 当前 table
      currentTable: null
    };
  },
  watch: {
    // actived_ele(element) {
    // }
    fomulaDialogVisible(visible) {
      if (visible) {
        this.initDialog();
      }
    }
  },
  methods: {
    /* eslint-disable no-undef */
    initDialog() {
      this.setDialogHeight();
      // 光标移动到末尾
      this.setSelectionByIndex();
      // 获取模板数据
      this.getFomulaTpls();
      // 获取表体 tab 数据
      this.getDatabase();
      // 获取表列表数据
      this.getDatabaseTables();
      if (this.inputValue) {
        this.fomulaStr = this.inputValue;
      }
    },
    dialogCancel() {
      this.$emit('cancel');
    },
    dialogConfirm() {
      if (!this.parserFunction || typeof this.parserFunction !== 'function') {
        console.error('未传入parser函数');
        return;
      }
      let validateStr;
      if (this.fomulaStr) {
        validateStr = this.fomulaStr.trim();
      }
      	var parserData ="";
      if(this.fomulaStr){
        parserData = this.parserFunction(this.fomulaStr);
      }
      
      this.$emit('confirm', parserData);
    },

    /**
     * textarea 部分
     */
    // 点击确定
    textareaConfirm() {
      // if (this.doValidate()) {
        this.dialogConfirm();
      // }else{
        // this.$message('校验不通过,请重新设置公式');
      // }
    },
    // 点击取消
    textareaCancel() {
      this.dialogCancel();
    },
      getCookie(cName) {
      let cStart;
      let cEnd;
      if (document.cookie.length > 0) {
        cStart = document.cookie.indexOf(cName + "=");
        if (cStart !== -1) {
          cStart = cStart + cName.length + 1;
          cEnd = document.cookie.indexOf(";", cStart);
          if (cEnd === -1) {
            cEnd = document.cookie.length;
          }
          return decodeURIComponent(document.cookie.substring(cStart, cEnd));
        }
      }
      return "";
    },  
    // 点击验证
    textareaValidate() {
      var oThis = this;
      let validateStr;
      if (this.fomulaStr) {
        validateStr = this.fomulaStr.trim();
      }
      var url = '/wbalone/formula/validate';
      if (this.getCookie('platform') == 'ifbp'){
        url = '/ifbp-app-bd/wbalone/formula/validate'
      }
      $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        contentType:'application/json',
        data:validateStr,
        async: false,
        success:function(result) {
          if (result.success == true || result.status == 1){
            oThis.$message({message:'验证通过',type:'success'});
          }else{
            oThis.$message({message:result.msg,type:'error'});
          }
        },
        error:function(e) {
          console.error(e);
           oThis.$message({message:'调用验证请求失败',type:'error'});
        }
      });

    },
    // 点击全选
    textareaSelectAll() {
      const textareaEle = this.$refs.fomulaTextarea.$refs.textarea;
      // textareaEle.focus();
      this.setSelectionByIndex(0, this.fomulaStr.length, textareaEle);
      // this.$refs.fomulaTextarea.$refs.input.focus();
    },
    // 点击清空
    textareaClearAll() {
      this.fomulaStr = '';
      this.setSelectionByIndex();
    },
    // textarea blur 事件
    textareaBlur(event) {
      this.setSelectionByIndex(event.target.selectionStart, event.target.selectionEnd);
    },
    // 设置光标位置
    setSelectionByIndex(start, end, ele) {
      // 如果传入对象, 就设置对象的选中值, 否则设置组件的当前选中位置
      const startIndex = typeof start === 'number' ? start : this.fomulaStr.length;
      const endIndex = typeof end === 'number' ? end : this.fomulaStr.length;
      if (!ele) {
        this.selectionStartIndex = startIndex;
        this.selectionEndIndex = endIndex;
        return;
      }

      // 防止光标移动至textarea末尾
      this.focusTimer = setTimeout(() => {
        if (this.focusTimer) {
          clearTimeout(this.focusTimer);
          this.focusTimer = null;
        }
        if (typeof ele.select === 'function') {
          ele.select();
        }
        ele.selectionStart = startIndex;
        ele.selectionEnd = endIndex;
      }, 0);
    },
    // 插入内容
    insertContent(str, ele) {
      // 获取 textarea dom 元素
      ele = ele || this.$refs.fomulaTextarea.$refs.textarea;

      // 不传入对象, 设置当前组件值
      if (ele && typeof window.setRangeText === 'function') {
        ele.setRangeText(str);
      } else {
        const prefixStr = this.fomulaStr.substring(0, this.selectionStartIndex);
        const suffixStr = this.fomulaStr.substring(this.selectionEndIndex);
        this.fomulaStr = prefixStr + str + suffixStr;
      }
      this.selectionStartIndex += str.length;
      this.selectionEndIndex = this.selectionStartIndex;
      this.setSelectionByIndex(this.selectionStartIndex, this.selectionStartIndex, ele);
    },

    /**
     * 计算器部分
     */
    // 点击数字或操作符
    calculatorClick(val) {
      this.insertContent(val);
    },

    /**
     * 模板部分
     */
    // 获取模板数据
    getFomulaTpls() {
      // let vm = this;
      // $.ajax({
      //   type: 'POST',
      //   url: '/fomula/getFomulatpls',
      //   dataType: 'json',
      //   success(result) {
      //     vm.fomulaTpls = result;
      //   },
      //   error() {
      //     console.log('获取fomula模板失败');
      //   }
      // });
      if (!this.getFomulaTplsFunction || typeof this.getFomulaTplsFunction !== 'function') {
        console.log('未传入获取模板函数');
        return;
      }
      const resFomulaTpls = this.getFomulaTplsFunction();
      if (resFomulaTpls) {
        this.fomulaTpls = resFomulaTpls;
      }
    },
    // 点击模板
    fomulaTplClick(fomula) {
      this.currentFomulaTpl = fomula;
      this.fomulaTips = fomula.hintMsg ? fomula.hintMsg : null;
    },
    // 双击模板
    fomulaTplDblClick(fomula) {
      // console.log(JSON.stringify(fomula));
      this.insertContent(fomula.inputSig);
    },

    /**
     * 数据库相关
     */
    // 获取表体 tab 数据
    getDatabase() {
      if (!this.getDatabaseFunction || typeof this.getDatabaseFunction !== 'function') {
        console.log('未传入getDatabase函数');
        return;
      }
      const resDatabase = this.getDatabaseFunction();
      if (resDatabase) {
        this.database = resDatabase;
      }
      // let vm = this;
      // $.ajax({
      //   type: 'POST',
      //   url: '/fomula/getDatabase',
      //   dataType: 'json',
      //   success(result) {
      //     console.log(result);
      //     vm.database = result;
      //   },
      //   error() {
      //     console.log('获取fomula表体失败');
      //   }
      // });
    },
    // field 点击事件
    fieldDblClick(val) {
      this.insertContent(val);
    },
    // 获取表列表数据
    getDatabaseTables() {
      if (!this.getDatabaseTablesFunction || typeof this.getDatabaseTablesFunction !== 'function') {
        console.log('未传入getDatabaseTables函数');
        return;
      }
      const resDatabaseTables = this.getDatabaseTablesFunction();
      if (resDatabaseTables) {
        this.databaseTables = resDatabaseTables;
      }
      // let vm = this;
      // $.ajax({
      //   type: 'POST',
      //   url: '/fomula/getDatabaseTables',
      //   dataType: 'json',
      //   success(result) {
      //     console.log(result);
      //     vm.databaseTables = result;
      //   },
      //   error() {
      //     console.log('获取表列表失败');
      //   }
      // });
    },
    // 点击表选项
    tableClick(table) {
      if (!this.getTableFieldsFunction || typeof this.getTableFieldsFunction !== 'function') {
        console.log('未传入getTableFields函数');
        return;
      }
      const tableId = table.id;
      const resTableFields = this.getTableFieldsFunction(tableId);
      if (resTableFields) {
        this.tableFields = resTableFields;
      }
      // let vm = this;
      // this.currentTable = table;
      // $.ajax({
      //   type: 'POST',
      //   url: '/fomula/getTableFields',
      //   dataType: 'json',
      //   data: {
      //     id: tableId
      //   },
      //   success(result) {
      //     console.log(result);
      //     vm.tableFields = result;
      //   },
      //   error() {
      //     console.log('获取字段列表失败');
      //   }
      // });
    },
    // 设置内容区最大高度
    setDialogHeight() {
      const el = this.$el;
      const dialogBody = el.querySelector('.el-dialog__body');
      const dialogHeight = window.innerHeight - 64 - 64 - 64;
      console.log(dialogHeight);
      if (dialogBody) {
        // dialogBody.style.maxHeight = dialogHeight + 'px';
      }
    }
  },
  mounted() {
    /*eslint no-undef: "off"*/
    const dialogContainer = $('.el-dialog--full');
    if (dialogContainer && typeof dialogContainer.perfectScrollbar === 'function') {
      $('.el-dialog--full').perfectScrollbar();
    }
  }
};
</script>
