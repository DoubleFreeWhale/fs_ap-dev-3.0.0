<template>
  <div style="display: inline-block; padding-bottom: 8px">
    <i class="fs-icon-organization" style="font-size:24px;color: #999999 "></i>
    <el-cascader  v-if="corpTreeData && corpTreeData.length > 0"
                  ref="orgCascaderRef"
                  hideBorder
                  hideRight
                  expand-trigger="hover"
                  :options="corpTreeData"
                  v-model="defaultCorp"
                  :props="cascaderProps"
                  placeholder="请选择组织"
                  :show-all-levels="false"
                  :not-leaf-selectable="true"
                  :change-on-select="true"
                  @ifbpMenuItemClick="clickOrg"
                  @active-item-icon-click="clickOrgIcon"
                  >
    </el-cascader>
    <el-cascader  v-if="needDept && deptTreeData && deptTreeData.length > 0"
                  ref="deptCascaderRef"
                  hideBorder
                  hideRight
                  clearable
                  expand-trigger="hover"
                  :options="deptTreeData"
                  v-model="defaultDept"
                  :props="cascaderProps"
                  placeholder="请选择部门"
                  :show-all-levels="false"
                  :not-leaf-selectable="true"
                  @change="changeDept"
                  @active-item-icon-click="clickDeptIcon"
    >
    </el-cascader>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },

    corp_id: String,
    dept_id: String,
    needGroup: {
      type: Boolean,
      default: function () {
        return false;
      },
    },

    busiRegion: {
      type: String,
      default: function () {
        return '';
      },
    },

    needDept: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },

  computed: {
    // session_corp_id: function () {
    //   return this.name + "session_hrweb_corp_id";
    // },
    // session_orgNode: function () {
    //   return this.name + "session_hrweb_orgNode";
    // },
    // session_dept_id: function () {
    //   return this.name + "session_hrweb_dept_id";
    // },
    // session_deptNode: function () {
    //   return this.name + "session_hrweb_deptNode";
    // },
  },

  data() {
    return {
      permissionPrefix: '/hrorg/',
      corpPrefix: '/baseapp/',
      requestUrl: {
        corpCascader: 'corp/corpCascader',
        listNextLayerOrg: 'corp/corpNextLayerCascader',
        deptCascader: 'dept/deptCascader',
        listNextLayerDept: 'dept/deptNextLayerCascader',
      },

      cascaderProps: {
        value: 'id',
        label: 'name',
        children: 'children',
      },

      corpTreeData: [],
      defaultCorp: [],

      deptTreeData: [],
      defaultDept: [],
    }
  },

  mounted() {
    this.corpList();
  },

  methods: {

    // 获取第一层组织
    corpList: function () {
      let params = {
        needGroup: this.needGroup,
      };

      this.$http({
        url: this.corpPrefix + this.requestUrl.corpCascader,
        method: "post",
        params: params,
      }).then((res) => {
        if (res.data.status === true) {
          let options = res.data.data.options;
          if (options && options.length > 0) {
            this.corpTreeData = options;
          } else {
            this.corpTreeData = [];
          }
          let defaultValue = res.data.data.defaultValue;

          if (defaultValue && defaultValue.length > 0) {
            this.defaultCorp.push(defaultValue[0].id);
            this.clickOrg(defaultValue[0]);
          }

        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "[组织级联选择器]获取组织失败！", type: "error" });
      });
    },

    clickOrg (item) {
      if (item) {
        let corp_id = item.id;
        if (corp_id == 'org_busirelation') {
          this.$alert("该组织为虚拟组织！请点击该组织的下级进行后续操作！", "提示", {
            confirmButtonText: "确定",
            type: "info",
          });
        } else {
          this.afterChangeOrg(corp_id);
        }
      }
    },

    // 获取部门级联数据
    requestDept: function (corp_id) {
      let params = {
        corp_id: corp_id,
      };
      this.$http({
        url: this.permissionPrefix + this.requestUrl.deptCascader,
        method: "post",
        params: params,
      }).then((res) => {
        if (res.data.status === true) {
          if (res.data.data.options && res.data.data.options.length > 0) {
            this.deptTreeData = res.data.data.options;
            this.defaultDept = [res.data.data.defaultValue[0].id];
          } else {
            this.deptTreeData = [];
          }
          this.changeDept(this.defaultDept);

        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "[部门级联选择器]信息获取失败", type: "error" });
      });
    },

    // 点击组织右侧icon触发的事件
    clickOrgIcon (val, item, level) {
      if (item) {
        let corp_id = item.id;
        if (item.children && item.children.length > 0) {
          return;
        } else {
          this.listNextLayerOrg(item, corp_id);
        }
      }
    },

    // 获取下一层组织
    listNextLayerOrg: function (item, corp_id) {
      let params = {
        corp_id: corp_id,
      };

      this.$http({
        url: this.corpPrefix + this.requestUrl.listNextLayerOrg,
        method: "post",
        params: params,
      }).then((res) => {
        if (res.data.status === true) {
          let children = res.data.data.children;
          if (children && children.length > 0) {
            item.children = children;
          }
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "[组织级联选择器]下一层组织失败！", type: "error" });
      });
    },
    // 点击部门右侧icon触发的事件
    clickDeptIcon (val, item, level) {
      if (item) {
        let dept_id = item.id;
        if (item.children && item.children.length > 0) {
          return;
        } else {
          this.listNextLayerDept(item, dept_id);
        }
      }
    },
    // 获取下一层组织
    listNextLayerDept: function (item, dept_id) {
      let params = {
        dept_id: dept_id,
      };

      this.$http({
        url: this.permissionPrefix + this.requestUrl.listNextLayerDept,
        method: "post",
        params: params,
      }).then((res) => {
        if (res.data.status === true) {
          let children = res.data.data.children;
          if (children && children.length > 0) {
            item.children = children;
          }
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      }).catch(() => {
        this.$message({ message: "[部门级联选择器]下一层部门失败！", type: "error" });
      });
    },

    changeDept(treeItem) {
      if (Array.isArray(treeItem) && treeItem.length) {
        let dept_id = treeItem[treeItem.length - 1];
        this.afterChangeDept(dept_id);
      } else {
        this.afterChangeDept('');
      }
    },

    afterChangeOrg: function (corp_id) {
      this.$emit('update:corp_id', corp_id);
      if (corp_id && this.needDept) {
        this.requestDept(corp_id);
      } else {
        this.$emit('change');
      }
    },

    afterChangeDept: function (val) {
      this.$emit('update:dept_id', val);
      this.$emit('change');
    },
  }
}
</script>