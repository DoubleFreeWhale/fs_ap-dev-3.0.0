<template>
  <span
    class="el-cascader"
    :class="[
      {
        'is-opened': menuVisible,
        'is-disabled': disabled,
        'hide-border': hideBorder,  
        'hide-right':hideRight, 
      },
      size ? 'el-cascader--' + size : ''
    ]"
    @click="handleClick"
    @mouseenter="inputHover = true"
    @mouseleave="inputHover = false"
    ref="reference"
    v-clickoutside="handleClickoutside"
  >
    <el-input
      ref="input"
      :readonly="!filterable"
      v-model="inputValue"
      @change="debouncedInputChange"
      :validate-event="false"
      :size="size"
      :disabled="disabled"
    >
      <template slot="icon">
        <i
          key="1"
          v-if="clearable && inputHover && currentLabels.length"
          class="el-input__icon el-icon-circle-close el-cascader__clearIcon"
          @click="clearValue"
        ></i>
        <i
          key="2"
          v-else
          class="el-input__icon el-icon-caret-bottom"
          :class="{ 'is-reverse': menuVisible }"
        ></i>
        <div class="el-cascader-right-line"></div>
      </template>
    </el-input>
    <span class="el-cascader__label" v-show="inputValue === ''">
      <!-- 这里判断，当inputValue为空时，显示 placeholder 否则显示选中值。 同时 将input上的placeholder去掉 -->
      <template v-if="currentLabels.length==0 ">
        <span class="cascader_fake_placeholder"> {{ placeholder }} </span>
      </template>
      <template v-else>
        <template v-if="showAllLevels">
          <template v-for="(label, index) in currentLabels">
            {{ label }}
            <span v-if="index < currentLabels.length - 1" :key="index"> / </span>
          </template>
        </template>
        <template v-else>
          {{ currentLabels[currentLabels.length - 1] }}
        </template>
      </template>
    </span>
  </span>
</template>

<script>
import Vue from 'vue';
import ElCascaderMenu from './menu';
import ElInput from 'ifbp-element/packages/input';
import Popper from 'ifbp-element/src/utils/vue-popper';
import Clickoutside from 'ifbp-element/src/utils/clickoutside';
import emitter from 'ifbp-element/src/mixins/emitter';
import Locale from 'ifbp-element/src/mixins/locale';
import { t } from 'ifbp-element/src/locale';
import debounce from 'throttle-debounce/debounce';

const popperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
};

export default {
  name: 'ElCascader',

  directives: { Clickoutside },

  mixins: [popperMixin, emitter, Locale],

  components: {
    ElInput
  },

  props: {
    options: {
      type: Array,
      required: true
    },
    hideBorder:{
      type:Boolean,
      default:false
    },
    hideRight:{
      type:Boolean,
      default:false
    },
    props: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'label',
          value: 'value',
          disabled: 'disabled'
        };
      }
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default() {
        return t('el.cascader.placeholder');
      }
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: false
    },
    changeOnSelect: Boolean,
    popperClass: String,
    expandTrigger: {
      type: String,
      default: 'click'
    },
    filterable: Boolean,
    size: String,
    showAllLevels: {
      type: Boolean,
      default: true
    },
    debounce: {
      type: Number,
      default: 300
    },
    beforeFilter: {
      type: Function,
      default: () => (() => {})
    },
    notLeafSelectable: {
      type: Boolean,
      default: false
    },
    // 自适应弹框高度, 默认开
    selfAdjustHeight: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      currentValue: this.value,
      menu: null,
      debouncedInputChange() {},
      menuVisible: false,
      inputHover: false,
      inputValue: '',
      flatOptions: null,
      // 自适应高度
      // .el-cascader-menus 的 max-height
      containerMaxHeight: 396,
      // .el-cascader-menus 的 height
      containerHeight: 396,
      // 各 .el-cascader-menu 的 height
      menuHeightArr: [396],
      // .el-cascader-menu__item 高度
      menuItemHeight: 36,
      // 触发选中事件时的高度
      containerHeightOnSelect: null,
      // 缓存选中事件时高度
      cachedHeight: null,
      // 设置最小高度
      containerMinHeight: 188,
    };
  },

  computed: {
    labelKey() {
      return this.props.label || 'label';
    },
    valueKey() {
      return this.props.value || 'value';
    },
    childrenKey() {
      return this.props.children || 'children';
    },
    currentLabels() {
      let options = this.options;
      let labels = [];
      this.currentValue.forEach(value => {
        const targetOption = options && options.filter(option => option[this.valueKey] === value)[0];
        if (targetOption) {
          labels.push(targetOption[this.labelKey]);
          options = targetOption[this.childrenKey];
        }
      });
      return labels;
    }
  },

  watch: {
    menuVisible(value) {
      value ? this.showMenu() : this.hideMenu();
    },
    value(value) {
      this.currentValue = value;
    },
    currentValue(value) {
      this.dispatch('ElFormItem', 'el.form.change', [value]);
    },
    options: {
      deep: true,
      handler(value) {
        if (!this.menu) {
          this.initMenu();
        }
        this.flatOptions = this.flattenOptions(this.options);
        this.menu.options = value;
      }
    },
  },

  methods: {
    initMenu() {
      this.menu = new Vue(ElCascaderMenu).$mount();
      this.menu.options = this.options;
      this.menu.props = this.props;
      this.menu.expandTrigger = this.expandTrigger;
      this.menu.changeOnSelect = this.changeOnSelect;
      this.menu.popperClass = this.popperClass;
      this.menu.notLeafSelectable = this.notLeafSelectable;
      this.popperElm = this.menu.$el;
      this.menu.$on('pick', this.handlePick);
      this.menu.$on('activeItemChange', this.handleActiveItemChange);
      this.menu.$on('activeItemIconClick', this.activeItemIconClick);
      this.menu.$on('menuLeave', this.doDestroy);
      this.menu.$on('ifbpMenuItemClick', item => {
        // 设置触发选中事件时的容器高度
        this.containerHeightOnSelect = this.containerHeight;
        this.cachedHeight = this.containerHeightOnSelect;
        this.$emit('ifbpMenuItemClick', item);
      });
    },
    showMenu() {
      if (!this.menu) {
        this.initMenu();
      }
      // 如果自适应高度
      if (this.selfAdjustHeight) {
        // 计算menu容器最大高度
        if (this.$refs.input && this.$refs.input.$el) {
          var $inputEl = $(this.$refs.input.$el);
          var topPx = $inputEl.offset().top - $(window).scrollTop();
          var bottomPx = $(window).height() - ($inputEl.offset().top - $(window).scrollTop()) - $inputEl.height();
          this.containerMaxHeight = Math.max(topPx, bottomPx) - 16;
        }
        // 设置最大高度
        if (this.popperElm) {
          this.popperElm.style.maxHeight = this.containerMaxHeight + 'px';
        }
        // 设置高度
        if (Array.isArray(this.options) && this.options.length) {
          this.setContainerHeight(this.options.length, 0);
        }
      }

      this.menu.value = this.currentValue.slice(0);
      this.menu.visible = true;
      this.menu.options = this.options;
      this.$nextTick(_ => {
        this.updatePopper();
        this.menu.inputWidth = this.$refs.input.$el.offsetWidth - 2;
      });
    },
    hideMenu() {
      this.inputValue = '';
      this.menu.visible = false;
    },
    handleActiveItemChange(value, item, level) {
      // 设置容器高度
            if (item && Array.isArray(item.children) && item.children.length ) {
                this.setContainerHeight(item.children.length, level + 1);
            }
            this.$nextTick(_ => {
              this.updatePopper();
            });
            this.$emit('active-item-change', value, item, level);
    },
    activeItemIconClick(value, item, level){
      if (item && Array.isArray(item.children) && item.children.length ) {
                this.setContainerHeight(item.children.length, level + 1);
            }
            this.$nextTick(_ => {
              this.updatePopper();
            });
            this.$emit('active-item-icon-click', value, item, level);
    },
    handlePick(value, close = true) {
      this.currentValue = value;
      this.$emit('input', value);
      this.$emit('change', value);

      if (close) {
        this.menuVisible = false;
      }

      // // 设置触发选中事件时的容器高度
      // this.containerHeightOnSelect = this.containerHeight;
      // this.cachedHeight = this.containerHeightOnSelect;
    },
    handleInputChange(value) {
      if (!this.menuVisible) return;
      const flatOptions = this.flatOptions;

      if (!value) {
        this.menu.options = this.options;
        return;
      }

      let filteredFlatOptions = flatOptions.filter(optionsStack => {
        return optionsStack.some(option => new RegExp(value, 'i').test(option[this.labelKey]));
      });

      if (filteredFlatOptions.length > 0) {
        filteredFlatOptions = filteredFlatOptions.map(optionStack => {
          return {
            __IS__FLAT__OPTIONS: true,
            value: optionStack.map(item => item[this.valueKey]),
            label: this.renderFilteredOptionLabel(value, optionStack)
          };
        });
      } else {
        filteredFlatOptions = [{
          __IS__FLAT__OPTIONS: true,
          label: this.t('el.cascader.noMatch'),
          value: '',
          disabled: true
        }];
      }
      this.menu.options = filteredFlatOptions;
    },
    renderFilteredOptionLabel(inputValue, optionsStack) {
      return optionsStack.map((option, index) => {
        const label = option[this.labelKey];
        const keywordIndex = label.toLowerCase().indexOf(inputValue.toLowerCase());
        const labelPart = label.slice(keywordIndex, inputValue.length + keywordIndex);
        const node = keywordIndex > -1 ? this.highlightKeyword(label, labelPart) : label;
        return index === 0 ? node : [' / ', node];
      });
    },
    highlightKeyword(label, keyword) {
      const h = this._c;
      return label.split(keyword)
        .map((node, index) => index === 0 ? node : [
          h('span', { class: { 'el-cascader-menu__item__keyword': true }}, [this._v(keyword)]),
          node
        ]);
    },
    flattenOptions(options, ancestor = []) {
      let flatOptions = [];
      options.forEach((option) => {
        const optionsStack = ancestor.concat(option);
        if (!option[this.childrenKey]) {
          flatOptions.push(optionsStack);
        } else {
          if (this.changeOnSelect) {
            flatOptions.push(optionsStack);
          }
          flatOptions = flatOptions.concat(this.flattenOptions(option[this.childrenKey], optionsStack));
        }
      });
      return flatOptions;
    },
    clearValue(ev) {
      ev.stopPropagation();
      this.handlePick([], true);
      // 点击删除后将缓存的高度设置为0;
      this.cachedHeight=0;

    },
    handleClickoutside() {
      this.cachedHeight = this.containerHeightOnSelect ? this.containerHeightOnSelect : null;
      this.menuVisible = false;
    },
    handleClick() {
      if (this.disabled) return;
      if (this.filterable) {
        this.menuVisible = true;
        this.$refs.input.$refs.input.focus();
        return;
      }
      this.menuVisible = !this.menuVisible;
    },
    // 设置容器高度
    setContainerHeight(optionsCount, arrIndex) {
      if (!optionsCount || isNaN(arrIndex)) {
        return;
      }
      if (this.cachedHeight) {
        this.containerHeight = this.cachedHeight;
        this.cachedHeight = null;
      } else {
        // 本级所有选项的高度和
        this.menuHeightArr[arrIndex] = this.menuItemHeight * optionsCount + 14;
        // 跳级选择
        this.menuHeightArr = this.menuHeightArr.slice(0, arrIndex + 1);
        // 解决 set 值时, 形成稀疏数组从而无法使用 Math.max 的问题
        for (let i = 0; i < this.menuHeightArr.length; i++) {
          if (isNaN(this.menuHeightArr[i])) {
            this.menuHeightArr[i] = 0;
          }
        }
        let contentMaxHeight = Math.max.apply(null, this.menuHeightArr) || this.containerMaxHeight;
        if (this.containerHeight !== contentMaxHeight || arrIndex === 0) {
          this.containerHeight = contentMaxHeight;
        }
      }
      this.containerHeight = Math.max(this.containerMinHeight, this.containerHeight);
      // 设置高度
      if (this.selfAdjustHeight && this.popperElm) {
        this.popperElm.style.height = this.containerHeight + 'px';
      }
    }
  },

  created() {
    this.debouncedInputChange = debounce(this.debounce, value => {
      const before = this.beforeFilter(value);

      if (before && before.then) {
        this.menu.options = [{
          __IS__FLAT__OPTIONS: true,
          label: this.t('el.cascader.loading'),
          value: '',
          disabled: true
        }];
        before
          .then(() => {
            this.$nextTick(() => {
              this.handleInputChange(value);
            });
          });
      } else if (before !== false) {
        this.$nextTick(() => {
          this.handleInputChange(value);
        });
      }
    });
  },

  mounted() {
    this.flatOptions = this.flattenOptions(this.options);
  }
};
</script>

