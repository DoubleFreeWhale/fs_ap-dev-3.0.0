<template>
    <div id="elToolsPanel" ref="elToolsPanel" v-bind:draggable=canDrag  class="dressTips" v-bind:class="{'ui-draggable' : canDrag}"
         v-bind:style="{left: left+'px', top: top+'px', opacity: 1, display: display}" aria-disabled="false" v-on:dragstart="dragstart">
        <!-- <div class="dressTitle t_c3" v-if="false" onselectstart="return false;" style="-moz-user-select:none;" v-bind:class="{'draggable' : canDrag}">
          <i class="fa fa-arrows h4" v-show="canDrag"></i>&nbsp;
          <span role="name">{{model.text}}</span>
        </div> -->
        <!-- <div class="dressPad clearfix"> -->
        <div class="dressBtnBar">
            <ul class="dressBtnUl" v-show="canDrag">
                <li  title="拖拽" onselectstart="return false;" style="-moz-user-select:none;" v-bind:class="{'draggable' : canDrag}">
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
            <!-- <ul class="dressBtnUl">
              <li role="parent" title="上一级" v-on:click="goToParent"><span class="fa fa-expand"></span></li>
              <li role="child" title="下一级" v-on:click="goToChild"><span class="fa fa-compress"></span></li>
            </ul> -->
            <!-- <ul class="dressBtnUl">
                      <li role="left" title="左移" class="disabled" data-tips="3_t" showtipsel="1"><span class="fa fa-arrow-left"></span></li>
                      <li role="right" title="右移" data-tips="3_t" showtipsel="1" class=""><span class="fa fa-arrow-right"></span></li>
                  </ul> -->
            <!-- <ul class="dressBtnUl">
              <li role="manager" title="管理" v-on:click="manager"><span class="fa fa-cog"></span></li>
            </ul> -->
            <ul class="dressBtnUl">
                <!--
                        <li role="copy" title="复制" data-tips="3_t"><span class="icon-copy"></span></li>
                        <li role="paste" title="粘贴" data-tips="3_t"><span class="icon-paste"></span></li>
                        <li role="cut" title="剪切" data-tips="3_t"><span class="icon-scissors"></span></li>
                        -->
                <li role="delete" title="删除" data-tips="3_t" v-on:click="remove">
                    <span class="fa fa-trash-o"></span>
                </li>
            </ul>
            <ul class="dressBtnUl" v-show="canDrag">
                <li  title="置顶" onselectstart="return false;" style="-moz-user-select:none;" v-on:click="removeToTop">
                    <span class="fa fa-arrow-up" ></span>
                </li>
            </ul>
            <ul class="dressBtnUl" v-show="canDrag">
                <li  title="置底" onselectstart="return false;" style="-moz-user-select:none;" v-on:click="removeToBottom">
                    <span class="fa fa-arrow-down" ></span>
                </li>
            </ul>

        </div>
        <!-- </div> -->
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
                if(comp.$options._componentTag === 'el-form'){
                    this.showFormAdd = true;
                }else{
                    this.showFormAdd = false;
                }
                this.model = comp.$data; //comp.model;
                // var top = el.offset().top - elToolsPanelHeight;
                // if (top < 0) {
                //     top = el.offset().top + el.outerHeight();
                // }
                // this.top = top;
                // this.left = el.offset().left;
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
                var top = el.offset().top - elToolsPanelHeight + scrollTop;
                if (top < 0) {
                    top = el.offset().top + el.outerHeight();
                }
                this.top = top;
                this.left = el.offset().left + scrollLeft;
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
             * 置顶操作
             */
            removeToTop:function(){
                var oThis = this;
                this.$confirm('确定将当前元素移至顶部吗？', '确认').then(function () {
                    oThis.display = 'none';
                    oThis.model = {};
                    window.engine.removeToTop();
                    // $(oThis.actived_ele).remove();
                });
            },
            /**
             * 置底操作
             */
            removeToBottom:function(){
                var oThis = this;
                this.$confirm('确定将当前元素移至底部吗？', '确认').then(function () {
                    oThis.display = 'none';
                    oThis.model = {};
                    window.engine.removeToBottom();
                    // $(oThis.actived_ele).remove();
                });
            },
            /**
             * 拖拽事件
             */
            dragstart: function (e) {
                parent._dragSrcEl = e.target;
                parent._actived_ele = this.actived_ele;
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
                parent.shell.manager(this.actived_ele);
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
                window.engine.createComp('el-form-panel',ele[0]);
                window.engine.refreshDom();
            },

        }
    }
</script>

<style scoped>

</style>