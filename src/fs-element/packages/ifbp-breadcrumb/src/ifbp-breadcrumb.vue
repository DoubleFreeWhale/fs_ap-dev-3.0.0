<template>
    <div class="title-container" v-if="!off">
        <el-breadcrumb separator="/" class="ifbp-breadcrumb">
            <el-breadcrumb-item
                    v-for="(item, index) in pathArray"
                    :class="{
          'breadcrumb-active': index === pathArray.length
          }"
                    :key="index"
                    @routerClicked="handleCrumbClick(item,index)"
            >{{item.name}}
            </el-breadcrumb-item>
        </el-breadcrumb>
        <ifbp-tips class="ifbp-tips-item" v-if="showTips" :ifbp-tips-content="tipsContent"></ifbp-tips>
    </div>
</template>
<script>
    export default {
        name: 'IfbpBreadcrumb',
        props: {
            name: {
                type: String
            },
            showTips: {
                type: Boolean,
                default: false
            },
            tipsContent: {
                type: Object,
            },
            off: {
                type: Boolean,
                default: false
            }
        },
        computed:{
            pathArray(){
                return this.$store.state.crumbsList
            }
        },
        created(){
            debugger
            console.log(this.$store.state);
            this.$store.commit('upCrumbsList',{name:this.name,path:this.$route.path})
        },
        methods: {
            handleCrumbClick(obj,index) {
                let parms=Object.assign({},obj);
                delete parms.name;
                if(index!==this.pathArray.length-1){
                    this.$router.push(parms)
                }
            },
        },

    }
</script>
<style scoped>
    .title-container {
        margin-top: 8px;
    }

    .ifbp-breadcrumb {
        display: inline-block;
    }

    .ifbp-tips-item {
        display: inline-block;
        margin-left: 8px;
        position: absolute;
    }


</style>
