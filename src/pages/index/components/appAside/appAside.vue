<template>

    <div class="asideBox" @mouseover="asideHover" @mouseleave="asideLeave" :style="{width:width, marginLeft:left}">
        <el-menu class="el-menu-demo" background-color="#ffffffff" >
            <asideNav v-for="(e,index) in menulist" :navIndex="index"
                      :dataObj="e" :key="'a'+index"></asideNav>
        </el-menu>
    </div>

</template>

<script>
    import asideNav from './asideNav'

    export default {
        name: "appAside",
        data() {
            return {
                width: appDefaultConfig.navSideWidth,
                left: '-'+appDefaultConfig.navSideWidth
            }
        },
        props: ['navPosition'],
        components: {
            asideNav
        },
        computed: {
            menulist() {
                let arr = [{
                    label: '首页',
                    path: '/',
                    appIcon: 'el-icon-pt-shouye'
                }].concat(this.$store.state.routerList);
                console.log(arr);
                return arr
            },
            isMethods(){
                return this.navPosition !== 'leftFixed'
            },
        },
        updated(){
          if(!this.isMethods){
              this.left = '0';
              this.$emit('upWidth',appDefaultConfig.navSideWidth);
          }
        },
        methods: {
            asideHover() {

                if (this.isMethods) {
                    console.log(123);
                    this.left = '0';
                    this.$emit('upWidth',appDefaultConfig.navSideWidth);
                }
            },
            asideLeave() {
                if (this.isMethods) {
                    this.left = '-'+appDefaultConfig.navSideWidth;
                    this.$emit('upWidth','1px');
                }
            }
        },
    };
</script>

<style scoped>
    .el-menu-demo {

    }
    .asideBox {
        transition: margin-left 0.5s;
        height: 100%;
        min-width: 1px;
        z-index: 1000;
        overflow-y: auto;
        background: #ffffff;
        box-shadow: 1px 0 10px 0 #1d63af;
        display: inline-block;
        position: absolute;
    }
</style>