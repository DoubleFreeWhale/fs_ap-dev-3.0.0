<template>
  <div>
    <div class="common-padding clearfix add-props">
      <i class="ifbp-icon-add icon-fun-common" style="display: block;" @click="addCollection()"></i>
    </div>
    <ul class="shortcut_ul">
      <li v-for="(card, index) in collectionArr" :key="index">
        <div class="shortcut-prop">
          <i :class="['appIcon', card.icon,'iconfont_form']" :style="{color: card.iconColor}" style="vertical-align: top;"></i>
          <span>{{card.title}}</span>
          <!-- <i class="ifbp-icon-edit icon-fun-common" @click="changeCollection(card, index)"></i> -->
          <i class="ifbp-icon-delete icon-fun-common" @click="deleteColletion(index)"></i>
        </div>
      </li>
    </ul>
    <el-dialog title="新增功能" :visible="dialogVisible" size="large" custom-class="mycollection" :before-close="handleClose">
      <div class="mycollection-header" style="height: 64px;">
        <el-input placeholder="搜索收藏名称" icon="search" v-model="input2" style="width: 288px;margin: 16px 16px 24px 0; float: right;" :on-icon-click="handleIconClick" @change="handleIconClick">
        </el-input>
      </div>
      <div class="mycollection-body">
        <div v-for="(group,index) in showPermissionList" v-if="permissionList && permissionList.length>0 " :key="index">
          <span class="persion-groupName">
            <el-checkbox :indeterminate="group.indeterminate" v-model="group.checked" @change="handleCheckAllChange(group,index)">{{group.label}}</el-checkbox>
          </span>
          <permission-body @handlechange="function(item,itemindx){handlechange(item, itemindx,index)}" :group="group.check"></permission-body>
          <permission-body @handlechange="function(item, itemindx ){handlechange(item, itemindx,index)}" :group="group.uncheck"></permission-body>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCollection">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
	import permissionBody from './permission-body.vue' 
export default {
  	components:{
  		permissionBody
  	},
  data() {

    return {
      permissionList: [],
      originalList: [],
      dialogVisible: false,
      collectionArr: [],
      input2:""
    };
  },
  props: {
   
  },
  created(){
    this.getCollections();
  },
  computed: {
    appLists: function() {
          var arr = [];
          if (window.vueInstance && window.vueInstance.$children && window.vueInstance.$children[0] && window.vueInstance.$children && window.vueInstance.$children[0].collections) {
            arr = window.vueInstance.$children[0].collections;
          } else {
            this.$http({
              url: "/ifbp-app-sm/favorite/list",
              method: 'POST',
              data: { "title": "" }
            }).then((res) => {
              if (res.data.success) {
                arr = res.data.data;
              }
            }).catch((e) => {
              console.log("获取收藏信息失败, " + e);
            });
          }
          return arr;
        },
  	showPermissionList() {
      var list = [];
      this.permissionList.map((group, inx) => {
        group.check = [];
        group.uncheck = [];
        group.indeterminate = false;
        //group.checked = false;
        group.children.map((item, index) => {
          if (item.checked) {
            group.check.push(item);
          } else {
            group.uncheck.push(item);
          }
          item.hidden = item.hidden || false;
        });
        if (group.check.length == group.children.length) {
          group.checked = true;
        }
        if (group.uncheck.length == group.children.length) {
          group.checked = false;
        }
        if (
          group.check.length > 0 &&
          group.check.length < group.children.length
        ) {
          group.indeterminate = true;
        }
        list.push(group);
      });
      return list;
    }
    
  },
  watch: {},
  methods: {
    getCollections(){
      if (window.vueInstance && window.vueInstance.$children && window.vueInstance.$children[0] && window.vueInstance.$children && window.vueInstance.$children[0].collections) {
        this.collectionArr = window.vueInstance.$children[0].collections;
      } else {
        this.$http({
          url: "/ifbp-app-sm/favorite/list",
          method: 'POST',
          data: { "title": "" }
        }).then((res) => {
          if (res.data.success) {
            this.collectionArr = res.data.data;
          }
        }).catch((e) => {
          console.log("获取收藏信息失败, " + e);
        });
      }
    },
  	handleIconClick(){
  		
  	},
   handleClose() {
      this.dialogVisible = false;
    },
    addCollection() {
      this.dialogVisible = true;
      let isUser = false;
      let id = this.$route.query.roleid;
      let flag = this.$route.query.flag;
      if (flag == "workbench") {
        isUser = true;
      }
      this.getAppItems(id, isUser );
    },
    changeCollection() {},
    deleteColletion(index) {
      var collData = {
        delIds: [this.collectionArr[index].id],
        addData: []
      };
      this.$http({
        url: "/ifbp-app-sm/favorite/createAndDelete",
        method: "POST",
        data: collData
      }).then(res => {
        if (res.data.success) {
          //操作成功
          window.vueInstance.$children[0].findCollectionMessage();
          this.$message({
            message: "操作成功!",
            type: "success"
          });
          var that = this;
          setTimeout(function(){
            that.getCollections();
          },100)
          this.$emit("change",[]);
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
    handlechange(item, index, inx) {
      index = this.permissionList[inx].children.indexOf(item);
      this.permissionList[inx].children[index].checked = !this.permissionList[
        inx
      ].children[index].checked;
      this.permissionList[inx].children = Object.assign(
        [],
        this.permissionList[inx].children
      );
    },
    handleCheckAllChange(group, index) {
      var checkedG = group.checked;
      this.permissionList[index].children.map((item, inx) => {
        item.checked = checkedG;
      });

      this.permissionList[index].children = Object.assign(
        [],
        this.permissionList[index].children
      );
    },
    isContain(item, arr) {
          var flag = false;
          arr.map(it => {
            if (item.id == it.id) {
              flag = true
            }
          })
          return flag;
        },
    //收藏
    saveCollection() {
      //判断收藏的地址 取消收藏的id
      //勾选之前的数据  VS 勾选之后的数据
      var list1 = [];
      var list2 = [];
      var commonArr = [];
      var removeArr = [];
      var addArr = [];
      this.originalList.map(group => {
        group.children.map(item => {
          if (item.checked) {
            list1.push(item);
          }
        });
      });
      this.permissionList.map((group, index) => {
        group.check.map(item => {
          if (item.checked) {
            list2.push(item);
          }
        });
      });
      //找出数组中相同的元素
      list1.map(app => {
        list2.map(coll => {
          if (coll.id == app.id) {
            commonArr.push(app);
          }
        });
      });
      list1.map(item => {
        if (!this.isContain(item, commonArr)) {
          removeArr.push(item.id);
        }
      });
      list2.map(item => {
        if (!this.isContain(item, commonArr)) {
          item["appid"] = item.id;
          item.icon = item.appIcon;
          item.subtitle = item.app_desc;
          item.title = item.label;
          item.url = item.path;
          item.userid = "";
          addArr.push(item);
        }
      });
      var collData = {
        delIds: removeArr,
        addData: addArr
      };
      this.$http({
        url: "/ifbp-app-sm/favorite/createAndDelete",
        method: "POST",
        data: collData
      }).then(res => {
        if (res.data.success) {
          //操作成功
          window.vueInstance.$children[0].findCollectionMessage();
          this.dialogVisible = false;
          this.$message({
            message: "操作成功!",
            type: "success"
          });
          var that = this;
          setTimeout(function(){
            that.getCollections();
          },100)
          this.$emit("change",[]);
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
    getAppItems(id, isUser) {
      const url = isUser ? '/ifbp-app-sm/favorite/queryFunByUser' : '/ifbp-app-sm/roleFavorite/queryFunByRole'
      this.$http({
        url: url,
        method: 'POST',
        data: id
      }).then((res) => {
        if (res.data.success) {
          const appArr = [];
          res.data.data.map(item => {
            item.children.map(app => {
              appArr.push(app);
            })
          })
          if (this.appLists && appArr) {
            appArr.map(group => {
              group.children.map(item => {
                this.appLists.map(app => {
                  if (item.id == app.appid) {
                    item.checked = true;
                  }
                })
              })
            })
          }
          this.originalList = JSON.parse(JSON.stringify(appArr)); //数组深度拷贝					    
          this.permissionList = appArr;
        } else {
          this.originalList = [];
          this.permissionList = [];
        }
      }).catch(e => {

      })
    }
  }
};
</script>
<style>
.shortcut-prop > .appIcon.iconfont_form {
  font-size: 16px;
}
</style>

<style scoped>
/* .shortcut_ul {
  margin-top: 10px;
} */
.add-props {
  height: 32px;
  line-height: 32px;
  border-bottom: 1px solid #F0F0F5;
}
.shortcut-prop {
  height: 36px;
  line-height: 36px;
  padding-left: 10px;
}
.shortcut-prop:hover {
  background-color: #eaf9ff;
}
.shortcut-prop:hover > .icon-fun-common {
  display: block;
}
.icon-fun-common {
  display: none;
  vertical-align: middle;
  float: right;
  margin-right: 5px;
}
.common-padding {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
