export default {
data() {
  var vm = this;
  return {
    appletPremissonPk:'7ab24a85-0be1-4251-8aed-56d7de220c83',
    appletPremissonData: {},
    appPreEditable: true,
    tableOperVif: true,
    // premissionIconsEdit: true,
    appletPremissonResetFun: function($node) {
      var $table = this.getTableDom($node);
      var icons = [
        {
          title: '修改',
          icon: 'edit',
          vif: "tableOperVif"
        },
        {
          icon: 'delete',
          title: '删除',
          vif: "tableOperVif"
        },
      ];
      var operateHtml = this.getTableOperateHtml(icons);
      $table.append(operateHtml);
      return $node[0].outerHTML;
    },

    appPremIndex: 0,
    appSubDataOrigin: {},
    appSubDataExpand: {},
    appSubDelDialogVisible: false,
    subIconsEdit: true,
    appSubIndex: 0,
    appSubDelIndex: 0,
    appSubCreateData: {},
    isAppSubFormEdit: false,
  };
},

methods: {
  premissonFormConfirm(type, row) {
    this.$refs.appletPremisson.validate((valid) => {
      if(valid) {
        var tableData = this.$refs.appletPremisson.getTableData() ? this.$refs.appletPremisson.getTableData(): [];
        if(type === 'form') {
          tableData.unshift(this.$refs.appletPremisson.getFormData());
          this.$refs.appletPremisson.setTableData(tableData);
          this.$refs.appletPremisson.resetFormData();
          this.$refs.appletPremisson.tableShow = true;
          this.$refs.appletPremisson.formShow = false;
        } else {
          tableData[this.appPremIndex] = JSON.parse(JSON.stringify(this.$refs.appletPremisson.getFormData()));
          console.log(tableData);
          this.$refs.appletPremisson.setTableData(tableData);

        }
      }
    })
  },
  premissonTableClick(icon, scope) {
    if(icon === 'edit') {
      this.$refs.appletPremisson.expandRow(scope.row, scope.$index);
      this.appPremIndex = scope.$index;
      // this.pageHotelEditable = true;
    }
    if(icon === 'delete') {
      this.appSubDelIndex = scope.$index;
      this.appSubDelDialogVisible = true;
      // this.pageHotelEditable = true;
    }
  },
  onSubCancel() {

    this.appSubCreateData = {};
    this.isAppSubFormEdit = false;
    this.subIconsEdit = true;
  },
  deleteAppSubFun(scope) {
    var tableDelData = this.$refs.appletPremisson.getTableData();
    tableDelData.splice(this.appSubDelIndex,1);
    this.appSubDelDialogVisible = false;
    this.$refs.appletPremisson.setTableData(tableDelData);
  }
},
computed: {

},
mounted() {

}
}
