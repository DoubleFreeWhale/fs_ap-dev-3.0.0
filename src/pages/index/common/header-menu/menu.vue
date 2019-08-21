<template>
    <div class="headerMenu menuHeaderCenter">
    <span class="menuHeaderContent" @mouseover="handleHeaderContentOver" @mouseleave="handleHeaderContentLeave">
      <span class="menuHeaderContentInner">{{ mainHeadTitle }}</span>
      <i :class="{'menuHeaderIcon':true, 'el-icon-arrow-down': !showMenu, 'el-icon-arrow-up': showMenu}"></i>
    </span>
        <div @mouseover="handleHeaderContentOver" @mouseleave="handleHeaderContentLeave"
             :style="{top:hearderHeight}"
             :class="['menuHeaderExpandbox', {'show': showMenu || mouserInMenuPanel}]">
            <div class="expand-box-header">
                <span class="expandBox-box-title">全部应用</span>
            </div>
            <div class="expandBox-inner">
                <div class="expand-box-container">
                    <menuPanel @handlePanelItemClick='handlePanelItemClick' :data="menuData"></menuPanel>
                </div>
            </div>
            <span class="triangleUp"></span>
        </div>
    </div>
</template>
<script>
    import menuPanel from './menu-panel.vue';

    export default {
        data() {
            return {
                showMenu: false,
                mouserInMenuPanel: false,
                menuListData: [],
                parentLabel: null,
                timeout: null,
                hearderHeight:appDefaultConfig.themeConfig.hearderHeight-(appDefaultConfig.themeConfig.hearderHeight-40)/2+'px'
            };
        },
        components: {
            menuPanel,
        },
        computed: {
            menuData() {
                return this.$store.state.routerList
            },
            mainHeadTitle(){

                console.log(this.$store.state.mainHeadTitle)
                return this.$store.state.mainHeadTitle
            }
        },
        methods: {
            handleHeaderContentOver(e) {
                this.showMenu = true;
                e.preventDefault();
                e.stopPropagation();
            },
            handleHeaderContentLeave(e) {
                this.showMenu = false;
                e.preventDefault();
                e.stopPropagation();
            },
            handlePanelItemClick(title) {

                this.showMenu = false;
                // this.parentLabel = title;
            }

        }
    };
</script>
<style>
    .headerMenu.menuHeaderCenter {
        text-align: center;
        display: inline-block;
    }

    .headerMenu .menuHeaderContent {
        height: 40px;
        line-height: 40px;
        display: inline-block;
        padding: 0 16px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 16px;
    }

    .headerMenu .menuHeaderContent:hover {
        background-color: hsla(0,0%,100%,.25);
    }

    .headerMenu .menuHeaderContentInner {

    }

    .headerMenu .menuHeaderIcon {
        font-size: 20px;
        margin-left: 4px;
        vertical-align: sub;
    }

    .headerMenu .menuHeaderExpandbox {
        position: absolute;
        background-color: #fff;
        border: 1px solid #CBCBCE;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.20);
        border-radius: 5px;
        left: 50%;
        transform: translateX(-50%);
        width: 840px;
        min-width: 769px;
        overflow-x: hidden;
        visibility: hidden;
        transition: all .1s .1s ease-in-out;
    }

    .headerMenu .menuHeaderExpandbox.show {
        visibility: visible;
        transition: all .1s ease-in-out;
    }

    .expandBox-inner {
        width: 850px;
        height: 0;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
        transition: all .2s ease-in-out;
    }

    .headerMenu .menuHeaderExpandbox.show .expandBox-inner {
        height: 400px;
        transition: all .2s ease-in-out;
    }

    .menuHeaderExpandbox .expand-box-header {
        position: relative;
        text-align: center;
        /* font-size: 13px; */
        width: 100%;
        height: 32px;
        line-height: 32px;
        border-bottom: 1px solid #e5e5e5;
    }

    .menuHeaderExpandbox .expand-box-header .expandBox-box-title {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
    }

    .menuHeaderExpandbox .expand-box-container {
        width: 840px;
        min-width: 767px;
    }

    .triangleUp {
        width: .8rem;
        height: .8rem;
        position: absolute;
        top: -0.5rem;
        left: 50%;
        transform: translateX(-100%) rotate(-45deg);
        border-top: 1px solid #dcd8d8;
        border-right: 1px solid #dcd8d8;
        background-color: #fff;
        z-index: 3000;
    }

    .middle-border {
        width: 1px;
        height: 2000px;
        border-left: 1px solid #e5e5e5;
        position: absolute;
        left: 320px;
    }
</style>
