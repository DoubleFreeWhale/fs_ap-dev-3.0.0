<template>
    <div id="elToolsPanel" ref="elToolsPanel" v-bind:draggable=canDrag class="dressTips"
         v-bind:class="{'ui-draggable' : canDrag}"
         v-bind:style="{left: left+'px', top: top+'px', opacity: 1, display: display}" aria-disabled="false"
         v-on:dragstart="dragstart">
        <div class="dressBtnBar">
            <ul class="dressBtnUl" v-show="canDrag">
                <li title="拖拽" onselectstart="return false;" style="-moz-user-select:none;"
                    v-bind:class="{'draggable' : canDrag}">
                    <span class="fa fa-arrows h4" style="cursor:move;"></span>
                </li>
            </ul>
            <ul class="dressBtnUl" v-show="showAdd">
                <li role="add" title="增加" v-on:click="addChild">
                    <span class="fa fa-plus"></span>
                </li>
            </ul>
            <ul class="dressBtnUl" v-show="showFormAdd">
                <li role="formAdd" title="增加分组" v-on:click="addFormPanel">
                    <span class="fa fa-plus"></span>
                </li>
            </ul>
            <ul class="dressBtnUl">
                <li role="delete" title="删除" data-tips="3_t" v-on:click="remove">
                    <span class="fa fa-trash-o"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    var elToolsPanelHeight = 32;
    export default {
        name: "elToolsPanel",
        props: ['actived_ele'],
        data: function () {
            return {
                display: 'none',
                showAdd: false,
                canDrag: false,
                showFormAdd: false,
                left: 0,
                top: 0,
                // eletext:'',
                model: {}
            };
        },
        watch: {
            actived_ele: function (element) {
                if (!element) {
                    this.display = 'none';
                    return;
                }
                var el = $(element);
                var comp = element['comp'];
                if (comp.$options._componentTag === 'el-table') {
                    this.showAdd = true;
                } else {
                    this.showAdd = false;
                }
                if (comp.$options._componentTag === 'el-form') {
                    this.showFormAdd = true;
                } else {
                    this.showFormAdd = false;
                }
                this.model = comp.$data; //comp.model;
                this.calcPostion();
                if (el.attr('can-drag') == 'true') {
                    this.canDrag = true;
                } else {
                    this.canDrag = false;
                }
                this.display = 'block';
            }
        },
        methods: {
            calcPostion: function () {

                if (!this.actived_ele) {
                    this.display = 'none';
                    return;
                }
                var el = $(this.actived_ele);
                var scrollTop = $('#editor')[0].scrollTop;
                var scrollLeft = $('#editor')[0].scrollLeft;
                var editorPosition=$('#editor').offset();
                var top = el.offset().top -editorPosition.top - elToolsPanelHeight + scrollTop;
                if (top < 0) {
                    top = el.offset().top + el.outerHeight();
                }
                this.top = top;
                this.left = el.offset().left-editorPosition.left + scrollLeft;
            },
            /**
             * 删除
             */
            remove: function () {
                var oThis = this;
                this.$confirm('确定删除当前元素吗？', '确认').then(function () {
                    oThis.display = 'none';
                    oThis.model = {};
                    window.engine.removeNode();
                    // $(oThis.actived_ele).remove();
                });
            },
            /**
             * 拖拽事件
             */
            dragstart: function (e) {
                window._dragSrcEl = e.target;
                window._actived_ele = this.actived_ele;
                e.dataTransfer.effectAllowed = 'move';
            },
            hide: function () {
                this.display = 'none'
                this.actived_ele = null;
            },
            /**
             * 管理面板
             */
            manager: function () {
                window.shell.manager(this.actived_ele);
            },
            /**
             * 选中父级
             */
            goToParent: function () {
                if (!this.actived_ele)
                    return;
                var parent = this.actived_ele.parentNode;
                var target = null;
                while (parent.nodeName != 'BODY') {
                    if (parent['comp']) {
                        target = parent;
                        break;
                    }
                    parent = parent.parentNode;
                }
                if (target) {
                    window.engine.activeNode(target);
                }

            },
            /**
             * 选中子级
             */
            goToChild: function () {
                if (!this.actived_ele)
                    return;
                var target = window.engine.getChildCompEl(this.actived_ele);
                if (target) {
                    window.engine.activeNode(target);
                }
            },
            /**
             * 添加子项
             */
            addChild: function () {
                var actived_ele = window.engine.actived_ele;
                if (!actived_ele)
                    return;
                var _id = $(actived_ele).attr('_id');
                var ele = window.engine.currentDom.find('[_id=' + _id + ']');
                var compAttr = {
                    ctrlType: 'el-table-column',
                    code: '',
                    name: 'newField'
                }
                window.engine.createTableColumnComp({
                    compAttr: compAttr,
                    ele: ele[0]
                });
                window.engine.refreshDom();
            },
            /**
             * 添加form分组
             */
            addFormPanel: function () {
                var actived_ele = window.engine.actived_ele;
                if (!actived_ele)
                    return;
                var _id = $(actived_ele).attr('_id');
                var ele = window.engine.currentDom.find('[_id=' + _id + ']');
                window.engine.createComp('el-form-panel', ele[0]);
                window.engine.refreshDom();
            },

        }
    }
</script>

<style scoped>

</style>