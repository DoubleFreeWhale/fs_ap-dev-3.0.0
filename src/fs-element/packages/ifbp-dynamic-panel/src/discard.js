export default {
  methods: {

    dynamicRequest(index) {
      if (this.defaultCrud !== true) return;
      if (this.dynamicPageData.length > 0) {
        if (!this.pageParentId) {
          this.$nextTick(() => {
            for (var item in this.$refs) {
              if (item.indexOf('dynamic') > -1) {
                this.$refs[item][0].tableShow = false;
              }
            }
          });
          return;
        }
      } else {
        if (!this.parentId) {
          this.$nextTick(() => {
            for (var item in this.$refs) {
              if (item.indexOf('dynamic') > -1) {
                this.$refs[item][0].tableShow = false;
              }
            }
          });
          return;
        }
      }

      var url;
      // for (let i = 0; i < this.dynamicResData.length; i++) {
      let resData;
      var pzglId = '';
      if (this.dynamicPageData.length > 0) {
        pzglId = this.pageParentId;
      } else {
        pzglId = this.parentId;
      }
      var data = {
        pkClass: this.pkClass[index] || '',
        searchParams: {
          searchMap: {
            pk_parent_common: pzglId
          }
        }
      };
      var code = this.dynamicResData[index].code;
      this.$http({
        url: this.dynamicResData[index].queryURL,
        method: 'post',
        data: data,
        dataType: 'json'
      })
          .then((res) => {
            if (res.data.success === true) {
              resData = res.data.data.content;
              this.$nextTick(() => {
                if (this.$refs['dynamic_' + code][0]) {
                  this.$refs['dynamic_' + code][0].setTableData(resData);
                } else {
                  this.$refs['dynamic_' + code][0].$set(this.dynamicData[this.dynamicResData[index].code], 'uitemplateTableData', resData);
                }
                if (resData.length < 1) {
                  this.$refs['dynamic_' + code][0].tableShow = false;
                } else {
                  this.$refs['dynamic_' + code][0].tableShow = true;
                }
                // this.$refs['dynamic' + i][0].tableShow = resData.length < 1 ? false : true;
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
          .catch((e) => {
            this.$message({
              message: '子表信息获取失败',
              type: 'error'
            });
          });
    },
    childDeleteDialogClick() {
      var data1 = this.childDelData;
      var data;
      var dId;
      if (this.dynamicPageData.length > 0) {
        dId = this.pageParentId;
      } else {
        dId = this.parentId;
      }
      data = {
        'baseEntity': {
          'beanMap': {
            'pk_example': dId
          },
          'metaDefinedName': data1.metaDefinedName,
          'namespace': data1.namespace,
          'status': data1.status,
          'changedPropertyNames': data1.changedPropertyNames
        },
        'pkClass': this.pkClass[this.childIndex]
      };

      for (var key in data1) {
        if (!(key === 'metaDefinedName' || key === 'namespace' || key === 'status' || key === 'changedPropertyNames' || key === 'beanMap')) {
          data.baseEntity.beanMap[key] = data1[key];
        }
      }
      var url = this.dynamicResData[this.childIndex].deleteURL;
      if (this.defaultCrud === 'true' || this.defaultCrud === true) {
        this.$http({
          url: url,
          method: 'post',
          data: data,
          headers: {
            'Content-Type': 'application/json'
          },
          dataType: 'application/json'
        })
          .then(res => {
            this.$emit('requestDynamic', res.data);
            if (res.data.success === true) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.childDelDialogVisible = false;
              this.dynamicRequest(this.childIndex);
            } else {
              this.$message({
                message: res.data.error.errorMessage,
                type: 'error'
              });
            }
          })
          .catch(() => {
            this.$message({
              message: '删除失败',
              type: 'error'
            });
          });
      }
    }
  }
};
