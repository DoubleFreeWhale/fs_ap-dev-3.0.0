<script>
import {extend} from "ifbp-element/src/utils/extend.js";
export default {
  name: "IfbpImage",

  props: {
    value:{
      type: String
    },
    action: {
      type: String
      // required: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      defaultSrc: require('../images/icon_account_24px.svg'),
      imageUrlData: '',
      TimeOut:null
    }
  },
  methods: {
    valueChange(val){
      this.$emit("valuechange",val);
    },
    resetImg(e) {
      e.stopPropagation();
      // this.value = "";
      this.imageUrlData = this.defaultSrc;
    },
    openFile(e) {
      e.stopPropagation();
      if(this.editable) {
        if(this.$el) {
          $(this.$el).find('input').click();
        }
      }
    }
  },
  watch: {
    imageUrl(val) {
      this.imageUrlData = val;
    },
    value: {
        immediate: true,
        handler(value) {
          if(this.TimeOut){
            clearTimeout(this.TimeOut);
          }
          this.TimeOut = setTimeout(()=>{
            this.valueChange(value);
            this.TimeOut = null;
            clearTimeout(this.TimeOut);
          },200);         
        }
    },
  },
  mounted() {
    this.imageUrlData = this.imageUrl;
  },
  render(h) {
    let {
      resetImg,
      openFile,
    } = this;
    let baseProps = {
      "show-file-list": false,
      action: this.action
    };
    let otherProps = this.$vnode.data.attrs;
    let props = extend(true, {}, otherProps, baseProps);
    let uploadData = {
      props: props,
      imageUrlData: this.imageUrlData
    };
    return this.editable ? (
      <div class="ifbp-image">
      <elUpload {...uploadData}>
        <img v-show={this.value} src={this.imageUrlData} class={["avatar",this.imageUrlData===this.defaultSrc?'ifbp-image-is-default':'']} />
        <i v-show={!this.value} class="ifbp-icon-add avatar-uploader-icon" />
        <div class="ifbp-image-oper" v-show={this.value}>
        <i class="ifbp-icon-undo" on-click={resetImg} />
        <i class="ifbp-icon-edit" on-click={openFile} />
        </div>
      </elUpload>
      </div>
    ) : (
      <div class="avatar-uploader ifbp-image">
        <img v-show={this.value} src={this.imageUrlData} class="avatar " />
        <img v-show={!this.value} src={this.defaultSrc} class="avatar ifbp-image-avatar ifbp-default" />
      </div>
    );
  }
};
</script>

