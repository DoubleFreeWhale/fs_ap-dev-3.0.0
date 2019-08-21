<template>
<div class="table-container" :style="{width:containerWidth}">
  <el-form :model="data"  :inline="true" :style="{width:maxcols>3 ? 330*maxcols+'px' : '100%'}">
      <el-form-item v-for="layout in table" :style="{width:maxcols>3?'330px':100/maxcols+'%'}" :class="layout.componentKey==='Grid'?'yon-grid':'yon-form'" :label="layout.title+':'" v-if="Object.prototype.toString.call(layout.isDisplay) === '[object Boolean]' ? layout.isDisplay : true">
        <span :class="layout.required?'required-flag required':'required-flag'">*</span><div @trigger="trigger" :is="map[layout.componentKey]" :isEdit="isEdit" :data="layout" :templateValue="templateValue"></div>
      </el-form-item>
    </el-form>
</div>
</template>
<script>
import select from './Select';
import input from './Input';
import datepicker from './Datepicker';
import ref from './refDialog';
import image from './image.vue';
import checkbox from './checkBox.vue';
export default{
  data() {
    // var display=this.data.titleLayout==='field-hoz'?'block':'inline-block';
    return {
      table: [],
      tableWidth: '',
      containerWidth: '',
      maxcols: 1,
      map: {
        Select: 'yon-select',
        CheckBox: 'yon-checkbox',
        Text: 'yon-input',
        Money: 'yon-input',
        Phone: 'yon-input',
        Email: 'yon-input',
        Mobile: 'yon-input',
        NumberComponent: 'yon-input',
        Label: 'yon-label',
        TextArea: 'yon-input',
        DateComponent: 'yon-datepicker',
        ImageComponent: 'yon-image',
        Reference: 'yon-ref'
      }
    };
  },
  props: ['data', 'templateValue', 'isEdit'],
  methods: {
    removeBlank: function() {
      var table = [];
      var maxcols = 0;
      var tmp = [];
      var dump = '';
      var count = 0;
      for (var row = 0;row < this.data.rows;row++) {
        for (var col = 0;col < this.data.cols;col++) {
          count = row * this.data.cols;
          dump = this.data.layoutDetail[count + col].layoutDetail ? this.data.layoutDetail[count + col].layoutDetail : [];
          if (dump.length > 0) {
            tmp.push(dump[0]);
          }
        }
        if (tmp.length > 0) {
          table.push(tmp);
          if (tmp.length > maxcols) {
            maxcols = tmp.length;
          }
          tmp = [];
        }
      }
      this.maxcols = maxcols;
      return table;
    },
    trigger: function(event, value) {
      this.$emit('trigger', event, value);
    },
    getComponents(data) {
      var tmp = [];
      data.forEach((v) => {
        v.forEach((item) => {
          tmp.push(item);
        });
      });
      return tmp;
    }
  },
  components: {
    'yon-select': select,
    'yon-input': input,
    'yon-datepicker': datepicker,
    'yon-ref': ref,
    'yon-image': image,
    'yon-checkbox': checkbox
  },
  created() {
    this.table = this.getComponents(this.removeBlank());
    this.tableWidth = 330 * this.maxcols;
    this.containerWidth = this.maxcols > 2 ? (960 + this.maxcols * 10) + 'px' : '100%';
  }
};
</script>
<style>

</style>
<style scoped>
.required-flag {
  color: red;
  display: inline-block;
  width: 10px;
  visibility: hidden;
}
.required-flag.required{
  visibility: visible;
}
.table-container{
  overflow: auto;
}
.billitem-label-content{
  width:100px;
}
.fieldset{
  height:37px;
}
.norequired-div-vertical {
    max-width: 170px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.norequired-div-hoz {
    max-width: 118px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    float: left;
}
label {
    color: #48576a;
    padding-left: 10px;
    width:100px;
}
.label-hoz {
    width: 135px;
    text-align: right;
    padding-top: 4px;
    vertical-align: middle;
}
</style>
