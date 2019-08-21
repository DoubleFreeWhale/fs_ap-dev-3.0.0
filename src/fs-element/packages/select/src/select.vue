<template>
  <div
    class="el-select"
    v-clickoutside="handleClose">
    <ifbp-tooltip :content="selectedLabel"  v-show="showFlag === 'tooptip'"></ifbp-tooltip>
    <ifbp-tooltip :content="multiCurrentLabel" v-show="showFlag === 'tooptipMulti'"></ifbp-tooltip>
    <ifbp-tooltip :diff="diffLabel" v-show="showFlag === 'tooptipDiff'"></ifbp-tooltip>
    <div v-show="showFlag === 'base'">
      <div
      class="el-select__tags"
      v-if="multiple"
      @click.stop="toggleMenu"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px' }">
        <transition-group @after-leave="resetInputHeight">
          <el-tag
            v-for="item in selected"
            :key="item.value"
            closable
            :hit="item.hitState"
            type="primary"
            @close="deleteTag($event, item)"
            close-transition>
            <span class="el-select__tags-text">{{ item.currentLabel }}</span>
          </el-tag>
        </transition-group>

        <input
          type="text"
          class="el-select__input"
          :class="`is-${ size }`"
          @focus="handleFocus1"
          :disabled="disabled"
          @keyup="managePlaceholder"
          @keydown="resetInputState"
          @keydown.down.prevent="navigateOptions('next')"
          @keydown.up.prevent="navigateOptions('prev')"
          @keydown.enter.prevent="selectOption"
          @keydown.esc.prevent="visible = false"
          @keydown.delete="deletePrevTag"
          v-model="query"
          :debounce="remote ? 300 : 0"
          v-if="filterable"
          :style="{ width: inputLength + 'px', 'max-width': inputWidth - 42 + 'px' }"
          ref="input">
      </div>
      <el-input
        v-if="IsPC"
        ref="reference"
        v-model="selectedLabel"
        type="text"
        :placeholder="currentPlaceholder"
        :name="name"
        :size="size"
        :disabled="disabled"
        :readonly="!filterable || multiple"
        :validate-event="false"
        @focus="handleFocus"
        @blur="handleBlur"
        @click="handleIconClick"
        @mousedown.native="handleMouseDown"
        @keyup.native="debouncedOnInputChange"
        @keydown.native.down.prevent="navigateOptions('next')"
        @keydown.native.up.prevent="navigateOptions('prev')"
        @keydown.native.enter.prevent="selectOption"
        @keydown.native.esc.prevent="visible = false"
        @keydown.native.tab="visible = false"
        @paste.native="debouncedOnInputChange"
        @mouseenter.native="inputHovering = true"
        @mouseleave.native="inputHovering = false"
        :icon="iconClass">
      </el-input>
       <el-input
         v-else
        ref="reference"
        v-model="selectedLabel"
        type="text"
        :placeholder="currentPlaceholder"
        :name="name"
        :size="size"
        :disabled="disabled"
        :readonly="!filterable || multiple"
        :validate-event="false"
        @focus="handleFocus2"
        @blur="handleBlur"
        @click="handleIconClick2"
        :icon="iconClass">
      </el-input>
    </div>
    <transition
      name="el-zoom-in-top"
      @after-leave="doDestroy"
      v-if="IsPC"
      @after-enter="handleMenuEnter">
      <el-select-menu
        ref="popper"
        v-show="visible && emptyText !== false" >
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          :class="{ 'is-empty': !allowCreate && filteredOptionsCount === 0 , 'ifbp-page-select': pageType} "
          v-show="options.length > 0 && !loading">
          <el-option
            :value="query"
            created
            v-if="showNewOption">
          </el-option>
          <!-- <el-option
            value=""
            label="请选择"
            created
            v-if="false">
          </el-option> -->
          <slot></slot>
        </el-scrollbar>
        <p class="el-select-dropdown__empty" v-if="emptyText && (allowCreate && options.length === 0 || !allowCreate)">{{ emptyText }}</p>
      </el-select-menu>
    </transition>
     <mt-select v-if="!IsPC" ref="mtpicker"  :multiple="multiple" :pageType="pageType" :loading=" loading" @confirm="confirmSelectOption"  @cancel="cancelSelectOptions">
        <slot></slot>
     </mt-select>
  </div>
</template>

<script type="text/babel">
import Emitter from "ifbp-element/src/mixins/emitter";
import Locale from "ifbp-element/src/mixins/locale";
import ElInput from "ifbp-element/packages/input";
import ElSelectMenu from "./select-dropdown.vue";
import ElOption from "./option.vue";
import ElTag from "ifbp-element/packages/tag";
import ElScrollbar from "ifbp-element/packages/scrollbar";
import debounce from "throttle-debounce/debounce";
import Clickoutside from "ifbp-element/src/utils/clickoutside";
import { IsPC } from 'ifbp-element/src/utils/util';
import MtSelect from 'ifbp-element/packages/mt-select';
import { addClass, removeClass, hasClass } from "ifbp-element/src/utils/dom";
import {
  addResizeListener,
  removeResizeListener
} from "ifbp-element/src/utils/resize-event";
import { t } from "ifbp-element/src/locale";
const sizeMap = {
  large: 42,
  small: 30,
  mini: 22
};

export default {
  mixins: [Emitter, Locale],

  name: "ElSelect",

  componentName: "ElSelect",

  computed: {
    showFlag(){
      if(this.editable === false && this.diff && this.diff.oldValue !== undefined && this.diff.newValue !== undefined){
        return 'tooptipDiff';
      }
      if(this.editable === false && !this.multiple){
        return 'tooptip';
      }else if(this.editable === false && this.multiple){
        return 'tooptipMulti';
      }else{
        return 'base';
      }
    },
    multiCurrentLabel() {
      let label = "";
      if (this.selected && this.selected.length > 0) {
        for (let i = 0; i < this.selected.length; i++) {
          label += this.selected[i].currentLabel + ";";
        }
      }
      return label;
    },
    iconClass() {
      let criteria =
        this.clearable &&
        !this.disabled &&
        this.inputHovering &&
        !this.multiple &&
        this.value !== undefined &&
        this.value !== "";
      return criteria
        ? "circle-close is-show-close"
        : this.remote && this.filterable ? "" : "caret-top";
      // return criteria = this.remote && this.filterable ? "" : "caret-top";
    },

    debounce() {
      return this.remote ? 300 : 0;
    },

    emptyText() {
      if (this.loading) {
        return this.loadingText || this.t("el.select.loading");
      } else {
        if (this.remote && this.query === "" && this.options.length === 0)
          return false;
        if (
          this.filterable &&
          this.options.length > 0 &&
          this.filteredOptionsCount === 0
        ) {
          return this.noMatchText || this.t("el.select.noMatch");
        }
        if (this.options.length === 0) {
          return this.noDataText || this.t("el.select.noData");
        }
      }
      return null;
    },

    showNewOption() {
      let hasExistingOption = this.options
        .filter(option => !option.created)
        .some(option => option.currentLabel === this.query);
      return (
        this.filterable &&
        this.allowCreate &&
        this.query !== "" &&
        !hasExistingOption
      );
    }
  },

  components: {
    ElInput,
    ElSelectMenu,
    ElOption,
    ElTag,
    ElScrollbar,
    MtSelect
  },

  directives: { Clickoutside },

  props: {
    pageType: {
      type: Boolean,
      default: false
    },
    name: String,
    value: {
      required: true
    },
    size: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    editable: {
      type: Boolean,
      default: true
    },
    loading: Boolean,
    popperClass: String,
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default() {
        return t("el.select.placeholder");
      }
    },
    defaultFirstOption: Boolean,
    diff: {}
  },

  data() {
    return {
      radioSelectedHistory:'',
      multipleSelect:[],
      options: [],
      cachedOptions: [],
      createdLabel: null,
      createdSelected: false,
      selected: this.multiple ? [] : {},
      isSelect: true,
      inputLength: 20,
      inputWidth: 0,
      cachedPlaceHolder: "",
      optionsCount: 0,
      filteredOptionsCount: 0,
      dropdownUl: null,
      visible: false,
      selectedLabel: "",
      hoverIndex: -1,
      query: "",
      bottomOverflow: 0,
      topOverflow: 0,
      optionsAllDisabled: false,
      inputHovering: false,
      currentPlaceholder: "",
      currentOption: null,
      diffLabel: null,
      IsPC: IsPC(),
      TimeOut:null
    };
  },

  watch: {
    editable(editable){
      this.dispatch('ElFormItem', 'editableChange', [editable]);
    },
    placeholder(val) {
      this.cachedPlaceHolder = this.currentPlaceholder = val;
    },
    diff: {
      handler(diff) {
        if(this.showFlag === 'tooptipDiff'){
          this.getDiffValue();
        }
      },
      deep: true
    },
    value(val) {
      if (this.multiple) {
        this.resetInputHeight();
        if (val.length > 0 || (this.$refs.input && this.query !== "")) {
          this.currentPlaceholder = "";
        } else {
          this.currentPlaceholder = this.cachedPlaceHolder;
        }
      }
      this.setSelected();
      if (this.filterable && !this.multiple) {
        this.inputLength = 20;
      }
      if(this.TimeOut){
        clearTimeout(this.TimeOut);
      }
      this.TimeOut = setTimeout(()=>{
        this.valueChange(val);
        this.TimeOut = null;
        clearTimeout(this.TimeOut);
      },200);   
    },

    query(val) {
      this.$nextTick(() => {
        if (this.visible) this.broadcast("ElSelectDropdown", "updatePopper");
      });
      this.hoverIndex = -1;
      if (this.multiple && this.filterable) {
        this.inputLength = this.$refs.input.value.length * 15 + 20;
        this.managePlaceholder();
        this.resetInputHeight();
      }
      if (this.remote && typeof this.remoteMethod === "function") {
        this.hoverIndex = -1;
        this.remoteMethod(val);
        this.broadcast("ElOption", "resetIndex");
      } else if (typeof this.filterMethod === "function") {
        this.filterMethod(val);
        this.broadcast("ElOptionGroup", "queryChange");
      } else {
        this.filteredOptionsCount = this.optionsCount;
        this.broadcast("ElOption", "queryChange", val);
        this.broadcast("ElOptionGroup", "queryChange");
      }
      if (
        this.defaultFirstOption &&
        (this.filterable || this.remote) &&
        this.filteredOptionsCount
      ) {
        this.hoverIndex = -1;
        for (let i = 0; i !== this.options.length; ++i) {
          const option = this.options[i];
          if (val) {
            // pick first options that passes the filter
            if (!option.disabled && !option.groupDisabled && option.visible) {
              this.hoverIndex = i;
              break;
            }
          } else {
            // pick currently selected option
            if (option.itemSelected) {
              this.hoverIndex = i;
              break;
            }
          }
        }
      }
    },

    visible(val) {
      if (!val) {
        this.$refs.reference.$el.querySelector("input").blur();
        this.handleIconHide();
        this.broadcast("ElSelectDropdown", "destroyPopper");
        if (this.$refs.input) {
          this.$refs.input.blur();
        }
        this.query = "";
        this.selectedLabel = "";
        this.inputLength = 20;
        this.resetHoverIndex();
        this.$nextTick(() => {
          if (
            this.$refs.input &&
            this.$refs.input.value === "" &&
            this.selected.length === 0
          ) {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        });
        if (!this.multiple) {
          this.getOverflows();
          if (this.selected) {
            if (
              this.filterable &&
              this.allowCreate &&
              this.createdSelected &&
              this.createdOption
            ) {
              this.selectedLabel = this.createdLabel;
            } else {
              this.selectedLabel = this.selected.currentLabel;
            }
            if (this.filterable) this.query = this.selectedLabel;
          }
        }
      } else {
        this.handleIconShow();
        this.broadcast("ElSelectDropdown", "updatePopper");
        if (this.filterable) {
          this.query = this.selectedLabel;
          if (this.multiple) {
            this.$refs.input.focus();
          } else {
            if (!this.remote) {
              this.broadcast("ElOption", "queryChange", "");
              this.broadcast("ElOptionGroup", "queryChange");
            }
            this.broadcast("ElInput", "inputSelect");
          }
        }
      }
      this.$emit("visible-change", val);
    },

    options(val) {
      if (this.$isServer) return;
      if(this.showFlag === 'tooptipDiff'){
        this.getDiffValue();
        return;
      }
      this.optionsAllDisabled =
        val.length === val.filter(item => item.disabled === true).length;
      if (this.multiple) {
        this.resetInputHeight();
      }
      let inputs = this.$el.querySelectorAll("input");
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        this.setSelected();
      }

    }
  },

  methods: {
    valueChange(val){
      this.$emit("valuechange",val);
    },
    handleIconHide() {
      let icon = this.$el.querySelector(".el-input__icon");
      if (icon) {
        removeClass(icon, "is-reverse");
      }
    },

    handleIconShow() {
      let icon = this.$el.querySelector(".el-input__icon");
      if (icon && !hasClass(icon, "el-icon-circle-close")) {
        addClass(icon, "is-reverse");
      }
    },

    handleMenuEnter() {
      if (!this.dropdownUl) {
        this.dropdownUl = this.$refs.popper.$el.querySelector(
          ".el-select-dropdown__wrap"
        );
        this.getOverflows();
      }
      if (!this.multiple && this.dropdownUl) {
        this.resetMenuScroll();
      }
    },

    getOverflows() {
      if (this.dropdownUl && this.selected && this.selected.$el) {
        let selectedRect = this.selected.$el.getBoundingClientRect();
        let popperRect = this.$refs.popper.$el.getBoundingClientRect();
        this.bottomOverflow = selectedRect.bottom - popperRect.bottom;
        this.topOverflow = selectedRect.top - popperRect.top;
      }
    },

    resetMenuScroll() {
      if (this.bottomOverflow > 0) {
        this.dropdownUl.scrollTop += this.bottomOverflow;
      } else if (this.topOverflow < 0) {
        this.dropdownUl.scrollTop += this.topOverflow;
      }
    },

    getOption(value) {
      let option;
      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i];
        // 修复value是object类型时不能选中的问题
        if (Object.prototype.toString.call(value) === "[object Object]") {
          if(cachedOption.value === value) {
            option = cachedOption;
            break;
          }
        } else if(cachedOption.value + "" === value + "") { // 为了处理纯数字的情况，转换为字符串之后再比较
          option = cachedOption;
          break;
        }
      }
      if (option) return option;
      const label =
        typeof value === "string" || typeof value === "number" ? value : "";
      let newOption = {
        value: value,
        currentLabel: label
      };
      if (this.multiple) {
        newOption.hitState = false;
      }
      return newOption;
    },

    setSelected() {
      if (!this.multiple) {
        let option = this.getOption(this.value);
        var l = option.currentLabel;
        if(option.value === ''){
          l = '';
        }
        if (option.created) {
          this.createdLabel = option.currentLabel;
          this.createdSelected = true;
        } else {
          this.createdSelected = false;
        }
        this.selectedLabel = l;
        this.selected = option;
        if (this.filterable) this.query = this.selectedLabel;
        return;
      }
      let result = [];
      if (Array.isArray(this.value)) {
        this.value.forEach(value => {
          result.push(this.getOption(value));
        });
      }
      this.selected = result;
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },

    handleFocus(event) {
      let callbackFun = () => {
        this.$emit('focus', event);
        this.visible = true;
      }
      if(this._events['before-edit'] && this._events['before-edit'].length > 0){
        this.$emit('before-edit', this, callbackFun)
      }else{
        callbackFun.call(this);
      }
    },
    handleFocus2(event){
      this.visible = true;
      this.$refs.mtpicker.open();
      if(!this.multiple){
        this.radioSelectedHistory=this.selected.value;
      }else{
        this.multipleSelect=[];
        for(let i=0;i<this.selected.length;i++){
            this.multipleSelect.push(this.selected[i].value);
        }
      }
       
    },
    handleIconClick2(event){
      this.visible = true;
      this.$refs.mtpicker.open();
       if(!this.multiple){
        this.radioSelectedHistory=this.selected.value;
      }else{
        this.multipleSelect=[];
        for(let i=0;i<this.selected.length;i++){
            this.multipleSelect.push(this.selected[i].value);
        }
      }
    },
    handleFocus1(event){
      let callbackFun = () => {
        this.visible = true;
      }
      if(this._events['before-edit'] && this._events['before-edit'].length > 0){
        this.$emit('before-edit', this, callbackFun)
      }else{
        callbackFun.call(this);
      }
    },

    handleBlur(event){
      this.$emit('blur', event);
    },

    handleIconClick(event) {
      if (this.iconClass.indexOf("circle-close") > -1) {
        this.deleteSelected(event);
      } else {
        this.toggleMenu();
      }
    },

    handleMouseDown(event) {
      if (event.target.tagName !== "INPUT") return;
      if (this.visible) {
        this.handleClose();
        event.preventDefault();
      }
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    },

    handleClose() {
      this.visible = false;
    },

    toggleLastOptionHitState(hit) {
      if (!Array.isArray(this.selected)) return;
      const option = this.selected[this.selected.length - 1];
      if (!option) return;

      if (hit === true || hit === false) {
        option.hitState = hit;
        return hit;
      }

      option.hitState = !option.hitState;
      return option.hitState;
    },

    deletePrevTag(e) {
      if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
        const value = this.value.slice();
        value.pop();
        this.$emit("input", value);
      }
    },

    managePlaceholder() {
      if (this.currentPlaceholder !== "") {
        this.currentPlaceholder = this.$refs.input.value
          ? ""
          : this.cachedPlaceHolder;
      }
    },

    resetInputState(e) {
      if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
      this.inputLength = this.$refs.input.value.length * 15 + 20;
      this.resetInputHeight();
    },

    resetInputHeight() {
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        let inputChildNodes = this.$refs.reference.$el.childNodes;
        let input = [].filter.call(
          inputChildNodes,
          item => item.tagName === "INPUT"
        )[0];
        input.style.height =
          Math.max(this.$refs.tags.clientHeight + 6, sizeMap[this.size] || 36) +
          "px";
        if (this.visible && this.emptyText !== false) {
          this.broadcast("ElSelectDropdown", "updatePopper");
        }
      });
    },

    resetHoverIndex() {
      setTimeout(() => {
        if (!this.multiple) {
          this.hoverIndex = this.options.indexOf(this.selected);
        } else {
          if (this.selected.length > 0) {
            this.hoverIndex = Math.min.apply(
              null,
              this.selected.map(item => this.options.indexOf(item))
            );
          } else {
            this.hoverIndex = -1;
          }
        }
      }, 300);
    },
    confirmSelectOption(){
      this.visible=false;
    },
    cancelSelectOptions:function(){
      this.visible=false;
      if(!this.multiple){
        this.currentOption = null;
        this.$emit("input", this.radioSelectedHistory);
        this.$emit("change", '', {type: 'select'});
        this.dispatch("ElFormItem", "el.form.change", '');
      }else{
        this.currentOption = null;
        this.$emit("input", this.multipleSelect);
        this.$emit("change", '', {type: 'select'});
        this.dispatch("ElFormItem", "el.form.change", '');
      }
      
    },
    handleOptionSelect(option) {
      let realValue = '';
      if (this.multiple) {
        const value = this.value.slice();
        const optionIndex = value.indexOf(option.value);
        if (optionIndex > -1) {
          value.splice(optionIndex, 1);
        } else if (
          this.multipleLimit <= 0 ||
          value.length < this.multipleLimit
        ) {
          value.push(option.value);
        }
        this.$emit("input", value);
        realValue = value;
        if (option.created) {
          this.query = "";
          this.inputLength = 20;
        }
        if (this.filterable) this.$refs.input.focus();
      } else {
        this.currentOption = option;
        this.$emit("input", option.value);
        realValue = option.value;
        // this.value = option.value; // 解决组件绑定的属性为数组的某一项的某一属性，不会触发valuechange的情况
        this.visible = false;
      }
      let obj = {
        type: 'select'
      }
      for(var key in this.currentOption){
        obj[key] = this.currentOption[key];
      }
      this.$emit("change", realValue, obj);
      this.dispatch("ElFormItem", "el.form.change", realValue);
    },

    toggleMenu() {
      if (this.filterable && this.query === "" && this.visible) {
        return;
      }
      if (!this.disabled) {
        this.visible = !this.visible;
      }
    },

    navigateOptions(direction) {
      if (!this.visible) {
        this.visible = true;
        return;
      }
      if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
      this.optionsAllDisabled =
        this.options.length ===
        this.options.filter(item => item.disabled === true).length;
      if (!this.optionsAllDisabled) {
        if (direction === "next") {
          this.hoverIndex++;
          if (this.hoverIndex === this.options.length) {
            this.hoverIndex = 0;
          }
          this.resetScrollTop();
          if (
            this.options[this.hoverIndex].disabled === true ||
            this.options[this.hoverIndex].groupDisabled === true ||
            !this.options[this.hoverIndex].visible
          ) {
            this.navigateOptions("next");
          }
        }
        if (direction === "prev") {
          this.hoverIndex--;
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.options.length - 1;
          }
          this.resetScrollTop();
          if (
            this.options[this.hoverIndex].disabled === true ||
            this.options[this.hoverIndex].groupDisabled === true ||
            !this.options[this.hoverIndex].visible
          ) {
            this.navigateOptions("prev");
          }
        }
      }
    },

    resetScrollTop() {
      let bottomOverflowDistance =
        this.options[this.hoverIndex].$el.getBoundingClientRect().bottom -
        this.$refs.popper.$el.getBoundingClientRect().bottom;
      let topOverflowDistance =
        this.options[this.hoverIndex].$el.getBoundingClientRect().top -
        this.$refs.popper.$el.getBoundingClientRect().top;
      if (bottomOverflowDistance > 0) {
        this.dropdownUl.scrollTop += bottomOverflowDistance;
      }
      if (topOverflowDistance < 0) {
        this.dropdownUl.scrollTop += topOverflowDistance;
      }
    },

    selectOption() {
      if (this.options[this.hoverIndex]) {
        this.handleOptionSelect(this.options[this.hoverIndex]);
      }
    },

    deleteSelected(event) {
      event.stopPropagation();
      this.currentOption = null;
      this.$emit("input", "");
      this.$emit("change", '', {type: 'select'});
      this.dispatch("ElFormItem", "el.form.change", '');
      this.visible = false;
    },

    deleteTag(event, tag) {
      let index = this.selected.indexOf(tag);
      if (index > -1 && !this.disabled) {
        const value = this.value.slice();
        value.splice(index, 1);
        this.$emit("input", value);
        this.$emit("remove-tag", tag);
      }
      event.stopPropagation();
    },

    onInputChange() {
      if (this.filterable) {
        this.query = this.selectedLabel;
      }
    },

    onOptionDestroy(option) {
      this.optionsCount--;
      this.filteredOptionsCount--;
      let index = this.options.indexOf(option);
      if (index > -1) {
        this.options.splice(index, 1);
      }
      this.broadcast("ElOption", "resetIndex");
    },

    resetInputWidth() {
      if (!this.editable) {
        return;
      }
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },

    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    },

    getDiffValue() {
      let oldValue = this.diff.oldValue;
      let newValue = this.diff.newValue;

      if (!this.multiple) {
        let oldLabel = this.getOption(oldValue).currentLabel;
        let newLabel = this.getOption(newValue).currentLabel;
        this.diffLabel = {
          oldValue: oldLabel,
          newValue: newLabel
        };
        return;
      }

      let oldResult = [];
      let newResult = [];
      if (Array.isArray(oldValue)) {
        oldValue.forEach(value => {
          oldResult.push(this.getOption(value).currentLabel);
        });
      }

      if (Array.isArray(newValue)) {
        newValue.forEach(value => {
          newResult.push(this.getOption(value).currentLabel);
        });
      }

      this.diffLabel = {
        oldValue: oldResult.join(','),
        newValue: newResult.join(',')
      };
    }
  },

  created() {
    this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit("input", []);
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit("input", "");
    }
    if(this.showFlag === 'tooptipDiff'){
      this.getDiffValue();
    }
    this.setSelected();


    this.debouncedOnInputChange = debounce(this.debounce, () => {
      this.onInputChange();
    });

    this.$on("handleOptionClick", this.handleOptionSelect);
    this.$on("onOptionDestroy", this.onOptionDestroy);
    this.$on("setSelected", this.setSelected);
  },

  mounted() {
    this.dispatch('ElFormItem', 'editableChange', [this.editable]);
    this.dispatch('ElFormItem', 'havPaddingRight', [this.IsPC]);
    if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
      this.currentPlaceholder = "";
    }
    addResizeListener(this.$el, this.handleResize);
    if (this.remote && this.multiple) {
      this.resetInputHeight();
    }
    this.$nextTick(() => {
      if (this.$refs.reference && this.$refs.reference.$el) {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      }
    });
  },

  updated() {
    if (this.editable && this.$refs.popper) {
      this.$refs.popper.minWidth =
        this.$el.getBoundingClientRect().width + "px";
    }
  },

  beforeDestroy() {
    if (this.$el && this.handleResize)
      removeResizeListener(this.$el, this.handleResize);
  }
};
</script>
