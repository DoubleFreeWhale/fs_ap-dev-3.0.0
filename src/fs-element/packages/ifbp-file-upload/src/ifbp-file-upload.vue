<template>
  <div>
    <el-upload class="page-upload" :action="action" :data="uploadParams" :show-file-list="false" :on-progress="handlePageProgress" :on-success="handlePageSuccess" :on-error="handlePageError" :before-upload="beforePageUpload">
      <el-button v-if="!fileLoad" size="small" type="primary">点击上传</el-button>
      <ul class="page-upload-content" v-if="fileLoad" v-for="(item,index) in fileList" :key="index">
        <li @mouseover="showIcon" @mouseout="hideIcon">
          <i class="ifbp-icon-page ifbp-page-icon"></i>
          <span class="content-file-name" :title="item.name">{{item.name}}</span>
          <span style="float:right;">{{item.size}}</span>          
          <i class="page-progress" :class="{'ifbp-icon-success icon-success':fileStatus,'ifbp-icon-down icon-downLoad':isHover}" @click.stop="downloadFile(item)"></i>
        </li>
      </ul>
      <div slot="tip" v-if="!fileLoad" class="el-upload__tip">{{`只能上传${fileType}文件，且不超过${limitSize}MB`}}</div>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: 'ifbpFileUpload',
  data() {
    return {
      // 上传完成图片路径
      isHover: false,
      fileStatus: false,
      fileLoad: false,
      fileList: [],
      uploadParams: {
        pk: '',
        propName: ''
      }
    };
  },
  props: {
    field: {
      type: String,
      default: ''
    },
    templateValue: {},
    action: {
      type: String,
      default: '/ifbp-hpa-dp-web/fastdfs/upload'
    },
    downloadUrl: {
      type: String,
      default: '/ifbp-hpa-dp-web/fastdfs/download?path='
    },
    billpk: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      default: 'zip'
    },
    limitSize: {
      type: String,
      default: '5'
    }
  },  
  mounted() {
    this.setFile();    
  },
  watch: {
    templateValue: {
      deep: true,
      handler(val) { 
        this.uploadParams = {
          pk: val[this.billpk],
          propName: this.field
        };        
        this.setFile();
      }
    }    
  },
  methods: {
    initUpload() {
      this.fileLoad = false;
      this.fileList = [];
    },
    setFile() {         
      if (this.templateValue && this.templateValue[this.field]) {            
        if (typeof this.templateValue === 'object' && this.templateValue.beanMap && JSON.stringify(this.templateValue.beanMap) !== '{}') {
          this.fileLoad = true;
          this.fileList = [this.getFileInfo()];
        }               
      } else {
        this.initUpload();
      }
    },
    getFileInfo() {      
      return this.templateValue.beanMap[this.field + '_fileref'][this.templateValue[this.field]];
    },
    downloadFile(item) {
      window.open(this.downloadUrl + item.url, '_self');
    },
    showIcon() {
      this.fileStatus = false;
      this.isHover = true;
    },
    hideIcon() {
      this.fileStatus = true;
      this.isHover = false;
    },
    handlePageProgress(event, file) {},
    handlePageSuccess(res, file) {       
      this.fileLoad = true;
      this.fileStatus = true;
      this.fileList = [
        {
          name: res.data.name,
          size: res.data.size,
          url: res.data.url
        }
      ];
      this.templateValue[this.field] = res.data.url;
      this.$emit('onSuccess', res, file);
    },
    handlePageError(err, file) {             
      this.$emit('onError', err, file);
    },
    beforePageUpload(file) {   
      let fileType;     
      if (file.name.lastIndexOf('.') > -1) {
        fileType = file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length)
      }	                        
      let isJPG;                    
      if (fileType) {
        isJPG = this.fileType.indexOf(fileType) > -1;
      } else {
        isJPG = false;        
      }
      const isLt2M = file.size / 1024 / 1024 < this.limitSize;
      if (!isJPG) {
        this.$message.error(`上传文件只能是 ${this.fileType} 格式!`);
      }
      if (!isLt2M) {
        this.$message.error(`上传文件大小不能超过 ${this.limitSize} MB!`);
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
