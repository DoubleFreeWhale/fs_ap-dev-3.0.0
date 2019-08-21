<template>
  <div>
    <div v-show="shortcutListVisible">
      <div class="common-padding clearfix add-props">
          <i class="ifbp-icon-add icon-fun-common" style="display: block;" @click="addShortcut()"></i>
      </div>
      <ul class="shortcut_ul" v-show="showProps">
        <li v-for="(card, index) in shortcutArr" :key="index">
          <div class="shortcut-prop">
            <i :class="card.iconClass" :style="{color: card.iconColor}" style="vertical-align: top;"></i>
            <span>{{card.name}}</span>
            <i class="ifbp-icon-edit icon-fun-common"  @click="changeShortcut(card, index)"></i>
            <i class="ifbp-icon-delete icon-fun-common"  @click="deleteShortcut(index)"></i>
          </div>
        </li>
      </ul>
    </div>
    <div class="common-padding" v-show="shortcutVisible">
      <el-form :model="shortcutform" :inline="false" label-position="top" :adaptation="false">
        <el-form-item label="名称">
          <el-input v-model="shortcutform.name"></el-input>
        </el-form-item>
        <el-form-item label="跳转路由">
          <el-input v-model="shortcutform.links"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <ifbp-icon-select :default-icon="shortcutform.iconClass" :is-show-color-select="true" @icon-select="changeIcon"></ifbp-icon-select>
          <!-- <i class="appIcon cyan iconfont_form" :class="shortcutform.iconClass" @click="changeIcon" style="font-size: 30px;vertical-align: top;"></i> -->
          <!-- <el-input v-model="shortcutform.iconClass" style="width: 91%"></el-input> -->
        </el-form-item>
        <el-form-item label="渲染方式">
          <el-select v-model="shortcutform.renderType" placeholder="请选择活动区域" @change="showRenderType">
            <el-option label="js" value="js"></el-option>
            <el-option label="文字" value="word"></el-option>
            <el-option label="链接" value="link"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="shortcutform.renderType == 'js'" label="js">
          <el-input v-model="shortcutform.render"></el-input>
        </el-form-item>
        <el-form-item v-else-if="shortcutform.renderType == 'word'" label="文字">
          <el-input v-model="shortcutform.render"></el-input>
        </el-form-item>
        <el-form-item v-else-if="shortcutform.renderType == 'link'" label="链接">
          <div class="render-type-content" v-for="(item,index) in shortcutform.renderLinks" :key="index">
            <el-input v-model="item.text" placeholder="名称" class="render-type-common">{{ item.text }}</el-input>
            <el-input v-model="item.link" placeholder="链接" class="render-type-common" style="width: 90%;">{{ item.link }}</el-input>
            <i class="ifbp-icon-close el-icon-close el-icon-pt-guanbi" style="vertical-align: middle;" @click="deleteLinks(index)"></i>
          </div>
          <p style="color: rgb(95, 95, 100)">
            <span type="primary" v-show="addLinksShow" @click="addLinks">添加链接</span>
          </p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shortcutVisible = false; shortcutListVisible = true">取 消</el-button>
        <el-button type="primary" @click="shortcutSure(shortcutform)">确 定</el-button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shortcutListVisible: true,
      shortcutVisible: false,
      shortcutform: {
        name: "",
        links: "",
        imgSrc: "",
        render: "",
        iconClass: "ifbp-icon-receipt",
        iconColor: "",
        renderType: "js",
        renderLinks: [
          {
            text: "",
            link: ""
          }
        ]
      },
      iconListShow: false,
      iconList: [],
      addLinksShow: true,
      isAdd: true,
      shortcutArr: [],
      selectIndex: 0,
      showProps: false
    };
  },
  props: {
    arr: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    arr:{
      deep: true,
      handler(value, old) {
        this.shortcutArr = value;
        this.showProps = true;
      }
    }
  },
  created() {
    this.shortcutArr = this.arr
    this.showProps = true;
  },
  methods: {
    addShortcut(model) {
      this.shortcutListVisible = false;
      this.shortcutVisible = true;
      this.shortcutform = {
        "name": "",
        "links": "",
        "imgSrc": "",
        "iconClass": "ifbp-icon-receipt",
        "iconColor": "",
        "render": "",
        "renderType": "js",
        "renderLinks": [{
          "text": "",
          "link": ""
        }]
      };
      this.isAdd = true;
    },
    changeShortcut(item, index) {
      this.shortcutListVisible = false;
      this.shortcutVisible = true;
      item["renderLinks"] = [
        {
          text: "",
          link: ""
        }
      ];
      this.shortcutform = item;
      this.isAdd = false;
      this.selectIndex = index;
    },
    deleteShortcut(index) {
      this.shortcutArr.splice(index, 1);
      this.$emit("change",this.shortcutArr);
    },
    shortcutSure(form, index) {
      if(this.isAdd){
        this.shortcutArr.push(form);
        this.$message("添加成功！");
      } else {
        this.shortcutArr.splice(this.selectIndex, 1, form);
        this.$message("修改成功！");
      }
      this.$emit("change",this.shortcutArr);
      this.shortcutListVisible = true;
      this.shortcutVisible = false;
      if(this.shortcutArr.length > 0){
        this.showProps = true;
      } else {
        this.showProps = false;
      }
    },
    changeIcon(value) {
      this.shortcutform.iconClass = value.class;
      this.shortcutform.iconColor = value.color;
    },
    showRenderType() {
      var renderType = this.shortcutform.renderType;
    },
    addLinks() {
      var render_links = this.shortcutform.renderLinks;
      var link = {
        text: "",
        link: ""
      };
      render_links.push(link);
      if (render_links.length == 2) {
        this.addLinksShow = false;
        return;
      } else {
        this.addLinksShow = true;
      }
    },
    deleteLinks(index) {
      this.shortcutform.renderLinks.splice(index, 1);
      var render_links = this.shortcutform.renderLinks;
      if (render_links.length == 2) {
        this.addLinksShow = false;
        return;
      } else {
        this.addLinksShow = true;
      }
    }
  }
};
</script>

<style scoped>
.add-props {
  height: 32px;
  line-height: 32px;
  border-bottom: 1px solid #F0F0F5;
}
/* .shortcut_ul {
  margin-top: 10px;
} */
.render-type-common {
  margin-top: 10px;
}
.shortcut-prop {
  height: 36px;
  line-height: 36px;
  padding-left: 10px;
  border-bottom: 1px solid #F0F0F5;
}
.shortcut-prop:hover {
  background-color: #EAF9FF;
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
