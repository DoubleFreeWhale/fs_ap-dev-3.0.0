<template>
  <el-dialog
  title="公式配置"
  :visible="dialogVisible"
  class="formula-dialog"
  :before-close="close"
  :close-on-click-modal="true"
  size="small">
  <div id="formula-container">
    <div class="formula-head">
      <div class="formula-left-head">
        <span class="formula-circle">1</span>
        <span>选取公式</span>
        <div class="formula-operators" @click.stop="clickOperator($event)">
          <i class="formula-operator">x</i>
				  <i class="formula-operator">÷</i>
			  	<i class="formula-operator">+</i>
			  	<i class="formula-operator">-</i>
			  	<i class="formula-operator">&lt;</i>
			  	<i class="formula-operator">&gt;</i>
        </div>
      </div>
      <div class="formula-right-head">
        <el-select v-model="pSelectValue" @change="pSelectChange" placeholder="请选择">
          <el-option
            v-for="item in parentSelect"
            :key="item.value"
            :label="item.name"
            :value="item.value">
         </el-option>
        </el-select>
        <el-select v-model="cSelectValue" @change="cSelectChange" placeholder="请选择">
          <el-option
            v-for="item in childSelect"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="formula-textarea">
      <div class="formula-left-textarea">
        <span>取数公式</span>
        <el-input
          type="textarea"
          :rows="4"
          ref="formula"
          @input="handleInput"
          placeholder="请输入内容"
          v-model="formula">
        </el-input>
      </div>
      <div class="formula-right-textarea">
        <span>取数公式释义</span>
        <el-input
          type="textarea"
          :rows="4"
          :readonly="true"
          placeholder="公式释义"
          v-model="description">
        </el-input>
      </div>
    </div>
    <div class="formula-source-list">

      <el-tabs v-model="activeName">
        <el-tab-pane :disabled="true">
          <template slot="label"><span class="formula-circle">2</span><span>选择元数据</span></template>
        </el-tab-pane>
        <el-tab-pane label="角色管理" name="third">
          <div class="formula-selection">
            <div class="formula-left-selection">
              <span>1:元数据表</span>
              <ul class="formula-selection-list" @dblclick.stop="dblclickParent($event)" @click.stop="clickParent($event)">
                <el-tooltip v-for="(item,index) in tableList" :key="item[tableProp.name]+index"
                            :content="item[tableProp.value] + '  ' + item[tableProp.name]"
                            placement="top"
                            :disabled="!parentOverflow[item[tableProp.value]]">
                  <li :ref="item[tableProp.value]" :data-value="item[tableProp.value]" :class="item[tableProp.value] === tableValue ? 'formula-selection-item selected': 'formula-selection-item'">{{item[tableProp.name] + '  ' + item[tableProp.value]}}</li>
                </el-tooltip>
              </ul>
            </div>
            <div class="formula-right-selection">
              <span>2:元数据列</span>
              <ul class="formula-selection-list" @dblclick.stop="dblclickChild($event)" @click.stop="clickChild($event)">
                <el-tooltip v-for="(item,index) in columnList" :key="item[columnProp.name]+index"
                            :content="item[columnProp.name] + '  ' + item[columnProp.value]"
                            placement="top"
                            :disabled="!childOverflow[item[columnProp.value]]">
                  <li :ref="item[columnProp.value]" :data-value="item[columnProp.value]" :class="item[columnProp.value] === columnValue ? 'formula-selection-item selected': 'formula-selection-item'">{{item[columnProp.name] + '  ' + item[columnProp.value]}}</li>
                </el-tooltip>
              </ul>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
  export default {
    name: 'ElFormula',
    data() {
      return {
        // dialogVisible: false,
        formula: this.value,
        description: '',
        textarea: '',
        activeName: 'third',
        parentSelect: [],
        childSelect: [],
        pSelectValue: '',
        cSelectValue: '',
        parentData: [],
        childData: [],
        tableValue: '',
        columnValue: '',
        parentOverflow: {},
        childOverflow: {}
      };
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      tableList: {
        type: Array,
        default() {
          return [];
        }
      },
      columnList: {
        type: Array,
        default() {
          return [];
        }
      },
      tableProp: {
        type: Object,
        default() {
          return {
            value: 'value',
            name: 'name'
          };
        }
      },
      columnProp: {
        type: Object,
        default() {
          return {
            value: 'value',
            name: 'name'
          };
        }
      },
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      dblclickChild(e) {
        if (e.target.nodeName === 'LI') {
          this.columnValue = e.target.dataset.value;
          this.insert(this.columnValue);
        }
      },
      dblclickParent(e) {
        if (e.target.nodeName === 'LI') {
          this.tableValue = e.target.dataset.value;
          this.insert(this.tableValue);
        }
      },
      cTmpHandle(data) {
        var tmp = [];
        data.forEach((name, index) => {
          tmp.push({
            name: name,
            value: index.toString()
          });
        });
        return tmp;
      },
      beforeClose(done) {
        this.close();
        done();
      },
      close() {
        this.$emit('visibleHandle', false);
      },
      cancel() {
        this.close();
        this.$emit('cancel');
      },
      confirm() {
        this.close();
        this.$emit('confirm');
      },
      handleInput(value) {
        this.$emit('input', value);
        this.$emit('change', value);
      },
      pSelectChange(value) {
        if (value.length > 0) {
          this.$http({
            url: '/formula/formula/formulas?typeId=' + encodeURIComponent(value),
            method: 'get'
          }).then((res) => {
            this.childSelect = this.cTmpHandle(res.data);
            this.cSelectValue = '';
          });
        }
      },
      cSelectChange(value) {
        var name = '';
        if (value.length > 0) {
          for (var i = 0; i < this.childSelect.length; i++) {
            if (this.childSelect[i].value === value) {
              name = this.childSelect[i].name;
              break;
            }
          }
          this.insert(name);
        }
      },
      clickOperator(e) {
        if (e.target.nodeName === 'I') {
          this.insert(this.decodeOperator(e.target.innerHTML));
        }
      },
      insert(text) {
        var dom = this.$refs.formula.$refs.textarea;
        var value = this.formula;
        var start = dom.selectionStart;
        var end = dom.selectionEnd;
        value = value.slice(0, start) + text + value.slice(end, value.length);
        this.formula = value;
        this.$emit('input', value);
        this.$emit('change', value);
      },
      decodeOperator(operator) {
        var result = operator;
        if (result === '&lt;') {
          result = '<';
        } else if (result === '&gt;') {
          result = '>';
        }
        return result;
      },
      clickParent(e) {
        if (e.target.nodeName === 'LI') {
          this.tableValue = e.target.dataset.value;
          this.$emit('tableChange', this.tableValue);
        }
      },
      clickChild(e) {
        if (e.target.nodeName === 'LI') {
          this.columnValue = e.target.dataset.value;
        }
      },
      initSelect() {
        this.$http({
          url: '/formula/formula/types',
          mothod: 'get'
        }).then((res) => {
          this.parentSelect = this.tmpHandle(res.data);
        });
      },
      tmpHandle(data) {
        var tmp = [];
        Object.keys(data).forEach((key) => {
          tmp.push({
            value: key,
            name: data[key]
          });
        });
        return tmp;
      },
      /*eslint-disable*/
      computeVisibility(name){
        var tmp = {};
        var list;
        var key;
        if (name === 'parent') {
          list = this.tableList;
          key = this.tableProp.value;
        } else {
          list = this.columnList;
          key = this.columnProp.value;
        }

        this.$nextTick(() => {
          list.forEach((data) => {
            if (this.$refs[data[key]] && this.$refs[data[key]][0].offsetWidth < this.$refs[data[key]][0].scrollWidth) {
              tmp[data[key]] = true;
            } else {
              tmp[data[key]] = false;
            }
          });
          name === 'parent' ? this.parentOverflow = tmp : this.childOverflow = tmp;
        });
      }
      /*eslint-enable*/
    },
    created() {
      this.initSelect();
    },
    mounted() {
      this.computeVisibility('parent');
      this.computeVisibility('child');
    },
    watch: {
      tableList: {
        handler: function() {
          this.computeVisibility('parent');
        }
      },
      columnList: {
        handler: function() {
          this.computeVisibility('child');
        }
      },
      value: {
        handler: function(value) {
          this.formula = value;
        },
        immediate: true
      }
    }
  };
</script>

<style scoped>
  #formula-container {
    width:100%;
    height:400px;
  }

  .formula-operators,.formula-left-head,.formula-right-head {
    display: inline-block;
  }
  .formula-left-head {
    width: 35%;
  }
  .formula-right-head {
    width: 64%;
    padding-left: 25px;
  }
  .formula-left-textarea,.formula-right-textarea,.formula-left-selection,.formula-right-selection {
    width: 40%;
    vertical-align: top;
  }
  .formula-textarea,.formula-selection {
    padding-top: 10px;
  }
  .formula-left-textarea,.formula-left-selection {
    margin-right: 9%;
  }
  .formula-right-textarea,.formula-right-selection {
    margin-left: 9%;
  }
  .formula-selection-list:hover {
    border-color: #8397a5;
  }
  .formula-selection-list {
    height: 180px;
    border: 1px solid #bfd0d9;
    border-radius: 4px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    padding: 10px;
    overflow-y: auto;
  }
  .formula-selection-item {
    line-height: 19px;
    padding: 6px;
    border: 1px solid white;
    overflow: hidden;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .formula-selection-item.selected {
    background-color: rgba(239, 243, 246, 1)
  }
  .formula-selection-item:hover {
    border-color: #ccc;
  }
  .formula-operators .formula-operator {
    text-align: center;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    border-radius: 4px;
    width: 20px;
    cursor: pointer;
    background-color: rgba(250, 251, 252, 1);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(206, 208, 218, 1);
    font-size: 12px;
  }
  .formula-circle {
    display: inline-block;
    background-color: #333333;
    width: 14px;
    height: 16px;
    color: #FFFFFF;
    border-radius: 14px;
    text-align: center;
    line-height: 16px;
  }
  .formula-left-textarea,.formula-right-textarea,.formula-left-selection,.formula-right-selection {
    display: inline-block;
  }

</style>
