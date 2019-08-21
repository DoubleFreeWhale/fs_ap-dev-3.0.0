<template>
  <div>
    <!-- 新增磁铁部分的model dialog -->
    <el-dialog size="tiny"
               class="side"
               top="70px"
               @close="clear"
               :modal="false"
               :lock-scroll="false"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               :show-close="false"
               title="新增磁贴"
               v-model="show">
      <el-form :model="form">
        <el-form-item label="磁贴名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="业务地址" :label-width="formLabelWidth">
            <el-input v-model="form.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="板块分组" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择分组板块">
                <el-option label="租户管理" value="zuhuguanli"></el-option>
                <el-option label="组织管理" value="zuzhiguanli"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="选择图标" :label-width="formLabelWidth">
            <img :src="form.img" v-if="isActive" class="formImg">
            <el-button type="success" @click="openSelectImg" v-if="!isActive">选择图标</el-button>
            <el-button type="success" @click="openSelectImg" v-if="isActive">重新选择</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="formSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择图标部分的model dialog -->
    <el-dialog  size="tiny"
                class="side"
                top="70px"
                title="选择图标"
                :modal="false"
                :lock-scroll="false"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                :show-close="false"
                v-model="imgDialog">
      <el-form :model="form">
        <el-row>
          <el-col :span='6' v-for="(img, index) in imgList" :key="img.index">
            <el-form-item>
              <img :src=img.src @click="selectImg(index)" class="formImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
    export default {
      name: 'ElSideDialog',
      props: {
        show: {
          type: Boolean
        },
        list: {
          type: Array,
          required: true
        }
      },
      data() {
        return {
          form: {
            title: '',
            img: '',
            url: '',
            region: ''
          },
          formLabelWidth: '70px',
          imgDialog: false,
          imgList: [],
          isActive: false
        };
      },
      created() {
        this.imgList = this.list;
      },
      methods: {
        clear() {
          this.form = {
            title: '',
            img: '',
            region: ''
          };
          this.isActive = false;
        },
        formSubmit() {
          // ajax
          this.clear();
          this.close();
        },
        openSelectImg() {
          this.imgDialog = true;
        },
        selectImg(index) {
          this.form.img = this.imgList[index].src;
          this.isActive = true;
          this.imgDialog = false;
        },
        close() {
          this.$parent.$emit('closeSideDialog');
        }
      }
    };
</script>
<style scoped>
    .formImg{
        width: 76px;
        height: 76px;
        float: left;
        margin-top: -16px;
        margin-right: 10px;
    }
</style>
