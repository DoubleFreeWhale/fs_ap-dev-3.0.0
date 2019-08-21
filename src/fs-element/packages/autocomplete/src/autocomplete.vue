<template>
  <div
    class="el-autocomplete"
    v-clickoutside="close"
    aria-haspopup="listbox"
    role="combobox"
    :aria-expanded="suggestionVisible"
    :aria-owns="id"
  >
    <ifbp-tooltip :content="value" v-if="editable === false"></ifbp-tooltip>
    <template v-else>
      <el-input
        ref="input"
        v-bind="$props"
        @compositionstart.native="handleComposition"
        @compositionupdate.native="handleComposition"
        :disabled="disabled"
        @valuechange = "valueChange"
        @compositionend.native="handleComposition"
        @input="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
        @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
      @keydown.enter.native="handleKeyEnter"
      @keydown.native.tab="close"
      :label="label"
    >
      <template slot="prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="$slots.append">
        <slot name="append"></slot>
      </template>
      <template slot="prefix" v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template slot="suffix" v-if="$slots.suffix">
        <slot name="suffix"></slot>
      </template>
    </el-input>
    <el-autocomplete-suggestions
      visible-arrow
      :class="[popperClass ? popperClass : '']"
      ref="suggestions"
      placement="bottom-start"
      :id="id">
      <li
        v-for="(item, index) in suggestions"
        :key="index"
        :class="{'highlighted': highlightedIndex === index}"
        @click="select(item)"
        :id="`${id}-item-${index}`"
        role="option"
        :aria-selected="highlightedIndex === index"
      >
        <slot :item="item">
          {{ item[valueKey] }}
        </slot>
      </li>
      <li
        v-if="showBtnDialog && btnDialogText"
        class="btn-dialog"
        @click="showDialog"
      ><span>{{ btnDialogText }}</span></li>
    </el-autocomplete-suggestions>
    </template>
  </div>
</template>
<script>
  import debounce from 'throttle-debounce/debounce';
  import ElInput from 'ifbp-element/packages/input';
  import Clickoutside from 'ifbp-element/src/utils/clickoutside';
  import ElAutocompleteSuggestions from './autocomplete-suggestions.vue';
  import Emitter from 'ifbp-element/src/mixins/emitter';
  import Migrating from 'ifbp-element/src/mixins/migrating';
  import { generateId } from 'ifbp-element/src/utils/util';
  import Focus from 'ifbp-element/src/mixins/focus';

  export default {
    name: 'ElAutocomplete',

    mixins: [Emitter, Focus('input'), Migrating],

    componentName: 'ElAutocomplete',

    components: {
      ElInput,
      ElAutocompleteSuggestions
    },

    directives: { Clickoutside },

    props: {
      valueKey: {
        type: String,
        default: 'value'
      },
      popperClass: String,
      placeholder: String,
      disabled: Boolean,
      name: String,
      size: String,
      value: String,
      maxlength: Number,
      minlength: Number,
      autofocus: Boolean,
      fetchSuggestions: Function,
      triggerOnFocus: {
        type: Boolean,
        default: true
      },
      fetchOnEnter: {
        type: Boolean,
        default: false
      },
      editable: {
        type: Boolean,
        default: true
      },
      customItem: String,
      selectWhenUnmatched: {
        type: Boolean,
        default: false
      },
      prefixIcon: String,
      suffixIcon: String,
      icon: String,
      onIconClick: Function,
      label: String,
      debounce: {
        type: Number,
        default: 300
      },
      // for ref
      showBtnDialog: Boolean,
      btnDialogText: {
        type: String,
        default: '更多'
      },
      // 点回车自动匹配建议项
      autoMatchWhenEnter: Boolean
    },
    data() {
      return {
        activated: false,
        isOnComposition: false,
        suggestions: [],
        loading: false,
        highlightedIndex: -1
      };
    },
    computed: {
      suggestionVisible() {
        const suggestions = this.suggestions;
        let isValidData = Array.isArray(suggestions) && suggestions.length > 0;
        return (isValidData || this.loading) && this.activated;
      },
      id() {
        return `el-autocomplete-${generateId()}`;
      }
    },
    watch: {
      editable(editable){
        this.dispatch('ElFormItem', 'editableChange', [editable]);
      },
      suggestionVisible(val) {
        this.broadcast('ElAutocompleteSuggestions', 'visible', [val, this.$refs.input.$refs.input.offsetWidth]);
      }
    },
    methods: {
    	valueChange(val){
    		this.$emit("valuechange",val);
    	},
      getMigratingConfig() {
        return {
          props: {
            'custom-item': 'custom-item is removed, use scoped slot instead.',
            'props': 'props is removed, use value-key instead.'
          }
        };
      },
      getData(queryString) {
        this.loading = true;
        this.fetchSuggestions(queryString, (suggestions) => {
          this.loading = false;
          if (Array.isArray(suggestions)) {
            this.suggestions = suggestions;
          } else {
            console.error('autocomplete suggestions must be an array');
          }
        });
      },
      handleComposition(event) {
        if (event.type === 'compositionend') {
          this.isOnComposition = false;
          this.handleChange(event.target.value);
        } else {
          this.isOnComposition = true;
        }
      },
      handleChange(value) {
        this.$emit('input', value);
        if (this.isOnComposition || (!this.triggerOnFocus && !value)) {
          this.suggestions = [];
          return;
        }
        this.debouncedGetData(value);
      },
      handleFocus(event) {
        this.activated = true;
        if (!this.value) {
          this.suggestions = [];
        }
        this.$emit('focus', event);
        if (this.fetchOnEnter) {
          return;
        }
        if (this.triggerOnFocus) {
          this.debouncedGetData(this.value);
        }
      },
      handleBlur(event) {
        this.$emit('blur', event);
      },
      close(e) {
        if (
          this.autoMatchWhenEnter &&
          e && e.type === 'keydown' && e.key === 'Tab' &&
          Array.isArray(this.suggestions) && this.suggestions.length
        ) {
          this.suggestions.some(suggestion => {
            if (suggestion.refname === this.value) {
              this.select(suggestion);
              // this.$nextTick(() => {
              //   this.$refs.input.$el.dispatchEvent(new KeyboardEvent('keyup', {
              //     key: 'Tab'
              //   }));
              // });
              return true;
            }
            return false;
          });
        }
        this.activated = false;
      },
      handleKeyEnter(e) {
        if (this.suggestionVisible) {
          if (this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
            e.preventDefault();
            this.select(this.suggestions[this.highlightedIndex]);
          } else if (this.autoMatchWhenEnter && Array.isArray(this.suggestions) && this.suggestions.length) {
            this.suggestions.some(suggestion => {
              if (suggestion.refname === this.value) {
                this.select(suggestion);
                // this.$nextTick(() => {
                //   this.$refs.input.$el.dispatchEvent(new KeyboardEvent('keyup', {
                //     key: 'Tab'
                //   }));
                // });
                return true;
              }
              return false;
            });
          }
        } else if (this.selectWhenUnmatched) {
          this.$emit('select', {value: this.value});
          this.$nextTick(_ => {
            this.suggestions = [];
            this.highlightedIndex = -1;
          });
        } else if (this.fetchOnEnter) {
          this.suggestionVisible = true;
          this.$nextTick(() => {
            this.getData(this.value);
          });
        }
      },
      select(item) {
        this.$emit('input', item[this.valueKey]);
        this.$emit('select', item);
        this.$nextTick(_ => {
          this.suggestions = [];
          this.highlightedIndex = -1;
        });
      },
      highlight(index) {
        if (!this.suggestionVisible || this.loading) { return; }
        if (index < 0) {
          this.highlightedIndex = -1;
          return;
        }
        if (index >= this.suggestions.length) {
          index = this.suggestions.length - 1;
        }
        const suggestion = this.$refs.suggestions.$el.querySelector('.el-autocomplete-suggestion__wrap');
        const suggestionList = suggestion.querySelectorAll('.el-autocomplete-suggestion__list li');

        let highlightItem = suggestionList[index];
        let scrollTop = suggestion.scrollTop;
        let offsetTop = highlightItem.offsetTop;

        if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
          suggestion.scrollTop += highlightItem.scrollHeight;
        }
        if (offsetTop < scrollTop) {
          suggestion.scrollTop -= highlightItem.scrollHeight;
        }
        this.highlightedIndex = index;
        this.$el.querySelector('.el-input__inner').setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`);
      },
      showDialog() {
        this.$emit('showDialog', 'suggestion');
      },
    },
    mounted() {
    	this.dispatch('ElFormItem', 'editableChange', [this.editable]);
      this.debouncedGetData = debounce(this.debounce, (val) => {
        if (this.fetchOnEnter) {
          return;
        }
        this.getData(val);
      });
      this.$on('item-click', item => {

        this.select(item);

      });
      let $input = this.$el.querySelector('.el-input__inner');
      if($input){
        $input.setAttribute('role', 'textbox');
        $input.setAttribute('aria-autocomplete', 'list');
        $input.setAttribute('aria-controls', 'id');
        $input.setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`);
      }
    },
    beforeDestroy() {
      this.$refs.suggestions.$destroy();
    }
  };
</script>
