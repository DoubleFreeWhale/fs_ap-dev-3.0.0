<template>
  <div>
    <ifbp-tooltip :content="displayValue" :diff="diffLabel" v-show="editable === false"></ifbp-tooltip>
    <div v-show="editable">
      <el-input v-if="IsPC"
        class="el-date-editor"
        :class="[
          'el-date-editor--' + type,
          {'el-date-noIcon': !showIcon}
        ]"
        :readonly="currentReadonly"
        :disabled="disabled"
        :size="size"
        v-clickoutside="handleClose"
        :placeholder="placeholder"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.native="handleKeydown"
        :value="displayValue"
        @change.native="displayValue = $event.target.value;this.$emit('change',this.value);this.dispatch('ElFormItem', 'el.form.change',this.value);"
        :validateEvent="false"
        ref="reference">
        <!-- 将 ifbp-icon-power-off 替换为 el-icon-circle-close, 前者有样式冲突-->
        <i slot="icon"
          class="el-input__icon"
          @click="handleClickIcon"
          :class="[showClose ? 'el-icon-circle-close' : triggerClass]"
          @mouseenter="handleMouseEnterIcon"
          @mouseleave="showClose = false"
          v-if="haveTrigger && showIcon">
        </i>
      </el-input>
      <!--移动端如下组件 -->
      <el-input v-else
        :value="displayValue"
        :readonly="currentReadonly"
        :disabled="disabled"
        @focus="handleFocus"
        @blur="handleBlur"
        v-clickoutside="handleClose"
        :placeholder="placeholder"
        :size="size"
        @change.native="displayValue = $event.target.value;this.$emit('change',this.value);this.dispatch('ElFormItem', 'el.form.change',this.value);"
      >
        <i slot="icon"
          class="el-input__icon"
          @click="handleClickIcon1"
          v-if="showIcon"
          :class="[showClose ? 'el-icon-circle-close' : triggerClass]">
        </i>
      </el-input>
      <mt-datetime-picker v-if="!IsPC && type=='daterange'" :tipBtn="true" :tipText="tipText"  :startDate="startDate" :endDate="endDate" ref="mtpicker" :format="format" type="date" @confirm="confirmDatatime">
      </mt-datetime-picker>
      <mt-datetime-picker v-else-if="!IsPC && type=='datetimerange'" :tipBtn="true" :tipText="tipText"  :startDate="startDate" :endDate="endDate" ref="mtpicker" :format="format" type="datetime" @confirm="confirmDatatime">
      </mt-datetime-picker>
      <mt-datetime-picker v-else-if="!IsPC" :startDate="startDate" :endDate="endDate" ref="mtpicker" :format="format" :type="type" @confirm="confirmDatatime">
      </mt-datetime-picker>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import Clickoutside from 'ifbp-element/src/utils/clickoutside';
import { formatDate, parseDate, getWeekNumber, equalDate, isDate } from './util';
import Popper from 'ifbp-element/src/utils/vue-popper';
import Emitter from 'ifbp-element/src/mixins/emitter';
import ElInput from 'ifbp-element/packages/input';
import MtPicker from 'ifbp-element/packages/datetime-picker';
import { IsPC } from 'ifbp-element/src/utils/util';

const NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
};

const DEFAULT_FORMATS = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  week: 'yyyywWW',
  timerange: 'HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  year: 'yyyy'
};
const HAVE_TRIGGER_TYPES = [
  'date',
  'datetime',
  'time',
  'time-select',
  'week',
  'month',
  'year',
  'daterange',
  'timerange',
  'datetimerange'
];
const DATE_FORMATTER = function(value, format) {
  return formatDate(value, format);
};
const DATE_PARSER = function(text, format) {
  return parseDate(text, format);
};
const RANGE_FORMATTER = function(value, format, separator) {
  if (Array.isArray(value) && value.length === 2) {
    const start = value[0];
    const end = value[1];

    if (start && end) {
      return formatDate(start, format) + separator + formatDate(end, format);
    }
  }
  return '';
};
const RANGE_PARSER = function(text, format, separator) {
  const array = text.split(separator);
  if (array.length === 2) {
    const range1 = array[0];
    const range2 = array[1];

    return [parseDate(range1, format), parseDate(range2, format)];
  }
  return [];
};
const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value) {
      if (!value) return '';
      return '' + value;
    },
    parser(text) {
      if (text === undefined || text === '') return null;
      return text;
    }
  },
  week: {
    formatter(value, format) {
      let date = formatDate(value, format);
      const week = getWeekNumber(value);

      date = /WW/.test(date)
            ? date.replace(/WW/, week < 10 ? '0' + week : week)
            : date.replace(/W/, week);
      return date;
    },
    parser(text) {
      const array = (text || '').split('w');
      if (array.length === 2) {
        const year = Number(array[0]);
        const month = Number(array[1]);

        if (!isNaN(year) && !isNaN(month) && month < 54) {
          return text;
        }
      }
      return null;
    }
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  month: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  year: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  number: {
    formatter(value) {
      if (!value) return '';
      return '' + value;
    },
    parser(text) {
      let result = Number(text);

      if (!isNaN(text)) {
        return result;
      } else {
        return null;
      }
    }
  }
};
const PLACEMENT_MAP = {
  left: 'bottom-start',
  center: 'bottom-center',
  right: 'bottom-end'
};

// only considers date-picker's value: Date or [Date, Date]
const valueEquals = function(a, b) {
  const aIsArray = a instanceof Array;
  const bIsArray = b instanceof Array;
  if (aIsArray && bIsArray) {
    return new Date(a[0]).getTime() === new Date(b[0]).getTime() &&
           new Date(a[1]).getTime() === new Date(b[1]).getTime();
  }
  if (!aIsArray && !bIsArray) {
    return new Date(a).getTime() === new Date(b).getTime();
  }
  return false;
};

export default {
  mixins: [Emitter, NewPopper],

  props: {
    size: String,
    format: String,
    readonly:{
      type:Boolean,
      default:false
    },
    monthonly: Boolean,
    placeholder: String,
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    popperClass: String,
    editable: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: 'left'
    },
    value: {},
    defaultValue: {},
    rangeSeparator: {
      default: ' - '
    },
    pickerOptions: {},
    startDate: {
      type: Date,
      default() {
        return new Date(new Date().getFullYear() - 50, 0, 1);
      }
    },
    endDate: {
      type: Date,
      default() {
        return new Date(new Date().getFullYear() + 50, 11, 31);
      }
    },
    diff: {},
    valuetoms:{
      type: Boolean,
      default: false
    },
    showIcon:{
      type: Boolean,
      default: true
    }
  },

  components: { ElInput },

  directives: { Clickoutside },

  data() {
    return {
      pickerVisible: false,
      showClose: false,
      // flag: true,
      currentValue: '',
      currentReadonly:"",
      unwatchPickerOptions: null,
      mtFormatValue: '',
      IsPC: IsPC(),
      isfirst:true,
      dateArr:[],
      mtFormatDateArr:[],
      tipText:"开始时间",
      TimeOut:null
    };
  },

  watch: {
    editable(editable){
      this.dispatch('ElFormItem', 'editableChange', [editable]);
    },
    pickerVisible(val) {
      if (!val) this.dispatch('ElFormItem', 'el.form.blur');
      if (this.currentReadonly || this.disabled) return;
      val ? this.showPicker() : this.hidePicker();
    },
    currentValue(val) {
      if (val) return;
      if (this.picker && typeof this.picker.handleClearNoEmmit === 'function') {
        this.picker.handleClearNoEmmit();
      } else {
        this.$emit('input', val);
      }
    },
    mtFormatValue(val) {
      if (val) return;
      this.$emit('input', val);
    },
    value: {
      immediate: true,
      handler(val) {
        if(this.type === 'time-select') {
          this.currentValue = val;
        } else {
          if(this.IsPC) {
            this.currentValue = isDate(val) ? new Date(val) : isDate(parseInt(val))? new Date(parseInt(val)) : val;
          } else {
            this.mtFormatValue = isDate(val) ? new Date(val) : isDate(parseInt(val))? new Date(parseInt(val)) : val;
          }
        }

      if(this.TimeOut){
        clearTimeout(this.TimeOut);
      }
      this.TimeOut = setTimeout(()=>{
        this.$emit('valuechange',val);
        this.TimeOut = null;
        clearTimeout(this.TimeOut);
      },200);

      }
    },
    displayValue(val) {
      // this.$emit('change', val);
      // this.dispatch('ElFormItem', 'el.form.change');
    },
    readonly: {
      immediate: true,
      handler(val){
        //在移动端设置为`readonly='true'`.否则,focus时会同时弹出软键盘和时间选择的panel.
        if(!this.IsPC) {
          this.currentReadonly = true;
        }else{
          this.currentReadonly = this.readonly;
        }
      }
    }
  },

  computed: {
    reference() {
      return this.$refs.reference.$el;
    },

    refInput() {
      if (this.reference) return this.reference.querySelector('input');
      return {};
    },

    valueIsEmpty() {
      const val = this.currentValue;
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; i++) {
          if (val[i]) {
            return false;
          }
        }
      } else {
        if (val) {
          return false;
        }
      }
      return true;
    },

    triggerClass() {
      return this.type.indexOf('time') !== -1 ? 'el-icon-time' : 'el-icon-date';
    },

    selectionMode() {
      // if (this.type === 'week') {
      //   return 'week';
      // } else
      if (this.type === 'month') {
        return 'month';
      } else if (this.type === 'year') {
        return 'year';
      }

      return 'day';
    },

    haveTrigger() {
      if (typeof this.showTrigger !== 'undefined') {
        return this.showTrigger;
      }
      return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
    },

    displayValue: {
      get() {
        let value;
        if(this.IsPC) {
           value = this.currentValue;
        } else {
          value = this.mtFormatValue;
        }
        if (!value) return;
        const formatter = (
          TYPE_VALUE_RESOLVER_MAP[this.type] ||
          TYPE_VALUE_RESOLVER_MAP['default']
        ).formatter;
        const format = (this.type === 'month'&&this.monthonly)?'MM':DEFAULT_FORMATS[this.type];
        return formatter(value, this.format || format, this.rangeSeparator);
      },
      set(value) {
        if (value) {
          const type = this.type;
          const parser = (
            TYPE_VALUE_RESOLVER_MAP[type] ||
            TYPE_VALUE_RESOLVER_MAP['default']
          ).parser;
          const parsedValue = parser(value, this.format || (this.type === 'month'&&this.monthonly)?'MM':DEFAULT_FORMATS[type], this.rangeSeparator);
          if (parsedValue && this.picker) {
            this.picker.value = parsedValue;
          }
        } else {
          this.$emit('input', value);
          this.picker.value = value;
        }
        this.$forceUpdate();
      }
    },

    // 差异化数据
    diffLabel: {
      get() {
        if (!this.diff) {
          return;
        }
        const oldValue = this.diff.oldValue;
        const newValue = this.diff.newValue;
        if (oldValue === undefined || newValue === undefined) {
          return;
        }
        let oldLabel = '';
        let newLabel = '';
        const formatter = (
          TYPE_VALUE_RESOLVER_MAP[this.type] ||
          TYPE_VALUE_RESOLVER_MAP['default']
        ).formatter;
        const format = (this.type === 'month'&&this.monthonly)?'MM':DEFAULT_FORMATS[this.type];
        if (oldValue) {
          oldLabel = formatter(oldValue, this.format || format, this.rangeSeparator);
        }
        if (newValue) {
          newLabel = formatter(newValue, this.format || format, this.rangeSeparator);
        }
        return {
          oldValue: oldLabel,
          newValue: newLabel
        }
      }
    }
  },

  created() {
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false
    };
    this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;
  },

  mounted: function(){
    this.dispatch('ElFormItem', 'editableChange', [this.editable]);
  },

  methods: {
  	valueChange(val){
  		this.$emit('valuechange',val)
  	},
    handleClickIcon1() {
      this.$refs.mtpicker.open();
    },
    confirmDatatime() {
      if(this.type=="daterange"||this.type=="datetimerange" ){
        if(this.isfirst){
          this.handleRangeCheckVal();
          this.$refs.mtpicker.open();
          this.isfirst=false;
        }else{
          this.handleRangeCheckVal();
          this.isfirst=true;
        }
      }else{
        //如果类型不是daterange，直接处理结果;
        this.handleCommonCheckVal();
      }
    },
    //日期范围的取值操作;
    handleRangeCheckVal(){
        this.mtFormatValue = this.$refs.mtpicker.getFormatValue();
        var date = new Date(this.mtFormatValue);
        if(date instanceof Object){
          date=date.getTime();
          this.dateArr.push(date);
          this.mtFormatDateArr.push(this.mtFormatValue);
        }
        if(!this.isfirst){
          date=this.dateArr;
          this.mtFormatValue=this.mtFormatDateArr[0]+"~"+this.mtFormatDateArr[1];
          this.dateArr=[];
          this.mtFormatDateArr=[];
          this.tipText="开始时间"
          if(date[1]<date[0]){
            alert("结束时间不能小于开始时间");
            this.mtFormatValue="",
            date="";
          }
        }else{
          this.tipText="结束时间"
        }
        // do not emit if values are same
        if (!valueEquals(this.value, date)) {
          if(this.type === 'month'||this.type === 'year'){
            if(this.monthonly){
              var tmp = date.getMonth()+1;
              this.$emit('change',tmp>10?tmp:'0'+tmp);
            }else{
              this.$emit('change',formatDate(date, DEFAULT_FORMATS[this.type]));
            }
          }else {
            this.$emit('change', date);
          }
          this.dispatch('ElFormItem', 'el.form.change',date);
          this.$emit('input', date);
        }
    },
    //普通获取日期操作;
    handleCommonCheckVal() {
       this.mtFormatValue = this.$refs.mtpicker.getFormatValue();
       this.mtFormatValue = this.mtFormatValue.replace(/-/g, "/");
       var date = new Date(this.mtFormatValue);
       if(this.valuetoms){
        if(date instanceof Array){
          let d0 = date[0];
          let d1 = date[1];
          if(d0 instanceof Object ){
            d0 = d0.getTime();
          }
          if(d1 instanceof Object ){
            d1 = d1.getTime();
          }
          date = [d0,d1];
        }else if(date instanceof Object ){
          date = date.getTime();
        }
      };

      // do not emit if values are same
      if (!valueEquals(this.value, date)) {
        this.$emit('input', date);
        if(this.type === 'month'||this.type === 'year'){
          if(this.monthonly){
            var tmp = date.getMonth()+1;
            this.$emit('change',tmp>10?tmp:'0'+tmp);
          }else{
            this.$emit('change',formatDate(date, DEFAULT_FORMATS[this.type]));
          }
        }else {
          this.$emit('change', date);
        }
        this.dispatch('ElFormItem', 'el.form.change',date);
      }
    },
    handleMouseEnterIcon() {
      if (this.currentReadonly || this.disabled) return;
      if (!this.valueIsEmpty && this.clearable) {
        //r3分支要求放开如下内容：
        this.showClose = true;
      }
    },
    handleClickIcon() {
      if (this.currentReadonly || this.disabled) return;
      if (this.showClose) {
        this.currentValue = this.$options.defaultValue || '';
        this.$emit('change',this.currentValue);
        this.$emit('input', this.currentValue);
        this.showClose = false;
      } else {
        this.pickerVisible = !this.pickerVisible;
      }
    },

    dateChanged(dateA, dateB) {
      if (Array.isArray(dateA)) {
        let len = dateA.length;
        if (!dateB) return true;
        while (len--) {
          if (!equalDate(dateA[len], dateB[len])) return true;
        }
      } else {
        if (!equalDate(dateA, dateB)) return true;
      }

      return false;
    },

    handleClose() {
      if(!this.IsPC) {
        this.$refs.mtpicker.close();
      } else {
        this.pickerVisible = false;
      }

    },

    handleFocus() {
      const type = this.type;
      if(!this.IsPC) {
        this.$refs.mtpicker.open();
      } else {
        if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
          this.pickerVisible = true;
        }
      }
      this.$emit('focus', this);
    },

    handleBlur() {
      this.$emit('blur', this);
    },

    handleKeydown(event) {
      const keyCode = event.keyCode;

      // tab
      if (keyCode === 9) {
        this.pickerVisible = false;
      }
    },

    hidePicker() {
      if (this.picker) {
        this.picker.resetView && this.picker.resetView();
        this.pickerVisible = this.picker.visible = false;
        this.destroyPopper();
      }
    },

    showPicker() {
      if (this.$isServer) return;
      if (!this.picker) {
        this.mountPicker();
      }
      this.pickerVisible = this.picker.visible = true;

      this.updatePopper();
      if (this.currentValue instanceof Date) {
        this.picker.date = new Date(this.currentValue.getTime());
      } else {
        this.picker.value = this.currentValue;
      }
      this.picker.resetView && this.picker.resetView();

      this.$nextTick(() => {
        this.picker.ajustScrollTop && this.picker.ajustScrollTop();
      });
    },

    mountPicker() {
      this.panel.defaultValue = this.defaultValue || this.currentValue;
      this.picker = new Vue(this.panel).$mount();
      this.picker.popperClass = this.popperClass;
      this.popperElm = this.picker.$el;
      this.picker.width = this.reference.getBoundingClientRect().width;
      this.picker.showTime = this.type === 'datetime' || this.type === 'datetimerange';
      this.picker.selectionMode = this.selectionMode;
      this.picker.monthonly = this.monthonly;
      if (this.format) {
        this.picker.format = this.format;
      }

      const updateOptions = () => {
        const options = this.pickerOptions;
        if (options && options.selectableRange) {
          let ranges = options.selectableRange;
          const parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser;
          const format = DEFAULT_FORMATS.timerange;

          ranges = Array.isArray(ranges) ? ranges : [ranges];
          this.picker.selectableRange = ranges.map(range => parser(range, format, this.rangeSeparator));
        }

        for (const option in options) {
          if (options.hasOwnProperty(option) &&
              // 忽略 time-picker 的该配置项
              option !== 'selectableRange') {
            this.picker[option] = options[option];
          }
        }
      };
      updateOptions();
      this.unwatchPickerOptions = this.$watch('pickerOptions', () => updateOptions(), { deep: true });

      this.$el.appendChild(this.picker.$el);// 把日期面板插入DOM节点
      this.picker.resetView && this.picker.resetView();

      this.picker.$on('dodestroy', this.doDestroy);
      this.picker.$on('pick', (date = '', visible = false) => {
        if(this.valuetoms){
          if(date instanceof Array){
            let d0 = date[0];
            let d1 = date[1];
            if(d0 instanceof Object ){
              d0 = d0.getTime();
            }
            if(d1 instanceof Object ){
              d1 = d1.getTime();
            }
            date = [d0,d1];
          }else if(date instanceof Object ){
            date = date.getTime();
          }
        };

        // do not emit if values are same
        if (!valueEquals(this.value, date)) {
          this.$emit('input', date);
          if(this.type === 'month'||this.type === 'year'){
            if(this.monthonly){
              var tmp = date.getMonth()+1;
              this.$emit('change',tmp>10?tmp:'0'+tmp);
            }else{
              this.$emit('change',formatDate(date, DEFAULT_FORMATS[this.type]));
            }
          }else {
            this.$emit('change', date);
          }
          this.dispatch('ElFormItem', 'el.form.change',date);
        }
        this.pickerVisible = this.picker.visible = visible;
        this.picker.resetView && this.picker.resetView();
      });

      this.picker.$on('select-range', (start, end) => {
        this.refInput.setSelectionRange(start, end);
        this.refInput.focus();
      });
    },

    unmountPicker() {
      if (this.picker) {
        this.picker.$destroy();
        this.picker.$off();
        if (typeof this.unwatchPickerOptions === 'function') {
          this.unwatchPickerOptions();
        }
        this.picker.$el.parentNode.removeChild(this.picker.$el);
      }
    }
  }
};
</script>
