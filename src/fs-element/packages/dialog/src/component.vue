<template>
  <transition name="dialog-fade">
    <div class="el-dialog__wrapper" :class="[{'mt-el-dialog':!IsPC}]" v-show="visible" @click.self="handleWrapperClick">
      <div
        class="el-dialog"
        :class="[sizeClass, customClass]"
        ref="dialog"
        :style="style">
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{title}}</span>
          </slot>
          <div class="el-dialog__headerbtn">
            <i v-if="showClose" class="el-dialog__close el-icon el-icon-close" @click='handleClose'></i>
          </div>
        </div>
        <div class="el-dialog__body" v-if="rendered"><slot></slot></div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Popup from 'ifbp-element/src/utils/popup';
  import emitter from 'ifbp-element/src/mixins/emitter';
  import { IsPC } from 'ifbp-element/src/utils/util';
  export default {
    name: 'ElDialog',

    mixins: [Popup, emitter],
    data (){
      return {
        IsPC: IsPC()
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },

      modal: {
        type: Boolean,
        default: true
      },

      modalAppendToBody: {
        type: Boolean,
        default: true
      },

      lockScroll: {
        type: Boolean,
        default: true
      },

      closeOnClickModal: {
        type: Boolean,
        default: false
      },

      closeOnPressEscape: {
        type: Boolean,
        default: false
      },

      showClose: {
        type: Boolean,
        default: true
      },

      size: {
        type: String,
        default: 'small'
      },

      customClass: {
        type: String,
        default: ''
      },

      top: {
        type: String,
        default: ''
      },

      width: {
        type: String
      },
      beforeClose: Function
    },

    watch: {
      visible(val) {
        this.$emit('update:visible', val);
        if (val) {
          this.$emit('open');
          this.$el.addEventListener('scroll', this.updatePopper);
          this.$nextTick(() => {
            this.$refs.dialog.scrollTop = 0;
            setTimeout(()=> {
              this.elDialogResize();
            },100)
          });
        } else {
          this.$el.removeEventListener('scroll', this.updatePopper);
          this.$emit('close');
        }
      }
    },

    computed: {
      sizeClass() {
        return `el-dialog--${ this.size }`;
      },
      style() {
        let tmpStyle = this.size === 'full' ? {} : { 'top': this.top };
        if (this.width) {
          tmpStyle.width = this.width;
        }
        return tmpStyle;
      }
    },

    methods: {
      handleWrapperClick() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
      },
      handleClose() {
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(this.hide);
        } else {
          this.hide();
        }
      },
      hide(cancel) {
        if (cancel !== false) {
          this.$emit('update:visible', false);
          this.$emit('visible-change', false);
        }
      },
      updatePopper() {
        this.broadcast('ElSelectDropdown', 'updatePopper');
        this.broadcast('ElDropdownMenu', 'updatePopper');
      },
      elDialogResize() {
        if(this.$el && this.size !== 'full') {
          let visibleHeight = document.documentElement.clientHeight;
          let dialogHeight = $(this.$el).find('.el-dialog')[0].offsetHeight;
          let residueHeight = visibleHeight - dialogHeight;
          let dialogHeaderHeight = 0;
          if($(this.$el).find('.el-dialog .el-dialog__header')[0]) {
            dialogHeaderHeight = $(this.$el).find('.el-dialog .el-dialog__header')[0].offsetHeight;
          }
          let dialogFooterHeight = 0;
          if($(this.$el).find('.el-dialog .el-dialog__footer')[0]) {
             dialogFooterHeight = $(this.$el).find('.el-dialog .el-dialog__footer')[0].offsetHeight;
          }
          let dialogBodyHeight = 0;
          let orgBodyHeight = 0;
          if($(this.$el).find('.el-dialog .el-dialog__body')[0]) {
             dialogBodyHeight = $(this.$el).find('.el-dialog .el-dialog__body')[0].offsetHeight;
          }
          let residueDialogHeight = visibleHeight-dialogHeaderHeight-dialogFooterHeight - 64*2;
          $(this.$el).find('.el-dialog').css("overflow","hidden");
          $(this.$el).find('.el-dialog .el-dialog__body').css("max-height", residueDialogHeight+'px');
          $(this.$el).find('.el-dialog .el-dialog__body').css("overflow","auto");
        }
      },
      resizeListener(e){
        if(this.visible&& this.size !=='full'){
          e.stopPropagation();
          this.elDialogResize();
        }
      }
    },

    mounted() {
      if (this.visible) {
        this.rendered = true;
        this.open();
      }
      window.document.body.appendChild(this.$el);
      if(this.visible && this.size !=='full') {
        this.elDialogResize();
      }
      // window.addEventListener('resize', (e) => {
      //     if(this.visible&& this.size !=='full'){
      //       e.stopPropagation();
      //       this.elDialogResize();
      //     }
      //   });
      window.addEventListener('resize', this.resizeListener);
    },
    beforeDestroy() {
      $(this.$el).remove();
      window.removeEventListener('resize', this.resizeListener);
      // this.$off();
      // this.$refs.wrapper.click = null;
    },
  };
</script>
