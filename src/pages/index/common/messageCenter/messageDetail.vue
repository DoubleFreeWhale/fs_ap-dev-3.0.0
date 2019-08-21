<template>
<ifbp-page class="infoDetail">
  <ifbp-breadcrumb name="消息详情"></ifbp-breadcrumb>
  <ifbp-main-area type="detail">
    <div class="title">
      <h1>{{currentDetail.title}}</h1>
      <div class="mdDate">
        <span class="mmDate">
          时间：{{currentDetail.send_time | time}}
        </span>
      </div>
    </div>
    <div class="contentDetail">
      <div class="phtml">

      </div>
    </div>
  </ifbp-main-area>
</ifbp-page>
</template>
<script>
export default {
  data() {
    return {
      currentDetail: ""
    };
  },
  mounted() {
    this.queryDetail();
  },
  methods: {
    queryDetail() {
      this.$http({
        url:
          "/ifbp-app-sm/sm/messageCenter/getDetailById/" +
          this.$root.$router.currentRoute.params.id,
        method: "get"
      }).then(res => {
        if (res.data.success) {
          this.currentDetail = res.data.data;
          $(".phtml").html(this.currentDetail.content);
          // 总条数
        } else {
          this.$message({
            message: res.data.data,
            type: "error"
          });
        }
      });
    }
    // backInfo() {
    //   this.$router.push('/messageCenter');
    //   this.$context.getApp().back();
    // }
  }
};
</script>
<style>
/* .infoDetail {
  width: 98%;
  height: 100%;
  margin: 0 auto;
  overflow-y: auto;
} */
.infoDetail .infoheader {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ccc;
  position: relative;
}
.infoDetail .infoheader .tipclo span,
.infoDetail .infoheader .goBack span {
  font-size: 15px;
}
.infoDetail .infoheader .goBack {
  position: absolute;
  right: 10px;
  top: 0;
  cursor: pointer;
}
.infoDetail .infoheader .sp {
  color: #9e9e9e;
}
.infoDetail .title {
  width: 80%;
  margin: 0 auto;
  padding-top: 40px;
  text-align: center;
}

.infoDetail .title .mdDate {
  font-size: 12px;
  color: #9e9e9e;
}

.infoDetail .title .mmDate {
  display: inline-block;
  width: 200px;
  margin: 20px 0 0 150px;
}

.infoDetail .title h1 {
  font-size: 20px;
}
.infoDetail .contentDetail {
  margin-top: 20px;
}
.infoDetail .contentDetail .phtml {
  font-size: 14px;
  color: rgb(100, 100, 100);
  text-indent: 28px;
  line-height: 30px;
  word-wrap: break-word;
}
</style>
