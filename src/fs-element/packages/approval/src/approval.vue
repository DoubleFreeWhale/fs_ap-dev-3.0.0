<template>
  <el-tabs v-model="activeTab" @click="clickTab" @tab-remove="removeTab">
    <el-tab-pane label="审批面板" name="panel">
      <el-steps :active="active" :space="space" :style="stepbarStyle" v-if="steps.length > 0">
        <el-step v-for="(step,index) in steps"
                 :key="step.title+index"
         :title="step.title"
         :description="step.description"
         :icon="step.icon">
        </el-step>
      </el-steps>
      <el-dialog
        :title="mergedDialog[currentAction].title"
        :visible.sync="dialogVisible"
        size="tiny"
        :before-close="handleClose">
        <label :style="mergedDialog[currentAction].style"
        v-if="mergedDialog[currentAction].message.length > 0"
        >{{mergedDialog[currentAction].message}}</label>
        <el-form :model="normalForm" ref="normal" v-if="showChooser[currentAction]&&formLive&&currentAction !== 'reject'" :rules="normalFormRules">
          <el-form-item
          label="人员"
          prop="people">
            <el-select
              v-model="normalForm.people"
              filterable
              placeholder="请选择">
              <el-option
                v-for="item in personList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form :model="rejectForm" v-if="formLive&&currentAction === 'reject'" ref="reject" :rules="rejectFormRules">
          <el-form-item
          prop="rejectTo">
            <el-radio-group @chang111e="actionChange" v-model="rejectForm.rejectTo">
              <el-radio label="直接驳回">直接驳回</el-radio>
              <el-radio label="节点">节点</el-radio>
              <el-radio label="人员">人员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
          prop="person"
          v-if="'人员' === rejectForm.rejectTo">
            <el-select
              v-model="rejectForm.person"
              filterable
              placeholder="请选择">
              <el-option
                v-for="item in personList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
          prop="node"
          v-if="'节点' === rejectForm.rejectTo">
            <el-select
              v-model="rejectForm.node"
              filterable
              placeholder="请选择">
              <el-option
                v-for="item in nodeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="toCC">
            <el-checkbox v-model="rejectForm.toCC">抄送</el-checkbox>
          </el-form-item>
          <el-form-item
          prop="toCC"
          v-if="rejectForm.toCC">
            <el-select
              v-model="rejectForm.ccList"
              filterable
              multiple
              placeholder="请选择">
              <el-option
                v-for="item in toCcList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>
      <div class='header' :style="headerStyle">
        <el-input
          type="textarea"
          v-model="opinion"
          :resize="'none'"
          :style="opinionStyle"
          :placeholder="opinionHolder">
        </el-input>
        <el-button
        class="action"
        v-for="(button,index) in buttons"
        :key="button.label+index"
        :type="button.type"
        @click="clickButton(button.name)">{{button.label}}</el-button>

      </div>
      <div class='content'><slot name="content"></slot></div>
    </el-tab-pane>
    <el-tab-pane label="审批历史" name="history">
      <el-table :data="history">
        <el-table-column
          v-for="(col,index) in columns"
          :key="col.label+index"
          :label="col.label"
          :prop="col.prop"
          :sortable="col.sortable"
          :min-width="col.width"
        >
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane v-if="extraTabs.length > 0" v-for="(tab,index) in extraTabs"
                 :key="tab.label+index"
      :label="tab.label"
      :name="tab.name"
      :closable="tab.closable"
      :disabled="tab.disabled"
      >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    name: 'ElApproval',
    data() {
      return {
        opinion: '',
        active: 0,
        activeTab: 'panel',
        extraTabs: [],
        // extraTabs: [{
        //   label: '123',
        //   name: '123',
        //   closable: true
        // }],,
        dialogVisible: false,
        formLive: false,
        currentAction: 'approval',
        normalForm: {
          people: ''
        },
        normalFormRules: {
          people: [{
            required: true,
            message: '请选择人员',
            trigger: 'change'
          }]},
        rejectForm: {
          rejectTo: '直接驳回',
          person: '',
          node: '',
          toCC: false,
          ccList: []
        },
        rejectFormRules: {
          person: [{
            required: true,
            message: '请选择人员',
            trigger: 'change'
          }],
          node: [{
            required: true,
            message: '请选择节点',
            trigger: 'change'
          }]
        },
        defaultDialogConf: {
          approval: {
            title: '批准',
            message: '',
            style: {}
          },
          reject: {
            title: '驳回',
            message: '',
            style: {}
          },
          'extra-endorse': {
            title: '加签',
            message: '',
            style: {}
          },
          'counter-sign': {
            title: '会签',
            message: '',
            style: {}
          },
          assign: {
            title: '改派',
            message: '',
            style: {}
          }
        },
        defaultButton: {
          approval: {
            name: 'approval',
            type: 'success',
            label: '批准',
            showChooser: false
          },
          reject: {
            name: 'reject',
            type: 'danger',
            label: '驳回'
          },
          'extra-endorse': {
            name: 'extra-endorse',
            type: 'info',
            label: '加签',
            showChooser: true
          },
          'counter-sign': {
            name: 'counter-sign',
            type: 'info',
            label: '会签',
            showChooser: true
          },
          assign: {
            name: 'assign',
            type: 'info',
            label: '改派',
            showChooser: true
          }
        }
      };
    },
    props: {
      approvalText: {
        type: String,
        default: '批准',
        required: false
      },
      rejectText: {
        type: String,
        default: '驳回',
        required: false
      },
      personList: {
        type: Array,
        default: function() {
          return [];
        },
        required: false
      },
      nodeList: {
        type: Array,
        default: function() {
          return [];
        },
        required: false
      },
      toCcList: {
        type: Array,
        default: function() {
          return [];
        },
        required: false
      },
      steps: {
        type: Array,
        default: function() {
          return [];
        },
        required: false
      },
      currentStep: {
        type: Object,
        default: function() {
          return {};
        },
        required: false
      },
      dialogConf: {
        type: Object,
        default: function() {
          return {};
        },
        required: false
      },
      opinionHolder: {
        type: String,
        default: '请输入审批意见',
        required: false
      },
      columns: {
        type: Array,
        default: function() {
          return [{
            label: '发送人',
            prop: 'creator',
            sortable: false,
            width: 90
          }, {
            label: '发送时间',
            prop: 'createTime',
            sortable: false,
            width: 90
          }, {
            label: '审批人',
            prop: 'name',
            sortable: false,
            width: 90
          }, {
            label: '审批时间',
            prop: 'updateTime',
            sortable: false,
            width: 90
          }, {
            label: '是否审批',
            prop: 'isApproved',
            sortable: false,
            width: 90
          }, {
            label: '批语',
            prop: 'word',
            sortable: false,
            width: 90
          }, {
            label: '消息内容',
            prop: 'content',
            sortable: false,
            width: 200
          }];
        },
        required: false
      },
      history: {
        type: Array,
        default: function() {
          return [];
        },
        required: false
      },
      approvalStyle: {
        type: Object,
        default: function() {
          return {
            width: '80px',
            'margin-left': '10px',
            color: '#fff',
            'background-color': '#20a0ff',
            'border-color': '#20a0ff'
          };
        },
        required: false
      },
      rejectStyle: {
        type: Object,
        default: function() {
          return {
            width: '80px',
            'margin-left': '10px'
          };
        },
        required: false
      },
      opinionStyle: {
        type: Object,
        default: function() {
          return {
            width: '200px',
            'vertical-align': 'middle',
            'margin-left': 'calc(50% - 200px - 90px)'
          };
        },
        required: false
      },
      headerStyle: {
        type: Object,
        default: function() {
          return {
            width: '100%',
            'min-width': '600px',
            height: '100px',
            'line-height': '100px',
            'box-sizing': 'border-box',
            'border': '1px solid rgb(191, 203, 217)',
            'border-radius': '4px',
            'margin-bottom': '10px'
          };
        },
        required: false
      },
      stepbarStyle: {
        type: Object,
        default: function() {
          return {
            width: '100%',
            'min-width': '600px',
            'border': '1px solid rgb(191, 203, 217)',
            'border-radius': '4px',
            'padding': '20px',
            'box-sizing': 'border-box',
            'margin-bottom': '10px',
            'overflow-x': 'auto'
          };
        },
        required: false
      }
    },
    computed: {
      space() {
        return this.steps.length > 10 ? 70 : '';
      },
      showChooser() {
        var showChooser = {};
        var name;
        if (this.currentStep.buttons && this.currentStep.buttons.length > 0) {
          this.currentStep.buttons.forEach((button) => {
            name = button.name;
            if (name && this.defaultButton[name]) {
              if (typeof button.showChooser === 'boolean') {
                showChooser[name] = button.showChooser;
              } else {
                showChooser[name] = this.defaultButton[name].showChooser;
              }
            }
          });
        } else {
          Object.keys(this.defaultButton).forEach((key) => {
            showChooser[key] = this.defaultButton[key].showChooser;
          });
        }
        return showChooser;
      },
      mergedDialog() {
        var dialogs = {};
        Object.keys(this.defaultDialogConf).forEach((key) => {
          if (this.dialogConf[key]) {
            dialogs[key] = this.mergeObj(this.defaultDialogConf[key], this.dialogConf[key]);
          } else {
            dialogs[key] = this.defaultDialogConf[key];
          }
        });
        return dialogs;
      },
      buttons() {
        var buttons = {};
        var name;
        if (this.currentStep.buttons && this.currentStep.buttons.length > 0) {
          this.currentStep.buttons.forEach((button) => {
            name = button.name;
            if (name && this.defaultButton[name]) {
              buttons[name] = this.mergeObj(this.defaultButton[name], button);
            }
          });
        } else {
          buttons = this.defaultButton;
        }
        return buttons;
      }
    },
    watch: {
      dialogVisible() {
        this.$nextTick(() => {
          this.formLive = this.dialogVisible;
        });
      }
    },
    methods: {
      mergeObj(def, custom) {
        var merged = {};
        Object.keys(def).forEach((key) => {
          merged[key] = custom[key] ? custom[key] : def[key];
        });
        return merged;
      },
      setCurStep(step) {
        if (typeof step === 'number' && step > -1 && step < this.steps.length + 1) {
          this.active = parseInt(step, 10);
        } else {
          console.warn('call method "setCurStep" with wrong step: ' + step);
        }
      },
      clickTab(e) {
        console.log(e);
      },
      actionChange(value) {
        if (value === '人员') {
          this.rejectFormRules = {
            person: [{
              required: true,
              message: '请选择人员',
              trigger: 'change'
            }]
          };
        } else if (value === '节点') {
          this.rejectFormRules = {
            node: [{
              required: true,
              message: '请选择节点',
              trigger: 'change'
            }]
          };
        } else {
          this.rejectFormRules = {};
        }
      },
      removeTab(tabName) {
        this.extraTabs = this.extraTabs.filter(tab => tab.name !== tabName);
      },
      confirm() {
        var form;
        var data;
        if (this.currentAction !== 'reject') {
          if (this.showChooser[this.currentAction]) {
            form = this.$refs.normal;
            data = {
              person: this.normalForm.people
            };
          } else {
            data = {};
          }
        } else {
          form = this.$refs.reject;
          data = {
            rejectTo: this.rejectForm.rejectTo,
            person: this.rejectForm.person,
            node: this.rejectForm.node,
            toCC: this.rejectForm.toCC,
            ccList: this.rejectForm.ccList.slice()
          };
        }
        if (this.currentAction === 'reject' || this.showChooser[this.currentAction]) {
          form.validate((valid) => {
            if (valid) {
              this.confirmAction(data);
            }
          });
        } else {
          this.confirmAction(data);
        }

      },
      confirmAction(data) {
        var eventName;
        switch (this.currentAction) {
          case 'approval':
            eventName = 'approval';
            break;
          case 'reject':
            eventName = 'reject';
            break;
          case 'assign':
            eventName = 'assign';
            break;
          case 'extra-endorse':
            eventName = 'extra-endorse';
            break;
          case 'counter-sign':
            eventName = 'counter-sign';
            break;
          default:
            break;
        }
        this.$emit(eventName, this.opinion, this.active, data);
        this.dialogVisible = false;
      },
      cancel() {
        if (this.currentAction !== 'reject') {
          if (this.showChooser[this.currentAction]) {
            this.$refs.normal.resetFields();
            this.normalForm = {
              people: ''
            };
          }
        } else {
          this.$refs.reject.resetFields();
          this.rejectForm = {
            rejectTo: '直接驳回',
            person: '',
            node: '',
            toCC: false,
            ccList: []
          };
        }

        this.dialogVisible = false;
      },
      clickButton(action, title) {
        this.currentAction = action;
        this.dialogTitle = title;
        this.dialogVisible = true;

      },
      handleClose(done) {
        if (this.currentAction !== 'reject') {
          if (this.showChooser[this.currentAction]) {
            this.$refs.normal.resetFields();
          }
        } else {
          this.$refs.reject.resetFields();
        }
        done();
      }
    },
    created() {

    }
  };

</script>

<style scoped>
  .action {
    width: 60px;
    margin-left: 10px;
  }
</style>
