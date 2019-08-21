<template>
  <!--需要改变颜色主题的地方 要绑定class-->
  <div :class="{ active: isActive,themeClass: true }"
       @scroll.stop="scroll">
    <el-menu :default-active="path"
             class="el-menu-vertical-demo"
             v-if="types === 'hover'">
      <el-menu-item v-for="(item, index) in list"
                    :key="item.path+index"
                    :index="item.path"
                    @mouseover.stop.native="hover(index)">
        <cascader @change="changeHandler"
                  @click.native="clickRoute(item)"
                  :ref="'cascader'+index"
                  :options="item.children?item.children:[]"
                  :index = "item.path">
          <i class="el-icon-menu"></i>
          {{item.label}}
        </cascader>
      </el-menu-item>
    </el-menu>
    <el-menu :default-active="path"
             class="el-menu-vertical-demo"
             v-if="types === 'click'"
             :router="true">
      <el-menu-item v-for="(item, index) in list"
                    :key="item.id+index"
                    :index="item.id"
                    @click.native="clickItem(item.id)"
                    :style="item.id===$route.path ? {color:'black','font-size':cssList[index].text['font-size'],'background-color':'white'}:cssList[index].text">
        <i :class="cssList[index].icon.name" v-if="!cssList[index].icon.isImage" class="ii" :style="{color: item.id===$route.path?'black':cssList[index].icon.color, 'font-size': cssList[index].icon['font-size']}"></i>
        <div v-else class="img-container"><img :src="cssList[index].icon.url"></div>
        {{item.name}}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script type="text/javascript">
  import cascader from './cascader.vue';
  import _ from 'lodash';

  export default {
    name: 'ElMainNav',
    props: ['menuList', 'theme', 'type', 'collapse', 'style-list'],
    data() {
      return {
        path: this.$route.path,
        types: 'click',
        isActive: false,
        list: '', // 取当前路径,
        glist: '',
        cssList: '',
        style: {
          text: {
            color: 'black',
            'font-size': '12px',
            'background-color': 'white'
          },
          icon: {
            isImage: false,
            'font-size': '22px',
            url: '',
            name: 'el-icon-menu',
            color: 'black'
          }
        }
      };
    },
    components: {
      'cascader': cascader
    },
    methods: {
      adjustStyle() {
        var tmp = [];
        this.list.forEach((v, i) => {
          this.style.icon.name = v.icon;
          tmp[i] = _.defaultsDeep((this.styleList && this.styleList[i]) ? this.styleList[i] : {}, this.style);
        });
        this.cssList = tmp;
      },
      clickItem(hash) {
        this.$parent.$emit('groupList', hash);
      },
      hover(index) {
        console.log('hover');
        Object.keys(this.$refs).forEach((v) => {
          this.$refs[v][0].handleClick(false);
        });
        this.$refs['cascader' + index][0].handleClick(true);
      },
      close(index) {
        this.$refs['cascader' + index][0].handleClick(false);
      },
      scroll(index) {
        Object.keys(this.$refs).forEach((v, i) => {
          this.$refs[v][0].$emit('scroll', index.srcElement.scrollTop);
        });
      },
      clickRoute(item) {
        if (!item.children) {
          this.$root.$router.push(item.path);
        }
      },
      getRouteMap(list) {
        var tmp = [];
        var getChild = function(array) {
          array.forEach((v) => {
            if (v.children) {
              getChild(v.children);
            } else {
              tmp.push(v);
            }
          });
        };
        getChild(list);
        return tmp;
      },
      changeHandler(value, index) {
        const data = JSON.parse(JSON.stringify(value));
        const router = this.$root.$router;
        const currentValue = data[data.length - 1];
        if (currentValue.href) {
          window.open(currentValue.href);
        } else if (currentValue.path) {
          router.push(currentValue.path);
        }
        this.path = index;
      },
      handlePathFocus(path) {
        let tmp;
        for (let i = 0;i < this.list.length;i++) {
          if (!this.list[i].children) {
            if (this.list[i].path === path) {
              this.path = path;
              return;
            }
          } else {
            tmp = this.getRouteMap(this.list[i].children);
            for (let j = 0;j < tmp.length;j++) {
              if (tmp[j].path === path) {
                this.path = this.list[i].path;
                return;
              }
            }
          }
        }
      }
    },
    created() {
      var localStorage = window.ifbpLocalCache || window.localStorage;
      const localColor = localStorage.getItem('themeColor');     // 创建mainNav组件时读取localStorage
      this.themeClass = localColor;
      this.style = _.defaultsDeep(this.styleList ? this.styleList : {}, this.style);
      this.handlePathFocus(this.path);                           // 组件颜色
      this.list = this.menuList;
      this.adjustStyle();
      if (this.type) {
        this.types = this.type;
      }
      if (this.collapse) {
        this.isActive = this.collapse;
      }
    },
    watch: {
      /*eslint no-unused-vars: "warn"*/
      $route(to) {
        this.handlePathFocus(to.fullPath);
      },
      theme() {
        this.themeClass = this.theme;
      },
      menuList() {
        this.list = this.menuList;
        this.adjustStyle();
        this.$nextTick(() => {
          console.log('this.list=' + this.list);
        });
      },
      collapse() {
        this.isActive = this.collapse;
      }
    }
  };
</script>
