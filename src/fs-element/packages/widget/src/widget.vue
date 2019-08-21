<template>
    <div class="el-widget">
        <div class="el-widget-heading">
            <h3 class="el-widget-title">{{title}}</h3>
        </div>
        <div class="el-widget-body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ElWidget',
        componentName: 'ElWidget',
        props:{
            title:String
        }
    }
</script>

