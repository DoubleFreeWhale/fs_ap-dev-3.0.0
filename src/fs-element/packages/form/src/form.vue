<template>
  <form ref="form" class="el-form" :class="[
    labelPosition ? 'el-form--label-' + labelPosition : '',
    { 'el-form--inline': inline && needInline },
    !IsPC?'el-form-mobile':''
  ]">
    <slot></slot>
  </form>
</template>
<script>
import {
  addResizeListener,
  removeResizeListener
} from "ifbp-element/src/utils/resize-event";
import { IsPC } from 'ifbp-element/src/utils/util';
export default {
  name: "ElForm",
  componentName: "ElForm",
  props: {
    model: Object,
    rules: Object,
    labelPosition: String,
    labelWidth: String,

    labelSuffix: {
      type: String,
      default: ""
    },
    inline: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    adaptation: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    rules() {
      this.validate();
    }
  },
  data() {
    return {
      IsPC: IsPC(),
      fields: [],
      allFields: [],
      LessThanFormItemWidthFlag: false,
      setItemWidth: "",
      needInline: true,
      hasLabelWidth: true,
      firstValidateError: false
    };
  },
  created() {
    this.$on("el.form.addField", field => {
      if (field) {
        this.fields.push(field);
      }
    });

    this.$on("el.form.addAllField", field => {
      if (field) {
        this.allFields.push(field);
      }
    });
    /* istanbul ignore next */
    this.$on("el.form.removeField", field => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1);
      }
    });
    this.$on("el.form.removeAllField", field => {
      if (field.prop) {
        this.allFields.splice(this.allFields.indexOf(field), 1);
      }
    });
  },
  mounted() {
    let l = $('.el-form-panel').length;
    if(l > 0){
      $('.el-form-panel').removeClass('el-form-panel-first').removeClass('el-form-panel-last');
      $($('.el-form-panel')[0]).addClass('el-form-panel-first');
      $($('.el-form-panel')[l-1]).addClass('el-form-panel-last');
    }
    if(this.IsPC){
       this.formAdapt();
       addResizeListener(this.$el, this.formAdapt);
    }
    
    // window.addEventListener('resize', (e) => {
    //   e.stopPropagation();
    //   this.formAdapt();
    // });
  },
  beforeDestroy() {
    if(this.IsPC){
      removeResizeListener(this.$el, this.formAdapt);
    }
  },
  methods: {
    getFormItem() {
      return this.$refs.form.children.length;
    },
    formAdapt() {
      if (this.$refs.form) {
        // 针对西安小贷设置label的页面样式错乱
        if(!this.adaptation){
            return;
        }
        var formWidth = this.$refs.form.clientWidth;
        if(formWidth < 1){
          return;
        }
        // var formItemWidth = this.$refs.form.children[0].clientWidth;
        var formItemWidth = 350; // 此值需要根据设计调整
        if(window.appDefaultConfig.formItemWidth > 0){
          formItemWidth =  window.appDefaultConfig.formItemWidth;
        }
        var whiteSpace = 30;
        var formColumn = Math.floor(formWidth / formItemWidth);
        formColumn > 4 ? (formColumn = 4) : "";
        formColumn === 0 ? (formColumn = 1) : "";

        var realItemWidth = Math.floor(formWidth / formColumn);
        var hasWhiteSpace = false;
        var LessThanFormItemWidth = false;
        if (realItemWidth > (formItemWidth + whiteSpace)) hasWhiteSpace = true;
        if (realItemWidth < formItemWidth) LessThanFormItemWidth = true;  // 修改为在移动端的时候并且小屏显示为折行
        var formLef = 0;
        var elm = this.$refs.form.children;
        var formItems = this.allFields;
        var j = 0;
        // console.log(
        //   "formWidth：" +
        //     formWidth +
        //     "formColumn" +
        //     formColumn +
        //     "；realItemWidth：" +
        //     realItemWidth
        // );
        if (LessThanFormItemWidth) { // 此情况强制label在上，并且宽度为100%
          if (!this.LessThanFormItemWidthFlag) {
            this.hasLabelWidth = false;
            this.needInline = false;
            for (var i = 0; i < formItems.length; i++) {
              formItems[i].$el.style.width = "100%";
              formItems[i].$el.style.paddingLeft = "10px";
            }

            this.LessThanFormItemWidthFlag = true;
          }
        } else {
          if (this.LessThanFormItemWidthFlag) {
            this.hasLabelWidth = true;
            this.needInline = true;
            for (var i = 0; i < formItems.length; i++) {
              formItems[i].$el.style.width = formItems[i].$el.baseWidth;
              formItems[i].$el.style.paddingLeft = formItems[i].$el.basePaddingLeft;
            }
            this.LessThanFormItemWidthFlag = false;
          }
          for (var i = 0; i < formItems.length; i++) {
            if (hasWhiteSpace) {
              formItems[i].$el.style.paddingLeft = whiteSpace + "px";
            } else {
              formItems[i].$el.style.paddingLeft = "10px";
            }
            if(!formItems[i].$el.baseWidth){ //设置了宽度则不再后续操作
              switch (formColumn) {
                case 1:
                  {
                    formItems[i].$el.style.width = "100%";
                    formItems[i].$el.style.paddingLeft = "10px";
                  }
                  break;
                case 2:
                  {
                    if (formItems[i].$props.width !== "100%") {
                      formItems[i].$el.style.width = "50%";
                    }
                  }
                  break;
                case 3: {
                  if (formItems[i].$props.width !== "100%") {
                    formItems[i].$el.style.width = "33.33333333333%";
                  }
                  break;
                }
                case 4:
                  {
                    if (formItems[i].$props.width !== "100%") {
                      formItems[i].$el.style.width = "25%";
                    }
                  }
                  break;
              }
            }
          }
        }

        // var row = Math.ceil(elem/formColumn);
        // var j = 0;
        // for (var i = 0; i < elm.length; i++) {
        //   switch (formColumn) {
        //     case 1:
        //       {
        //         elm[j].style.width = "100%";
        //         j++;
        //       }
        //       break;
        //     case 2:
        //       {
        //         if (elm[j].style.width === "100%") {
        //           elm[j].style.float = "left";
        //           j = j + (2 - (j - 1) % 2 + 2);
        //         } else {
        //           if (j % formColumn === 0) {
        //             elm[j].style.float = "left";
        //           }
        //           if (j % formColumn === 1) {
        //             elm[j].style.float = "right";
        //           }
        //           j++;
        //         }
        //       }
        //       break;
        //     case 3: {
        //       if (elm[j].style.width === "100%") {
        //         elm[j].style.float = "left";
        //         j = j + (3 - (j - 1) % 3 + 3);
        //       } else {
        //         if (j % formColumn === 0) {
        //           elm[j].style.float = "right";
        //         }
        //         if (j % formColumn === 1) {
        //           elm[j].style.float = "left";
        //         }
        //         if (j % formColumn === 2) {
        //           formLef = formWidth - formColumn * formItemWidth;
        //           elm[j].style.marginLeft = formLef / 2;
        //           elm[j].style.marginRight = formLef / 2;
        //         }
        //         j++;
        //       }
        //     }
        //     case 4:
        //       {
        //         if (elm[j].style.width === "100%") {
        //           elm[j].style.float = "left";
        //           j = j + (4 - (j - 1) % 4 + 4);
        //         } else {
        //           if (j % formColumn === 0) {
        //             elm[j].style.float = "right";
        //           }
        //           if (j % formColumn === 1) {
        //             elm[j].style.float = "left";
        //           }
        //           if (j % formColumn === 2 || j % formColumn === 3) {
        //             formLef = formWidth - formColumn * formItemWidth;
        //             elm[j].style.marginLeft = formLef / 4;
        //             elm[j].style.marginRight = formLef / 4;
        //           }
        //         }
        //       }
        //       break;
        //   }
        // }
      }

      // if(formWidth < 576) {
      //   this.setItemWidth ='99.9%';
      // } else if(formWidth >= 576 && formWidth <= 768) {
      //   this.setItemWidth = '50%';
      // } else if(formWidth > 768 && formWidth < 968){
      //   this.setItemWidth ='33%';
      // } else if (formWidth >968) {
      //   this.setItemWidth = '25%';
      // }
      // var elm = this.$refs.form.children;
      // for (var i = 0; i < elm.length; i++) {
      //   if(elm[i].style.width !== '100%'){
      //     elm[i].style.width= this.setItemWidth;
      //   }
      // }
    },
    resetFields() {
      this.fields.forEach(field => {
        field.resetField();
      });
    },
    validate(callback) {
      let valid = true;
      let count = 0;
      this.firstValidateError = false;
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      this.fields.forEach((field, index) => {
        field.validate("", errors => {
          if (errors) {
            valid = false;
          }
          if (
            typeof callback === "function" &&
            ++count === this.fields.length
          ) {
            callback(valid);
          }
        });
      });
    },
    validateField(prop, cb) {
      var field = this.fields.filter(field => field.prop === prop)[0];
      if (!field) {
        throw new Error("must call validateField with valid prop string!");
      }

      field.validate("", cb);
    },
    clearErrorMessage() {
      this.fields.forEach(field => {
        field.clearErrorMessage();
      });
    },
  }
};
</script>
<style >
/*.el-form-item {
  float: left;
}*/
</style>
