<template>
    <div class='ref-container'>
        <el-autocomplete
                placeholder=""
                v-model="value"
                v-show="true"
                icon="pt-fenlei1"
                size="small"
                :disabled="data.readOnly"
                v-bind:style="{width:data.width,display:'inline-block'}"
                :id="data.fieldId"
                :width="data.width"
                v-if="isEdit"
                :on-icon-click="showDialog"
                :fetch-suggestions="getSuggestions"
                @select="onSelectData"
                @input="handleChange"
        >
        <template v-if="selected.length > 0" slot="prepend">
          <el-button @click="reset">清空</el-button>
        </template>
        </el-autocomplete>
        <div
          class="tpl-label"
          v-else>
          <tooltip :content="value"></tooltip>
        </div>
        <refDialog
                @onSelectData="onSelectData"
                :data="data"
                :templateValue="templateValue"
                :dialogVisible="dialogVisible"
                :refInfo="refInfo"
                :savedSelected="selected"
                :refData="refData"
                label="label"
                tableDc="/table.json"></refDialog>
    </div>
</template>
<script>
/* eslint-disable */
  import refDialog from './ref';
  import tooltip from './toolTip.vue';
  import Clickoutside from 'ifbp-element/src/utils/clickoutside';
  export default {
    data() {
      return {
        refData: '',
        value: '',
        selected: [],
        refInfo: '',
        code: '',
        dialogVisible: false,
        timeid: false,
        infoPromise: false
      };
    },
    props: ['data', 'templateValue', 'isEdit', 'refQueryParams', 'refBeforeQuery'],
    directives: {
      Clickoutside
    },
    components: {
      refDialog,
      tooltip
    },
    methods: {
      init() {
        if (this.templateValue[this.code] !== null) {
          var tail = '_ref';
          if (this.templateValue.beanMap) {
            var data = this.templateValue.beanMap[this.code + tail];
            if(Object.prototype.toString.call(data) === '[object Object]') {
              Object.keys(data).forEach((key) => {
                this.selected.push(data[key]);
                this.value = this.value + ',' + data[key].name;
              });
              this.value = this.value.substr(1);
            }
          }
        }
                // this.infoPromise.then(() => {
                //   if (this.valueWatcher) {
                //     this.valueWatcher();
                //   }
                //   if (this.templateValue[this.code]) {
                //     var refUrl = this.refInfo.refModelUrl;
                //     var refParam = refUrl.split('/');
                //     if (refUrl[refUrl.length - 1] === '/') {
                //       refParam = refParam[refParam.length - 2];
                //     } else {
                //       refParam = refParam[refParam.length - 1];
                //     }
                //     var tmp = this.templateValue[this.code].split(',');
                //     this.$http({
                //       url: '/wbalone/' + refParam + '/matchPKRefJSON',
                //       method: 'post',
                //       data: {pk_val: tmp}
                //     }).then((res) => {
                //       var tmp = '';
                //       this.selected = res.data;
                //       this.selected.forEach((v) => {
                //         tmp = tmp + ',' + v.refname;
                //       });
                //       this.value = tmp.substr(1);
                //     });
                //   }
                // });
      },
      reset() {
        if (!this.data.readOnly) {
          this.value = '';
          this.selected = [];
          this.templateValue[this.code] = '';
        }
      },
      handleChange(value) {
        if (value === '') {
          this.reset();
        }
      },
      onSelectData(data) {
        console.log(data);
        this.value = '';
        var name;
        if (Object.prototype.toString.call(data) === '[object Array]') {
          this.selected = data;
          data.forEach((v) => {
            name = v.refname ? v.refname : v.name;
            this.value = this.value + ',' + name;
          });
          this.value = this.value.substr(1);
        } else {
          this.selected = [data];
          this.value = data.refname ? data.refname : data.name;
        }
        var temp = '';
        this.selected.forEach((v) => {
          temp = temp + ',' + v.id;
        });
        temp = temp.substr(1);
        this.templateValue[this.code] = temp;
        console.log(this.selected);
        var payload = {
          key: this.code,
          value: this.selected
        };
        this.$emit('trigger', 'change', payload);
      },
      showDialog: function() {
        if (!this.data.readOnly) {
          this.request();
        }
                /* this.dialogVisible=false;
                 this.$nextTick(() => {
                 this.dialogVisible=true;
                 });*/
      },
      getSuggestions(searchStr, callback) {
        if(this.refBeforeQuery){
          var result = this.refBeforeQuery.call(this);
          if(!result){
            callback([])
            return;
          }
        }
        var tmp = function() {
          this.querySearch(searchStr, callback);
          this.timeid = false;
        }.bind(this);
        if (!this.timeid) {
          this.timeid = setTimeout(tmp, 300);
        } else {
          clearTimeout(this.timeid);
          this.timeid = setTimeout(tmp, 300);
        }
      },
      querySearch(searchStr, callback) {
        var params;
        if (this.templateValue['base_doc_type'] && this.code === 'pk_base_doc') {
          params = 'content=' + encodeURIComponent(searchStr) + '&refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl) + '&condition=' + encodeURIComponent(this.templateValue['base_doc_type']);
        } else if (this.templateValue['pk_org'] && this.code === 'pk_dept') {
          params = 'content=' + encodeURIComponent(searchStr) + '&refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl) + '&condition=' + encodeURIComponent(this.templateValue['pk_org']);
        }else {
          params = 'content=' + encodeURIComponent(searchStr) + '&refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl);
        }

        let requestData = {
        content: searchStr,
        refModelUrl: this.refInfo.refModelUrl
      };
      if (this.urlParamsParams && JSON.stringify(this.urlParamsParams) !== '{}') {
        requestData.transmitParam = JSON.stringify(this.urlParamsParams);
      }
      if (this.templateValue && this.templateValue['base_doc_type']) {
        requestData.condition = this.templateValue['base_doc_type'];
      }
        this.$http({
          url: '/uitemplate_web/iref_ctr/filterRefJSON',
          headers: {
          'Content-Type': 'application/json'
        },
          method: 'post',
          data:requestData
          // data: params + this.urlParams
        }).then((res) => {
          var segs;
          if (res.data && ({}).toString.call(res.data.data) === '[object Array]') {
            segs = res.data.data;
            for (var i = 0; i < segs.length; i++) {
              segs[i].value = segs[i].refname;
            }
          } else {
            segs = [{value: '无可用数据！'}];
          }
          callback(segs);
        });
      },
      requestInfo() {
        var url = '/uitemplate_web/iref_ctr/refInfo/?refCode=' + this.data.contMeta.refcode;
                /* eslint-disable no-undef */
        this.infoPromise = new Promise((res) => {
                    /* eslint-enable no-undef */
          var getRefType = this.$http({
            url: url + this.urlParams,
            method: 'get'
          });
          getRefType.then((refInfo) => {
            this.refInfo = refInfo.data;
            res();
          });
        });
      },
      request() {
        if(this.refBeforeQuery){
          var result = this.refBeforeQuery.call(this);
          if(!result){
            return;
          }
        }
        
        var getRef;

        let requestData = {
        refModelUrl: this.refInfo.refModelUrl
      };
      // code为dept的参照需要额外传值
      if (this.refInfo.refCode === 'dept') {
        var tmp = location.hash.split('?')[1];
        var dept_org = tmp ? tmp.split('=')[1] : '';
        requestData.pk_org = dept_org;
      }
      if (this.templateValue['base_doc_type']) {
        requestData.condition = this.templateValue['base_doc_type'];
      }
      if (this.urlParamsParams && JSON.stringify(this.urlParamsParams) !== '{}') {
        requestData.transmitParam = JSON.stringify(this.urlParamsParams);
      }
      // 分页
      if (this.refInfo.refUIType === 'RefGrid') {
        let pageInfo = {
          pageSize: 10,
          currPageIndex: 0
        };
        requestData.refClientPageInfo = pageInfo;
      }

                // code为dept的参照需要额外传值
        if (this.refInfo.refCode === 'dept') {
          var tmp = location.hash.split('?')[1];
          var dept_org = tmp ? tmp.split('=')[1] : '';
          var params;
          if (this.code === 'pk_dept') {
            params = 'refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl) + '&condition=' + encodeURIComponent(this.templateValue['pk_org']);
          } else {
            params = 'refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl) + '&pk_org=' + encodeURIComponent(dept_org);
          }
          getRef = this.$http({
            url: '/uitemplate_web/iref_ctr/commonRefsearch',
            method: 'post',
            // data: params + this.urlParams,
            data: requestData,
            headers: {
          'Content-Type': 'application/json'
        }
          });
        } else {
          var refGridTreeData;
          var data;
          if (this.templateValue['base_doc_type'] && this.code === 'pk_base_doc') {
                        // 参照为关联身份时候的额外传值
            refGridTreeData = 'refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl) + '&condition=' + encodeURIComponent(this.templateValue['base_doc_type']);
            data = 'refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl) + '&condition=' + encodeURIComponent(this.templateValue['base_doc_type']);
          } else if (this.templateValue['pk_org'] && this.code === 'pk_dept') {
            refGridTreeData = 'refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl) + '&condition=' + encodeURIComponent(this.templateValue['pk_org']);
            data = 'refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl) + '&condition=' + encodeURIComponent(this.templateValue['pk_org']);
          }else {
            refGridTreeData = 'refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl);
            data = 'refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl);
          }
          if (this.refInfo.refUIType === 'RefGridTree') {
            getRef = this.$http({
              url: '/uitemplate_web/iref_ctr/blobRefClassSearch',
              method: 'post',
              data: refGridTreeData + this.urlParams,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            });
          } else {
            getRef = this.$http({
              url: '/uitemplate_web/iref_ctr/commonRefsearch',
              method: 'post',
              // data: data + this.urlParams,
              data: requestData,
              headers: {
          'Content-Type': 'application/json'
        }
            });
          }
        }
        getRef.then((ref) => {
          ref.data.data = this.getRefData(ref.data.data);
          this.refData = ref.data;
          this.dialogVisible = true;
        });
      },
      getRefData(data) {
        var refData;
        if (['RefTree', 'RefGridTree'].indexOf(this.refInfo.refUIType) > -1) {
          var map = {};
          var ids = [];
          var root = [];
          data.forEach((v) => {
            ids.push(v.id);
          });
          data.forEach((v) => {
            if (ids.indexOf(v.pid) > -1) {
              if (map[v.pid]) {
                map[v.pid].push(v);
              } else {
                map[v.pid] = [v];
              }
            } else {
              root.push(v);
            }
          });
          var setChild = function(node) {
            var tmp = node;
            if (map[tmp.id]) {
              tmp.children = map[tmp.id];
              tmp.children.forEach((v) => {
                setChild(v);
              });
            }
          };
          root.forEach((v) => {
            setChild(v);
          });
          refData = root;
        } else {
          refData = data;
        }
        return refData;
      },
      changeRefQueryParams(refQueryParams){
        this.refQueryParams = refQueryParams;
        this.urlParams = '';
        this.urlParamsParams = '';
        if(this.refQueryParams &&  this.refQueryParams instanceof Array &&  this.refQueryParams.length > 0){
          for(var i = 0; i < this.refQueryParams.length; i++){
            var nowQueryParams = this.refQueryParams[i];
            var itemCode = nowQueryParams.itemCode;
            if(itemCode === this.data.itemCode){
              this.urlParams += '&transmitParam=' + encodeURIComponent(JSON.stringify(this.refQueryParams[i].params));
              this.urlParamsParams = this.refQueryParams[i].params;
              break;
            }
          }
        }
      }
    },

    created: function() {
      this.code = this.data.itemCode ? this.data.itemCode.split('.').pop() : '';
      this.urlParams = '';
      this.urlParamsParams = '';
      if(this.refQueryParams &&  this.refQueryParams instanceof Array &&  this.refQueryParams.length > 0){
        for(var i = 0; i < this.refQueryParams.length; i++){
          var nowQueryParams = this.refQueryParams[i];
          var itemCode = nowQueryParams.itemCode;
          if(itemCode === this.data.itemCode){
            this.urlParams += '&transmitParam=' + encodeURIComponent(JSON.stringify(this.refQueryParams[i].params));
            this.urlParamsParams = this.refQueryParams[i].params;
            break;
          }
        }
      }
      this.valueWatcher = this.$watch(function() {
        return this.templateValue;
      },
                function() {
                  if (this.templateValue && this.templateValue[this.code] !== null) {
                    this.init();
                    this.valueWatcher();
                  }
                }.bind(this), {deep: true});
      if (this.templateValue && this.templateValue[this.code] !== null) {
        this.init();
        this.valueWatcher();
      }
      this.$on('closeDialog', () => {
        this.dialogVisible = false;
      });
      this.requestInfo();
    }
        // props:['data']
  };
  /* eslint-enable */
</script>

<style>
    /*.ref-container .el-dialog__body{
      height:380px;
    }
    .ref-container .el-tree>.el-tree-node>.el-tree-node__children{
      height: 271px;
      overflow: auto;
    }
    .ref-container .el-tree,.ref-container .el-tree>.el-tree-node.is-expanded{
      height: 308px;
      overflow: hidden;
    }*/
    .ref-container .el-tree > .el-tree-node > .el-tree-node__children {
    }

    .ref-container .el-tree > .el-tree-node.is-expanded {
        overflow: hidden;
    }

    /* .ref-container .el-tree {
        overflow: auto;
        height: 308px;
    } */

    .ref-container .el-dialog__body {
        height: 380px;
        box-sizing: content-box;
    }

    .yon-form .ref-dialog .el-input {
        width: 100%;
    }

    .yon-form .ref-dialog .el-input__inner {
        width: 100%;
    }
</style>
