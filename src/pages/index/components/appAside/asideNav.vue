<template>
    <el-submenu  v-if="dataObj.hasOwnProperty('children')" :index="navIndex+''">
        <template slot="title">
            <div>
                <i :class="dataObj.areaIcon||dataObj.appIcon"></i>
                <p style="overflow: hidden;text-overflow: ellipsis">{{dataObj.label}}</p>
            </div>
        </template>
        <asideNav  v-for="(e,index) in dataObj.children" :navIndex="navIndex+'-'+index"
                   :dataObj="e" :key="'a'+index"></asideNav>
    </el-submenu>
    <el-menu-item  v-else @click="gotorouter(dataObj.path)" :index="navIndex+''">
        <i :class="dataObj.areaIcon||dataObj.appIcon"></i>
        <span>{{dataObj.label}}</span>
    </el-menu-item>
</template>

<script>
    export default {
        name: "asideNav",
        props:['dataObj','navIndex'],
        methods:{
           gotorouter(e){
               if(e){
                   this.$router.replace({
                       path:e
                   })
               }
           }
       }
    }
</script>

<style scoped>

</style>