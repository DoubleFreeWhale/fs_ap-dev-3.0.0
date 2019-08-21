<template>
    <div class="persioncontain">
        <div :class="['persionbox',app.checked && showIcon ? 'persionbox_add':'persionbox_close']" v-for="(app,inx) in group" v-if="!app.hidden">
            <div class="persionbox-remove" v-if = "app.checked && showIcon">
                <i class="ifbp-icon-power-off el-icon-circle-close" @click="handlechange(app,inx)"></i>
            </div>
            <div class="persionbox-remove" v-if = "!app.checked && showIcon">
                <div style = "height: 18px;width: 18px;border-radius:50%;background: #5CB0E6;">
                    <i class="ifbp-icon-add" @click = "handlechange(app,inx)"></i>
                </div>
            </div>
            <div class="img-and-dynamic">
			<span class="img-area">
			<i v-if="!app.appIcon" class="ifbp-icon-patch" style="color:#8E8E93"></i>
    		<i v-else :class="['iconfont_form appIcon', app.appIcon ? app.appIcon :  'icon-C-app']"></i></span>
            </div>
            <div class = "colle-message">
                <div class="card-title" :title="app.label" >{{app.label}}</div>
                <div class="subtitle"> {{app.app_desc }} </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "permissionBody",
        data: function () {
            return {
                count: 0
            }
        },
        props: {
            group: {
                type: Array,
                default: ""
            },
            showIcon: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            handlechange: function (app, inx) {
                this.$emit("handlechange", app, inx);
            }
        },
    }
</script>

<style scoped>

</style>