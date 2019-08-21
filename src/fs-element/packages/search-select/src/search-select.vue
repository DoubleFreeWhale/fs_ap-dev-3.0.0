<template>
  <div class="s-select">
    <div class="s-select__inputBox">
      <input
        readonly
        type="text"
        class="s-select__input"
        @blur="onblur"
        @click.stop="selectClick('input')"
        v-model="selectedOption.label"
        style="height: 23px;border:0px;padding:3px 29px 3px 10px;width:calc(100% - 39px);"
        />
        <i class="select__icon" :class="iconClass" @click.stop="selectClick('icon')"></i>
    </div>
    <div class="s-select__dropdown" v-show="visible">
    <div class="s-select__searchBox">
      <input
        type="text"
        class="s-select__search"
        icon="search"
        v-model="searchKeywords"
        placeholder="请输入关键字"
        @focus="searchFocus"
        @blur="searchBlur" />
        <i class="search__icon el-icon-pt-sousuo"></i>
    </div>

      <div class="s-select__optionList">
        <ul class="s-select__items">
          <el-select-item
            v-for="(item, index) in s_options"
            :label="item.label"
            :value="item.value"
            :key="index"
            :index="index"
            :selectedOption="selectedOption"
            @clickItem="clickItem">
          </el-select-item>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElSearchSelect',
  data() {
    return {
      inputValue: '',
      s_options: [],
      visible: false,
      iconClass: 'el-icon-pt-jiantouxia',
      selectedOption: {},
      searchKeywords: ''
    };
  },
  props: ['value', 'options'],
  methods: {
    onblur() {
      this.delayHideDropdown();
    },
    searchFocus() {
      clearTimeout(this.timer);
    },
    searchBlur() {
      this.delayHideDropdown();
    },
    selectClick(flag) {
      clearTimeout(this.timer);
      if (flag === 'icon') {
        this.$el.parentNode.getElementsByTagName('input')[0].focus();
      }
      if (this.visible) {
        this.hideDropdown();
      } else {
        this.showDropdown();
      }
    },
    clickItem(index) {
      clearTimeout(this.timer);
      this.selectedOption = this.s_options[index];
      this.delayHideDropdown();
    },
    showDropdown() {
      if (!this.visible) {
        this.visible = true;
        this.iconClass = 'el-icon-pt-jiantoushang';
      }
    },
    hideDropdown() {
      if (this.visible) {
        this.iconClass = 'el-icon-pt-jiantouxia';
        this.searchKeywords = '';
        this.visible = false;
      }
    },
    delayHideDropdown() {
      this.timer = setTimeout(() => {
        this.hideDropdown();
        this.selected();
      }, 150);
    },
    selected() {
      this.$emit('selected', this.selectedOption, this.$el);
    }
  },
  watch: {
    searchKeywords() {
      const self = this;
      /*eslint-disable*/
      this.s_options = this.options.filter(function(item) {
        return item.label.indexOf(self.searchKeywords) > -1;
      });
    },
    value(oldVal,newVal) {
      for(let i = 0; i < this.options.length; i++) {
        if (this.options[i].value === this.value) {
          this.selectedOption = this.options[i];
        }
      }
    }
  },
  created: function() {
    this.s_options = _.cloneDeep(this.options);
    for(let i = 0; i < this.options.length; i++) {
      if (this.options[i].value === this.value) {
        this.selectedOption = this.options[i];
      }
    }
  }
};
</script>

