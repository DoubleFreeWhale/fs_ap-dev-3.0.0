<template>
    <div>
        <el-dialog
                v-model="visible"
                title="详细地址"
                ref="refDialog"
                :size="size"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false">
            <el-form :model="refFormData" label-width="100px" ref="dialogForm" :rules="rules">
                <el-form-item label="所在地区：" prop="district">
                    <el-input
                            ref="addressInput"
                            :placeholder="'请选择地址'"
                            icon="caret-down"
                            v-model="refFormData.district"
                            @mouseout="showPanel = false"
                            @focus="showPanel = true">
                    </el-input>
                </el-form-item>
                <el-form-item label="详细地址：" prop="detailinfo">
                    <el-input v-model="refFormData.detailinfo">{{refFormData.detailinfo}}</el-input>
                </el-form-item>
                <el-form-item label="邮编：">
                    <el-input v-model="refFormData.postcode">{{refFormData.postcode}}</el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
        <ref-input ref="addressPanel"
                   v-if="showPanel"
                   :data="refFormData"
                   :data-name="refFormDataName"
                   :width="inputWidth"
                   :offsetLeft="inputLeft"
                   :offsetTop="inputTop"
                   @pkchange="handlePkChange"
                   @select="handleSelect">
        </ref-input>
    </div>
</template>
<script>
  import refInput from './ref-input.vue';

  export default {
    name: 'addressDialog',
    props: ['dialogVisible', 'savedSelected', 'size', 'formValue', 'formValueId'],
    components: {refInput},
    data() {
      return {
        visible: false,
        addressName: '',
        showPanel: false,
        inputWidth: null,
        inputLeft: null,
        inputTop: null,
        pkData: {},
        refFormData: {
          district: '',
          detailinfo: '',
          postcode: ''
        },
        refFormDataName: {
          district: '',
          detailinfo: '',
          postcode: ''
        },
        rules: {
          district: [
            {required: true, message: '请输入地址', trigger: 'blur' },
            {max: 50, message: '长度最多 50 个字符', trigger: 'blur' }
          ],
          detailinfo: [
            {required: true, message: '请输入地址', trigger: 'blur' },
            {max: 50, message: '长度最多 50 个字符', trigger: 'blur' }
          ]
        }
      };
    },
    watch: {
      dialogVisible(val) {
        this.visible = val;
        if (val === false) {
          this.showPanel = false;
        }
      },
      showPanel(val) {
        if (val === true) {
          $(document).click(function(e) {
            if ($(e.target).attr('class') != 'el-input__inner' && $(e.target).closest('#addressBox').length == 0) {
              this.showPanel = false;
            }
          }.bind(this));
        }
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        if (this.formValue) {
          this.refFormData = JSON.parse(JSON.stringify(this.formValue));
          this.refFormDataName = JSON.parse(JSON.stringify(this.formValue));
        } else {
          this.refFormData = {
            district: '',
            detailinfo: '',
            postcode: ''
          };
        }
      },
      initRequest() {
        if (!this.formValueId) {
          return;
        }
        this.$http({
          url: '/wbalone/address/getAddressById',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: this.formValueId
        }).then(res => {
          if (res.data.success) {
            $.extend(this.refFormData, res.data.data);
          }
        }).catch(() => {
          this.$message({type: 'error', message: '请求失败!'});
        });
      },
      handleSelect(val) {
        this.$set(this.refFormData, 'district', val.join(''));
      },
      handlePkChange(val, valName) {
        this.refFormDataName = valName;
        $.extend(this.refFormData, val);
      },
      confirm() {
        if (!this.refFormData) {
          return;
        }
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.refFormDataName.detailinfo = this.refFormData.detailinfo;
            this.refFormDataName.postcode = this.refFormData.postcode;
            this.$http({
              url: '/wbalone/address/saveAddress',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: this.refFormData
            }).then(res => {
              if (res.data.success) {
                this.pkData = res.data.data;
                this.$emit('selectPk', {field: this.pkData, value: this.refFormDataName});
                // this.$message({type: 'success',message: '保存成功!'});
              }
            }).catch(() => {
              this.$message({type: 'error', message: '请求失败!'});
            });
            this.$emit('valueChange', this.refFormData);
            this.$emit('closeDialog');
          }
        });
      },
      cancel() {
        this.init();
        this.initRequest();
        this.$emit('closeDialog');
      }
    },
    updated() {
      this.inputWidth = this.$refs.addressInput.$refs.input.offsetWidth;
      this.inputLeft = this.$refs.refDialog.$el.children[0].offsetLeft + 116;
      this.inputTop = this.$refs.refDialog.$el.children[0].offsetTop + 117;
    }
  };
</script>
<style scoped>
    .tabDialog {
        z-index: 9999;
        position: absolute;
    }

    .tree-node-panel-content {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .tree-node-childnode {
        padding: 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #2D2D2D;
        cursor: pointer;
        font-size: 14px;
        line-height: 14px;
    }

    .tree-node-childnode:hover,
    .tree-node-childnode.current {
        color: #5AC8FA;;
    }
</style>
