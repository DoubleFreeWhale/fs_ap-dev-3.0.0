<template>
    <div id="grandson-page" :style="{'top': top + 'px', 'width': width + 'px', 'transform': transform,'box-shadow':boxShadow}">
        <div class="grandson-page-header">
            <slot name="title">
                <span style="font-weight: 700;font-size: 14px;color: #333;">{{title}}</span>
            </slot>
            <i class="el-icon-close" @click="hidePage" v-if="showClose" title="关闭"></i>
        </div>
        <div class="grandson-page-body" :style="{'bottom': hasFooterSlot ? '50px' : 0}">
            <slot></slot>
        </div>
        <div class="grandson-page-footer" v-if="hasFooterSlot">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<script>
import Popup from "ifbp-element/src/utils/popup";

export default {
  name: "IfbpGrandsonPage",

  componentName: "IfbpGrandsonPage",

  mixins: [Popup],

  props: {
    top: {
      type: [Number, String],
      default: function() {
        var headerHeight = 0;
        var headerDom = document.querySelector("header.header");
        if (headerDom) {
          headerHeight = headerDom.clientHeight;
        }
        return headerHeight;
      }
    },

    width: {
      type: [Number, String],
      default: 500
    },

    title: {
      type: String,
      default: ""
    },

    showClose: {
      type: Boolean,
      default: true
    },

    modal: {
      type: Boolean,
      default: false
    },

    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pageWidth: 350,
      isShow: false,
      bodyOverflow: null
    };
  },
  computed: {
    hasFooterSlot() {
      return this.$slots.footer !== undefined;
    },
    transform() {
      return "translateX(" + (this.isShow ? "0" : "100%") + ")";
    },
    boxShadow(){
      return this.isShow ? "0 8px 24px 0 rgba(0,0,0,0.15)" : ""
    }
  },
  created() {
    this.pageWidth = this.width;
  },
  methods: {
    showPage() {
      this.isShow = true;
      if (this.modal) {
        this.open();
      }
    },
    hidePage() {
      if (this.modal) {
        this.close(); // 触发this.onClose方法
      } else {
        this.isShow = false;
        this.$emit("close");
      }
    },
    // called in Popup when popup closeing
    onClose() {
      this.isShow = false;
      this.$emit("close");
    }
  },
  mounted() {
	}
};
</script>

<style scoped>
#grandson-page {
  position: fixed;
  /* height: 100%; */
  max-width: 100%;
  transition: 0.5s;
  right: 0;
  bottom: 0;
  background: #ffffff;
  overflow-x: hidden;
  border-left: 1px solid #c5c5c5;
  overflow: hidden;
  z-index: 1000;
}
#grandson-page .grandson-page-header {
  position: absolute;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  color: #333;
  font-size: 14px;
  border-bottom: 1px solid #d1cfcf;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 60;
}
#grandson-page .grandson-page-body {
  padding-top: 34px;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  right: 0px;
  left: 0px;
  top: 50px;
  z-index: 55;
}
#grandson-page .grandson-page-footer {
  position: absolute;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background-color: #fff;
  border-top: 1px solid #d1cfcf;
  box-sizing: border-box;
  bottom: 0;
  z-index: 55;
}
#grandson-page .grandson-page-header i.el-icon-close {
  float: right;
  cursor: pointer;
  padding: 10px;
  margin: 8px 0;
  transition: 0.2s;
  display: inline-block;
}
#grandson-page .grandson-page-header i.el-icon-close:hover {
  transform: rotate(-90deg);
  background: #e4e8ec;
  border-radius: 30px;
}
</style>
