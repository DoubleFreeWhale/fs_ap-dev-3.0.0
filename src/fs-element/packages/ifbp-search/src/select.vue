<template>
  <div
    class="el-select"
    v-clickoutside="handleClose">
    <div>
      <div
        class="el-select__tags"
        ref="tags"
        @click.native="handleFocus"
        :style="{ 'max-width': inputWidth - 32 + 'px' }">
        <transition-group @after-leave="resetInputHeight">
          <el-tag
            v-for="(item, index) in selectedRules"
            :key="'a'+index"
            closable
            :hit="item.hitState"
            type="primary"
            @close="deleteTag(index)"
            close-transition>
            <span class="el-select__tags-text">{{ item.fieldname + ': ' + item.value }}</span>
          </el-tag>
        </transition-group>

        <input
          type="text"
          class="el-select__input"
          @focus="handleTrueInputFocus"
          @keyup="handleInputChange"
          @keydown="resetInputState"
          @keydown.down.prevent="navigateOptions('next')"
          @keydown.up.prevent="navigateOptions('prev')"
          @keydown.enter.prevent="selectOption"
          @keydown.esc.prevent="visible = false"
          @keydown.delete="deletePrevTag"
          @paste.native="handleInputChange"
          v-model="query"
          :style="{ width: inputLength + 'px', 'max-width': inputWidth - 42 + 'px' }"
          ref="input">
      </div>
      <el-input
        ref="reference"
        v-model="selectedLabel"
        type="text"
        :placeholder="currentPlaceholder"
        :validate-event="false"
        :on-icon-click="triggerSearch"
        @focus="handleFocus"
        icon="search">
      </el-input>
    </div>
    <transition
      name="el-zoom-in-top"
      @after-leave="doDestroy"
      @after-enter="handleMenuEnter">
      <el-select-menu
        ref="popper"
        v-show="visible" >
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          v-show="options.length > 0">
          <el-option
            v-for="(option, index) in filterRules" :key="index"
            :value="option.fieldcode"
            :label="option.fieldname"
            :query="query"
          >
          </el-option>
          <el-option
            value="@FULLTEXT"
            label="全部"
            :query="query"
          >
          </el-option>
          <slot></slot>
        </el-scrollbar>
      </el-select-menu>
    </transition>
  </div>
</template>

<script type="text/babel">
import Emitter from 'ifbp-element/src/mixins/emitter';
import Locale from 'ifbp-element/src/mixins/locale';
import ElSelectMenu from './select-dropdown.vue';
import ElOption from './option.vue';
import Clickoutside from 'ifbp-element/src/utils/clickoutside';
import { addClass, removeClass, hasClass } from 'ifbp-element/src/utils/dom';
import {
  addResizeListener,
  removeResizeListener
} from 'ifbp-element/src/utils/resize-event';

export default {
  mixins: [Emitter, Locale],

  name: 'ElSelect',

  componentName: 'ElSelect',

  components: {
    ElSelectMenu,
    ElOption,
  },

  directives: { Clickoutside },

  props: {
    filterRules: {
      required: true
    },
    placeholder: {
      type: String,
      default: '搜索'
    }
  },

  data() {
    return {
      radioSelectedHistory: '',
      options: [],
      cachedOptions: [],
      createdLabel: null,
      createdSelected: false,
      selected: [],
      isSelect: true,
      inputLength: 20,
      inputWidth: 0,
      cachedPlaceHolder: '',
      optionsCount: 0,
      filteredOptionsCount: 0,
      dropdownUl: null,
      visible: false,
      selectedLabel: '',
      hoverIndex: -1,
      query: '',
      bottomOverflow: 0,
      topOverflow: 0,
      inputHovering: false,
      currentPlaceholder: '',
      currentOption: null,
      diffLabel: null,
      selectedRules: []
    };
  },

  watch: {
    placeholder(val) {
      this.cachedPlaceHolder = val;
    },
    selectedRules(val) {
      this.resetInputHeight();
      this.managePlaceholder();
    },

    query(val) {
      this.$nextTick(() => {
        if (this.visible) this.broadcast('ElSelectDropdown', 'updatePopper');
      });
      this.hoverIndex = -1;
      this.inputLength = this.$refs.input.value.length * 15 + 20;
      this.managePlaceholder();
      this.resetInputHeight();
      this.filteredOptionsCount = this.optionsCount;
    },

    visible(val) {
      if (!val) {
        this.$refs.reference.$el.querySelector('input').blur();
        this.handleIconHide();
        this.broadcast('ElSelectDropdown', 'destroyPopper');
        if (this.$refs.input) {
          this.$refs.input.blur();
        }
        this.query = '';
        this.inputLength = 20;
        this.resetHoverIndex();
        this.$nextTick(() => {
          this.managePlaceholder();
        });
      }
      this.broadcast('ElSelectDropdown', 'updatePopper');
    },

    options(val) {
      this.resetInputHeight();
    }
  },

  methods: {
    handleIconHide() {
      let icon = this.$el.querySelector('.el-input__icon');
      if (icon) {
        removeClass(icon, 'is-reverse');
      }
    },

    handleIconShow() {
      let icon = this.$el.querySelector('.el-input__icon');
      if (icon && !hasClass(icon, 'el-icon-circle-close')) {
        addClass(icon, 'is-reverse');
      }
    },

    handleMenuEnter() {
      if (!this.dropdownUl) {
        this.dropdownUl = this.$refs.popper.$el.querySelector(
          '.el-select-dropdown__wrap'
        );
        this.getOverflows();
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

    handleFocus(event) {
      this.$refs.input.focus();
    },
    handleTrueInputFocus(event) {
      if (this.query) {
        this.visible = true;
      }
    },
    handleInputChange(event) {
      const trimedQuery = this.query ? this.query.trim() : '';
      if (trimedQuery) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    },

    triggerSearch() {
      this.$emit('searchTriggered', this.selectedRules);
    },

    handleMouseDown(event) {
      if (event.target.tagName !== 'INPUT') return;
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
      const option = this.selectedRules[this.selectedRules.length - 1];
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
        this.selectedRules.pop();
      }
    },

    managePlaceholder() {
      this.currentPlaceholder = this.$refs.input.value || this.selectedRules.length
        ? ''
        : this.cachedPlaceHolder;
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
          item => item.tagName === 'INPUT'
        )[0];
        input.style.height =
          Math.max(this.$refs.tags.clientHeight + 2, 32) +
          'px';
        if (this.visible) {
          this.broadcast('ElSelectDropdown', 'updatePopper');
        }
      });
    },

    resetHoverIndex() {
      setTimeout(() => {
        this.hoverIndex = -1;
      }, 300);
    },
    handleOptionSelect(option) {
      this.selectedRules.push({
        fieldcode: option.value,
        fieldname: option.label,
        value: this.query,
        hitState: false
      });
      this.visible = false;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    navigateOptions(direction) {
      if (!this.visible) {
        this.visible = true;
        return;
      }
      if (direction === 'next') {
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
          this.navigateOptions('next');
        }
      }
      if (direction === 'prev') {
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
          this.navigateOptions('prev');
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
      const trimedQuery = this.query ? this.query.trim() : '';
      if (!trimedQuery) {
        this.triggerSearch();
        this.visible = false;
        return;
      }
      if (this.hoverIndex > -1) {
        this.handleOptionSelect(this.options[this.hoverIndex]);
      } else {
        this.handleOptionSelect({
          value: '@FULLTEXT',
          label: '全部'
        });
      }
    },

    deleteTag(index) {
      this.selectedRules.splice(index, 1);
      event.stopPropagation();
    },

    onOptionDestroy(option) {
      this.optionsCount--;
      this.filteredOptionsCount--;
      let index = this.options.indexOf(option);
      if (index > -1) {
        this.options.splice(index, 1);
      }
      this.broadcast('ElOption', 'resetIndex');
    },

    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },

    handleResize() {
      this.resetInputWidth();
      this.resetInputHeight();
    }
  },

  created() {
    this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
    this.$on('handleOptionClick', this.handleOptionSelect);
    this.$on('onOptionDestroy', this.onOptionDestroy);
  },

  mounted() {
    addResizeListener(this.$el, this.handleResize);
    this.resetInputHeight();
    this.$nextTick(() => {
      if (this.$refs.reference && this.$refs.reference.$el) {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      }
    });
  },

  beforeDestroy() {
    if (this.$el && this.handleResize) {
      removeResizeListener(this.$el, this.handleResize);
    }
  }
};
</script>
