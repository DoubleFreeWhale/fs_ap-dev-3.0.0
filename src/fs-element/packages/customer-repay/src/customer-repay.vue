
<template>
    <el-tabs class="nav-customer" v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
        <el-tab-pane
                v-for="(item, index) in editableTabs"
                :label="item.title"
                :name="item.name"
                :key="item.id">
        </el-tab-pane>
        <div class="forms">
            <h4>基础参数配置</h4>
            <ol>
                <li>
                    <label for="">收款提醒通知提前天数(天)</label><input type="number" v-model="advanceDay">
                </li>
                <li>
                    <label for="">客户还款宽限期(天)</label><input type="number" v-model="deadline">
                </li>
                <li class="checkboxs">
                    <label for="">是否启用客户经理数据权限</label>
                    <label for=""><input type="radio" name="limit" checked>是</label>
                    <label for=""><input type="radio" name="limit">否</label>
                </li>
                <li class="asset-table">
                    <label for="">资产风险分类规则</label>
                </li>
                <table class="table" collapse="0">
                    <tr>
                        <td>资产风险分类</td>
                        <td>逾期天数最小值(含)</td>
                        <td>逾期天数最大值(含)</td>
                        <td>备注</td>
                    </tr>
                    <tr>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                    </tr>
                    <tr>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                    </tr>
                    <tr>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                        <td><input type="text"></td>
                    </tr>
                </table>
                <li>
                    <label for="">收付款财务审批角色</label><input type="number">
                </li>
                <li>
                    <label for="">逾期罚息日利率(%)</label><input type="number">
                </li>
            </ol>
        </div>
        <hr style="border-style: dash">
        <div class="btn">
            <el-form>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('numberValidateForm')">保存</el-button>
                    <el-button @click="resetForm('numberValidateForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-tabs>
</template>
<script>
  export default {
    name: 'ElCustomerRepay',
    data() {
      return {
        advanceDay: '',
        deadline: '',
        editableTabsValue: '2',
        editableTabs: [{
          title: '首页',
          name: '1',
          id: 1
        }, {
          title: '新页标签名称',
          name: '2',
          id: 2
        },
        {
          title: '已打开的标签页',
          name: '3',
          id: 3
        },
        {
          title: '已打开的标签页',
          name: '4',
          id: 4
        }],
        tabIndex: 4
      };
    },
    methods: {
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          this.tabIndex += 1;
          const newTabName = this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          const tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                const nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
          return valid;
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>
