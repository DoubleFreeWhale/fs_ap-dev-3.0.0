<template lang="html">
  <ifbp-page>
    <ifbp-breadcrumb   :name="isAppCreate?'新增磁贴信息':'修改磁贴信息'"></ifbp-breadcrumb>
    <ifbp-main-area type="detail">
      <ifbp-panel id="basePanel" title="磁贴信息"  :icons="appletIcons">
        <ifbp-template
        ref="appletBaseDetail"
        :pk-temp="appletBaseDetailPk"
        tpl-id="appletBaseDetailId"
        :tpl-data="appletBaseData"
        :tpl-reset-fun="appletBaseResetFun"
        show-type="form"
        :methods="appletBaseMethods"
        :editable="appletBaseEdit"
        @after-create="appletAfterCreate"
        @change="changeFun"
        >
        </ifbp-template>
      </ifbp-panel>
      <ifbp-panel id="contentPanel" title="磁贴内容"  :icons="appletContentIcons">
        <el-form class="applet-manage-content" ref="AppMagnetType" inline :rules="appContentRules" :model="appContentFormData" v-if="appletContentStyle">
          <el-form-item label="磁贴样式" prop="tileType" >
            <el-select v-model="appContentFormData.tileType" clearable @change="magnetTypeChange">
              <el-option v-for="item in appStyle" :key="item.value" :value="item.value" :label="item.name">{{item.name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图标选择器" prop="appIcon" v-if="isShowFontIcon">
            <ifbp-icon-select :is-show-color-select="true" @icon-select="selectIcon"></ifbp-icon-select>
          </el-form-item>
          <el-form-item label="上传图标" prop="iconContent" v-if="isShowImgIcon">
            <ifbp-image
            class="applet-icon-content-upload"
            v-model="appContentFormData.iconContent"
            action="/wbalone/appMGT/iconUpload"
            :image-url="appletDetailUploadImg+appContentFormData.iconContent"
            :on-success="handleAvatarSuccess">
            </ifbp-image>
            <!-- <span @click="clearUploadFiles"  class="cancelBackground">取消上传</span> -->
          </el-form-item>
          <el-form-item label="图表类型" prop="chartType" v-if="isShowCharts">
            <el-select v-model="appContentFormData.chartType">
              <el-option v-for="item in chartTypeOptions" :key="item.value" :value="item.value" :label="item.name">{{item.name}}</el-option>
            </el-select>
            <!-- <el-input v-model="appFormData.chartType"></el-input> -->
          </el-form-item>
          <el-form-item label="图表数据URL" prop="chartUrl" v-if="isShowCharts">
            <el-input v-model="appContentFormData.chartUrl"></el-input>
          </el-form-item>
          <el-form-item label="数字数据URL" prop="numberUrl" v-if="isShowApi">
            <el-input v-model="appContentFormData.numberUrl"></el-input>
          </el-form-item>
          <el-form-item label="单位" v-if="isShowApi">
            <el-input v-model="appContentFormData.numberUnit"></el-input>
          </el-form-item>
          <el-form-item label="颜色" v-if="isShowApi">
            <ifbp-color-picker v-model="appContentFormData.numberColor" show-alpha ></ifbp-color-picker>
          </el-form-item>
        </el-form>
        <div class="appSubOpro" v-if="appletContentStyle">
          <el-button @click="appContentCancel">取消</el-button>
          <el-button type="primary" @click="appContentSubmit">完成</el-button>
        </div>
        <el-table ref="appletContentTable" :data="appContentData"
                  style="width: 100%" class="appContentTable"
                  :span-method="arraySpanMethod"
        >

          <el-table-column prop="tileType" label="类型">
            <template slot-scope="scope">
              <span v-for="item in appStyle" v-show="item.value === scope.row.tileType">{{item.name}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="内容描述">
            <template slot-scope="scope">
              <span v-if="scope.row.tileType === 'fontIcon'">图标名称:{{scope.row.appIcon}}</span>
              <span v-if="scope.row.tileType === 'imgIcon'">上传图标的路径:{{scope.row.iconContent}}</span>
              <span v-if="scope.row.tileType === 'charts'">图表类型:{{scope.row.chartType}} 图表的url:{{scope.row.chartUrl}}</span>
              <span v-if="scope.row.tileType === 'api'">数值url:{{scope.row.numberUrl}} 数值单位:{{scope.row.numberUnit}}</span>
            </template>
          </el-table-column>
          <el-table-column  type="expand">
            <template slot-scope="props">
              <el-form class="" ref="AppMagnetExpandType" inline :rules="appContentRules" :model="props.row">
                <el-form-item label="磁贴样式" prop="tileType" >
                  <el-select v-model="appContentExpandFormData.tileType" clearable @change="magnetTypeEditChange">
                    <el-option v-for="item in appStyle" :key="item.value" :value="item.value" :label="item.name">{{item.name}}</el-option>
                  </el-select>
                  <!-- <span v-for="item in appStyle" v-if="(item.value === appContentExpandFormData.tileType)&& (appContentExpandFormData.tileType)">{{item.name}}</span> -->
                </el-form-item>
                <el-form-item label="图标选择器" prop="appIcon" v-if="isShowEditFontIcon">
                  <ifbp-icon-select :is-show-color-select="true" :default-icon="appContentExpandFormData.appIcon":default-color="appContentExpandFormData.appIconColor" @icon-select="selectEditIcon"></ifbp-icon-select>
                </el-form-item>
                <el-form-item label="上传图标" prop="iconContent" v-if="isShowEditImgIcon">
                  <ifbp-image
                          class="applet-icon-content-upload"
                          v-model="appContentExpandFormData.iconContent"
                          action="/wbalone/appMGT/iconUpload"
                          :image-url="appletDetailUploadImg+appContentExpandFormData.iconContent"
                          :on-success="handleAvatarEditSuccess">
                  </ifbp-image>
                  <!-- <span @click="clearEditUploadFiles"  class="cancelBackground">取消上传</span> -->
                </el-form-item>
                <el-form-item label="图表类型" prop="chartType" v-if="isShowEditCharts">
                  <el-select v-model="appContentExpandFormData.chartType">
                    <el-option v-for="item in chartTypeOptions" :key="item.value" :value="item.value" :label="item.name">{{item.name}}</el-option>
                  </el-select>
                  <!-- <el-input v-model="appFormData.chartType"></el-input> -->
                </el-form-item>
                <el-form-item label="图表数据URL" prop="chartUrl" v-if="isShowEditCharts">
                  <el-input v-model="appContentExpandFormData.chartUrl"></el-input>
                </el-form-item>
                <el-form-item label="数字数据URL" prop="numberUrl" v-if="isShowEditApi">
                  <el-input v-model="appContentExpandFormData.numberUrl"></el-input>
                </el-form-item>
                <el-form-item label="单位" v-if="isShowEditApi">
                  <el-input v-model="appContentExpandFormData.numberUnit"></el-input>
                </el-form-item>
                <el-form-item label="颜色" v-if="isShowEditApi">
                  <ifbp-color-picker v-model="appContentExpandFormData.numberColor" show-alpha ></ifbp-color-picker>
                </el-form-item>
              </el-form>
              <div class="fr">
                <el-button @click="appContentUpdateCancel(props.row)">取消</el-button>
                <el-button type="primary" @click="appContentUpdate(props.row)">保存</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width=200 class-name="table-operate-column" :show-overflow-tooltip="false">
          <template slot-scope="scope">
            <i title="上移" class="ifbp-icon-up el-table-operate-icon" @click="appContentUp(scope)" v-if="appletBaseEdit"></i>
            <i title="下移" class="ifbp-icon-down el-table-operate-icon" @click="appContentDown(scope)" v-if="appletBaseEdit"></i>
            <i title="编辑" class="ifbp-icon-edit el-table-operate-icon" @click="appContentEdit(scope)" v-if="appletBaseEdit"></i>
            <i title="删除" class="ifbp-icon-delete el-table-operate-icon applet-dsds-icon" @click="appContentDelete(scope)" v-if="appletBaseEdit"></i>
          </template>
        </el-table-column>
        </el-table>
      </ifbp-panel>
      <ifbp-panel title="页脚" id="applet-base-footer">
        <el-form class="" ref="AppFooterType" inline :model="appContentFooterData">
          <el-form-item label="页脚" prop="footerType" >
            <el-select v-model="appContentFooterData.footerType" clearable @change="appletFooterChange" v-if="appletBaseEdit">
              <el-option v-for="item in appFooterOptions" :key="item.value" :value="item.value" :label="item.name">{{item.name}}</el-option>
            </el-select>
            <span v-for="item in appFooterOptions" :key="item.value" @change="appletFooterChange" v-if="(item.value === appContentFooterData.footerType)&& (appContentFooterData.footerType)&& !appletBaseEdit">{{item.name}}</span>
          </el-form-item>
          <el-form-item label="页脚内容" prop="footer" v-if="isFooterContent">
            <el-input v-model="appContentFooterData.footer" v-if="appletBaseEdit"></el-input>
            <span v-else >{{appContentFooterData.footer}}</span>
          </el-form-item>
          <el-form-item label="页脚Url" prop="footerUrl" v-if="isFooterUrl">
            <el-input v-model="appContentFooterData.footerUrl" v-if="appletBaseEdit"></el-input>
            <span v-else>{{appContentFooterData.footerUrl}}</span>
            <!-- <span v-for="item in appStyle" v-if="(item.value === appContentFormData.tileType)&& (appContentFormData.tileType)">{{item.name}}</span> -->
          </el-form-item>
        </el-form>
      </ifbp-panel>
      <div v-if="!isShowPremisson" style="margin-bottom:260px;"></div>
      <ifbp-panel id="appPerssion" :icons="appSubIcons" title="磁贴权限信息" v-if="isShowPremisson">
        <ifbp-template
        ref="appletPremisson"
        :pk-temp="appletPremissonPk"
        :tpl-data="appletPremissonData"
        tpl-id="appletPremissonId"
        :table-show-menu="false"
        :tpl-reset-fun="appletPremissonResetFun"
        show-type="table-form"
        :editable="appPreEditable"
        @update:editable="val => {this.appPreEditable = val}"
        :cancel-button-show="appPreEditable"
        @expand="(row, expanded) => {this.tableOperVif = !expanded}"
        :table-oper-vif="tableOperVif"
        @form-confirm-click="premissonFormConfirm"
        @table-click="premissonTableClick"
        >
        </ifbp-template>
        <el-dialog
          title="提示"
          v-model="appSubDelDialogVisible"
          :modal="true"
          size="tiny">
          <span>确认删除？删除后无法恢复。</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="appSubDelDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteAppSubFun">确 定</el-button>
          </span>
        </el-dialog>
      </ifbp-panel>

    </ifbp-main-area>
    <app-tile class="appletManageDetailTile" :child="allData"></app-tile>
    <ifbp-footer>
        <el-button id="appletBtn" @click="appCancel">取消</el-button>
        <el-button type="primary" @click="appEditAll" v-if="!appletBaseEdit">编辑</el-button>
        <el-button type="primary" @click="appSaveAll" v-if="appletBaseEdit">保存</el-button>
     </ifbp-footer>
  </ifbp-page>
</template>
<script>
import appletContent from './appletContent.js';
import appPremisson from "./appPremisson.js";
import appTile from './appTile.vue';
export default {
  mixins: [appletContent, appPremisson],
  components: {
    appTile
  },
  data() {
    var appletId = this.$root.$router.currentRoute.params.id;
    var isAppCreateId = !appletId;
    var vm = this;
    return {
      premissionIconsEdit: isAppCreateId,
      contentIconsEdit: isAppCreateId,
      appBaseOrgData: {},
      appContentOrgData: [],
      appPremOrgData: [],
      appContentOrgFormData:{},
      isAppCreate: isAppCreateId,
      appletBaseDetailPk: '0001APPDETAIL0000001',
      appletBaseData: {},
      iconsEdit: !isAppCreateId,
      labels: [],
      id: appletId,
      arr:[],
      appContentData: [],
      appletBaseEdit: isAppCreateId,
      appDetailGroupOptions: [],
      appSubData: [],
      appPremissonData: [],
      allData:{},
      isShowPremisson: true,
      appletDetailUploadImg:'',
      appletBaseResetFun: function($node) {
        //磁贴产品添加事件
        var $areaDom = $node.find('el-form-item[prop="areaId"]').find('el-select');
        $areaDom.attr("v-on:change", "areaChange");
        return $node[0].outerHTML;
      },
      appletBaseMethods: {
        // 选择图片后的处理方法
        beforeMainImgUpload(file) {
          // 看支持不支持FileReader
          if (!file || !URL.createObjectURL) {
            this.$message({message: "您当前的浏览器不支持图片的上传！", type: "error"});
            return;
          }
          // 图片预览
          var imgUrlNew = URL.createObjectURL(file);
          // this.appFormData.backgroundImg = imgUrlNew;
          // 图片流获取
          let reader = new FileReader();
          reader.readAsDataURL(file);
          let avatarThis = this;
          reader.onload = function (evt) {
            avatarThis.dataChange(evt.target.result);
          };
          //返回false不继续上传
          return false;
        },
        
      // 图片变化
      dataChange: function (val) {
        this.appFormData.backgroundImgContent = val;
        this.appFormData.backgroundUrl = val;
      },
        //图片处理方法
        avatarUploadSuccess(res) {
          var formData = vm.$refs.appletBaseDetail.comp.appFormData;
          formData.backgroundImgContent = res.data;
        },
        //级联处理方法
        areaChange(val) {
          vm.$refs.appletBaseDetail.comp.appFormData.groupId = '';
          vm.$refs.appletBaseDetail.setData("groupOptions", vm.appDetailGroupOptions.filter(item => (item.areaId === val)))
        }
      },
      linkType: [{
          label: "vue页面",
          value: "plugin"
        },
        {
          label: "网页链接",
          value: "url"
        },
        {
          label: "概览页",
          value: "view"
        }
      ],
      platformOptions: [{
          label: "web",
          value: "web"
        },
        {
          label: "app",
          value: "app"
        }
      ],
      appStyleTypeOption: [{
          label: "1*1",
          value: "1*1"
        },
        {
          label: "2*1",
          value: "2*1"
        }
      ],
      typeOptions:[],
    };
  },
  methods: {
    arraySpanMethod  ({ row, column, rowIndex, columnIndex }) {
      if(column.type==='expand'){
        return [1,2]
      }
    },
    appletAfterCreate() {
      this.requestAppletDetail();
      this.getAllData();
      if(this.$refs.appletBaseDetail) {
        this.$refs.appletBaseDetail.setData('formItemVIfappType', true);
        this.$refs.appletBaseDetail.setData('formItemVIflabels', false);
        this.$refs.appletBaseDetail.setData('formItemVIfplatform', false);
      }
    },
    getFooterType(val) {
      if(val === 'url') {
        this.isFooterUrl = true;
        this.isFooterContent = false;
      }
      if(val  === 'content') {
        this.isFooterUrl = false;
        this.isFooterContent = true;
      }
      if(val  === '') {
        this.isFooterUrl = false;
        this.isFooterContent = false;
      }
    },
    //请求基本信息数据
    requestAppletDetail() {
      if(this.$refs.appletBaseDetail) {
        this.$refs.appletBaseDetail.setData("appTypeOptions",this.typeOptions);
        this.$refs.appletBaseDetail.setData("areaOptions", this.arr);
        this.$refs.appletBaseDetail.setData("urlTypeOptions", this.linkType);
        this.$refs.appletBaseDetail.setData("styleTypeOptions", this.appStyleTypeOption);
        this.$refs.appletBaseDetail.setData("platformOptions", this.platformOptions);
        // this.$refs.appletBaseDetail.setData("appTypeOptions", this.labels);
      }
      if (!this.id) return;
      this.$http({
          url: "/baseapp/appMGT/findOne/" + this.id,
          type: 'GET',
          dataType: 'json',
        }).then(res => {
          if (res.data.success === true && res.data.data) {
            res.data.data
            let resData = res.data.data || {};
            resData.backgroundUrl = '/baseapp/appMGT/iconDownload?app_img_id=' + resData.backgroundImg + '&time=' + (new Date()).getTime();
            this.appBaseOrgData = JSON.parse(JSON.stringify(resData));
            this.appPremOrgData = JSON.parse(JSON.stringify(res.data.data.appPerssion));
            this.appContentOrgData = JSON.parse(JSON.stringify(res.data.data.contents));
            this.$nextTick(() => {
              this.$refs.appletBaseDetail.comp.areaChange(res.data.data.areaId);
              if(Array.isArray(res.data.data.contents)) {
                this.appContentData = res.data.data.contents;
              } else {
                this.appContentData = [];
              }
              this.appContentFooterData.footerUrl= res.data.data.footerUrl;
              this.appContentFooterData.footerType = res.data.data.footerType;
              this.appContentFooterData.footer = res.data.data.footer;
              this.getFooterType(this.appContentFooterData.footerType);
              if (this.$refs.appletBaseDetail) {
                this.$refs.appletBaseDetail.setFormData(resData);
              } else {
                this.$set(this.appletBaseData, "uitemplateFormData", resData);
              }
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(e => {
          this.$message({
            message: "基本信息详情获取失败",
            type: "error"
          });
        });
    },
    //获取产品和分组的级联信息
    loadDetailList() {
      this.$http({
        url: '/baseapp/moduleMGT/listWithGroup',
        type: 'GET',
        dataType: 'json',
      }).then((res) => {
        if(res.data.status === 1) {
          this.appDetailGroupOptions = [];
          if(res.data.data && res.data.data.length > 0 ){
            for (var i = 0; i < res.data.data.length; i++) {
              this.arr.push(res.data.data[i].area);
              this.appDetailGroupOptions = this.appDetailGroupOptions.concat(res.data.data[i].group);
            }
            if(this.appDetailGroupOptions && this.appDetailGroupOptions.length > 0) {
              for (var i = 0; i < this.appDetailGroupOptions.length; i++) {
                this.appDetailGroupOptions[i].label = this.appDetailGroupOptions[i].name;
                this.appDetailGroupOptions[i].value = this.appDetailGroupOptions[i].id;
              }
            }
            // console.log("bbbb",this.arr);
            if(this.arr && this.arr.length > 0) {
              for (var i = 0; i < this.arr.length; i++) {
                this.arr[i].label = this.arr[i].areaName;
                this.arr[i].value = this.arr[i].id;
              }
            }
            // console.log('aaaa', this.arr);
          }
        }
      }).catch(() => {
        this.$message({
          message: '产品信息获取失败',
          type: 'error'
        });
      });
    },
    //整单保存的方法
    appSaveAll() {
      if(this.$refs.appletBaseDetail) {
        var appBaseSaveData = this.$refs.appletBaseDetail.getFormData();
      }
      var appContentSaveData = this.appContentData;
      var appFooterSaveData = this.appContentFooterData;
      if(Array.isArray(appContentSaveData) && appContentSaveData.length) {
        for (var i = 0; i < appContentSaveData.length; i++) {
          delete appContentSaveData[i].pk;
        }
      }
      if(this.$refs.appletPremisson) {
        var appPremissonSaveData = this.$refs.appletPremisson.getTableData();
      }
      var data = {
        "app": {
        ...appBaseSaveData,
            contents: appContentSaveData,
            footer: appFooterSaveData.footer,
            footerType: appFooterSaveData.footerType,
            footerUrl: appFooterSaveData.footerUrl,
        }
      };
      console.log(data);
      this.$refs.appletBaseDetail.validate((valid) => {
        if(valid) {
          this
            .$http({
              url: "/baseapp/appMGT/save",
              method: "post",
              data: data,
              headers: {
                "Content-Type": "application/json"
              },
              dataType: "application/json"
            })
            .then(res => {
              if (res.data.success) {
                this.$refs.appletBaseDetail.clearEdit();
                if(!this.id || this.id === "undefined"){
                  this.$message({
                    message: "保存成功"
                  });
                  this.$context.destroyCurrentTile();
                  this.$router.push("/appletManageList");
                }else{
                  this.$refs.appletBaseDetail.setFormDataByField("ts", res.data.data.ts);
                  this.$message({
                    message: "修改成功"
                  });
                  this.appletBaseEdit = false;
                  this.contentIconsEdit = false;
                  this.iconsEdit = true;
                  this.premissionIconsEdit = false;
                  this.closeOPer();
                }
                // this.pageExpenseAccountIcons[0].show = true;
              } else {
                this.$message({
                  message: res.data.error.errorMessage,
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "保存失败",
                type: "error"
              });
            });
        }
      })
    },
    closeOPer() {
      if(this.$refs.appletPremisson) {
        this.$refs.appletPremisson.getTableComp().closeExpandRow();
        this.$refs.appletPremisson.formShow = false;
      }
      this.$refs.appletContentTable.closeExpandRow();
      this.appletContentStyle = false;
      this.appContentFormData = {};
      this.isShowFontIcon = false;
      this.isShowImgIcon = false;
      this.isShowApi = false;
      this.isShowCharts = false;
    },
    // 取消操作
    appCancel() {
      debugger
      if(!this.appletBaseEdit) {
        this.$router.push("/appletManageList");
      } else {
        this.closeOPer();
        var tempData = JSON.parse(JSON.stringify(this.appBaseOrgData));
        if (this.$refs.appletBaseDetail) {
          this.$refs.appletBaseDetail.setFormData(tempData);
        }
        this.appContentData = this.appContentOrgData;
        console.log(this.appContentData);
        this.appContentFooterData.footerType = tempData.footerType;
        this.appContentFooterData.footerUrl = tempData.footerUrl;
        this.appContentFooterData.footer = tempData.footer;
        this.getFooterType(this.appContentFooterData.footerType);
        this.appletBaseEdit = false;
        this.contentIconsEdit = false;
        this.iconsEdit = true;
        this.premissionIconsEdit = false;
        this.tableOperVif = false;

      }
    },
    //设置磁贴标签的方法
    setOptions(val) {
      if(Array.isArray(val) && val.length > 0) {
        for (var i = 0; i < val.length; i++) {
          val[i].label = val[i].name;
          val[i].value = val[i].code;
        }
      }
    },
    //获取磁贴标签的信息
    loadLabels() {
      var url = "/wbalone/apptype/listByGroup";
      // var group;
      this.$http({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
      }).then((res) => {
        if (res.data.status === 1) {
          if(Array.isArray(res.data.data) && res.data.data.length>0) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].label = res.data.data[i].name;
              res.data.data[i].value = res.data.data[i].code;
            }
          }
          this.typeOptions = res.data.data;
          this.setOptions(this.typeOptions);
        }
      }).catch(() => {
        this.$message({
          message: '标签信息获取失败',
          type: 'error'
        });
      });
    },
    getAllData(){
      var formData = this.$refs.appletBaseDetail ? this.$refs.appletBaseDetail.getFormData() : {};
      if(Array.isArray(this.appContentData) && this.appContentData.length) {
        for (let i = 0; i < this.appContentData.length; i++) {
          this.appContentData[i].pk = i;
        }
        console.log('syteee',this.appContentData);
      }
      var a =  {
        ...formData,
        contents: this.appContentData,
        footer: this.appContentFooterData.footer,
        footerType: this.appContentFooterData.footerType,
        footerUrl: this.appContentFooterData.footerUrl
      }
      this.allData = a;
    },
    changeFun(){
      if(this.changeTimeout)
        clearTimeout(this.changeTimeout);
      this.changeTimeout = setTimeout(()=>{
        this.getAllData();
      },100)
    },
    appEditAll() {
      this.iconsEdit = false;
      this.appletBaseEdit = true;
      this.contentIconsEdit = true;
      this.premissionIconsEdit = true;
      this.tableOperVif = true;
    }
  },
  watch: {
    appContentData(val) {
      if(this.changeTimeout)
        clearTimeout(this.changeTimeout);
      this.changeTimeout = setTimeout(()=>{
        this.getAllData();
      },100)
    },
    appContentFooterData:{
      deep: true,
      handler(val) {
        if(this.changeTimeout)
          clearTimeout(this.changeTimeout);
        this.changeTimeout = setTimeout(()=>{
          this.getAllData();
        },100)
      }
    }
  },
  computed: {
    appletIcons() {
      let vm = this;
      let baseIcons = [{
        icon: "edit",
        show: vm.iconsEdit,
        click: function() {
          vm.iconsEdit = false;
          vm.appletBaseEdit = !vm.appletBaseEdit;
          vm.contentIconsEdit = true;
        }
      }];
      return baseIcons;
    },
    appSubIcons() {
      let vm = this;
      let subIcons = [{
        icon: "plus",
        show: vm.premissionIconsEdit,
        click: function() {
          vm.appPreEditable = true;
          vm.$refs.appletPremisson.getTableComp().closeExpandRow();
          // 重置新增数据
          vm.$refs.appletPremisson.resetFormData();
          // 显示新增区域
          vm.$refs.appletPremisson.formShow = true;
          // this.isAppSubFormEdit = true;
        }
      }];
      return subIcons;
    }
  },
  mounted() {

  },
  created() {
    this.loadDetailList();
    this.isShowPremisson = false;
    this.appletDetailUploadImg = '/wbalone/appMGT/iconDownload?avatar=';
    this.loadLabels();
  }
}
</script>

<style>
.applet-icon-content-upload {
  display: inline-block;
}
.cancelBackground {
  position: absolute;
  margin-left: 16px;
}
.appSubOpro{
  float: right;
  margin-bottom: 16px;
  /* overflow: hidden; */
}
.appContentTable {
 clear: both;
 margin-top: 16px;
}
#applet-base-footer {
  /* margin-bottom: 176px; */
}
.applet-footer {
  height: auto !important;
}
.appletManageDetailTile {
  position: fixed !important;
  bottom: 0;
  left: 0;
  z-index: 2000 !important;
}
#appSubTable {
  clear: both;
}
#appPerssion {
  margin-bottom: 176px;
}
.el-table__body tr.hover-row>td .el-table-operate-icon.applet-dsds-icon{
  display: inline-block;
}
.applet-manage-content {
  margin-top: 16px;
}
.appContentTable .el-table .hover-row  td.table-operate-column  .cell {
  margin-right: 8px;
}


</style>
