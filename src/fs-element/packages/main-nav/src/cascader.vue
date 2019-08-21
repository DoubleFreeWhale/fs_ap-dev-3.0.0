<template>
  <span
    class="el-cascader"
    :class="[
      {
        'is-opened': menuVisible,
        'is-disabled': disabled
      },
      size ? 'el-cascader--' + size : ''
    ]"
    @click="handleClick"
    @mouseenter="inputHover = true"
    @mouseleave="inputHover = false"
    ref="reference"
    v-clickoutside="handleClickoutside"
  >
    <slot></slot>
  </span>
</template>

<script>
import Vue from 'vue';
import ElCascaderMenu from './cc-menu';
import Popper from 'ifbp-element/src/utils/vue-popper';
import Clickoutside from 'ifbp-element/src/utils/clickoutside';
import emitter from 'ifbp-element/src/mixins/emitter';
import lodash from 'lodash';

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
  name: 'cascader',
  directives: { Clickoutside },
  mixins: [popperMixin, emitter],
  props: {
    options: {
      required: true
    },
    index: {
      required: true
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
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: false
    },
    changeOnSelect: Boolean,
   // popperClass: String,
    expandTrigger: {
      type: String,
      default: 'hover'
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
      flatOptions: null
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
      value && this.options.length > 0 ? this.showMenu() : this.hideMenu();
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
        if (this.menu) {
          this.flatOptions = this.flattenOptions(this.options);
          this.menu.options = value;
        }
      }
    }
  },
  methods: {
    initMenu() {
      if (this.options.length < 1) return;
      this.menu = new Vue(ElCascaderMenu).$mount();
      this.menu.options = this.options;
      this.menu.props = this.props;
      this.menu.expandTrigger = this.expandTrigger;
      this.menu.changeOnSelect = this.changeOnSelect;
      // this.menu.popperClass = this.popperClass;
      this.flyoutElm = this.menu.$el;
      this.setPosition(this.flyoutElm);
      document.body.appendChild(this.flyoutElm);
      this.menu.$on('pick', this.handlePick);
      this.menu.$on('activeItemChange', this.handleActiveItemChange);
      this.menu.$on('menuLeave', this.doDestroy);
      this.$on('scroll', function() {
        this.setPosition(this.flyoutElm);
      }.bind(this));
    },
    setPosition(ele) {
      var ref = this.$parent.$el;// li
      var top = ref.offsetTop;
      var left = ref.offsetLeft;
      var parent = ref.offsetParent;
      var scrollRef = ref.offsetParent.offsetParent;
      while (parent) {
        top += parent.offsetTop;
        left += parent.offsetLeft;
        parent = parent.offsetParent;
      }
      if (document.body.clientHeight - (top - scrollRef.scrollTop) < 204) {
        ele.style.top = top - scrollRef.scrollTop - (204 - ref.offsetHeight) - 5 + 'px';
      } else {
        ele.style.top = top - scrollRef.scrollTop - 5 + 'px';
      }
      ele.style.left = left + ref.offsetWidth + 'px';
    },
    showMenu() {
      if (!this.menu) {
        this.initMenu();
      }
      if (this.menu) {
        this.menu.value = this.currentValue.slice(0);
        this.menu.visible = true;
        this.menu.options = this.options;
        this.$nextTick(_ => {
        // this.updatePopper();
        // this.menu.inputWidth = this.$refs.input.$el.offsetWidth - 2;
        });
      }
    },
    hideMenu() {
      if (this.menu) {
        this.inputValue = '';
        this.menu.visible = false;
      }
    },
    handleActiveItemChange(value) {
      this.$nextTick(_ => {
        // this.updatePopper();
      });
      this.$emit('active-item-change', value);
    },
    handlePick(value, close = true) {
      this.currentValue = value;
      // this.$emit('input', value);
      this.$emit('change', value, this.index);
      if (close) {
        this.menuVisible = false;
      }
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
    },
    handleClickoutside() {
      this.menuVisible = false;
    },
    handleClick(flag) {
      if (this.disabled) return;
      if (this.filterable) {
        this.menuVisible = true;
        // this.$refs.input.$refs.input.focus();
        return;
      }
      if (flag === undefined) {
        this.menuVisible = !this.menuVisible;
      } else {
        this.menuVisible = !!flag;
      }
    }
  },
  created() {
    this.debouncedInputChange = lodash.debounce(value => {
      this.handleInputChange(value);
    }, this.debounce.default);
  },
  mounted() {
    this.flatOptions = this.flattenOptions(this.options);
  }
};
</script>
