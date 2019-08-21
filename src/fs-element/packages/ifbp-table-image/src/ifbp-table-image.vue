<!-- 用户下拉菜单组件 -->
<template>
    <span class="ifbp-table-image" :style="{'background-color':bgColor}">{{firstName}}</span>
</template>
<script type="text/javascript">
    export default {
        name: 'IfbpTableImage',
        data() {
            return {
                colors: ['#FF3B30', '#FF9500', '#FFCC00', '#00A753', '#5AC8FA', '#0089FA', '#5856D6', '#FF2D55']
            };
        },
        computed: {
            bgColor() {
                var i = this.index % 8;
                return this.colors[i];
            },
            firstName() {
                var name = this.name.charAt(0);
                return name;
            }
        },
        props: {
            name: {
                type: String,
                default: ''
            },
            index: {
                type: Number,
                // eslint-disable-next-line radix
                default: parseInt(Math.random() * 7)
            }
        },
        methods: {}
    };
</script>
<style>
    .ifbp-table-image{
        width: 32px;
        height: 32px;
        display: inline-block;
        border-radius: 32px;
        text-align: center;
        line-height: 32px;
        color: #fff;
    }
</style>
