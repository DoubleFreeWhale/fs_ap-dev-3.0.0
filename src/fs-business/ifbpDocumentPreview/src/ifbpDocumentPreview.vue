<template>
  <div style="display:inline-block;">
    <el-button type="primary" @click="previewClick">{{iframePreviewBtnName}}</el-button>
    <el-dialog
      id="iframeDocumentPreview"
      title="单据预览"
      size="full"
      v-model="showDocumentPreview"
      :before-close="closeDocumentPreview">
      <iframe :id="documentPreviewId" width="100%" height="100%" :src="iframeSrc"></iframe>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ifbpDocumentPreview',
  props: {
    iframePreviewBtnName: {
      type: String,
      default: "预览",
      required: true
    },
    previewType: {
      type: String,
      default: "",
      required: true
    },
    iframeSrc: {
      type: String,
      default: "",
      required: true
    }

  },
  data(){
    return {
      documentPreviewId: '',
      showDocumentPreview: false,
    }
  },
  methods:{
    setUrl(){
      if(this.previewType === 'word'){
        this.documentPreviewId = "iframeWordPreview";
      } else if(this.previewClick === 'document'){
        this.documentPreviewId = "iframeDocumentPreview";
      }
    },
    previewClick(){
      this.showDocumentPreview = true;
    },
    closeDocumentPreview(done){
      this.showDocumentPreview = false;
      done();
    },
  },
  created(){
    this.setUrl()
  }
}
</script>
<style>
#iframeDocumentPreview .el-dialog__body{
  height: calc(100% - 100px);
  overflow: hidden;
}
</style>


