<template>
  <el-form :model="templateValue" ref="form" :rules="rules" :class="isEdit ? 'yon-form edit' : 'yon-form view'" :inline="true" style="width:100%;">
    <el-row v-for="row in data" v-if="isRowDisplay(row.layoutDetail)">
      <el-form-item :prop="getItemCode(layout)" :validateStatus="validateStatus" v-for="layout in row.layoutDetail" label="label" :class="layout.componentKey==='Grid'?'yon-grid':'yon-form yonCount-'+(row.size === 'large'?1:row.size)" :style="{width:getWidth(row.size), visibility:isItemShow(layout)}">
        <template slot="label">
            <tooltip
              :content="noLabel.indexOf(layout.componentKey)<0? layout.title + ' :' : ''"
              :handler="handleTitle">
            </tooltip>
        </template>
        <div @trigger="trigger" :ref="getItemCode(layout) + '1'" :is="map[layout.componentKey]" :isEdit="isEdit" :itemCode="itemCount" :data="layout" :templateValue="templateValue" :refQueryParams="refQueryParams" :refBeforeQuery="refBeforeQuery"></div>
      </el-form-item>
    </el-row>
 </el-form>

</template>

<script>
import select from './Select';
import input from './Input';
import datepicker from './Datepicker';
import table from './Table';
import ref from './refDialog';
import grid from './grid';
import image from './image.vue';
import checkbox from './checkBox.vue';
import tooltip from './toolTip.vue';

export default {
  name: 'tplForm',
  data() {
    var width = '200px';
    var isInline = true;
    return {
      labelWidth: width,
      isInline: isInline,
      map: {
        Select: 'yon-select',
        CheckBox: 'yon-checkbox',
        Text: 'yon-input',
        Money: 'yon-input',
        Phone: 'yon-input',
        Email: 'yon-input',
        Mobile: 'yon-input',
        NumberComponent: 'yon-input',
        TextArea: 'yon-input',
        DateComponent: 'yon-datepicker',
        TableLayout: 'yon-table',
        ImageComponent: 'yon-image',
        Reference: 'yon-ref',
        // Grid: 'tplForm',
        Grid: 'yon-grid',
        DataTable: 'tplForm',
        GroupTable: 'ElTemplate'
      },
      validateStatus: '',
      itemCount: 2,
      extraClass: '',
      noLabel: ['GroupTable', 'Grid', 'TableLayout']
    };
  },
  methods: {
    trigger: function(event, data) {
      this.$emit('trigger', event, data);
    },
    isRowDisplay(row) {
      var tmp = false;
      row.forEach((item) => {
        tmp = tmp || item.isDisplay;
      });
      return tmp;
    },
    isItemShow(item) {
      var visible = Object.prototype.toString.call(item.isDisplay) === '[object Boolean]' ? item.isDisplay : true;
      return visible ? 'visible' : 'hidden';
    },
    getWidth(size){
      var nowSize = size === 'large'? 1 : size;
      return  90/nowSize + '%';
    },
    getItemCode(item) {
      return item.itemCode ? item.itemCode.split('.').pop() : '';
    },
    handleTitle(content) {
      return content.substr(0, content.length - 2);
    }
  },
  watch: {
    isEdit() {
      if (!this.isEdit) {
        this.validateStatus = '' + (new Date()).getTime();
      }
    }
  },
  created() {
    // this.adjustStyle();
  },
  props: ['data', 'templateValue', 'isEdit', 'rules', 'refQueryParams', 'refBeforeQuery'],
  components: {
    'tooltip': tooltip,
    'yon-select': select,
    'yon-input': input,
    // 'yon-label':label,
    'yon-datepicker': datepicker,
    'yon-table': table,
    'yon-ref': ref,
    'yon-image': image,
    'yon-grid': grid,
    'yon-checkbox': checkbox
  }
};

</script>

<style>
.yon-form.el-form--inline .el-form-item{
  margin-right: 0px;
  padding-bottom: 0px;
}

.yon-form.view .el-form-item.is-required .el-form-item__label:after{
  display: none;
}

.yon-form .el-form-item__error{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}
</style>
<style scoped>
.required-flag {
  color: red;
  display: inline-block;
  width: 10px;
  visibility: hidden;
  vertical-align: top;
  font-size: 14px;
  line-height: 16px;
  padding-bottom: 10px;
  padding-top: 10px;
}
.required-flag.required{
  visibility: visible;
}
</style>
