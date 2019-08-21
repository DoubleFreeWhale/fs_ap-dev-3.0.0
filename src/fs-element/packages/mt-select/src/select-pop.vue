<template>
  <mt-popup v-model="visible" position="bottom" class="mint-datetime">
      <div class="top-button">
        <span class="mint-datetime-action mint-datetime-cancel" @click="visible = false;$emit('cancel')">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="confirm">确定</span>
      </div>
      <div class="app-select-items" v-if="!multiple">
          <slot></slot>
      </div>
       <div class="app-select-item" v-else>
          <slot></slot>
      </div>
  </mt-popup>
  
</template>

<style lang="css">
    $color-blue: #26a2ff;
    $color-white: #fff;
    $color-grey: #d9d9d9;
    $border-color: #c8c8cd;
    $success-color: #4caf50;
    $error-color: #f44336;
    $warning-color: #ffc107;

    /* Cell Component */
    $cell-value-color: #888;

    /* Header Component */
    $header-height: 40px;

    /* Button Component */
    $button-default-color: #656b79;
    $button-default-background-color: #f6f8fa;
    $button-default-plain-color: #5a5a5a;
    $button-default-box-shadow: 0 0 1px #b8bbbf;
    $button-primary-color: #fff;
    $button-primary-background-color: #26a2ff;
    $button-danger-color: #fff;
    $button-danger-background-color: #ef4f4f;

    /* Tab Item Component */
    $tab-item-font-size: 12px;

    /* Tabbar Component */
    $tabbar-background-color: #fafafa;
    $tabbar-tab-item-selected-background-color: #eaeaea;
    $tabbar-tab-item-selected-color: $color-blue;

    /* Navbar Component */
    $navbar-background-color: #fafafa;
    $tabbar-tab-item-selected-background-color: #eaeaea;

    /* Checklist Component */
    $checklist-title-color: #888;

    /* Radio Component */
    $radio-title-color: #888;

    /* z-index */
    $z-index-normal: 1;

    .v-modal-enter {
        animation: v-modal-in .2s ease;
    }

    .v-modal-leave {
        animation: v-modal-out .2s ease forwards;
    }

    @keyframes v-modal-in {
        0% {
            opacity: 0;
        }
        100% {
        }
    }

    @keyframes v-modal-out {
        0% {
        }
        100% {
            opacity: 0;
        }
    }

    .v-modal {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0.5;
        background: #000;
    }

</style>

<script type="text/babel">
  /* import radioSelect from 'ifbp-element/packages/app-select/index.js' */
  import { IsPC } from 'ifbp-element/src/utils/util';
  import popup from 'ifbp-element/packages/popup/index.js';
  if (process.env.NODE_ENV === 'component') {
    require('ifbp-element/packages/popup/style.css');
  }
  export default {
    name: 'mt-datetime-picker',
    props: {
      loading: Boolean,
      pageType: {
        type: Boolean,
        default: false
      },
      cancelText: {
      type: String,
      default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      multiple: Boolean,
    },
    data() {
      return {
        options: [],
        visible: false,
        filteredOptionsCount: 0,
        allowCreate:false,
        emptyText:true,
        IsPC: IsPC()
      };
    },

    components: {
      'mt-popup': popup,
    },

    methods: {
      open() {
        this.visible = true;
      },

      close() {
        this.visible = false;
        this.$emit('cancel');
      },
      confirm() {
        this.visible = false;
        this.$emit('confirm');
      }
    },

    computed: {
    },

    watch: {
     
    },
    mounted() {
    
    }
  };
</script>
