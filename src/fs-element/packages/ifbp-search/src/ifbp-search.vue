<template>
  <div v-if="currentTpl&&Array.isArray(currentTpl.keyword.fields)" class="search-panel">
    <div class="search-input-container" :class="(conditionList && conditionList.length)?'':'set-all-border-radius'">
      <template v-if=" currentTpl.keyword.fields.length>0" >
        <search-select
          v-if="filterKeywords"
          :filterRules="currentTpl.keyword.fields"
          :placeholder="searchPlaceholder"
          @searchTriggered="handleSelectSearch"
        ></search-select>
        <el-input
          v-else
          :placeholder="searchPlaceholder"
          v-model="currentTpl.keyword.value"
          icon="search"
          ref="searchInput"
          :style="inputStyle"
          @keyup.enter.native="search"
          :on-icon-click="search"></el-input>
      </template>
      <el-input
        v-else
        :disabled="true"
        placeholder="未配置模糊搜索">
      </el-input>
      <span
        class="btn-more"
        :class="{
          active: this.panelShown
        }"
        v-if="conditionList && conditionList.length"
        @click="showSearchPanel">

        <i class="el-icon-arrow-up" v-if="this.panelShown"></i>
        <i class="el-icon-arrow-down" v-else></i>
      </span>
    </div>
    <!-- <el-collapse-transition> -->
      <div class="advanced-search-panel" ref="searchPanel"
        :class="{
          'without-btns': searchOnSelect,
          'no-breadcrumb-search': noBreadcrumbSearch
        }"
        v-show="panelShown">

        <!-- 已选参数展示 -->
        <div v-if="showSelectedTags" class="options-selected">
          <template v-for="condition in conditionList">
            <el-tag v-if="(condition.ctrltype === 'DateTime'|| condition.ctrltype === 'Date')&& (condition.optionList.def_min_value || condition.optionList.def_max_value)"
              :key="condition.fieldcode"
              :closable="true"
              type="gray"
              @close="cancelConditionSelection(condition.optionList)">
              {{ formatSelectedDate(condition.optionList.def_min_value, condition.optionList.def_max_value) }}
            </el-tag>
            <el-tag v-if="condition.ctrltype === 'NumberComponent' && (condition.optionList.def_min_value || condition.optionList.def_max_value)"
              :key="condition.fieldcode"
              :closable="true"
              type="gray"
              @close="cancelConditionSelection(condition.optionList)"
            >
              {{ formatSelectedNumber(condition.optionList.def_min_value, condition.optionList.def_max_value) }}
            </el-tag>
            <el-tag v-if="condition.ctrltype === 'Reference' && condition.optionList.value"
              :key="condition.fieldcode"
              :closable="true"
              type="gray"
              @close="cancelConditionSelection(condition.optionList)"
            >
              {{ formatSelectedReference(condition.optionList) }}
            </el-tag>
            <el-tag
              v-for="option in condition.optionList.options"
              :key="option.value"
              v-if="option.selected"
              :closable="true"
              type="gray"
              @close="cancelConditionSelection(condition.optionList)">
              {{ option.name }}
            </el-tag>
          </template>
        </div>

        <!-- 搜索参数 -->
        <div>

          <!-- 前三条平铺条件 -->
          <div
            class="condition-row"
            v-for="(condition, index) in conditionList"
            :key="condition.fieldcode"
            v-if="index < conditionsBeforeAdvance"
          >
            <!-- 条件名 -->
            <span class="condition-label">{{ condition.fieldname }}:</span>
            <!-- 条件选项 -->
            <div class="condition-options">

              <!-- 通用选项 -->
              <template v-if="condition.optionList.options.length">
                <span
                  v-for="(option, optionIndex) in condition.optionList.options"
                  :key="optionIndex"
                  class="condition-option"
                  :class="{selected: option.selected}"
                  @click="selectConditionOption(condition.optionList, option, condition)"
                  v-if="(condition.fe_showAllOptions || optionIndex < optionsBeforeMore) && (typeof option.fe_option_show !== 'boolean' || option.fe_option_show)"
                >{{ option.name }}</span>
              </template>

              <!-- 数值字段 -->
              <template v-if="condition.ctrltype === 'NumberComponent' && (typeof condition.fe_showAllOptions !== 'boolean' || condition.fe_showAllOptions)">
                <div class="option-num-container">
                  <el-input
                    v-model="condition.optionList.def_min_value"
                    @blur="selectConditionOption(condition.optionList, null, condition)"
                    size="small"
                    placeholder="最小值">
                  </el-input>
                </div>
                  -
                <div class="option-num-container">
                  <el-input
                    v-model="condition.optionList.def_max_value"
                    @blur="selectConditionOption(condition.optionList, null, condition)"
                    size="small"
                    placeholder="最大值">
                  </el-input>
                </div>
              </template>

              <!-- 日期字段 -->
              <template v-else-if="(condition.ctrltype === 'DateTime' || condition.ctrltype === 'Date')&& (typeof condition.fe_showAllOptions !== 'boolean' || condition.fe_showAllOptions)">
                <div class="option-date-container">
                  <el-date-picker
                    v-model="condition.optionList.def_min_value"
                    @change="handleDateChange(condition.optionList, 'def_min_value', $event, condition)"
                    :type="condition.dateformat || 'datetime'"
                    size="small"
                    :format="condition.dateformat === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                    :placeholder="condition.dateformat === 'date' ? '选择日期' : '选择日期时间'">
                  </el-date-picker>
                </div>
                  -
                <div class="option-date-container">
                  <el-date-picker
                    v-model="condition.optionList.def_max_value"
                    @change="handleDateChange(condition.optionList, 'def_max_value', $event, condition)"
                    :type="condition.dateformat || 'datetime'"
                    size="small"
                    :format="condition.dateformat === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                    :placeholder="condition.dateformat === 'date' ? '选择日期' : '选择日期时间'">
                  </el-date-picker>
                </div>

                <!-- 系统变量 -->
                <div class="option-date-container" v-if="sysVarOptions && sysVarOptions.length">
                  <el-select
                    v-model="condition.optionList.value"
                    @change="handleSysVarChange(condition.optionList, $event, condition)"
                    size="small"
                    placeholder="可选择系统变量"
                  >
                    <el-option
                      v-for="(sysVar, sysVarIndex) in sysVarOptions"
                      :key="sysVarIndex"
                      :label="sysVar.name"
                      :value="sysVar.preview"
                    ></el-option>
                  </el-select>
                </div>
              </template>

              <!-- 参照字段 -->
              <template v-if="condition.ctrltype === 'Reference' && condition.refcode && (typeof condition.fe_showAllOptions !== 'boolean' || condition.fe_showAllOptions)">
                <div class="option-ref-container">
                  <el-ref
                    :is-muti-select="true"
                    :ref-code="condition.refcode"
                    field="value"
                    :template-value="condition.optionList"
                    :is-edit="true"
                    :query-params="condition.filtercondition"
                    @trigger="handleRefChange(condition.optionList, $event, condition)"
                  >
                  </el-ref>
                </div>
              </template>

              <!-- 更多按钮 -->
              <template v-if="typeof condition.fe_showAllOptions === 'boolean'">
                <span
                  class="btn-more active"
                  v-if="condition.fe_showAllOptions"
                  @click="toggleShowAllOptions(condition, index)">
                  收起
                  <i class="el-icon-arrow-up"></i>
                </span>
                <span
                  class="btn-more inactive"
                  v-else
                  @click="toggleShowAllOptions(condition, index)">
                  更多
                  <i class="el-icon-arrow-down"></i>
                </span>
              </template>
            </div>
            <div class="condition-multiple">
              <template v-if="condition.single_flag === false">
                <el-checkbox
                  v-if="condition.ctrltype === 'Select' && condition.fieldtype === 'tinyint'"
                  v-model="condition.fe_multipleSelect"
                  disabled
                  title="布尔类型不需多选"
                  @change="multipleSelectChange(condition)">多选</el-checkbox>
                <el-checkbox
                  v-else
                  v-model="condition.fe_multipleSelect"
                  @change="multipleSelectChange(condition)">多选</el-checkbox>
              </template>
            </div>
          </div>

          <!-- 高级条件 -->
          <div class="condition-row advanced-conditions-row" v-if="conditionList.length > conditionsBeforeAdvance">
            <span class="condition-label">高级:</span>
            <!-- 条件名 -->
            <div class="advanced-conditions">
              <span v-for="(condition, index) in conditionList"
                v-if="index >= conditionsBeforeAdvance"
                class="advanced-condition"
                :class="{
                  current: currentConditionCode === condition.fieldcode,
                  selected: condition.optionList.feOptionSelected
                }"
                :key="condition.fieldcode"
                @click="setCurrentCondition(condition)">
                {{ condition.fieldname }}
                <i class="el-icon-arrow-up" v-if="currentConditionCode === condition.fieldcode"></i>
                <i class="el-icon-arrow-down" v-else></i>
              </span>
            </div>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="advanced-search-btns" v-if="!searchOnSelect">
          <el-button @click="clearSelectedOptions">清空</el-button>
          <el-button type="primary" @click="search">搜索</el-button>
        </div>

        <!-- 当前选中的条件选项 -->
        <div class="current-condition-options-container">
          <div class="current-condition-options" v-if="currentCondition">

            <!-- 通用选项 -->
            <template v-if="currentCondition.optionList.options.length">
              <span
                v-for="(option, optionIndex) in currentCondition.optionList.options"
                :key="optionIndex"
                class="condition-option"
                :class="{selected: option.selected}"
                @click="selectConditionOption(currentCondition.optionList, option, currentCondition)"
              >{{ option.name }}</span>
            </template>

            <!-- 数值字段 -->
            <template v-if="currentCondition.ctrltype === 'NumberComponent'">
              <div class="option-num-container">
                <el-input
                  v-model="currentCondition.optionList.def_min_value"
                  @blur="selectConditionOption(currentCondition.optionList, null, currentCondition)"
                  size="small"
                  placeholder="最小值">
                </el-input>
              </div>
                -
              <div class="option-num-container">
                <el-input
                  v-model="currentCondition.optionList.def_max_value"
                  @blur="selectConditionOption(currentCondition.optionList, null, currentCondition)"
                  size="small"
                  placeholder="最大值">
                </el-input>
              </div>
            </template>

            <!-- 日期字段-->
            <template v-else-if="currentCondition.ctrltype === 'DateTime' || currentCondition.ctrltype === 'Date'">
              <div class="option-date-container">
                <el-date-picker
                  v-model="currentCondition.optionList.def_min_value"
                  @change="handleDateChange(currentCondition.optionList, 'def_min_value', $event, currentCondition)"
                  :type="currentCondition.dateformat || 'datetime'"
                  size="small"
                  :format="currentCondition.dateformat === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                  :placeholder="currentCondition.dateformat === 'date' ? '选择日期' : '选择日期时间'">
                </el-date-picker>
              </div>
                -
              <div class="option-date-container">
                <el-date-picker
                  v-model="currentCondition.optionList.def_max_value"
                  @change="handleDateChange(currentCondition.optionList, 'def_max_value', $event, currentCondition)"
                  :type="currentCondition.dateformat || 'datetime'"
                  size="small"
                  :format="currentCondition.dateformat === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                  :placeholder="currentCondition.dateformat === 'date' ? '选择日期' : '选择日期时间'">
                </el-date-picker>
              </div>

              <div class="option-date-container" v-if="sysVarOptions && sysVarOptions.length">
                <el-select
                  v-model="currentCondition.optionList.value"
                  @change="handleSysVarChange(currentCondition.optionList, $event, currentCondition)"
                  size="small"
                  placeholder="可选择系统变量"
                >
                  <el-option
                    v-for="(sysVar, sysVarIndex) in sysVarOptions"
                    :key="sysVarIndex"
                    :label="sysVar.name"
                    :value="sysVar.preview"
                  ></el-option>
                </el-select>
              </div>
            </template>

            <!-- 参照字段 -->
            <template v-if="currentCondition.ctrltype === 'Reference' && currentCondition.refcode">
              <div class="option-ref-container">
                <el-ref
                  :is-muti-select="true"
                  :ref-code="currentCondition.refcode"
                  field="value"
                  :template-value="currentCondition.optionList"
                  :is-edit="true"
                  :query-params="currentCondition.filtercondition"
                  @trigger="handleRefChange(currentCondition.optionList, $event, currentCondition)"
                >
                </el-ref>
              </div>
            </template>
            <template v-if="currentCondition.single_flag === false">
              <el-checkbox
                v-if="currentCondition.ctrltype === 'Select' && currentCondition.fieldtype === 'tinyint'"
                v-model="currentCondition.fe_multipleSelect"
                class="advanced-multiple-checkbox"
                disabled
                title="布尔类型不需多选"
                @change="multipleSelectChange(currentCondition)">多选</el-checkbox>
              <el-checkbox
                v-else
                v-model="currentCondition.fe_multipleSelect"
                class="advanced-multiple-checkbox"
                @change="multipleSelectChange(currentCondition)">多选</el-checkbox>
            </template>
          </div>
        </div>
      </div>
    <!-- </el-collapse-transition> -->
  </div>
</template>
<script>
import Select from './select.vue';
export default {
  name: 'IfbpSearch',
  components: {
    'search-select': Select
  },
  props: {
    noBreadcrumbSearch: {
      type: Boolean,
      default: false
    },
    // 搜索模板对象
    searchTemplate: Object,

    // 是否显示已选中标签
    showSelectedTags: {
      type: Boolean,
      default: false
    },

    // 高级搜索前展示的条数, 默认3
    conditionsBeforeAdvance: {
      type: [Number, String],
      default: 3
    },

    // 模板 code 值
    templateCode: {

    },

    // 每个条件更多按钮前显示的选项个数, 默认999
    optionsBeforeMore: {
      type: [Number, String],
      default: 999
    },

    // 是否默认展开 search panel
    showPanelByDefault: {
      type: Boolean,
      default: false
    },

    // 是否点击条件就触发 search 事件
    searchOnSelect: {
      type: Boolean,
      default: false
    },

    // 格式化日期
    dateFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    // 根据条件是否折行, 自动设置选项的更多和收起按钮
    setOptionsMoreButtonByDefault: {
      type: Boolean,
      default: true
    },
    // 是否在挂载时自动 focus input
    focusInputOnMounted: {
      type: Boolean,
      default: false
    },

    // 是否筛选关键字
    filterKeywords: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    templateCode(val) {
      if (val) {
        this.requestSearchTpl();
        this.currentTpl.keyword.value="";
        this.$refs["searchInput"].currentValue="";
      } else {
        this.currentTpl = null;
      }
      this.hideSearchPanel();
      this.$emit("toggle-search-panel",this);
    }
  },
  data() {
    return {
      // 搜索面板显示
      panelShown: false,
      // 搜索框 placeholder
      searchPlaceholder: '',
      // 条件列表
      conditionList: [],
      // 当前打开的高级条件编号
      currentConditionCode: '',
      // 当前打开的高级条件内容
      currentCondition: null,
      // 当前查询模板对象
      currentTpl: null,

      // 日期类型系统变量
      sysVarOptions: [],
      // 已设置更多收起按钮
      _optionsMoreButtonAlreadySet: false,
    };
  },
  created() {
    if (this.templateCode) {
      this.requestSearchTpl();
    } else if (this.searchTemplate) {
      this.currentTpl = this.searchTemplate;
      this.initSearchTpl();
    } else {
      console.log('创建查询模板失败, 未传入 searchTemplate 或 templateCode 参数');
    }
  },
  beforeDestroy() {
    this.hideSearchPanel();
  },
  mounted() {
    if (this.showPanelByDefault) {
      this.showSearchPanel();
    }
  },
  computed:{
    inputStyle(){
      if(this.conditionList  && this.conditionList.length > 0){
        return 'width:calc(100% - 68px)';
      }
      return '';
    }
  },
  methods: {
    // 初始化 tpl
    initSearchTpl() {
      this.searchPlaceholder = this.formatPlaceholder(this.currentTpl.keyword.fields);
      var conditionList = this.currentTpl.conditionList;
      for (let i = 0; i < conditionList.length; i++) {
        var condition = conditionList[i];
        this.$set(condition, 'fe_multipleSelect', false);
        // parse queryParams for ref
        if (condition.ctrltype === 'Reference' && condition.filtercondition) {
          try {
            condition.filtercondition = JSON.parse(condition.filtercondition);
          } catch (error) {
            console.log(condition.fieldname, '条件中filtercondition字段非合法JSON字符串');
            condition.filtercondition = null;
          }
        }
        if (!condition.default_option) {
          condition.default_option = false;
        }
        condition.fe_autoRefFetched = false; // 是否已获取默认选项标识
        if (!condition.optionList) {
          this.$set(condition, 'optionList', {
            def_min_value: null,
            def_max_value: null,
            value: null,
            options: []
          });
          // condition.optionList = {
          //   def_min_value: null,
          //   def_max_value: null,
          //   value: null,
          //   options: []
          // };
          continue;
        }
        var optionList = condition.optionList;
        if (typeof optionList.def_min_value === 'undefined') {
          this.$set(optionList, 'def_min_value', null);
        }
        if (typeof optionList.def_max_value === 'undefined') {
          this.$set(optionList, 'def_max_value', null);
        }
        if (typeof optionList.value === 'undefined') {
          this.$set(optionList, 'value', null);
        }
        if (typeof optionList.options === 'undefined') {
          this.$set(optionList, 'options', []);
        }
        var options = optionList.options;
        if (options.length > this.optionsBeforeMore) {
          this.$set(condition, 'fe_showAllOptions', false);
        }
      }
      this.conditionList = conditionList;
      this.initConditionListStatus();
      this.requestSysVars(this.formatSysVarOption);
      this.$emit('ready', this.currentTpl);

      if (this.focusInputOnMounted) {
        this.$nextTick(() => {
          const searchInput = this.$refs.searchInput;
          if (!searchInput) {
            return;
          }
          const searchInputRefs = searchInput.$refs;
          if (!searchInputRefs || !searchInputRefs.input) {
            return;
          }
          if (typeof searchInputRefs.input.focus === 'function') {
            searchInputRefs.input.focus();
          }
        });
      }
    },
    // 触发搜索事件
    search() {
      // this.panelShown = false;
      this.setCurrentCondition();
      const copyOfTpl = this.removeValOfSysVars();
      this.$emit('search', copyOfTpl);
    },
    // 切换高级搜索显示状态
    showSearchPanel() {
      this.movePanelToParentNode();
      this.panelShown = !this.panelShown;
      this.setCurrentCondition();
      if (this.setOptionsMoreButtonByDefault && !this._optionsMoreButtonAlreadySet) {
        this.$nextTick(() => {
          this.setConditionMoreBtn();
          this.$emit('show-search-panel-call',this.panelShown);
        });
      }
      let conditionList = this.conditionList;
      for (let i = 0; i < this.conditionsBeforeAdvance; i++) {
        let condition = conditionList[i];
        if (condition) {
          this.setAutoRefOptions(condition);
        }
      }
      this.$emit("toggle-search-panel",this);
    },
    // 搜索框 placeholder
    formatPlaceholder(fields) {
      fields=fields?fields:[];
      var keywords = [];
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var keyword = field.fieldname;
        if (keyword && field.iskeyword) {
          keywords.push(keyword);
        }
      }
      return '搜索' + keywords.join('/');
    },

    /**
      * 高级搜索
      */

    //  获取数据后检查是否有选中选项, 用以高亮已选条件
    initConditionListStatus() {
      var conditionList = this.conditionList;
      for (var i = this.conditionsBeforeAdvance; i < conditionList.length; i++) { // 第四条开始
        var condition = conditionList[i];
        var optionList = condition.optionList;
        var options = optionList.options;
        this.$set(optionList, 'feOptionSelected', false);
        // optionList.feOptionSelected = false;
        if (!optionList) {
          continue;
        }
        if (optionList.def_min_value || optionList.def_max_value) {
          // console.log(optionList.def_min_value, optionList.def_max_value);
          optionList.feOptionSelected = true;
          continue;
        }
        for (var j = 0; j < options.length; j++) {
          var option = options[j];
          if (!option) {
            continue;
          }
          if (option.selected) {
            optionList.feOptionSelected = true;
          }
        }
      }
    },

    // 设置选中
    selectConditionOption(optionList, option, condition) {
      // console.log(arguments);
      var optionSelected = false;
      if (option && option.selected) {
        optionSelected = true;
      }
      if (!optionList.def_min_value && !optionList.def_max_value && (!option || option.selected)) {
        optionList.feOptionSelected = false;
      } else {
        optionList.feOptionSelected = true;
      }
      // 为单选时, 清空其他选项
      if (!condition.fe_multipleSelect) {
        this.unSelectAllOptions(optionList.options);
      }
      if (option) {
        option.selected = !optionSelected;
        // option.selected = !option.selected;
        this.resetCustomOption(optionList);
        // if (typeof conditionSequence !== 'undefined') {
        //   this.clearReferenceComponent();
        // }
        // 为单选时, 收起弹出的高级条件
        if (!condition.fe_multipleSelect) {
          this.setCurrentCondition();
        }
      }
      this.initConditionListStatus();
      this.checkIfEmitNeeded(condition, option);
    },

    // 已选中日期格式整理
    formatSelectedDate(startDay, endDay) {
      var dateString = '';
      if (startDay && endDay) {
        dateString = startDay + ' 至 ' + endDay;
      } else if (startDay) {
        dateString = startDay + '之后';
      } else {
        dateString = endDay + '之前';
      }
      return dateString;
    },

    // 已选中数值格式整理
    formatSelectedNumber(min, max) {
      if (min && max) {
        return min + '-' + max + '万元';
      } else if (min) {
        return min + '万元及以上';
      } else {
        return '低于' + max + '万元';
      }
    },

    // 整理date格式
    formatDate(time, dateformat, minOrMax) {
      const date = new Date(time);
      if (date === 'Invalid Date') {
        return null;
      }
      const ymd = date.getFullYear() + '-' + ((date.getMonth()) >= 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() > 9 ? date.getDate() : ('0' + date.getDate()));
      let hms;
      if (dateformat === 'date' && minOrMax === 'min') {
        hms = '00:00:00';
      } else if (dateformat === 'date' && minOrMax === 'max') {
        hms = '23:59:59';
      } else {
        hms = (date.getHours() > 9 ? date.getHours() : ('0' + date.getHours())) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes())) + ':' + (date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds()));
      }
      return ymd + ' ' + hms;
    },

    // 触发date组件change事件时, 使用格式化后的值
    handleDateChange(optionList, key, formatedValue, condition) {
      optionList[key] = formatedValue;
      if (!condition.fe_multipleSelect) {
        this.unSelectAllOptions(optionList.options);
      }
      // 如果不是由选择系统变量触发的 date change, 重置系统变量 select
      if (!optionList.value) {
        this.checkIfEmitNeeded(condition, null);
        return;
      }
      if ((key === 'def_min_value' && formatedValue !== optionList.value[0]) ||
        (key === 'def_max_value' && formatedValue !== optionList.value[1])) {
        this.checkIfEmitNeeded(condition, null);
        optionList.value = null;
      }
    },

    // 取消选中
    cancelConditionSelection(optionList) {
      this.unSelectAllOptions(optionList.options);
      this.resetCustomOption(optionList);
      // if (typeof conditionSequence !== 'undefined') {
      //   this.clearReferenceComponent();
      // }
      this.setCurrentCondition();
    },

    // 设置当前选中的高级条件
    setCurrentCondition(condition) {
      if (!condition || (this.currentConditionCode === condition.fieldcode)) {
        this.currentConditionCode = '';
        this.currentCondition = null;
      } else {
        this.currentConditionCode = condition.fieldcode;
        this.currentCondition = condition;
      }
      if (condition) {
        this.setAutoRefOptions(condition, true);
      }
    },

    // 点击清空按钮
    clearSelectedOptions() {
      var conditions = this.conditionList;
      for (var i = 0; i < conditions.length; i++) {
        let condition = conditions[i];
        this.cancelConditionSelection(condition.optionList, true);
        condition.fe_multipleSelect = false;
      }
      this.currentTpl.keyword.value="";
      this.search();
    },

    // 已选中参照
    formatSelectedReference(optionList) {
      var refValue = optionList.value;
      if (optionList.beanMap &&
        optionList.beanMap.value_ref &&
        optionList.beanMap.value_ref[refValue] &&
        optionList.beanMap.value_ref[refValue].name) {
        return optionList.beanMap.value_ref[refValue].name;
      }

      return refValue;
    },

    // 参照值改变事件处理
    handleRefChange(optionList, event, condition) {
      var options = optionList.options;
      if (event !== 'change') {
        return;
      }
      if (!condition.fe_multipleSelect && Array.isArray(options) && options.length) {
        this.unSelectAllOptions(options);
      }
      this.checkIfEmitNeeded(condition, null);
    },

    // 重置自定义条件
    resetCustomOption(optionList) {
      optionList.feOptionSelected = false;
      optionList.def_min_value = null;
      optionList.def_max_value = null;
      optionList.value = null;
      if (optionList.beanMap) {
        optionList.beanMap = null;
      }
    },

    // 获取查询模板
    requestSearchTpl() {
      var requestUrl = '/ifbp-app-sm-qt-web/quyerTemplate/getByCode';
      this.$http({
        url: requestUrl,
        method: 'post',
        data: this.templateCode,
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (!res.data) {
            console.log('查询模板获取失败: ', JSON.stringify(res));
            return;
          }
          if (res.data.success) {
              this.currentTpl = res.data.data;
              this.initSearchTpl();

          } else if (res.data.error) {
            console.log('查询模板获取失败: ', JSON.stringify(res.data.error));
          }
        })
        .catch(() => {
          console.log('未获取到查询模板');
        });
    },

    // 将搜索panel移至父级容器
    movePanelToParentNode() {
      /*eslint no-undef: "off"*/
      // TODO 用原生js递归替代jQuery, 解除对jQuery的依赖
      var el = this.$el;
      var searchPanel = el.querySelector('.advanced-search-panel');
      // var operatorContainer = document.querySelector('.operator-container');
      var operatorContainer = $(el).parents('.operator-container');
      if (!searchPanel) {
        return;
      }
      if (operatorContainer) {
        $(searchPanel).insertAfter(operatorContainer);
        // operatorContainer.parentNode.insertBefore(searchPanel, operatorContainer.nextSibling);
      } else {
        var parent = el.parentNode;
        parent.parentNode.insertBefore(searchPanel, parent.nextSibling);
      }
    },

    // 获取系统变量
    requestSysVars(callback) {
      if (this.sysVarOptions && this.sysVarOptions.length) {
        if (typeof callback === 'function') {
          callback();
        }
        return;
      }
      const requestUrl = '/ifbp-app-sm-qt-web/sysVariable/queryAll';
      this.$http({
        url: requestUrl,
        method: 'post',
        dataType: 'json'
      })
        .then(res => {
          if (res.data.success) {
            this.sysVarOptions = res.data.data;
            if (typeof callback === 'function') {
              callback();
            }
          } else {
            console.log('获取系统变量失败', JSON.stringify(res.data.data));
          }
        })
        .catch(() => {
          console.log('获取系统变量失败');
        });
    },

    // 给系统变量类型选项 max_value 和 min_value 赋值
    formatSysVarOption() {
      if (!this.conditionList || !this.conditionList.length) {
        return;
      }
      this.conditionList.forEach(condition => {
        condition.optionList.options.forEach(option => {
          if (option.issysflag && option.value) {
            this.sysVarOptions.every(sysVarOption => {
              if (sysVarOption.code === option.value && sysVarOption.preview) {
                option.min_value = sysVarOption.preview[0];
                option.max_value = sysVarOption.preview[1];
                return false;
              }
              return true;
            });
          }
        });
      });
    },

    // 处理系统变量改变
    handleSysVarChange(optionList, val, condition) {
      if (!val) {
        return;
      }
      optionList.def_min_value = val[0];
      optionList.def_max_value = val[1];
      this.checkIfEmitNeeded(condition, null);
    },

    // 取消选中所有选项
    unSelectAllOptions(options) {
      options.forEach(option => {
        option.selected = false;
      });
    },

    // 系统变量(日期类型), 传递对象时, 需要把 value 置空
    removeValOfSysVars() {
      let copyOfTpl = JSON.parse(JSON.stringify(this.currentTpl));
      // 去除搜索框空格
      let keyword = copyOfTpl.keyword;
      if (keyword && keyword.value && typeof keyword.value.trim === 'function') {
        keyword.value = keyword.value.trim();
      }
      let conditions = copyOfTpl.conditionList;
      conditions.forEach(condition => {
        const dateformat = condition.dateformat;
        if (condition.ctrltype === 'DateTime' || condition.ctrltype === 'Date') {
          condition.optionList.value = null;
          if (condition.optionList.def_min_value) {
            condition.optionList.def_min_value = this.formatDate(condition.optionList.def_min_value, dateformat, 'min');
          }
          if (condition.optionList.def_max_value) {
            condition.optionList.def_max_value = this.formatDate(condition.optionList.def_max_value, dateformat, 'max');
          }
        }
        if (typeof condition.fe_showAllOptions === 'boolean') {
          delete condition.fe_showAllOptions;
        }
        delete condition.fe_multipleSelect;
        // 删除自定义参数
        delete condition.optionList.feOptionSelected;
        condition.optionList.options.forEach(option => {
          delete option.fe_option_show;
          if (option.def_min_value) {
            option.def_min_value = this.formatDate(option.def_min_value, dateformat, 'min');
          }
          if (option.def_max_value) {
            option.def_max_value = this.formatDate(option.def_max_value, dateformat, 'max');
          }
        });
      });
      return copyOfTpl;
    },

    // 收起展开更多选项
    toggleShowAllOptions(condition, index) {
      const el = this.$refs.searchPanel;
      const conditionRows = $(el).find('.condition-row').not('.advanced-conditions-row');
      if (condition.fe_showAllOptions) {
        conditionRows.get(index).style.height = '40px';
      } else {
        conditionRows.get(index).style.height = 'auto';
      }
      condition.fe_showAllOptions = !condition.fe_showAllOptions;
    },

    checkIfEmitNeeded(condition, option) {
      let copyOfTpl = this.removeValOfSysVars();
      // let copyOfOption = JSON.parse(JSON.stringify(option));
      // let copyOfCondition = JSON.parse(JSON.stringify(condition));
      const dateformat = condition ? condition.dateformat : 'datetime';
      if (condition && (condition.ctrltype === 'DateTime' || condition.ctrltype === 'Date') && condition.optionList) {
        if (condition.optionList.def_min_value) {
          condition.optionList.def_min_value = this.formatDate(condition.optionList.def_min_value, dateformat, 'min');
        }
        if (condition.optionList.def_max_value) {
          condition.optionList.def_max_value = this.formatDate(condition.optionList.def_max_value, dateformat, 'max');
        }
      }
      if (condition && (condition.ctrltype === 'DateTime' || condition.ctrltype === 'Date') && option) {
        if (option.def_min_value) {
          option.def_min_value = this.formatDate(option.def_min_value, dateformat, 'min');
        }
        if (option.def_max_value) {
          option.def_max_value = this.formatDate(option.def_max_value, dateformat, 'max');
        }
      }
      let copyOfCondition = JSON.parse(JSON.stringify(condition));
      let copyOfOption = JSON.parse(JSON.stringify(option));
      this.$emit('select', copyOfTpl, copyOfCondition, copyOfOption);
      if (this.searchOnSelect) {
        // this.setCurrentCondition();
        this.$emit('search', copyOfTpl);
      }
    },

    multipleSelectChange(condition) {
      if (!condition) {
        return;
      }
      if (condition.fe_multipleSelect) {
        return;
      }
      // 清空该条件已选项
      let optionList = condition.optionList;
      optionList.def_min_value = null;
      optionList.def_max_value = null;
      optionList.value = null;
      let options = optionList.options;
      options.forEach(option => {
        option.selected = false;
      });
      // 如果需要, 抛事件
      if (this.searchOnSelect) {
        const copyOfTpl = this.removeValOfSysVars();
        this.$emit('select', copyOfTpl, condition, null);
      }
    },

    // 自动配置条件选项的更多, 收起
    setConditionMoreBtn() {
      const el = this.$refs.searchPanel;
      const conditionRows = $(el).find('.condition-row').not('.advanced-conditions-row');
      // const heightEachRow = 40;
      let conditions = this.conditionList;
      conditionRows.each((index, domEle) => {
        if ($(domEle).height() > 40) {
          this.$set(conditions[index], 'fe_showAllOptions', false);
          $(domEle).height(40);
        }
      });
      this._optionsMoreButtonAlreadySet = true;
    },

    setAutoRefOptions(condition, advancedCondition) {
      if (!condition || condition.ctrltype !== 'Reference' || !condition.refcode || !condition.default_option || condition.fe_autoRefFetched) {
        return;
      }
      this.$http({
        url: '/uitemplate_web/iref_ctr/refInfo/?refCode=' + condition.refcode,
        method: 'get'
      }).then(refInfo => {
        const refInfoData = refInfo.data;
        if (!refInfoData) {
          throw new Error(refcode + ' refInfo is empty.');
        }
        refInfoData.content = '';
        let queryParams = condition.filtercondition;
        if (queryParams) {
          refInfoData.transmitParam = JSON.stringify(queryParams);
        }
        this.$http({
          url: '/uitemplate_web/iref_ctr/filterRefJSON',
          method: 'post',
          data: refInfoData,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (!res || !res.data || !res.data.data) {
            throw new Error(refcode + ' filterRefJSON empty');
          }
          let options = [];
          for (let i = 0; i < res.data.data.length; i++) {
            const ref = res.data.data[i];
            options.push({
              pk: null,
              min_value: null,
              max_value: null,
              value: ref.id,
              name: ref.refname || ref.name || '',
              dispsequence: i,
              selected: false,
              issysflag: false
            });
            if (i === 9) {
              break;
            }
          }
          condition.optionList.options = options;
          // condition.conditionList = {
          //   pk: null,
          //   def_min_value: null,
          //   def_max_value: null,
          //   value: null,
          //   options: options
          // };
          condition.fe_autoRefFetched = true;
          if (!advancedCondition) {
            this.$nextTick(() => {
              this.setConditionMoreBtn();
            });
          }
        }).catch(error => {
          console.log('Fetching filterRefJSON failed: ', error);
        });
      }).catch(err => {
        console.log('Fetching refinfo of auto ref options failed: ', err);
      });
    },

    // 隐藏展开的模板
    hideSearchPanel() {
      this.panelShown = false;
    },

    // 筛选关键字搜索事件触发
    handleSelectSearch(rules) {
      const keywordsRules = Array.isArray(rules) ? rules : [];
      let rulesFormated = [];
      keywordsRules.forEach(rule => {
        // let fieldcode, fieldname, value;
        // rulesFormated.push({ fieldcode, fieldname, value } = rule);
        rulesFormated.push({
          fieldcode: rule.fieldcode,
          fieldname: rule.fieldname,
          value: rule.value
        });
      });
      this.currentTpl.keyword.rules = rulesFormated;
      this.search();
    },

    /**
     * 暴露方法
     */
    // 根据fieldcode查找条件并设置选项内容
    // 'fieldcode': {
    //   'optionValue': 'optionName',
    //   'optionValue2': 'optionName2',
    // }
    setOptionsByFieldcode(paramObj) {
      // 参数无效时返回
      if (Object.prototype.toString.call(paramObj) !== '[object Object]') {
        return;
      }
      let fieldsToReset = Object.keys(paramObj);
      if (!fieldsToReset.length) {
        return;
      }
      let conditionList = this.currentTpl.conditionList;
      for (let i = 0; i < conditionList.length; i++) {
        let condition = conditionList[i];
        let fieldcode = condition.fieldcode;
        if (fieldsToReset.indexOf(fieldcode) === -1) {
          continue;
        }
        // 如果传入fieldcode对应的option参数为空或无效时, 删除当前fieldcode对应的条件
        const optionsToSet = paramObj[fieldcode];
        let optionValuesToSet = Object.keys(optionsToSet);
        // 处理传入的条件
        let optionListToReset = condition.optionList || {};
        let optionsToReset = optionListToReset.options || {};
        // 如果传入条件对应的选项为空, 隐藏所有选项
        if (!optionsToSet || !optionValuesToSet.length) {
          for (let j = 0; j < optionsToReset.length; j++) {
            let option = optionsToReset[j];
            option.fe_option_show = false;
            option.selected = false;
          }
          continue;
        }
        for (let j = 0; j < optionsToReset.length; j++) {
          let option = optionsToReset[j];
          const optionValue = option.value;
          if (optionValuesToSet.indexOf(optionValue) !== -1) {
            // 赋值
            option.name = optionsToSet[optionValue];
            option.fe_option_show = true;
            // 删除标记数组中的optionvalue
            optionValuesToSet.splice(optionValuesToSet.indexOf(optionValue), 1);
          } else {
            option.fe_option_show = false;
            option.selected = false;
          }
        }
        if (!optionValuesToSet.length) {
          continue;
        }
        // 如果有新增的选项， 需要创建新的选项
        for (let k = 0; k < optionValuesToSet.length; k++) {
          let newOptionValue = optionValuesToSet[k];
          let newOption = {
            'min_value': null,
            'max_value': null,
            'value': newOptionValue,
            'name': optionsToSet[newOptionValue],
            'dispsequence': null,
            'selected': false,
            'fe_option_show': true
          };
          optionsToReset.push(newOption);
        }
      }
    },

    // 根据 fieldcode 查找参照类型条件并设置 filtercondition (若为自动获取默认选项, 则获取默认选项)
    // {
    //   'fieldcode1': 'queryParams1JSON',
    //   'fieldcode2': 'queryParams2JSON',
    // }
    setFilterConditionByFieldCode(paramObj) {
      // 参数无效时返回
      if (Object.prototype.toString.call(paramObj) !== '[object Object]') {
        return;
      }
      let fieldsToReset = Object.keys(paramObj);
      if (!fieldsToReset.length) {
        return;
      }
      let conditionList = this.currentTpl.conditionList;
      for (let i = 0; i < conditionList.length; i++) {
        let condition = conditionList[i];
        let fieldcode = condition.fieldcode;
        if (fieldsToReset.indexOf(fieldcode) === -1) {
          continue;
        }
        // 非参照类型条件跳过
        if (condition.ctrltype !== 'Reference') {
          continue;
        }
        // 条件未发生变化跳过
        const newCondition = paramObj[fieldcode];
        if (newCondition === condition.filtercondition) {
          continue;
        }
        // filtercondition 赋值
        // condition.filtercondition = newCondition;
        try {
          condition.filtercondition = JSON.parse(newCondition);
        } catch (error) {
          console.log(fieldcode, '对应条件中 filtercondition 字段非合法JSON字符串');
          condition.filtercondition = null;
        }
        // 判断是否需要自动获取条件选项
        if (condition.default_option) {
          condition.fe_autoRefFetched = false;
          this.setAutoRefOptions(condition);
        }
      }
    },
  }
};
</script>
<style>
</style>
