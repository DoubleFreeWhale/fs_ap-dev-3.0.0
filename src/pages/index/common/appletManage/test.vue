<template lang="html">
  <div class="">
    <ifbp-template
    ref="appletBaseDetail"
    :pk-temp="appletBaseDetailPk"
    :tpl-data="appletBaseData"
    show-type="form"
    @change="changeFun"
    >
    </ifbp-template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appletBaseData: {},
      appletBaseDetailPk:'8fc79f02-7fc1-47c5-84d3-8fc13dbeca48'
    };
  },
  methods: {
    changeFun() {
    },
    request() {
      if (!this.id) return;
      this.$http({
          url: "/baseapp/appMGT/findOne/" + this.id,
          type: 'GET',
          dataType: 'json',
        }).then(res => {

          if (res.data.success === true && res.data.data) {
            let resData = res.data.data || {};
            this.$nextTick(() => {
              this.$refs.appletBaseDetail.comp.areaChange(res.data.data.areaId);
              if (this.$refs.appletBaseDetail) {
                this.$refs.appletBaseDetail.setFormData(resData);
              } else {
                this.$set(this.appletBaseData, "uitemplateFormData", resData);
              }
            });
            this.baseData = JSON.parse(JSON.stringify(resData));
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
    }
  },
  mounted() {
    this.request();
  }
}
</script>

<style lang="css">
</style>
