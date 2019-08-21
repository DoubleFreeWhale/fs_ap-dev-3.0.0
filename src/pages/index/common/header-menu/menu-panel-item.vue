<template>
    <div class="group-list">
        <div :class="{'group-label':true,'is-show':showGroup}" @click="groupLabelClick">
            <i :class="{'ifbp-icon-angle-right':true, 'el-icon-arrow-right':true}"></i>
            <span>{{group.label}}</span>
        </div>
        <div :id="group.id" style="margin-left: 24px;display: block;">
            <div class="menu-panel-item" v-for="node in group.children"
                 @click="handlePanelItemClick(node,node.label,label.label)">
                <span :title='node.label.length<=7 ? "" : node.label'>{{node.label}}</span>
            </div>
        </div>

    </div>

</template>

<script>
    export default {
        data() {
            return {
                showGroup: true
            }
        },
        props: {
            group: {
                type: Object,
                required: true
            },
            label: {
                required: true
            }
        },
        methods: {
            groupLabelClick() {
                this.showGroup = !this.showGroup;
                if (this.showGroup) {
                    $("#" + this.group.id).show(300)
                } else {
                    $("#" + this.group.id).hide(300)
                }

            },
            handlePanelItemClick(data, panel, org) {
                var path = data && data.path; // 获得小磁贴的path
                this.$emit("handlePanelItemClick", org);
                if (path) {
                    this.$router.replace({
                        path: path
                    })
                }
            },
        }
    }

</script>

<style>


</style>
