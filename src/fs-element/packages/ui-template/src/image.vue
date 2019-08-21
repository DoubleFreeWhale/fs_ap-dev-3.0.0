<template>
  <el-upload
    v-if="isEdit"
    class="avatar-uploader"
    action="/ifbp-app-bd/bd/psn/psndoc/avatarImgUpload"
    :headers="headers"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :on-error="handleAvatarError"
    :before-upload="beforeAvatarUpload">
    <img v-if="imgUrl" :src="imgUrl" class="avatar">
    <i v-else class="el-icon-plus
                     avatar-uploader-icon"></i>
  </el-upload>
  <img v-else :src="imgUrl" class="avatar">
</template>
<script>
  export default {
    data() {
      return {
        code: '',
        imgUrl: '',
        headers: {
          apikey: 'system'
        }
      };
    },
    props: ['templateValue', 'data', 'isEdit'],
    methods: {
      handleAvatarSuccess(res) {
        if (res.success === true) {
          this.templateValue[this.code] = res.data;
          this.templateValue[this.code] === undefined ? this.imgUrl = '' : this.imgUrl = '/ifbp-app-bd/bd/psn/psndoc/avatarImgDownLoad?avatar=' + this.templateValue[this.code];
        } else if ((res.success === false)) {
          this.$message({
            message: res.error.errorMessage,
            type: 'error'
          });
        }

      },
      handleAvatarError() {
        this.$message({
          message: '上传失败!',
          type: 'error'
        });
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        // return isJPG && isLt2M;
        return isLt2M;
      }
    },
    created() {
      this.code = this.data.itemCode ? this.data.itemCode.split('.').pop() : '';
      this.valueWatcher = this.$watch(function() {
        return this.templateValue;
      },
      function() {
        if (this.templateValue[this.code]) {
          this.imgUrl = '/ifbp-app-bd/bd/psn/psndoc/avatarImgDownLoad?avatar=' + this.templateValue[this.code];
          this.valueWatcher();
        }
      }.bind(this), {deep: true});
      if (this.templateValue && Object.keys(this.templateValue).length > 0) {
        if (this.templateValue[this.code]) {
          this.imgUrl = '/ifbp-app-bd/bd/psn/psndoc/avatarImgDownLoad?avatar=' + this.templateValue[this.code];
        } else {
          this.imgUrl = false;
        }
        this.valueWatcher();
      }
    }
  };
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload input[type=file] {
    display: none;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>

<style scoped>
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border-radius: 0px;
    vertical-align: middle;
  }
</style>
