<template>
  <div>
    <div class="divBox" id="self-grid" :style="gridStyle2">
      <!-- 表格 -->
      <el-row type="flex" justify="center">
        <el-table
          v-loading.body="loading"
          :data="tableData"
          empty-text=""
          :border="showBorder === true ? showBorder : false"
          fit
          :max-height="maxHeight"
          :default-expand-all="!!defaultExpandAll"
          :row-key="rowKey"
          :expand-row-keys="expandRowKeys"
          :style="tableStyle2"
          @select="select"
          @select-all="selectAll"
          @selection-change="selectionChange"
          @row-click="handleRowClick"
          @expand="expandRow"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          :elcolumn-style="elcolumnStyle"
          :highlight-current-row="highlightCurrentRow"
        >
          <el-table-column type="expand" v-if="expand">
            <template scope="props">
              <el-form :model="props.row" ref="form" :rules="rules" :class="isEdit ? 'yon-form edit' : 'yon-form view'" :inline="true" style="width:100%;">
                <el-form-item v-for="layout in showedlayoutDetail" :class="'yon-form'+extraClass" :prop="layout.flag" :style="{width:itemCount>3?'300':90/itemCount + '%'}" :label="layout.title">
                  <div @trigger="trigger" :is="map[layout.componentKey]" :isEdit="isEdit" :itemCode="itemCount" :data="layout" :templateValue="props.row"></div>
                </el-form-item>
              </el-form>
              <el-row :style="{'text-align': expand.buttonAlign || 'center'}">
                <el-col>
                  <el-button v-for="button in expand.buttons" style="width:80px" size="small" type="primary" @click="handleClickFormButton(button.name, props.$index, props.row)" :type="button.type === 'normal' ? '' : button.type || 'primary'" :icon="button.icon || ''" v-if="expand.buttons && expand.buttons.length">{{button.text || ''}}</el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            :type="showType2"
            v-if="showType2 === 'selection'"
            width="45">
          </el-table-column>
          <el-table-column
            v-else-if="showType2 === 'index'"
            :label="indexLabel ? indexLabel : '序号'"
            align="center"
            header-align="center"
            width="70">
            <template scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="index in columnsShowCount"
            :prop="columns[index-1].flag"
            :label="columns[index-1].name"
            :min-width="columns[index-1].width"
            :sortable="sortable === true ? sortable : (columns[index-1].sortable === true ? columns[index-1].sortable : false)"
            :align="align!==undefined ? align : 'left'"
            :header-align="headerAlign!==undefined ? headerAlign : 'left'"
          >
            <template scope="scope">
              <div v-if="columns[index-1].componentKey==='Select'">
                <span v-for="option in columns[index-1].options" :style="{display: (option.selectionId !== null && option.selectionId !== undefined) && (scope.row[columns[index-1].flag] !== null && scope.row[columns[index-1].flag] !== undefined) && option.selectionId.toString() === scope.row[columns[index-1].flag].toString() ? 'block' : 'none'}">
                  {{option.name}}
                </span>
              </div>
              <div v-else-if="columns[index-1].componentKey==='ImageComponent'">
                <img :src="imgUrl + scope.row[columns[index-1].flag]" style="width: 35px;height: 45px;display: block;margin: 1px;">
              </div>
              <div v-else-if="columns[index-1].componentKey==='Reference'">
                <span>
                {{scope.row['beanMap'] &&
                  scope.row['beanMap'][columns[index-1].flag+'_ref'] &&
                  scope.row['beanMap'][columns[index-1].flag+'_ref'][scope.row[columns[index-1].flag]] &&
                  scope.row['beanMap'][columns[index-1].flag+'_ref'][scope.row[columns[index-1].flag]].name}}
                </span>
              </div>
              <yon-datepicker v-else-if="columns[index-1].componentKey==='DateComponent'" :data="showedlayoutDetail[index-1]" :isEdit="false" :templateValue="scope.row"></yon-datepicker>
              <div v-else>
                <span>{{scope.row[columns[index-1].flag]}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            label="操作"
            :width="showButton2.width || 100"
            header-align="center"
            :render-header="renderHeader"
            v-if="showButton2 && showButton2.buttons && showButton2.buttons.length>0"
          >
            <template scope="scope" :showButton2="showButton2">
              <div id="optionButton" style="text-align: center;" :style="{display: hoverShowButton === true ? 'none' : 'block','text-align': 'center'}">
                <el-tooltip v-for="item in showButton2.buttons" v-if="typeof item.according === 'function' ? item.according(scope.row) : (!item.according || scope.row[item.according])" :disabled="!item.content" :effect="item.effect || 'dark'" :content="item.content || ''" :placement="item.placement || 'top'">
                  <i v-if="item.icon" @click="handleClick(item.name,scope)" :class="'el-icon-'+item.icon" :style="{color:item.color||'#20a0ff', padding: '0 6px', 'font-size': item.fontSize || '16px', cursor: 'pointer'}"></i>
                  <el-button v-else-if="item.text" type="text" style="margin: 0 6px;">{{item.text}}</el-button>
                </el-tooltip>
              </div>
              <!-- <el-button-group v-if="showButton2.group || true">
                <el-button v-for="item in showButton2.buttons" @click="handleClick(item.name,scope)" :type="item.type || 'primary'" :icon="item.icon || ''" size="small">
                  <span v-if="!!item.text">{{item.text}}</span>
                </el-button>
              </el-button-group>
              <el-button v-for="item in showButton2.buttons"  @click="handleClick(item.name,scope)" :type="item.type || 'primary'" :icon="item.icon || ''" size="small" v-else>
                <span v-if="!!item.text">{{item.text}}</span>
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <el-dialog v-model="transferVisible" custom-class="transfer_self">
      <el-transfer
        :titles="['隐藏列', '显示列']"
        v-model="transfer.value"
        :data="transfer.data"
        @change="handleChange">
      </el-transfer>
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash';
  import select from './Select';
  import input from './Input' ;
  import datepicker from './Datepicker';
  import ref from './refDialog';
  import image from './image.vue';

  export default {
    data() {
      var width = '200px';
      var isInline = true;
      return {
        tableData: [],
        columns: [], // 存储可见的列信息，用于循环生成列
        layoutDetail: [], // 存储所有可见及不可见列
        showedlayoutDetail: [], // 存储所有layoutDetail中的可见layout，用于extend时循环生成展开表单
        loading: false,
        transfer: {
          data: [],
          value: []
        },
        transferVisible: false,
        gridStyle1: {},
        labelWidth: width,
        isInline: isInline,
        map: {
          Select: 'yon-select',
          Money: 'yon-input',
          Phone: 'yon-input',
          Email: 'yon-input',
          Mobile: 'yon-input',
          Text: 'yon-input',
          TextArea: 'yon-input',
          NumberComponent: 'yon-input',
          DateComponent: 'yon-datepicker',
          ImageComponent: 'yon-image',
          Reference: 'yon-ref'
        },
        itemCount: 2,
        extraClass: ''
      };
    },
    props: [
      'data',
      'templateValue',
      'rules',
      'showButton',
      'showType',
      'showBorder',
      'align',
      'sortable',
      'indexLabel',
      'headerAlign',
      'gridStyle',
      'tableStyle',
      'isEdit',
      'expand',
      'defaultExpandAll',
      'expandRowKeys',
      'rowKey',
      'imgUrl',
      'imgStyles',
      'hoverShowButton',
      'elcolumnStyle',
      'highlightCurrentRow'
    ],
    methods: {
      require(tmpValue) {
        this.tableData.length = 0;
        this.filterLayoutDetail();
        this.getcolumns();
        const templateValue = tmpValue || this.templateValue;
        if (templateValue && templateValue.length) {
          const self = this;
          templateValue.forEach(function(item) {
            self.tableData.push(item);
          });
        } else {
          self.tableData = [];
        }
      },
      renderHeader(createElement, { column }) {
        return createElement(
          'div',
          {
            style: {
              cursor: 'pointer'
            },
            on: {
              click: this.editColumns
            }
          },
          [
            '操作',
            createElement(
              'i',
              {
                'class': {
                  'el-icon-setting': true,
                  'operate-column': true
                }
              }
            )
          ]
        );
      },
      // 显示隐藏列
      editColumns() {
        this.transferVisible = true;
      },
      // 根据位置查找一行数据
      getDataItem(index) {
        return this.tableData[index];
      },
      // 点击全选触发
      selectAll(selection) {
        this.$parent.$emit('select-all', selection);
      },
      select(selection, row) {
        this.$parent.$emit('select', selection, row);
      },
      selectionChange(selection) {
        this.$parent.$emit('selection-change', selection);
      },
      expandRow(row, expanded) {
        this.$parent.$emit('expand-row', row, expanded);
      },
      // 最后一列按钮点击触发事件
      handleClick(eventName, scope) {
        const viewRowIndex = scope.$index;
        this.$parent.$emit(eventName + '-table-row', scope.row, viewRowIndex);
      },
      handleRowClick(row, event, column) {
        const rowIndex = event.currentTarget.rowIndex;
        this.$parent.$emit('row-click', rowIndex, row, event, column);
      },
      cellMouseEnter(row, column, cell, event) {
        this.$parent.$emit('cell-mouse-enter', row, column, cell, event);
        if (this.hoverShowButton === true) {
          const target = event.currentTarget;
          var optionButton = target.parentNode.querySelector('#optionButton');
          if (optionButton && optionButton.style) {
            optionButton.style.display = 'block';
          }
        }
      },
      cellMouseLeave(row, column, cell, event) {
        this.$parent.$emit('cell-mouse-leave', row, column, cell, event);
        if (this.hoverShowButton === true) {
          const target = event.currentTarget;
          var optionButton = target.parentNode.querySelector('#optionButton');
          if (optionButton && optionButton.style) {
            optionButton.style.display = 'none';
          }
        }
      },
      filterLayoutDetail() {
        const layoutDetail = (this.data && this.data.layoutDetail) ? this.data.layoutDetail : this.data;
        const self = this;
        this.layoutDetail = [];
        layoutDetail.forEach((v, i) => {
          if (v.isDisplay) {
            self.layoutDetail.push(v);
          }
        });
      },
      getcolumns() {
        let tmp = [];
        let showedTmp = [];
        this.transfer.value = [];
        this.transfer.data = [];
        const self = this;
        this.layoutDetail.forEach((v, i) => {
          if (v.isDisplay) {
            const flag = v.itemCode.split('.').pop();
            const columnItem = {
              flag: flag,
              componentKey: v.componentKey,
              name: v.title,
              width: v.width ? v.width : 50
            };
            if (v.componentKey === 'Select') {
              columnItem.options = v.options;
            }
            tmp.push(columnItem);
            var obj = _.assign({flag: flag}, v);
            showedTmp.push(obj);
            self.transfer.value.push(i);
          }
          self.transfer.data.push({
            label: v.title,
            key: i,
            itemId: v.itemId
          });
        });
        this.columns = tmp;
        this.showedlayoutDetail = showedTmp;
      },
      handleChange(value, direction, movedKeys) {
        var movedKeys2 = JSON.parse(JSON.stringify(movedKeys));
        if (value.length === 0 && direction === 'left') {
          this.$message('至少需显示一列！');
          var lastKey = movedKeys2.pop();
          this.transfer.value.push(lastKey);
        }
        for (let i = 0; i < movedKeys2.length; i++) {
          this.layoutDetail[movedKeys[i]].isDisplay = (direction !== 'left');
        }
        this.getcolumns();
      },
      trigger: function(event, data) {
        this.$emit('trigger', event, data);
      },
      adjustStyle() {
        var length = this.data.layoutDetail.length;
        this.itemCount = length > 2 ? 2 : length;
        if (this.data.layoutDetail[0].componentKey !== 'TableLayout') {
          this.extraClass = ' yonCount-' + this.itemCount;
        }
      },
      handleClickFormButton(name, index, row) {
        this.$parent.$emit(name + '-expand-form', index, row);
      }
    },
    created: function() {
      this.require();
      this.adjustStyle();
    },
    computed: {
      showButton2() {
        return this.showButton ? this.showButton : {};
      },
      showType2() {
        let type;
        if (['select', 'selection'].indexOf(this.showType) > -1) {
          type = 'selection';
        } else if (this.showType === 'index') {
          type = 'index';
        } else {
          type = false;
        }
        return type;
      },
      gridStyle2() {
        return this.gridStyle ? _.assign(this.gridStyle1, this.gridStyle) : this.gridStyle1;
      },
      tableStyle2() {
        const tableStyle1 = this.expand ? {'width': '100%'} : {'max-height': '400px', 'width': '100%'};
        return this.tableStyle ? _.assign(tableStyle1, this.tableStyle) : tableStyle1;
      },
      maxHeight() {
        return this.tableStyle2['max-height'] ? parseInt(this.tableStyle2['max-height'].split('px')[0], 10) : 400;
      },
      columnsShowCount() { // 表格显示的列数
        return this.expand && this.expand.columnsShowCount && this.expand.columnsShowCount < this.columns.length ? this.expand.columnsShowCount : this.columns.length;
      }
    },
    watch: {
      templateValue: {
        handler: function(val) {
          this.require(val);
        },
        deep: true
      }
    },
    components: {
      'yon-select': select,
      'yon-input': input,
      'yon-datepicker': datepicker,
      'yon-ref': ref,
      'yon-image': image
    }
  };
</script>
<style>
  .divBox .el-form-item__label {
    font-size: 15px;
  }
  .searchBox{ padding-top: 3px }
  #self-grid .operate-column{
    color: #97a8be;
    margin-left: 10px;
    font-size: 15px;
  }
  #self-grid .el-dialog.el-dialog--small.transfer_self{
    width: 530px;
  }
  #self-grid .el-table__expanded-cell {
    padding: 20px 10px;
  }
  /* .el-dialog.transfer_self {
    width: 500px;
  } */
  #self-grid .yon-form.view .el-form-item.is-required .el-form-item__label:after{
    display: none;
  }
</style>
