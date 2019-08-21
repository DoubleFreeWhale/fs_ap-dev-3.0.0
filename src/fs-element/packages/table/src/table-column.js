import {cellForced, cellStarts, defaultRenderCell, treeCellPrefix} from './config';
import {compose, mergeOptions, parseMinWidth, parseWidth} from './util';
import ElCheckbox from 'element-ui/packages/checkbox';
const getBeanmapByPk = function(pk, refCode, field, rowData, diffProp, vm) {
  if (!pk || !refCode || !field) {
    return;
  }
  const requestUrl = '/uitemplate_web/uitemplate_ctr/mdadptor_ctr/getRefTranslateInfo';
  const requestData = [{
    fieldCode: field,
    refCode: refCode,
    param: null,
    id: pk
  }];
  vm.$http({
    url: requestUrl,
    method: 'post',
    data: requestData,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    if (!res || !res.data || !Array.isArray(res.data)) {
      return;
    }
    let resBeanMapFieldRef;
    for (let i = 0; i < res.data.length; i++) {
      const obj = res.data[i];
      if (obj.fieldCode === field && obj.refCode === refCode) {
        resBeanMapFieldRef = obj.beanMap && obj.beanMap[field + '_ref'] || {};
        break;
      }
    }
    rowData.beanMap = rowData.beanMap || {};
    if (diffProp) {
      rowData.beanMap[field + '_ref'][diffProp] = resBeanMapFieldRef;
    } else {
      rowData.beanMap[field + '_ref'] = resBeanMapFieldRef;
    }
    vm.$set(rowData,field,'');
    vm.$set(rowData,field,pk);
  }).catch(err => {
    console.log('获取beanMap失败: ', err);
  });
};
let columnIdSeed = 1;
/**
 * @return {string}
 */
const percentSetformat = function(value,column) {
  var formatValue = numberUtil.setformat(
      numberUtil.accMul(value, 100),
      column.decimals,
      column.separator,
      column.negativeFormat
  );
  if (formatValue) {
    return formatValue + "%";
  } else {
    return column.decimals ? Number(0).toFixed(Number(column.decimals)) + '%' : '';
  }
}

const DEFAULT_RENDER_CELL_BY_TYPE = function(h, { row, column, _self }, diffProp) {
  let prop = column.property;
  let refProp = prop;
  let value = diffProp ? row[prop][diffProp] : row[prop];
  if(prop.indexOf('.') > 0){
    let props = prop.split('.');
    let nowValue = row;
    for(let i =0; i < props.length;i++){
      nowValue = nowValue[props[i]];
      if(i > 0){
        refProp = props[i];
      }
    }
    value = diffProp? nowValue[diffProp]: nowValue;
  }
  var columnRenderType = column.renderType;
  if (columnRenderType === 'ref') {

    if (!value) {
      return '';
    }
    // 如果没有beanmap则发请求获取
    const refCode = column.refCode;
    if (!row.beanMap || !row.beanMap[refProp + '_ref'] && refCode) {
      // refpk, refcode, field, rowData, diffProp, vm
      getBeanmapByPk(value, refCode, refProp, row, diffProp, _self);
      return;
    }
    const showField = column.showField;
    if(value.indexOf(',') > 0){
      let tmp = value.split(',');
      let valueArr = [];
      let nowValue = '';
      for(let i = 0; i < tmp.length; i++){
        if (row.beanMap[refProp + '_ref'][tmp[i]]) {
          let _refObj = diffProp ? row.beanMap[refProp + '_ref'][tmp[i]][diffProp] : row.beanMap[refProp + '_ref'][tmp[i]];
          if(_refObj && typeof _refObj === 'object'){
            nowValue = showField ? _refObj[showField] : (_refObj.name || _refObj.refname);
          }else{
            nowValue = '';
          }
          valueArr.push(nowValue);
        }
      }
      return valueArr.join(',');
    }
    let _refObj = diffProp ? row.beanMap[refProp + '_ref'][value][diffProp] : row.beanMap[refProp + '_ref'][value];
    if(_refObj && typeof _refObj === 'object'){
      return showField ? _refObj[showField] : (_refObj.name || _refObj.refname || '');
    }else{
      return '';
    }

  } else if (columnRenderType === 'address') {
    if(!row.beanMap || !row.beanMap[prop + '_ref'] || !row.beanMap[prop + '_ref'][value]){
      return '';
    }
    let _refObj = row.beanMap[prop + '_ref'][value];
    let attrName = ['country','province','city','vsection'];
    let str = '';
    attrName.forEach(val=>{
      if(_refObj[val]){
        str += _refObj[val];
      }
    });
    if(_refObj.detailinfo){
      str += ',' + _refObj.detailinfo;
    }
    if(_refObj.postcode){
      str += ',' + _refObj.postcode;
    }
    return str;
  } else if (columnRenderType === 'file') {
    if (!value) {
      return '';
    }
    const downloadUrl = column.downloadUrl;
    if (!row.beanMap || !row.beanMap[prop + '_fileref'] && downloadUrl) {
      return '';
    }
    if (!row.beanMap || !row.beanMap[prop + '_fileref'] || !row.beanMap[prop + '_fileref'][value]) {
      return '';
    }
    let _refObj = row.beanMap[prop + '_fileref'][value];
    if (_refObj && typeof _refObj === 'object') {
      let _returnValue = `${_refObj.name || ''} ${(_refObj.size) || ''}`;
      let comp = Vue.extend({
        template: '<a href="' + downloadUrl + value + '" target="_self" title="' + _returnValue + '"/' + _returnValue + '>'
      });
      let compObj = new comp();
      let compObjMount = compObj.$mount();
      return compObjMount._vnode;
    } else {
      return '';
    }
  } else if (columnRenderType === 'boolean') {
    return value ? '是' : '否';
  } else if (columnRenderType === 'select') {
    // let value = row[prop];
    // handle boolean
    if (typeof value === 'boolean') {
      return value ? '是' : '否';
    }
    let selectOptions = column.renderSelectOptionsVar;
    debugger
    if(value instanceof Array){
      if(value.length > 0){
        let valueArr = [];
        for(let j = 0; j < value.length; j++){
          let nowValue = value[j];
          if(selectOptions && selectOptions.length > 0){
            for (let i = 0; i < selectOptions.length; i++) {
              let option = selectOptions[i];
              if (option.value === nowValue) {
                valueArr.push(option.label);
              }
            }
          }
        }
        return valueArr.join(',');
      }else{
        return '';
      }
    }else{
      if(selectOptions && selectOptions.length > 0){
        for (let i = 0; i < selectOptions.length; i++) {
          let option = selectOptions[i];
          if (option.value == value) {
            return option.label;
          }
        }
      }
    }
    return '';
  }else if(columnRenderType === 'date'){
    let format = column.format || 'yyyy-MM-dd';
    format = format.replace(/Y/g,'y');
    format = format.replace(/D/g,'d');
    // let value = row[prop];
    if (value) {
      let dataObj = new Date(value);
      if (!dataObj.getTime()) {
        dataObj = new Date(parseInt(value));
        if(!dataObj.getTime()){
          return value;
        }
      }
      return dateUtil.format(dataObj, format);
    }
    return '';
  }else if(columnRenderType === 'money'){
    // let value = row[prop];
    if(value){
      return moneySetFormat(value, column);
    }
    return column.decimals ? column.symbol + Number(0).toFixed(Number(column.decimals)) : '';
  }else if(columnRenderType === 'number'){
    // let value = row[prop];
    if(value){
      const res = numberUtil.setformat(
          value,
          column.decimals,
          column.separator,
          column.negativeFormat
      );
      return res ? res : (column.decimals ? Number(0).toFixed(Number(column.decimals)) : '');
    }
    return column.decimals ? Number(0).toFixed(Number(column.decimals)) : '';
  }else if(columnRenderType === 'percent'){
    // let value = row[prop];
    if(value){
      return percentSetformat(value, column);
    }
    return column.decimals ? Number(0).toFixed(Number(column.decimals)) + '%' : '';
  }else if(columnRenderType === 'image'){
    // let value = row[prop],imageSrc;
    let imageSrc;
    const downloadUrl = column.downloadUrl;
    if(value){
      imageSrc = `${downloadUrl?downloadUrl:''}` + value;
    }else{
      imageSrc = defaultSrc;
    }

    let comp = Vue.extend({
      template:'<img src="' + imageSrc + '" class="el-table-cell-image"  alt=""/>'
    });
    let compObj = new comp();
    let compObjMount = compObj.$mount();
    return compObjMount._vnode;
  } else if (columnRenderType === 'tooltip') {
    return value || '';
  }
  return value;
};

const moneySetFormat = function(value,column) {
  var formatValue = numberUtil.setformat(
      value,
      column.decimals,
      column.separator,
      column.negativeFormat
  );
  if (formatValue) {
    return column.symbol + formatValue;
  } else {
    return column.decimals ? column.symbol + Number(0).toFixed(Number(column.decimals)) : '';
  }
};

export default {
  name: 'ElTableColumn',

  props: {
    refCode:String,
    downloadUrl: String,
    separator: {
      type: String
    },
    decimals: {
      type: [Number, String]
    },
    format: String,
    showField: String,
    symbol: {
      type: String,
      default: '￥'
    },
    renderSelectOptionsVar:{
      default() {
        return [];
      }
    },
    renderType: String,
    type: {
      type: String,
      default: 'default'
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    renderHeader: Function,
    sortable: {
      type: [Boolean, String],
      default: false
    },
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: true
    },
    columnKey: String,
    align: String,
    headerAlign: String,
    showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true
    },
    index: [Number, Function],
    sortOrders: {
      type: Array,
      default() {
        return ['ascending', 'descending', null];
      },
      validator(val) {
        return val.every(order => ['ascending', 'descending', null].indexOf(order) > -1);
      }
    }
  },

  data() {
    return {
      isSubColumn: false,
      columns: []
    };
  },

  computed: {
    realSeparator() {
      if (
          !this.separator &&
          this.appContext &&
          this.appContext["isThousandth"]
      ) {
        return this.appContext["thousandthChar"];
      }
      return this.separator;
    },
    appContext() {
      return this.$context && this.$context.getMaskerMeta("float");
    },
    realDecimals() {
      if (!this.decimals && this.appContext && this.appContext["precision"]) {
        return parseInt(this.appContext["precision"]);
      }
      return parseInt(this.decimals);
    },
    realSymbol() {
      if (
          !this.symbol &&
          this.appContext &&
          this.appContext["currency"] &&
          this.appContext["currency"]["curSymbol"]
      ) {
        return this.appContext["currency"]["curSymbol"];
      }
      return this.symbol;
    },
    owner() {
      let parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    },

    columnOrTableParent() {
      let parent = this.$parent;
      while (parent && !parent.tableId && !parent.columnId) {
        parent = parent.$parent;
      }
      return parent;
    },

    realWidth() {
      return parseWidth(this.width);
    },

    realMinWidth() {
      return parseMinWidth(this.minWidth);
    },

    realAlign() {
      return this.align ? 'is-' + this.align : null;
    },

    realHeaderAlign() {
      return this.headerAlign ? 'is-' + this.headerAlign : this.realAlign;
    }
  },

  methods: {
    getPropsData(...props) {
      return props.reduce((prev, cur) => {
        if (Array.isArray(cur)) {
          cur.forEach((key) => {
            prev[key] = this[key];
          });
        }
        return prev;
      }, {});
    },

    getColumnElIndex(children, child) {
      return [].indexOf.call(children, child);
    },

    setColumnWidth(column) {
      if (this.realWidth) {
        column.width = this.realWidth;
      }
      if (this.realMinWidth) {
        column.minWidth = this.realMinWidth;
      }
      if (!column.minWidth) {
        column.minWidth = 80;
      }
      column.realWidth = column.width === undefined ? column.minWidth : column.width;
      return column;
    },

    setColumnForcedProps(column) {
      // 对于特定类型的 column，某些属性不允许设置
      const type = column.type;
      const source = cellForced[type] || {};
      Object.keys(source).forEach(prop => {
        let value = source[prop];
        if (value !== undefined) {
          column[prop] = prop === 'className' ? `${column[prop]} ${value}` : value;
        }
      });
      return column;
    },

    setColumnRenders(column) {
      const specialTypes = Object.keys(cellForced);
      const renderType = column.renderType;
      // renderHeader 属性不推荐使用。
      if (this.renderHeader) {
        console.warn('[Element Warn][TableColumn]Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.');
      } else if (specialTypes.indexOf(column.type) === -1) {
        column.renderHeader = (h, scope) => {
          const renderHeader = this.$scopedSlots.header;
          return renderHeader ? renderHeader(scope) : column.label;
        };
      }
      let originRenderCell = column.renderCell;
      // TODO: 这里的实现调整
      if (column.type === 'expand') {
        // 对于展开行，renderCell 不允许配置的。在上一步中已经设置过，这里需要简单封装一下。
        column.renderCell = (h, data) => (<div class="cell">
          { originRenderCell(h, data) }
        </div>);
        this.owner.renderExpanded = (h, data) => {
          return this.$scopedSlots.default
            ? this.$scopedSlots.default(data)
            : this.$slots.default;
        };
      } else {
        originRenderCell = originRenderCell || defaultRenderCell;
        // 对 renderCell 进行包装
        column.renderCell = (h, data) => {
          let children = null;
          
          if (renderType && renderType !== 'default') {
            originRenderCell = DEFAULT_RENDER_CELL_BY_TYPE;
          }
          if (this.$scopedSlots.default) {
            children = this.$scopedSlots.default(data);
          } else {
            children = originRenderCell(h, data);
          }
          const prefix = treeCellPrefix(h, data);
          const props = {
            class: 'cell',
            style: {}
          };
          if (column.showOverflowTooltip) {
            props.class += ' el-tooltip';
            props.style = {width: (data.column.realWidth || data.column.width) - 1 + 'px'};
          }
          return (<div { ...props }>
            { prefix }
            { children }
          </div>);
        };
      }
      return column;
    },

    registerNormalWatchers() {
      const props = ['label', 'property', 'filters', 'filterMultiple', 'sortable', 'index', 'formatter', 'className', 'labelClassName', 'showOverflowTooltip'];
      // 一些属性具有别名
      const aliases = {
        prop: 'property',
        realAlign: 'align',
        realHeaderAlign: 'headerAlign',
        realWidth: 'width'
      };
      const allAliases = props.reduce((prev, cur) => {
        prev[cur] = cur;
        return prev;
      }, aliases);

      Object.keys(allAliases).forEach(key => {
        const columnKey = aliases[key];
        this.$watch(key, (newVal) => {
          this.columnConfig[columnKey] = newVal;
        });
      });
    },

    registerComplexWatchers() {
      const props = ['fixed'];
      const aliases = {
        realWidth: 'width',
        realMinWidth: 'minWidth'
      };
      const allAliases = props.reduce((prev, cur) => {
        prev[cur] = cur;
        return prev;
      }, aliases);

      Object.keys(allAliases).forEach(key => {
        const columnKey = aliases[key];

        this.$watch(key, (newVal) => {
          this.columnConfig[columnKey] = newVal;
          const updateColumns = columnKey === 'fixed';
          this.owner.store.scheduleLayout(updateColumns);
        });
      });
    }
  },

  components: {
    ElCheckbox
  },

  beforeCreate() {
    this.row = {};
    this.column = {};
    this.$index = 0;
    this.columnId = '';
  },

  created() {
    console.log(this.renderSelectOptionsVar);
    const parent = this.columnOrTableParent;
    this.isSubColumn = this.owner !== parent;
    this.columnId = (parent.tableId || parent.columnId) + '_column_' + columnIdSeed++;

    const type = this.type || 'default';
    const sortable = this.sortable === '' ? true : this.sortable;
    const defaults = {
      ...cellStarts[type],
      downloadUrl: this.downloadUrl,
      separator: this.realSeparator,
      decimals: this.realDecimals,
      format: this.format,
      showField: this.showField,
      symbol: this.realSymbol,
      renderSelectOptionsVar: this.renderSelectOptionsVar,
      renderType: this.renderType,
      id: this.columnId,
      type: type,
      refCode: this.refCode,
      property: this.prop || this.property,
      align: this.realAlign,
      headerAlign: this.realHeaderAlign,
      showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow,
      // filter 相关属性
      filterable: this.filters || this.filterMethod,
      filteredValue: [],
      filterPlacement: '',
      isColumnGroup: false,
      filterOpened: false,
      // sort 相关属性
      sortable: sortable,
      // index 列
      index: this.index
    };

    const basicProps = ['columnKey', 'label', 'className', 'labelClassName', 'type', 'renderHeader', 'formatter', 'fixed', 'resizable'];
    const sortProps = ['sortMethod', 'sortBy', 'sortOrders'];
    const selectProps = ['selectable', 'reserveSelection'];
    const filterProps = ['filterMethod', 'filters', 'filterMultiple', 'filterOpened', 'filteredValue', 'filterPlacement'];

    let column = this.getPropsData(basicProps, sortProps, selectProps, filterProps);
    column = mergeOptions(defaults, column);

    // 注意 compose 中函数执行的顺序是从右到左
    const chains = compose(this.setColumnRenders, this.setColumnWidth, this.setColumnForcedProps);
    column = chains(column);

    this.columnConfig = column;

    // 注册 watcher
    this.registerNormalWatchers();
    this.registerComplexWatchers();
  },
  watch: {
    renderSelectOptionsVar(newVal) {
      debugger
      if (this.columnConfig) {
        this.columnConfig.renderSelectOptionsVar = newVal;
      }
    },
  },
  mounted() {
    const owner = this.owner;
    const parent = this.columnOrTableParent;
    const children = this.isSubColumn ? parent.$el.children : parent.$refs.hiddenColumns.children;
    const columnIndex = this.getColumnElIndex(children, this.$el);

    owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
  },
  destroyed() {
    if (!this.$parent) return;
    const parent = this.$parent;
    this.owner.store.commit('removeColumn', this.columnConfig, this.isSubColumn ? parent.columnConfig : null);
  },

  render(h) {
    // slots 也要渲染，需要计算合并表头
    return h('div', this.$slots.default);
  }
};
