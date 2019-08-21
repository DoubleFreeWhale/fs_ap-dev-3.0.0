<template>
  <div class="yon-uitemplate">
    <div class="yon-title" v-if="!hideTitle">{{forms.name?forms.name:forms.title}}</div>
    <yon-grid
      @trigger="eventHandle"
      :data="formLayout[0]"
      :templateValue="templateValue"
      :rules="mergedRules"
      :showButton="showButton"
      :showType="showType"
      :showBorder="showBorder"
      :sortable="sortable"
      :indexLabel="indexLabel"
      :gridStyle="gridStyle"
      :tableStyle="tableStyle"
      :expand="expand"
      :defaultExpandAll="defaultExpandAll"
      :expandRowKeys="expandRowKeys"
      :rowKey="rowKey"
      :isEdit="isEdit"
      :imgUrl="imgUrl"
      :elcolumn-style="elcolumnStyle"
      :hoverShowButton="hoverShowButton"
      v-if="isGrid"
      :highlight-current-row="highlightCurrentRow"
    >
      <div slot="gridForm">
        <slot name="tableRowForm"></slot>
      </div>
    </yon-grid>
    <yon-form
      @trigger="eventHandle"
      v-if="forms!='' && !isGrid"
      :isEdit="isEdit"
      :data="formLayout"
      ref="form"
      :refQueryParams="refQueryParams"
      :refBeforeQuery="refBeforeQuery"
      :templateValue="templateValue"
      :rules="mergedRules"></yon-form>
  </div>
</template>
<script>
  import form from './Form';
  import grid from './grid';
  // import testjson from './testGrid';
  /* eslint-disable no-new */
  export default{
    name: 'ElTemplate',
    data() {
      return {
        forms: '',
        formLayout: '',
        isGrid: false,
        mergedRules: {}
      };
    },
    methods: {
      request() {
        if (this.tplCode) {
          this.$http({
            url: '/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplateByCode',
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: this.geturlencode(this.tplCode)
          }).then((res) => {
            this.data = res.data;
            this.formLayout = this.parseColumnPanel(this.data);
            this.forms = this.data.form ? this.data.form : this.data;
            this.handleNoValue(this.formLayout);
            this.handleRules(this.formLayout);
          }).catch((res) => {
            this.$message({
              showClose: true,
              message: 'UI模板获取结构数据失败',
              type: 'error'
            });
            // this.data = testjson;
            // this.formLayout = this.parseColumnPanel(this.data);
            // this.forms = this.data.form ? this.data.form : this.data;
            // this.handleNoValue(this.formLayout);
          });
        } else if (this.pkTemp) {
          this.$http({
            url: '/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/' +
            'queryTemplate?' + this.geturlencode({pk_temp: this.pkTemp}),
            method: 'get',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          }).then((res) => {
            this.data = res.data;
            this.formLayout = this.parseColumnPanel(this.data);
            this.forms = this.data.form ? this.data.form : this.data;
            this.handleNoValue(this.formLayout);
            this.handleRules(this.formLayout);
          }).catch((res) => {
            this.$message({
              showClose: true,
              message: 'UI模板获取结构数据失败',
              type: 'error'
            });
            // this.data = testjson;
            // this.formLayout = this.parseColumnPanel(this.data);
            // this.forms = this.data.form ? this.data.form : this.data;
            // this.handleNoValue(this.formLayout);
          });
        } else if (this.funnode && this.nexuskey) {
          var d = {
            funnode: this.funnode,
            nexusKey: this.nexuskey
          };
          this.$http({
            url: "/wbalone/ieoproleuitemplate/listByFunNodeAndNexusKey",
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            data: JSON.stringify(d)
          })
            .then(res => {
              this.data = res.data;
              this.formLayout = this.parseColumnPanel(this.data);
              this.forms = this.data.form ? this.data.form : this.data;
              this.handleNoValue(this.formLayout);
              this.handleRules(this.formLayout);
            })
            .catch(res => {
              console.log("err:" + res.message);
              this.$message({
                showClose: true,
                message: 'UI模板获取结构数据失败',
                type: 'error'
              });
            });
      } else {
          var structureWatcher = this.$watch(function() {
            return this.structureData;
          }, function() {
            this.formLayout = this.parseColumnPanel(this.structureData);
            this.forms = this.structureData.form ? this.structureData.form : this.structureData;
            this.handleNoValue(this.formLayout);
            this.handleRules(this.formLayout);
            structureWatcher();
          });
          if (this.structureData) {
            this.formLayout = this.parseColumnPanel(this.structureData);
            this.forms = this.structureData.form ? this.structureData.form : this.structureData;
            this.handleNoValue(this.formLayout);
            this.handleRules(this.formLayout);
            structureWatcher();
          }
        }
      },
      geturlencode(data) {
        var tmp = Object.keys(data);
        tmp.forEach((v, i) => {
          tmp[i] = v + '=' + data[v];
        });
        return tmp.join('&');
      },
      handleNoValue(nodes) {
        if (!this.templateValue) {
          var childs = [];
          var getAll = function(array) {
            if (array instanceof Array) {
              array.forEach((node) => {
                childs.push(node);
                if (node.layoutDetail) {
                  getAll(node.layoutDetail);
                }
              });
            }
          };
          getAll(nodes);
          childs = childs.filter((node) => {
            return ['Select', 'CheckBox', 'Email', 'Phone', 'Mobile', 'Text', 'Money', 'NumberComponent', 'TextArea', 'DateComponent', 'Reference', 'Grid'].indexOf(node.componentKey) > -1 && node.itemCode;
          });
          var tmpObj = {};
          childs.forEach((node) => {
            var code = node.itemCode.split('.').pop();
            tmpObj[code] = null;
            // this.templateValue[code] = null;
          });
          this.$emit('setEmptyKeys', tmpObj);
        }
      },
      parseColumnPanel(data) {
        var compts = [];
        var row = [];
        var layoutDetail;
        if (data.formLayout) {
          layoutDetail = data.formLayout.layoutDetail.layoutDetail;
        } else {
          layoutDetail = data.layoutDetail;
        }
        if (layoutDetail.length === 1 && ['Grid', 'Table', 'DataTable'].indexOf(layoutDetail[0].componentKey) > -1) {
          this.isGrid = true;
          return [layoutDetail[0]];
        }
        for (var i = 0;i < layoutDetail.length;i++) {
          if (layoutDetail[i].componentKey !== 'ColumnPanel') {
            row.push(layoutDetail[i]);
          } else {
            for (var j = 0;j < layoutDetail[i].layoutDetail.length;j++) {
              var tmp = layoutDetail[i].layoutDetail[j];
              while (tmp && (tmp.componentKey === 'ColumnPanel')) {
                tmp = tmp.layoutDetail[0];
              }
              if (tmp) {
                row.push(tmp);
              }
            }
          }
          var size = layoutDetail[i].size;
          compts.push({layoutDetail: row, size: size});
          row = [];
        }
        // force the cols count of last row as same as others
        if (!this.autoMergeCol) {
          var cols = compts[0].layoutDetail.length;
          compts.forEach((arr) => {
            arr.layoutDetail.forEach((component) => {
              component.colCountForDisplay = cols;
            });
          });
        }
        return compts;
      },
      handleRules(formLayout) {
        if (!this.rules) {
          this.mergedRules = this.getDefaultRules(formLayout, {
            hasRequire: false,
            hasPattern: false
          });
        } else { // do merge, check default rules first, then rules in props, someone need to edit template if they don't need default rules.
          var flag = this.getRulesFlag(this.rules);
          var rules = this.getDefaultRules(formLayout, flag);
          Object.keys(this.rules).forEach((key) => {
            if (Object.prototype.toString.call(rules[key]) === '[object Array]') {
              rules[key] = rules[key].concat(this.rules[key]); // defaultRules first
            } else {
              rules[key] = this.rules[key];
            }
          });
          this.mergedRules = rules;
        }
      },
      getDefaultRules(formLayout, flag) {
        if (flag.hasPattern && flag.hasRequire) {
          return {};
        }
        var typesWithRules = ['Money', 'Phone', 'Email', 'Mobile', 'NumberComponent', 'Text'];
        var rules = {};
        var component;
        var itemCode;
        var isTypesWithRules;
        var insertRule;
        var typesTriggerBlur = ['Text', 'TextArea', 'Money', 'Phone', 'Email', 'Mobile', 'NumberComponent'];
        for (var i = 0; i < formLayout.length; i++) {
          for (var j = 0; j < formLayout[i].layoutDetail.length; j++) {
            component = formLayout[i].layoutDetail[j];
            isTypesWithRules = typesWithRules.indexOf(component.componentKey) > -1;
            if ((isTypesWithRules || component.required) && component.isDisplay) {
              itemCode = component.itemCode.split('.').pop();
              if (component.required && (!flag[itemCode] || !flag[itemCode].hasRequire)) {
                var ruleMessage = component.title + '不能为空';
                if(component.componentKey === 'Reference'){
                  ruleMessage = '没有匹配到' + component.title;
                }
                insertRule = {
                  type: component.componentKey === 'DateComponent' ? 'number' : 'string',
                  required: true,
                  message: ruleMessage,
                  trigger: typesTriggerBlur.indexOf(component.componentKey) > -1 ? 'blur' : 'change'
                };
                rules[itemCode] ? rules[itemCode].push(insertRule) : rules[itemCode] = [insertRule];
              }
              if (isTypesWithRules && (!flag[itemCode] || !flag[itemCode].hasPattern)) {
                var pattern = null;
                var isIdentity = false;
                switch (component.componentKey) {
                  case 'Money':
                  case 'NumberComponent':
                    pattern = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
                    break;
                  case 'Phone':
                    pattern = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
                    break;
                  case 'Mobile':
                    pattern = /^1[34578]\d{9}$/;
                    break;
                  case 'Email':
                    pattern = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                    break;
                  case 'Text':
                    if(component.isIdentity === true) {
                      isIdentity = true;
                    }
                    break;
                  default:
                    break;
                }
                insertRule = {
                  pattern: pattern,
                  message: component.title + '格式错误',
                  trigger: 'blur'
                };
                if(isIdentity) {
                  insertRule.validator = function (rule, code, callback) {
                        var city = {
                          11: "北京",
                          12: "天津",
                          13: "河北",
                          14: "山西",
                          15: "内蒙古",
                          21: "辽宁",
                          22: "吉林",
                          23: "黑龙江 ",
                          31: "上海",
                          32: "江苏",
                          33: "浙江",
                          34: "安徽",
                          35: "福建",
                          36: "江西",
                          37: "山东",
                          41: "河南",
                          42: "湖北 ",
                          43: "湖南",
                          44: "广东",
                          45: "广西",
                          46: "海南",
                          50: "重庆",
                          51: "四川",
                          52: "贵州",
                          53: "云南",
                          54: "西藏 ",
                          61: "陕西",
                          62: "甘肃",
                          63: "青海",
                          64: "宁夏",
                          65: "新疆",
                          71: "台湾",
                          81: "香港",
                          82: "澳门",
                          91: "国外 "
                        };
                        var tip = "";
                        var pass = true;

                        if (!code || !/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(code)) {
                          tip = "身份证号格式错误";
                          pass = false;
                        } else if (!city[code.substr(0, 2)]) {
                          tip = "地址编码错误";
                          pass = false;
                        } else {
                          //18位身份证需要验证最后一位校验位
                          if (code.length == 18) {
                            code = code.split('');
                            //∑(ai×Wi)(mod 11)
                            //加权因子
                            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                            //校验位
                            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                            var sum = 0;
                            var ai = 0;
                            var wi = 0;
                            for (var i = 0; i < 17; i++) {
                              ai = code[i];
                              wi = factor[i];
                              sum += ai * wi;
                            }
                            var last = parity[sum % 11];
                            if (parity[sum % 11] != code[17]) {
                              tip = "校验位错误";
                              pass = false;
                            }
                          }
                        }
                        if (!pass) {
                          console.log("身份证类型校验未通过，原因：" + tip);
                        };
                        if(pass) {
                          callback();
                        } else {
                          callback(Error(component.title + '格式错误'));
                        }
                      };
                }
                rules[itemCode] ? rules[itemCode].push(insertRule) : rules[itemCode] = [insertRule];
              }
            }
          }
        }
        return rules;
      },
      getRulesFlag(rules) {
        var hasRequire;
        var hasPattern;
        var flag = {};
        if (Object.prototype.toString.call(rules) === '[object Object]') {
          Object.keys(rules).forEach((key) => {
            hasRequire = false;
            hasPattern = false;
            for (var i = 0; i < rules[key].length; i++) {
              if (rules[key][i].required) {
                hasRequire = true;
              }
              if (rules[key][i].pattern) {
                hasPattern = true;
              }
              if (hasRequire && hasPattern) {
                break;
              }
            }
            flag[key] = {
              hasRequire: hasRequire,
              hasPattern: hasPattern
            };
          });

        }
        return flag;
      },
      //  setValue: function(data) {
      //    this.templateValue = data;
      //  },
      // getValue: function() {
      //   return JSON.parse(JSON.stringify(this.templateValue));
      // },
      eventHandle(event, data) {
        this.$emit(event, data);
        // this.templateValue[index] = value;
      },
      validate(cb) {
        this.$children[0].$refs.form.validate.call('', cb);
      },
      validateField() {
        this.$children[0].$refs.form.validateField.apply('', arguments);
      },
      resetFields() {
        this.$children[0].$refs.form.resetFields.call();
      }
    },
    created() {
  
      this.request();
      // var data = this.data;
      // var data = testData;
    },
    components: {
      'yon-form': form,
      'yon-grid': grid
    },
    props: [
      'tplCode',
      'isEdit',
      'pkTemp',
      'rules',
      'structureData',
      'hideTitle',
      'refQueryParams',
      'refBeforeQuery',
      'templateValue',
      'showButton',
      'showType',
      'showBorder',
      'align',
      'sortable',
      'indexLabel',
      'headerAlign',
      'gridStyle',
      'tableStyle',
      'expand',
      'defaultExpandAll',
      'expandRowKeys',
      'rowKey',
      'imgUrl',
      'autoMergeCol',
      'hoverShowButton',
      'elcolumnStyle',
      'highlightCurrentRow',
      'funnode',
      'nexuskey'
    ]
  };
</script>

