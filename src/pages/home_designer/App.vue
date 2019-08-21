<template>
    <div>
        <div id="pagePanel" v-bind:class="{openPanel: rightPanelOn, openPanel_left:leftPanelOn}">
            <!--左侧组件面板c-->
            <div class="f_panel_left hideTop" id="toolsLeft"
                 v-bind:class="[(leftPanelOn && rightPanelOn)?'fullWidth':'noneWidth']">
                <a href="javascript:;" v-on:click="leftPaneltoggle"
                   v-bind:class="['f_panelSwitch_left', leftPanelOn ? 'off' : 'on']" title="收起" role="toggleBtn"
                   data-tips="3_r">
                    <i></i>
                </a>
                <div class="f_panelNav_left clearfix">
                    <ul role="toolsBar">
                        <li v-bind:class="{active : leftPanelShow == 'element'}" v-on:click="showElementPanel">小部件</li>
                        <li v-if="dType == 'ovpdesigner'" v-bind:class="{active : leftPanelShow == 'layout'}"
                            v-on:click="showLayoutPanel" class="s234">布局
                        </li>
                        <li v-if="dType == 'uitemplate'" v-bind:class="{active : leftPanelShow == 'object'}"
                            v-on:click="showObjectPanel">业务对象
                        </li>
                    </ul>
                </div>
                <div class="toolsContainer_left" role="toolsContainer">
                    <!--元素-->
                    <div v-bind:style="{display:  leftPanelShow == 'element' ? 'block' : 'none'}">
                        <div class="f_panelMain_left boxscroll">
                            <!--布局-->
                            <dl class="setPanel" v-if="dType !== 'ovpdesigner'">
                                <dt v-on:click="layoutPanelOn = !layoutPanelOn">
                                    <i v-bind:class="['el-tree-node__expand-icon',  layoutPanelOn ? 'expanded' : '']"></i>常用布局
                                </dt>
                                <dd>
                                    <div class="setPanelMain addPanelList" v-bind:class="{'active': layoutPanelOn}">
                                        <ul class="clearfix">
                                            <li v-for="item in layoutArray">
                                                <div v-drage class="custom_module_box ui-draggable"
                                                     v-bind="{keysssss:item.key,name:item.name}">
                                                    <div class="custom_module_ico">
                                                        <i v-bind:class="item.icon"></i>
                                                    </div>
                                                    <p class="custom_module_name">{{item.name}}</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </dd>
                            </dl>
                            <!--布局 end-->
                            <!--基本组件-->
                            <dl class="setPanel" v-if="dType == 'pagedesigner'">
                                <dt v-on:click="baseCompPanelOn = !baseCompPanelOn">
                                    <i v-bind:class="['el-tree-node__expand-icon', baseCompPanelOn ? 'expanded' : '']"></i>基础控件
                                </dt>
                                <dd>
                                    <div class="setPanelMain addPanelList" v-bind:class="{'active': baseCompPanelOn}">
                                        <ul class="clearfix">
                                            <li v-for="item in baseCompArray">
                                                <div v-drage class="custom_module_box ui-draggable"
                                                     v-bind="{key:item.key,name:item.name}">
                                                    <div class="custom_module_ico">
                                                        <i v-bind:class="item.icon"></i>
                                                    </div>
                                                    <div class="custom_module_name">{{item.name}}</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </dd>
                            </dl>
                            <!--基本控件 end-->

                            <!--表单控件-->
                            <dl class="setPanel" v-if="dType !== 'ovpdesigner'">
                                <dt v-on:click="formCompPanelOn = !formCompPanelOn">
                                    <i v-bind:class="['el-tree-node__expand-icon', formCompPanelOn ? 'expanded' : '']"></i>表单控件
                                </dt>
                                <dd>
                                    <div class="setPanelMain addPanelList" v-bind:class="{'active': formCompPanelOn}">
                                        <ul class="clearfix">
                                            <li v-for="item in formCompArray">
                                                <div v-drage class="custom_module_box ui-draggable"
                                                     v-if="item.show !== false" v-bind="{key:item.key,name:item.name}">
                                                    <div class="custom_module_ico">
                                                        <i v-bind:class="item.icon"></i>
                                                    </div>
                                                    <p class="custom_module_name">{{item.name}}</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </dd>
                            </dl>
                            <!--表单控件 end-->

                            <!--业务组件-->
                            <dl class="setPanel" v-if="dType == 'pagedesigner'">
                                <dt v-on:click="bizCompPanelOn = !bizCompPanelOn">
                                    <i v-bind:class="['el-tree-node__expand-icon', bizCompPanelOn ? 'expanded' : '']"></i>业务组件
                                </dt>
                                <dd>
                                    <div class="setPanelMain addPanelList" v-bind:class="{'active': bizCompPanelOn}">
                                        <ul class="clearfix">
                                            <li v-for="item in bizCompArray">
                                                <div v-drage class="custom_module_box ui-draggable"
                                                     v-bind="{key:item.key,name:item.name}">
                                                    <div class="custom_module_ico">
                                                        <i v-bind:class="item.icon"></i>
                                                    </div>
                                                    <div class="custom_module_name">{{item.name}}</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </dd>
                            </dl>
                            <!--业务控件 end-->

                            <!-- <dt v-on:click="layoutPanelOn = !layoutPanelOn">
                                                  <i v-bind:class="['el-tree-node__expand-icon',  layoutPanelOn ? 'expanded' : '']"></i>常用布局</dt>
                                                                <dd>
                                                                    <div class="setPanelMain addPanelList" v-bind:class="{'active': layoutPanelOn}"> -->


                            <!--小部件控件-->
                            <dl class="setPanel" v-if="dType == 'ovpdesigner'">
                                <!--<dt v-on:click="widgetsPanelOn = !widgetsPanelOn">-->
                                <!--<i v-bind:class="['el-tree-node__expand-icon', widgetsPanelOn ? 'expanded' : '']"></i>小部件控件-->
                                <!--</dt>-->
                                <el-input placeholder="搜索小部件名称" icon="search"
                                          style="width: 224px;margin-right: 8px;margin-bottom: 8px;margin-left: 8px;"
                                          v-model="widgetInput" @keyup.enter.native="searchWidget"
                                          :on-icon-click="searchWidget"></el-input>
                                <div>
                                    <div class="no-widget" v-show="noWidget">没有找到“<span>{{ widgetInput }}</span>”相关内容
                                    </div>
                                    <div v-for="(items,key) in widgetArray">
                                        <dt v-on:click="changeShowWidget(key)" style="cursor: pointer;">
                                            <i v-bind:class="['el-tree-node__expand-icon', items.show ? 'expanded' : '']"></i>
                                            {{ items.categoryName }}
                                        </dt>
                                        <dd>
                                            <div class="setPanelMain addPanelList"
                                                 v-bind:class="{'active': items.show}">
                                                <ul class="clearfix">
                                                    <li v-if="item.show !== false" v-for="item in items.widgetList">
                                                        <div v-drage class="custom_module_box ui-draggable"
                                                             v-bind="{key:item.code,name:item.name}">
                                                            <div class="custom_module_ico">
                                                                <i v-bind:class="item.icon"></i>
                                                            </div>
                                                            <p class="custom_module_name" :title="item.name">
                                                                {{item.name}}</p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                            <!--小部件控件 end-->

                            <!--系统组件-->
                            <dl class="setPanel" v-if="false">
                                <dt v-on:click="sysCompPanelOn = !sysCompPanelOn">
                                    <i v-bind:class="['el-tree-node__expand-icon', sysCompPanelOn ? 'expanded' : '']"></i>系统组件
                                </dt>
                                <dd>
                                    <div class="setPanelMain addPanelList" v-bind:class="{'active': sysCompPanelOn}">
                                        <ul class="clearfix">
                                            <li v-for="item in sysCompArray">
                                                <div v-drage class="custom_module_box ui-draggable"
                                                     v-bind="{key:item.key,name:item.name}">
                                                    <div class="custom_module_ico">
                                                        <i v-bind:class="item.icon"></i>
                                                    </div>
                                                    <div class="custom_module_name">{{item.name}}</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </dd>
                            </dl>
                            <!--系统组件 end-->
                        </div>
                    </div>
                    <!--元素 end-->
                    <!--业务对象 start-->
                    <div v-bind:style="{display:  leftPanelShow == 'object' ? 'block' : 'none'}">
                        <div class="f_panelMain_left boxscroll">
                            <div class="boxPad">
                                <el-tree id="form-businessObj" ref="businessTree" :props="treeProps" :data="treeData"
                                         default-expand-all empty-text=""
                                         :filter-node-method="treeFilterNode"></el-tree>
                                <!-- <div id="form-businessObj" class="ztree-div-class ztree j_scroll_editNew scroll-wrapperNew hide" style="height:100%;display:block;">
                              </div>-->
                            </div>
                        </div>
                    </div>
                    <!--业务对象 end-->
                    <!--布局模板 start-->
                    <div v-bind:style="{display:  leftPanelShow == 'layout' ? 'block' : 'none'}">
                        <div class="f_panelMain_left boxscroll">
                            <!--布局-->
                            <dl class="setPanel">
                                <dt v-on:click="layoutPanelOn = !layoutPanelOn">
                                    <i v-bind:class="['el-tree-node__expand-icon',  layoutPanelOn ? 'expanded' : '']"></i>常用布局
                                </dt>
                                <dd>
                                    <div class="setPanelMain addPanelList" v-bind:class="{'active': layoutPanelOn}">
                                        <ul class="clearfix">
                                            <li v-for="item in layoutArray">
                                                <div v-drage class="custom_module_box ui-draggable"
                                                     v-bind="{keynode:item.key,name:item.name}">
                                                    <div class="custom_module_ico">
                                                        <i v-bind:class="item.icon"></i>
                                                    </div>
                                                    <p class="custom_module_name">{{item.name}}</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </dd>
                            </dl>
                            <!--布局 end-->
                            <!--模板-->
                            <dl class="setPanel">
                                <dt>布局模板</dt>
                                <dd>
                                    <div class="setPanelMain addPanelList layoutTemplate" style="display: block">
                                        <ul class="clearfix">
                                            <li @click="selectTemplateLayout(item)" v-for="item in layoutTempArray"
                                                :id="item.id" class="container item-layout" v-html="item.tpl">
                                            </li>
                                        </ul>
                                    </div>
                                </dd>
                            </dl>
                            <!--模板 end-->
                        </div>
                    </div>
                    <!--布局模板 end-->
                </div>
            </div>
            <!--左侧组件面板 end-->
            <div class="f_main">
                <div class="f_mainTool">
                    <div class="f_mainToolImg">
                        <div v-text="logoText" class="logo-text"></div>
                    </div>
                    <div class="f_mainToolLeft">
                        <!-- <i class="fa fa-floppy-o"></i> -->
                        <el-button type="text" id="deleteBtn" @click="deleteFun" v-if="showDeleteBtn" showtipsel="1"
                                   title="修复" style="display:none;">删除
                        </el-button>
                        <el-button type="text" id="repairBtn" @click="repair" showtipsel="1" title="修复"
                                   style="display:none;">修复
                        </el-button>
                        <el-button type="text" id="clearBtn" @click="clear" showtipsel="1" title="清空"
                                   style="display:none;">清空
                        </el-button>
                        <el-button type="text" id="saveBtn" @click="save" showtipsel="1" title="保存"
                                   style="display:none;">保存
                        </el-button>
                        <el-button type="text" v-if="dType == 'ifrom'" id="moreSaveBtn" @click="save(true)"
                                   showtipsel="1" title="保存并启用" style="display:none;">保存启用
                        </el-button>

                        <el-button type="text" v-if="dType == 'pagedesigner'" @click="showTemplateDialog" showtipsel="1"
                                   title="选择模板" style="display:none;">选择模板
                        </el-button>
                        <el-button type="text" v-if="dType == 'pagedesigner'" @click="exportCode" showtipsel="1"
                                   title="导出代码" style="display:none;">导出代码
                        </el-button>
                        <el-button type="text" @click="preview" showtipsel="1" title="预览" style="display:none;">预览
                        </el-button>

                    </div>
                    <div class="f_mainToolMedia" id="rulers">
<!--                        <span class="fa fa-desktop" data-width="max" v-on:click="changeToPc"-->
<!--                              v-bind:class="{active : frameWidth == '100%'}"></span>-->
<!--                        <span class="fa fa-tablet fa-rotate-270" v-on:click="changeToTabletH" style="font-size:24px;"-->
<!--                              title="pad-横屏" v-bind:class="{active : frameWidth == '1024px'}"></span>-->
<!--                        <span class="fa fa-tablet" v-on:click="changeToTabletV" title="pad-竖屏" style="font-size:24px;"-->
<!--                              v-bind:class="{active : frameWidth == '768px'}"></span>-->
                    </div>
                    <div class="f_mainToolRight">

                    </div>
                </div>
                <div class="f_content" id="pageContainer" v-show="true" style="display:none;">
                    <div class="f_web" id="frameContainer" v-bind:style="{width:frameWidth}">
                        <designer @updata="updatafn"></designer>
                    </div>
                </div>
                <div class="f_footTool">
                    <ul class="clearfix" id="pathPanel">
                        <li v-for="(item,index) in modelParents" v-on:click="selectElement(item)"
                            v-bind:class="{'lastLi': index == (modelParents.length -1)}">{{item.text}}
                        </li>
                    </ul>
                </div>
                <div class="f_footer">
                    <div class="view-btn" :class="{'active': showType === 'VIEW'}" @click="showCode('VIEW')">VIEW</div>
                    <div class="view-btn" :class="{'active': showType === 'HTML'}" @click="showCode('HTML')">HTML</div>
                    <div class="view-btn" :class="{'active': showType === 'DATA'}" @click="showCode('DATA')">DATA</div>
                </div>

                <!-- <ul class="f_footUl" v-show="true" style="display:none;">
                <li v-bind:class="{active : mainShow === 'form'}" v-on:click="mainShowForm">表单</li>
                <li v-bind:class="{active : mainShow === 'table'}" v-on:click="mainShowTable">表格</li>
              </ul> -->
            </div>
            <!--右侧属性面板-->
            <div class="f_panel hideTop" id="toolsMain"
                 v-bind:class="[(leftPanelOn && rightPanelOn)?'fullWidth':'noneWidth']">

                <div class="f_panelNav clearfix">
                    <ul role="toolsBar">
                        <li>属性</li>
                    </ul>
                </div>
                <div class="toolsContainer" role="toolsContainer">
                    <!-- 属性面板 begin -->
                    <div v-bind:style="{display:  rightPanelShow == 'attribute' ? 'block' : 'none'}">
                        <div class="f_panelMain boxscroll" tabindex="5104" style=" outline: none;">
                            <div class="boxPadRight" role="toolsWrapper">
                                <div role="properties">
                                    <div role="setLayoutContainer" class="ct_2">
                                        <ul v-for="(propertyItem, index) in propertyUIs">
                                            <label class="propertyLabel propertyTitle form_property_split">{{index == 0
                                                ? currentCompName : childCompName}} </label>
                                            <li v-for="item in propertyItem" v-if="!item.hidden" class="propertyLi">
                                                <label v-if="item.type != 'boolean' && item.type != 'shortcut'"
                                                       class="propertyLabel">{{item.name}} </label>
                                                <!-- 文本输入 -->
                                                <el-input v-if="item.type == 'string' || item.type == 'number'"
                                                          v-model="models[index][item.model]"
                                                          @blur="attrChange(item, index)"
                                                          class="propertyInput"></el-input>
                                                <!-- 复选框 -->
                                                <!-- <input type="checkbox" v-bind:id="item.model" v-if="item.type == 'boolean'" v-model="models[index][item.model]" @change="attrChange(item, index)">
                                              <label v-if="item.type == 'boolean'" v-bind:for="item.model" class="propertyCheckLabel">{{ item.name }}</label> -->
                                                <el-checkbox v-if="item.type == 'boolean'"
                                                             v-model="models[index][item.model]"
                                                             @change="attrChange(item, index)">{{ item.name }}
                                                </el-checkbox>
                                                <!-- 下拉框 -->
                                                <el-select class="propertyInput" v-if="item.type === 'select'"
                                                           v-model="models[index][item.model]"
                                                           @change="attrChange(item, index)">
                                                    <el-option v-for="opt in item.options" :key="opt.value"
                                                               :label="opt.label" :value="opt.value"></el-option>
                                                </el-select>
                                                <!-- radio、checkbox、select 选择项编辑 -->
                                                <ul v-if="item.type == 'optionsEditor'" class="optionsEditor">
                                                    <span v-if="!models[index][item.model] || models[index][item.model].length === 0"
                                                          class="fa fa-plus-circle options-icon" title="添加一个新的选择项"
                                                          @click="addOptionsEditor(models,item,index)"></span>
                                                    <li v-for="(opt,optIndex) in models[index][item.model]">
                                                        <el-input type="text" class="options-value" v-model="opt.value"
                                                                  placeholder="选项实际值"
                                                                  @blur="attrChange(item, index)"></el-input>
                                                        <el-input type="text" class="options-name" v-model="opt.label"
                                                                  placeholder="选项显示值"
                                                                  @blur="attrChange(item, index)"></el-input>
                                                        <span class="fa fa-plus-circle options-icon" title="添加一个新的选择项"
                                                              @click="addOptionsEditor(models,item,index)"></span>
                                                        <span class="fa fa-minus-circle options-icon" title="删除此选择项"
                                                              @click="deleteOptionsEditor(models[index][item.model],optIndex,item,index)"></span>
                                                    </li>
                                                </ul>

                                                <ul v-if="item.type == 'shortcut'" class="shortcut_ul">
                          <span class="shortcut_span1" v-if="item.id == 'shortcutnew'">
                                <el-button @click="addShortcut(models[index][item.model])">快捷功能添加</el-button>
                            </span>
                                                    <span class="shortcut_span1" style="top: 50px;"
                                                          v-if="item.id == 'homePage'">
                                <el-button @click="addShortcutApp(models[index][item.model])">角色预置收藏</el-button>
                          </span>
                                                </ul>


                                                <el-dialog title="新增功能" :visible="dialogVisible" size="large"
                                                           custom-class="mycollection" :before-close="handleClose1">
                                                    <div class="mycollection-header" style="height: 64px;">
                                                        <el-input placeholder="搜索收藏名称" icon="search" v-model="input2"
                                                                  style="width: 288px;margin: 16px 16px 24px 0; float: right;"
                                                                  :on-icon-click="handleIconClick"
                                                                  @change="handleIconClick">
                                                        </el-input>
                                                    </div>
                                                    <div class="mycollection-body">


                                                        <div v-for="(group,index) in showPermissionList"
                                                             v-if="permissionList && permissionList.length>0 ">
                              <span class="persion-groupName">
											                <el-checkbox :indeterminate="group.indeterminate"
                                                                         v-model="group.checked"
                                                                         @change="handleCheckAllChange(group,index)">{{group.label}}</el-checkbox>
											            </span>
                                                            <permission-body
                                                                    @handleChange="function(item,itemindx){handleChange(item, itemindx,index)}"
                                                                    :group="group.check"></permission-body>
                                                            <permission-body
                                                                    @handleChange="function(item, itemindx ){handleChange(item, itemindx,index)}"
                                                                    :group="group.uncheck"></permission-body>
                                                        </div>
                                                    </div>


                                                    <span slot="footer" class="dialog-footer">
											    <el-button @click="dialogVisible = false">取 消</el-button>
											    <el-button type="primary" @click="saveCollection">确 定</el-button>
											  </span>
                                                </el-dialog>

                                                <!-- 功能快捷小部件 -->
                                                <ul v-if="item.type == 'shortcut'" class="shortcut_ul">
                                                    <!-- <span class="shortcut_span">
                                                      <el-button type="primary" class="shortcut_add shortcut_btn" icon="plus" @click="addShortcut(models[index][item.model])"></el-button>
                                                    </span> -->
                                                    <div v-if="models[index][item.model] != '[]'">

                                                        <li v-for="(card, index) in models[index][item.model]">
                                                            <div class="shortcutProp">
                                                                <span>{{card.name}}</span>
                                                                <el-button type="primary" class="shortcut_btn"
                                                                           icon="edit"
                                                                           @click="changeShortcut(card, index)"></el-button>
                                                                <el-button type="primary" class="shortcut_btn"
                                                                           icon="delete"
                                                                           @click="deleteShortcut(index)"></el-button>
                                                            </div>
                                                        </li>
                                                    </div>
                                                </ul>
                                            </li>
                                        </ul>
                                        <!--循环结束-->
                                        <el-dialog title="快捷小部件" :visible.sync="shortcutVisible" size="tiny">
                                            <el-form label-width="80px" :model="shortcutform">
                                                <el-form-item label="名称">
                                                    <el-input v-model="shortcutform.name"></el-input>
                                                </el-form-item>
                                                <el-form-item label="跳转路由">
                                                    <el-input v-model="shortcutform.links"></el-input>
                                                </el-form-item>
                                                <el-form-item label="图标">
                                                    <i class="appIcon cyan iconfont_form"
                                                       :class="shortcutform.iconClass" @click="changeIcon"
                                                       style="font-size: 30px;vertical-align: top;"></i>
                                                    <el-input v-model="shortcutform.iconClass"
                                                              style="width: 91%"></el-input>
                                                </el-form-item>
                                                <el-form-item label="渲染方式">
                                                    <el-select v-model="shortcutform.renderType" placeholder="请选择活动区域"
                                                               @change="showRenderType">
                                                        <el-option label="js" value="js"></el-option>
                                                        <el-option label="文字" value="word"></el-option>
                                                        <el-option label="链接" value="link"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item v-if="shortcutform.renderType == 'js'" label="js">
                                                    <el-input v-model="shortcutform.render"></el-input>
                                                </el-form-item>
                                                <el-form-item v-else-if="shortcutform.renderType == 'word'" label="文字">
                                                    <el-input v-model="shortcutform.render"></el-input>
                                                </el-form-item>
                                                <el-form-item v-else-if="shortcutform.renderType == 'link'" label="链接">

                                                    <div class="render-type-content"
                                                         v-for="(item,index) in shortcutform.renderLinks" :key="index">
                                                        <el-input v-model="item.text" placeholder="名称"
                                                                  class="render-type-common">{{ item.text }}
                                                        </el-input>
                                                        <el-input v-model="item.link" placeholder="链接"
                                                                  class="render-type-common">{{ item.link }}
                                                        </el-input>
                                                        <i class="ifbp-icon-close el-icon-close el-icon-pt-guanbi"
                                                           @click="deleteLinks(index)"></i>
                                                    </div>
                                                    <p style="color: rgb(95, 95, 100)">
                                                        <span type="primary" v-show="addLinksShow" @click="addLinks">添加链接</span>
                                                    </p>
                                                </el-form-item>
                                            </el-form>
                                            <span slot="footer" class="dialog-footer">
                        <el-button @click="shortcutVisible = false">取 消</el-button>
                        <el-button type="primary" @click="shortcutSure(shortcutform)">确 定</el-button>
                      </span>
                                            <div v-show="iconListShow" class="icon-list">
                                                <ul class="clearfix">
                                                    <li v-for="(names,index) in iconList" :key="'names'+index"
                                                        @click="choiceIcon(index)">
                                                        <i :class="'ifbp-icon-' + names[0]"></i>
                                                    </li>
                                                </ul>
                                            </div>
                                        </el-dialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 属性面板 end -->
                </div>
            </div>
            <!--右侧属性面板 end-->
            <div class="f_code" :class="{'show_code': showType === 'HTML'}">
                <pre id="code_editor" style="width:100%;height:100%;margin:0;"></pre>
            </div>

            <div class="f_code" :class="{'show_code': showType === 'DATA'}">
                <el-input type="textarea" :disabled="true"
                          style="height:100%;padding:20px;box-sizing:border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;"
                          v-model="tplDataStrFormat">
                </el-input>
            </div>

        </div>
        <ifbp-del-dialog v-model="delDialogVisible" title="个性化布局" message="确认删除该布局？删除后无法恢复。" @click="deleteClick"
                         @cancel-click="deleteCancelClick">
        </ifbp-del-dialog>

    </div>
</template>

<script>
    import compUtil from './js/editor/compUtil'
    import indexMixin from './ovpdesigner/index_mixin'
    import ifbpIcons from './res/ifbp-icon'
    import permissionBody from './components/permissionBody'
    import designer from './designer.vue'

    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    var baseCompArray = compUtil.getBaseCompArray();
    var formCompArray = compUtil.getFormCompArray();
    var layoutArray = compUtil.getLayoutArray();
    var widgetArray = compUtil.getWidgetArray('', 'init');
    var getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.parent.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    window.homePageUrl = window.location.href;

    var designer_flag = "workbench";
    if ($.getUrlParam('flag') == 'workbench') {
        designer_flag = "workbench";
    } else if ($.getUrlParam('roleid')) {
        designer_flag = "role";
    } else {
        designer_flag = "ovp";
    }
    for (var i = 0; i < widgetArray.length; i++) {
        widgetArray[i]["show"] = true;
        widgetArray[i]['widgetList'].forEach(function (item) {
            if (item.id == 'shortcutnew' && (designer_flag == 'workbench' || designer_flag == 'role')) {
                item['show'] = false
            }
            if (item.id == 'homePage' && designer_flag == 'ovp') {
                item['show'] = false
            }
        })

    }
    var sysCompArray = compUtil.getSysCompArray();
    var bizCompArray = compUtil.getBizCompArray();
    var layoutTemArray = compUtil.getLayoutTempArray();
    var compTypes = []
    for (var i = 0; i < formCompArray.length; i++) {
        compTypes.push({
            label: formCompArray[i].name,
            value: formCompArray[i].key
        })
    }

    export default {
        mixins: [indexMixin],
        data() {
            return {
                delDialogVisible: false,
                showDeleteBtn: false,
                dialogVisible: false,
                widgetInput: '',
                dType: 'uitemplate',
                // isIform: window._iform,
                logoPath: '',
                logoText: '',
                showType: 'VIEW',
                isShowCode: false,
                exportCodeDialogVisible: false,
                actived_ele: null,
                childCompEl: null,
                formInfo: {},
                modelParents: [],
                currentCompName: '',
                childCompName: '',
                currentModel: {},
                currentPropertyUI: {},
                childModel: {},
                childPropertyUI: {},
                models: [],
                treeData: [],
                treeProps: {
                    id: 'id',
                    pid: 'pid',
                    children: 'children',
                    label: 'name'
                },
                ss: "",
                propertyUIs: [[{}]],
                leftPanelOn: true, //左侧面板显示隐藏
                rightPanelOn: true, //右侧面板显示隐藏
                layoutPanelOn: true, //布局panel显示隐藏
                baseCompPanelOn: true, //组件panel显示隐藏
                sysCompPanelOn: true, //系统组件panel显示隐藏
                bizCompPanelOn: true, //系统组件panel显示隐藏
                formCompPanelOn: true, //系统组件panel显示隐藏
                widgetsPanelOn: true, //系统组件panel显示隐藏
                frameWidth: "100%", //编辑区域宽度
                leftPanelShow: 'object', //左侧面板显示内容  element or object
                mainShow: 'form',
                rightPanelShow: 'attribute', //右侧面板显示内容  form or attribute
                dragTreeData: [], //拖拽的数节点
                dragShowType: 'tableform',
                // layouts: layoutData,
                //组件信息
                // components: baseCompMap,
                // sysComponents: sysCompData,
                //基础控件
                baseCompArray: baseCompArray,
                //表单控件
                formCompArray: formCompArray,
                //布局信息
                layoutArray: layoutArray,
                layoutTempArray: layoutTemArray,
                //系统组件信息
                sysCompArray: sysCompArray,
                //业务组件信息
                bizCompArray: bizCompArray,
                //小部件信息
                widgetArray: widgetArray,
                widgetCate: {},
                shortcutarr: [],
                shortcutVisible: false,
                shortcutform: {},
                iconList: ifbpIcons,
                renderLinks: [],
                addLinksShow: true,
                iconListShow: false,
                isAdd: false,
                selectIndex: 0,
                manageDialogVisible: false, //组件管理面板
                treeDialogVisible: false, //业务对象树管理面板
                msg: 'design',
                tplDataStr: "{}",
                tplDataStrFormat: "",
                //云表单相关
                formType: [],
                isRefProcess: 'false',
                templateDialogVisible: false, // 表单模板
                templateUrl: '',
                saveAsTemplateDialogVisible: false,
                templateInfo: {
                    name: ''
                },
                templatenNamerules: {
                    name: [{
                        required: true,
                        message: '请输入模板名称',
                        trigger: 'blur'
                    }]
                },
                uiTemplateDialogVisible: false,
                buzTreeData: [],
                uiTemptableData: [],
                uiTEmplateCallback: {},
                uiTemptableColumn: [{
                    title: '业务类型',
                    prop: 'funnode',
                    display: true,
                    width: 100
                }, {
                    title: '模板名称',
                    prop: 'tempname',
                    display: true
                }, {
                    title: '模板标识',
                    prop: 'nexuskey',
                    display: true
                }],
                defaultTrueProps: {
                    id: "id",
                    pid: "pid",
                    label: "name",
                    children: "children"
                },
                currentUiTemplateRow: "",
                noWidget: false,
                input2: "",
                appLists: [],
                permissionList: [],
                originalList: []

            }
        },
        components: {permissionBody, designer},
        mounted: function () {
            window.shell=this;
            $('.boxscroll').perfectScrollbar();
            var parentWin = window.opener;
            window.parentWin = parentWin;
            let aeeet = setInterval(() => {
                console.log(window.ace);
                if (window.ace) {
                    window.codeEditor = ace.edit("code_editor");
                    window.codeEditor.setTheme("ace/theme/chrome");
                    window.codeEditor.getSession().setMode("ace/mode/html");
                    clearInterval(aeeet)
                }
            }, 10);
            // $('#ifr_content').attr('src', './designer.html');
        },
        watch: {
            actived_ele: function (element) {

                var oThis = this;
                this.activeNodeFlag = true;
                if (!element) {
                    // this.display = 'none';
                    this.currentCompName = '';
                    this.childCompName = '';
                    this.modelParents = [];
                    this.currentModel = {};
                    this.currentPropertyUI = [];
                    this.childModel = {};
                    this.childPropertyUI = [];
                    this.models = [];
                    this.models.push({});
                    this.models.push({});
                    this.propertyUIs = [[{}]];
                    return;
                }
                // var el = $(element);
                var comp = element['comp'];
                var eleId = $(element).attr('_id');
                var eleDom = window.engine.currentDom.find('[_id=' + eleId + ']');
                this.currentModel = {
                    "render-type": "default",
                    "fixed": false,
                    ":show-summary": false,
                    ":table-tree": false,
                    ":multiple": false,
                    "align": "left",
                    "header-align": "left"
                };
                // $.extend(this.currentModel,comp.$props); //comp.$data
                this.currentPropertyUI = comp.$options.meta.propertyUI;
                // // console.log(JSON.stringify(this.currentPropertyUI));
                for (var i = 0; i < this.currentPropertyUI.length; i++) {
                    var _key = this.currentPropertyUI[i].model;
                    if (_key === 'compType') {
                        this.currentPropertyUI[i].options = compTypes;
                    }
                    if (_key === ':shortcutarr') {
                        this.currentPropertyUI[i]['id'] = comp.id;
                    }
                    // 根据某一属性改变其他属性是否显示
                    if (_key === ':render-select-options-var' || _key === ':render-select-options') {
                        if (comp.$options._componentTag == 'el-table-column') {
                            var renderType = comp.$options.propsData.renderType;
                            if (renderType && renderType === 'select') {
                                this.currentPropertyUI[i].hidden = false;
                            } else {
                                this.currentPropertyUI[i].hidden = true;
                            }
                        }
                    }
                    if (_key === 'format') {
                        if (comp.$options._componentTag == 'el-table-column') {
                            var renderType = comp.$options.propsData.renderType;
                            if (renderType && renderType === 'date') {
                                this.currentPropertyUI[i].hidden = false;
                            } else {
                                this.currentPropertyUI[i].hidden = true;
                            }
                        }
                    }
                    if (_key === 'symbol') {
                        if (comp.$options._componentTag == 'el-table-column') {
                            var renderType = comp.$options.propsData.renderType;
                            if (renderType && renderType === 'money') {
                                this.currentPropertyUI[i].hidden = false;
                            } else {
                                this.currentPropertyUI[i].hidden = true;
                            }
                        }
                    }
                    if (_key === ':multiply') {
                        if (comp.$options._componentTag == 'el-table-column') {
                            var renderType = comp.$options.propsData.renderType;
                            if (renderType && renderType === 'percent') {
                                this.currentPropertyUI[i].hidden = false;
                            } else {
                                this.currentPropertyUI[i].hidden = true;
                            }
                        }
                    }
                    if (_key === 'decimals' || _key === 'separator') {
                        if (comp.$options._componentTag == 'el-table-column') {
                            var renderType = comp.$options.propsData.renderType;
                            if (renderType && (renderType === 'money' || renderType === 'number' || renderType === 'percent')) {
                                this.currentPropertyUI[i].hidden = false;
                            } else {
                                this.currentPropertyUI[i].hidden = true;
                            }
                        }
                    }
                    if (compUtil.setEditorEditorAttr(_key, element, this.currentModel)) {
                    } else {
                        var value = eleDom.attr(_key);
                        if (typeof (value) === 'string') {
                            this.currentModel[_key] = value.indexOf('[{') > -1 ? JSON.parse(value) : value;
                        }
                    }
                }
                this.models = [];
                this.propertyUIs = [];
                this.models.push(this.currentModel);
                this.propertyUIs.push(this.currentPropertyUI)
                // 点击表单项
                if (comp.$options._componentTag == 'el-form-item') {
                    this.childCompEl = window.engine.getChildCompEl(element);
                    if (this.childCompEl) {
                        var childId = $(this.childCompEl).attr('_id');
                        var childDom = window.engine.currentDom.find('[_id=' + childId + ']');
                        var childComp = this.childCompEl['comp'];
                        this.childCompName = childComp.$options.meta.name;
                        this.childModel = {
                            compType: '',
                            'ref-code': ''
                        };
                        // $.extend(this.childModel ,childComp.$props); //comp.$data
                        this.childPropertyUI = childComp.$options.meta.propertyUI;
                        for (var i = 0; i < this.childPropertyUI.length; i++) {
                            var _key = this.childPropertyUI[i].model;

                            if (_key === 'compType') {
                                this.childPropertyUI[i].options = compTypes;
                            }
                            if (_key === 'ref-code') {
                                var pk = childDom.attr('pk');
                                if (pk) {
                                    if (!window.engine.refCodeSelectPk[pk]) {
                                        $.ajax({
                                            type: "POST",
                                            url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryRef",
                                            data: {
                                                pk_md: pk
                                            },
                                            dataType: "json",
                                            async: false,
                                            success: function (result) {
                                                oThis.setRefByPk(result, oThis.childPropertyUI[i], pk);
                                            },
                                            error: function () {
                                                oThis.setRefByPk(null, oThis.childPropertyUI[i], pk);
                                            }
                                        });
                                    } else {
                                        this.childPropertyUI[i].options = window.engine.refCodeSelectPk[pk];
                                    }
                                } else {
                                    if (!window.engine.refCodeSelectNoPk) {
                                        $.ajax({
                                            type: "POST",
                                            url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryRef",
                                            dataType: "json",
                                            async: false,
                                            success: function (result) {
                                                oThis.setRefByPk(result, oThis.childPropertyUI[i], pk)
                                            },
                                            error: function () {
                                                oThis.setRefByPk(null, oThis.childPropertyUI[i], pk)
                                            }
                                        });
                                    } else {
                                        this.childPropertyUI[i].options = window.engine.refCodeSelectNoPk;
                                    }
                                }
                            }
                            if (compUtil.setEditorEditorAttr(_key, this.childCompEl, this.childModel)) {
                            } else {
                                this.childModel[_key] = childDom.attr(_key);
                            }
                        }
                        this.models.push(this.childModel);
                        this.propertyUIs.push(this.childPropertyUI)
                    }
                }


                this.modelParents = [];
                this.currentCompName = element['comp'].$options.meta.name;
                this.modelParents.push({
                    text: element['comp'].$options.meta.name,
                    ele: element
                });
                var parentNode = element.parentNode;
                while (parentNode.nodeName != 'BODY') {
                    if (parentNode['comp']) {
                        this.modelParents.unshift({
                            text: parentNode['comp'].$options.meta.name,
                            ele: parentNode
                        });
                    }
                    parentNode = parentNode.parentNode;
                }
                setTimeout(function () {
                    oThis.activeNodeFlag = false;
                }, 500);
            },
            formInfo: function (info) {
                if (info && info.processDefId != null) {
                    this.isRefProcess = 'true';
                }
            }
        },
        methods: {
            updatafn(a,b){
                this.real_actived_ele=a;
                this.actived_ele=b;
            },
            changeShowWidget: function (number) {
                this.widgetArray[number].show = !this.widgetArray[number].show;
            },
            handleIconClick: function () {
                var params = this.showWindowHref()
                var roleId = params['roleid'] ? params['roleid'] : ""
                var isUser = roleId ? false : true;
                this.getAppItems(roleId, isUser, this.input2)
            },
            //判断属猪
            isContain: function (item, arr) {
                var flag = false;
                arr.forEach(function (it) {
                    if (item.id && (item.id == it.id)) {
                        flag = true
                    }
                    if (item.pk_rolefavorite && it.pk_rolefavorite && item.pk_rolefavorite == it.pk_rolefavorite) {
                        flag = true
                    }
                })
                return flag;
            },
            //收藏
            saveCollection: function () {
                //判断收藏的地址 取消收藏的id
                //勾选之前的数据  VS 勾选之后的数据
                var oThis = this;
                var list1 = [];
                var list2 = [];
                var commonArr = [];
                var removeArr = [];
                var addArr = [];
                var params = oThis.showWindowHref()
                var roleId = params['roleid'] ? params['roleid'] : ""
                oThis.originalList.forEach(function (group) {
                    group.children.forEach(function (item) {
                        if (item.checked) {
                            list1.push(item);
                        }
                    })
                })
                oThis.permissionList.forEach(function (group, index) {
                    group.check.forEach(function (item) {
                        if (item.checked) {
                            list2.push(item)
                        }
                    })
                })
                //找出数组中相同的元素
                list1.forEach(function (app) {
                    list2.forEach(function (coll) {
                        if ((coll.id && coll.id == app.id) || (coll.pk_rolefavorite && app.pk_rolefavorite && coll.pk_rolefavorite == app.pk_rolefavorite)) {
                            commonArr.push(app)
                        }
                    })
                })

                list1.forEach(function (item) {
                    if (!oThis.isContain(item, commonArr)) {

                        if (roleId) {
                            removeArr.push(item.pk_rolefavorite)
                        } else {
                            removeArr.push(item.id)
                        }
                    }
                })
                list2.forEach(function (item) {
                    if (!oThis.isContain(item, commonArr)) {
                        item.appid = item.id;
                        item.icon = item.appIcon;
                        item.subtitle = item.app_desc;
                        item.title = item.label;
                        item.url = item.path;

                        if (roleId) {
                            item.pk_role = roleId;
                        } else {
                            item.userid = ""
                        }
                        delete item.id
                        addArr.push(item)
                    }
                })
                var collData = {
                    delIds: removeArr,
                    addData: addArr
                }
                var url = roleId ? "/ifbp-app-sm/roleFavorite/createAndDelete" : "/ifbp-app-sm/favorite/createAndDelete"
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: JSON.stringify(collData),
                    dataType: "json",
                    contentType: 'application/json;charset=UTF-8',
                    success: function (res) {
                        if (res.success) {
                            //操作成功
                            oThis.getCollection();
                            oThis.dialogVisible = false;
                            oThis.$message({
                                message: "操作成功!",
                                type: "success"
                            })
                        } else {
                            oThis.$message({
                                message: res.message,
                                type: "error"
                            })
                        }
                    }
                })
            },
            getPath: function (path, code) {
                //获取path 左右的参数
                var url = path.split("?")[0];
                var params = path.split("?")[1];
                var obj = {};
                var path = {};
                if (!params) {
                    return {url: url, query: null}
                } else {
                    var pList = params.split("&");
                    pList.forEach(function (it) {
                        var key = it.split("=")[0]
                        var value = it.split("=")[1]

                        obj[key] = value;
                    })
                    if (code) {
                        obj['tilecode'] = code;
                    }
                    return {url: url, query: obj}
                }
            },
            //判断两个url是否相等
            comparePath: function (path1, path2, code) {
                var oThis = this;
                var obj1 = oThis.getPath(path1, code)
                var obj2 = oThis.getPath(path2)
                if (obj1.url === obj2.url && !obj1.query && !obj2.query) {
                    return true
                } else if (obj1.url === obj2.url && obj1.query.funcode == obj2.query.funcode && obj1.query.tilecode == obj2.query.tilecode) {
                    return true;
                } else {
                    return false;
                }
            },
            //根据用户或者角色的id 来查询数据
            getAppItems: function (id, isUser, mes) {
                var _this = this;
                var url = isUser ? '/ifbp-app-sm/favorite/queryFunByUser' : '/ifbp-app-sm/roleFavorite/queryFunByRole'
                var data = isUser ? {label: mes} : {id: id, label: mes}

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json;charset=UTF-8',
                    success: function (res) {
                        if (res.success && res.data) {
                            var appArr = [];
                            res.data.forEach(function (item) {
                                item.children.forEach(function (app) {
                                    appArr.push(app);
                                })
                            })
                            if (_this.appLists && appArr) {
                                appArr.forEach(function (group) {
                                    group.children.forEach(function (item) {
                                        _this.appLists.forEach(function (app) {
                                            if (_this.comparePath(item.path, app.url)) {
                                                item.id = app.id;
                                                item.checked = true;
                                                if (!isUser && app.pk_rolefavorite) {
                                                    item.pk_rolefavorite = app.pk_rolefavorite;
                                                }
                                            }
                                        })
                                    })
                                })
                            }
                            _this.originalList = JSON.parse(JSON.stringify(appArr)); //数组深度拷贝
                            _this.permissionList = appArr;
                        } else {
                            _this.originalList = [];
                            _this.permissionList = [];
                        }
                    }
                })
            },

            showWindowHref: function () {
                var sHref = window.location.href;
                var args = sHref.split('?');
                if (args[0] == sHref) {
                    return "";
                }
                var arr = args[1].split('&');
                var obj = {};
                for (var i = 0; i < arr.length; i++) {
                    var arg = arr[i].split('=');
                    obj[arg[0]] = arg[1];
                }
                return obj;
            },
            handleChange: function (item, index, inx) {

                index = this.permissionList[inx].children.indexOf(item);
                this.permissionList[inx].children[index].checked = !this.permissionList[inx]
                    .children[index].checked;
                this.permissionList[inx].children = Object.assign(
                    [],
                    this.permissionList[inx].children
                );
            },
            handleCheckAllChange: function (group, index) {
                var checkedG = group.checked;
                this.permissionList[index].children.forEach(function (item, inx) {
                    item.checked = checkedG;
                });

                this.permissionList[index].children = Object.assign(
                    [],
                    this.permissionList[index].children
                );
            },
            searchWidget: function () {
                this.widgetArray = compUtil.getWidgetArray(this.widgetInput, 'init');
                for (var i = 0; i < widgetArray.length; i++) {
                    widgetArray[i]["show"] = true;
                }
                if (this.widgetArray.length == 0) {
                    this.noWidget = true;
                } else {
                    this.noWidget = false;
                }
            },
            setRefByPk: function (result, nowChildPropertyUI, pk) {
                // console.log(result && result.length > 0);
                if (result && result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        result[i].label = result[i].refname
                        result[i].value = result[i].refcode
                    }
                }
                if (pk) {
                    window.engine.refCodeSelectPk[pk] = result;
                    nowChildPropertyUI.options = window.engine.refCodeSelectPk[pk];
                } else {
                    window.engine.refCodeSelectNoPk = result;
                    nowChildPropertyUI.options = window.engine.refCodeSelectNoPk;
                }
            },
            treeFilterNode: function (value, data, node) {
                try {
                    if (node.data.data && node.data.data.ctrltype === 'Reference') {
                        node.removeAllChild();
                    }
                    if (node.data.data && node.data.data.ctrltype === 'DataTable' && node.data.data.pid) {
                        node.removeAllChild();
                        node.removeSelf();
                        return false;
                    }
                } catch (e) {
                    return true;
                }
                return true;
            },
            leftPaneltoggle: function () {
                this.leftPanelOn = !this.leftPanelOn;
                this.rightPanelOn = !this.rightPanelOn;
            },
            rightPaneltoggle: function () {
                this.rightPanelOn = !this.rightPanelOn;
            },
            // layoutPaneltoggle: function () {
            // 	this.layoutPanelOn = !this.layoutPanelOn;
            // 	// this.componentPanelOn = !this.layoutPanelOn;
            // },
            // componentPaneltoggle: function () {
            // 	this.componentPanelOn = !this.componentPanelOn;
            // 	// this.layoutPanelOn = !this.componentPanelOn;
            // },
            // sysComponentPaneltoggle: function () {
            // 	this.sysComponentPanelOn = !this.sysComponentPanelOn;
            // },
            /**
             * 显示模板
             */
            // showTemplateDialog: function () {
            // 	this.templateUrl = './res/templates/index.html'
            // 	this.templateDialogVisible = true;
            // },

            handleDragStart: function (elem, e) {
                // // console.log('handleDragStart', elem);
                // e.dataTransfer.addElement(elem.parentNode);
                this.loggedEvent = 'handleDragStart';
            },
            handleDragOver: function (elem) {
                // // console.log('handleDragOver', elem);
                this.loggedEvent = 'handleDragOver';
            },
            handleDragEnter: function (elem) {
                // // console.log('handleDragEnter', elem);
                this.loggedEvent = 'handleDragEnter';
            },
            handleDragLeave: function (elem) {
                // // console.log('handleDragLeave', elem);
                this.loggedEvent = 'handleDragLeave';
            },
            handleDragEnd: function (elem) {
                // // console.log('handleDragEnd', elem);
                this.loggedEvent = 'handleDragEnd';
            },
            handleDrop: function (itemOne, itemTwo) {
                // console.log('handleDrop', itemOne.id, itemTwo.id);
            },
            handleImageDrop: function (itemOne, itemTwo) {
                // console.log('handleImageDrop', itemOne.getAttribute('data-index'), itemTwo.getAttribute('data-index'));
                // this.loggedEvent = 'handleImageDrop';
                // var dummy = this.images[itemOne.getAttribute('data-index')];
                // this.images.$set(itemOne.getAttribute('data-index'), this.images[itemTwo.getAttribute('data-index')]);
                // this.images.$set(itemTwo.getAttribute('data-index'), dummy);
            },
            handleDrag: function (elem) {
                //// console.log('handleDrag', elem);
                this.loggedEvent = 'handleDrag';
            },
            /**
             * 保存
             */
            save: function (isEnable) {
                window.engine.save(isEnable);
                if (this.doSave) {
                    this.doSave(isEnable);
                }
                try {
                    if (window.opener && typeof window.opener.designerCB === 'function') {
                        var pk_temp = $.getUrlParam('pk_temp');
                        window.opener.designerCB(pk_temp);
                    }
                } catch (e) {
                    // console.log(e);
                }
                try {
                    if (window.parentWin) {
                        window.parentWin.location.reload();
                    }
                } catch (e) {
                    // console.log(e);
                }

            },

            clear: function () {
                window.engine.clear();
                if (this.doClear) {
                    this.doClear();
                }
            },
            repair: function () {
                window.engine.repair();
            },
            deleteFun: function () {
                this.delDialogVisible = true;
            },
            deleteCancelClick: function () {
                this.delDialogVisible = false;
            },
            deleteClick: function () {
                var oThis = this;
                var url = '/wbalone/userDesign/delPersonalLayout';
                $.ajax({
                    type: "get",
                    url: url,
                    data: {},
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            oThis.$message({
                                type: 'info',
                                message: data.message
                            });
                            try {
                                if (window.parentWin) {
                                    window.parentWin.location.reload();
                                }
                            } catch (e) {
                                // console.log(e);
                            }
                            window.close();
                        } else {
                            oThis.$message({
                                type: 'warning',
                                message: data.error.errorMessage
                            });
                        }
                    }
                })
            },
            /**
             * 显示模板
             */
            showTemplateDialog: function () {
                this.templateUrl = '/iform_web/iform_ctr/iform_design_ctr/manage#forms/cloud'
                this.templateDialogVisible = true;
            },
            // selectTemplate: function(){
            // 	this.templateDialogVisible = false;
            // },
            manageTemplateDialogOpen: function () {
                var oThis = this;
                this.$nextTick(function () {
                    var dialogHeight = this.$refs.templateDialog.$el.offsetHeight;
                    $('#templateFrame').css('height', dialogHeight - 120);
                    $('#templateFrame')[0].contentWindow.formDesignCallback = function (templateId) {
                        oThis.$confirm('确定后已经设计的表单会被重置', '确认').then(function () {
                            $.ajax({
                                type: "POST",
                                data: {
                                    templateId: templateId,
                                    pk_bo: $.getUrlParam('pk_bo')
                                },
                                dataType: "json",
                                url: "/iform_web/iform_ctr/iform_template/useFormTemplateInDesign",
                                success: function (data) {
                                    if (!data || data == null) {
                                        return;
                                    }
                                    if (data.message) {
                                        oThis.$message({
                                            type: 'warning',
                                            message: data.message
                                        });
                                        return
                                    }
                                    location.reload();
                                }
                            })
                        })
                    }
                })
            },
            handleClose: function () {
                this.templateDialogVisible = false;
            },
            handleClose1: function () {
                this.dialogVisible = false;
            },
            /**
             * 另存为模板
             */
            saveAsTemplate: function () {
                this.saveAsTemplateDialogVisible = true;
            },
            doSaveTemplate: function () {
                var oThis = this;
                this.$refs.templateNameForm.validate(function (valid) {
                    if (valid) {
                        var params = {
                            name: oThis.templateInfo.name
                        }
                        // params = JSON.stringify(params);
                        $.ajax({
                            type: "POST",
                            data: {
                                data: JSON.stringify(params)
                            },
                            // dataType: "json",
                            url: "/iform_web/iform_ctr/iform_template/addFormTemplate",
                            success: function (data) {
                                if (data.status == 1) {
                                    var model = {
                                        form: oThis.formInfo,
                                        formLayout: window.engine.currentDom.html(),
                                        formData: window.engine.tplData,
                                        formVersion: '1'
                                    }
                                    model.formData = window.engine.tplData;
                                    model.saveToTemplate = true;
                                    model.form.id = data.data.pk_bo;
                                    var params = {
                                        data: JSON.stringify(model)
                                    }
                                    $.ajax({
                                        type: "POST",
                                        data: params,
                                        url: '/iform_web/iform_ctr/iform_template/editFormTemplate',
                                        success: function (data) {
                                            if (data.status == 1) {
                                                oThis.saveAsTemplateDialogVisible = false;
                                            } else {
                                                oThis.$message({
                                                    type: "error",
                                                    message: data.message
                                                });
                                            }
                                        }
                                    })
                                } else if (data.status == 0) {
                                    oThis.$message({
                                        message: data.message
                                    });
                                }
                            }
                        })
                        this.saveAsTemplateDialogVisible = false;
                    } else {
                        return false;
                    }
                })
            },
            /**
             * 创建新流程
             */
            newProcess: function () {
                var oThis = this;
                if (!this.formInfo.processDefName) {
                    this.$message({
                        type: 'info',
                        message: '请输入流程名称',
                    })
                } else {
                    $.ajax({
                        type: 'POST',
                        data: {
                            processDefinionName: encodeURI(encodeURI(this.formInfo.processDefName)),
                            formlayout: JSON.stringify(window.engine.getModel()),
                            pk_bo: $.getUrlParam('pk_bo'),
                            pk_botype: this.formInfo.pk_botype //self.model.get('pk_botype')||($elm.closest('.js_formcategory').find('.js_categoryname').attr('id'))
                        },
                        dataType: 'json',
                        url: '/iform_web/wf_ctr/createNewPdm',
                        success: function (data) {
                            if (data) {
                                if (data.status == 0) {
                                    oThis.$message({
                                        type: 'error',
                                        message: data.message
                                    });
                                }
                                if (data.url) {
                                    window.open(data.url);
                                    oThis.formInfo.processDefId = data.id;
                                    oThis.formInfo.processDefName = data.processDefinionName;
                                }
                            }
                        }
                    })
                }
            },
            /**
             * 修改流程
             */
            editProcess: function () {
                var oThis = this;
                $.ajax({
                    type: "POST",
                    data: {
                        processDefinionId: oThis.formInfo.processDefId,
                        formlayout: window.engine.getModel(),
                        pk_bo: $.getUrlParam('pk_bo')
                    },
                    dataType: "json",
                    async: false,
                    url: "/iform_web/wf_ctr/editPdm",
                    success: function (data) {
                        if (data) {
                            if (data.status == 0) {
                                oThis.$message({
                                    type: 'error',
                                    message: data.message
                                });
                                return;
                            }
                            if (data.url) {
                                // self.model.set('editProcessIndex',parseInt(editProcessIndex)+parseInt(1));
                                window.open(data.url);
                            }
                        }
                    }
                });
            },
            /**
             * 删除流程
             */
            deleteProcess: function () {
                var oThis = this;
                this.$confirm('确定删除关联的流程吗？', '确认').then(function () {
                    $.ajax({
                        type: "post",
                        url: "/iform_web/form_manage/deleteProcessDirectly",
                        dataType: "json",
                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                        data: {
                            formId: $.getUrlParam('pk_bo')
                        }
                    }).done(function (result) {
                        if (result && result.success) {
                            oThis.formInfo.processDefId = '';
                            oThis.formInfo.processDefName = '';
                            oThis.$message({
                                type: 'success',
                                message: '表单权限同时已被删除！'
                            });
                            // self.changeProcessActivity('表单权限同时已被删除！');
                        } else {
                            oThis.$message({
                                type: 'error',
                                message: '删除流程失败，请稍后重试'
                            });
                        }
                    }).fail(function (error, status, statusText) {
                        oThis.$message({
                            type: 'error',
                            message: '网络请求错误，请稍后重试！'
                        });
                    });
                })
            },
            resetEditScroll: function () {
                var editDiv = $('#editor');
                editDiv[0].scrollLeft = '0px';
                editDiv[0].scrollTop = '0px';
            },
            /**
             * 改变屏幕宽度至PC
             */
            changeToPc: function () {
                this.resetEditScroll();
                this.frameWidth = "100%"
            },
            /**
             * 改变屏幕宽度至Pad横屏
             */
            changeToTabletH: function () {
                this.resetEditScroll();
                this.frameWidth = "1024px"
            },
            /**
             * 改变屏幕宽度至Pad竖屏
             */
            changeToTabletV: function () {
                this.resetEditScroll();
                this.frameWidth = "768px"
            },
            /**
             * 改变屏幕宽度至手机横屏
             */
            changeToMobileH: function () {
                this.resetEditScroll();
                this.frameWidth = "480px"
            },
            /**
             * 改变屏幕宽度至手机竖屏
             */
            changeToMobileV: function () {
                this.resetEditScroll();
                this.frameWidth = "320px"
            },
            showElementPanel: function () {
                this.leftPanelShow = 'element'
            },
            showObjectPanel: function () {
                this.leftPanelShow = 'object'
            },
            showLayoutPanel: function () {
                this.leftPanelShow = 'layout'
            },
            mainShowForm: function () {
                this.mainShowChange(true);
            },
            mainShowTable: function () {
                this.mainShowChange(false);
            },
            initTreeModel: function (pk, classId) {
                if (!pk)
                    return;
                var oThis = this;
                var clsid = classId || $.getUrlParam('clsid') || '';
                var type = $.getUrlParam('type') || clsid ? "CLS" : "MD";
                var cache = $.getUrlParam('cache') || "no";
                $.ajax({
                    type: 'get',
                    url: '/uitemplate_web/uitemplate_ctr/mdadptor_ctr/loadBusinessObj?id=' + pk + '&type=' + type + '&clsid=' + clsid + '&cache=' + cache,
                    success: function (data) {
                        window.engine.pkMetadata = pk;
                        if (typeof data === 'string') {
                            var _data = JSON.parse(data);
                        } else {
                            var _data = data;
                        }
                        for (var i = 0; i < _data.length; i++) {
                            _data[i].showFlag = 1;
                        }
                        oThis.treeData = _data;
                        oThis.$nextTick(function () {
                            $("#form-businessObj .el-tree-node__content").attr('draggable', true);
                            $("#form-businessObj .el-tree-node__content").off('dragstart');
                            $("#form-businessObj .el-tree-node__content").on('dragstart', function (e) {
                                // console.log('dragstart11')
                                if (e.stopPropagation) {
                                    e.stopPropagation();
                                }
                                top._dragSrcEl = e.target;
                            });
                            oThis.$refs['businessTree'].filter('1');
                            $('.boxscroll').perfectScrollbar('update');
                        });

                        window.engine.formInfo = window.engine.formInfo || {
                            name: '标题'
                        };
                        if (window.engine.formInfo.name === '标题') {
                            var rootNode = oThis.$refs['businessTree'].root;
                            var rootNodeName = rootNode.label;
                            window.engine.formInfo.name = rootNodeName;
                        }
                    }
                })

            },
            loadTempData: function (pk_temp) {
                window.top.nowPkTemp = pk_temp;
                // var pk_metadata = $.getUrlParam('pk_metadata');
                $.ajax({
                    type: 'get',
                    url: '/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplate?pk_temp=' + pk_temp,
                    success: function (data) {
                        if (typeof data === 'string' && data != '') {
                            var _data = JSON.parse(data);
                        } else {
                            var _data = data;
                        }
                        if (_data.form) {
                            var pk_metadata = _data.form.pkMetadata;
                            var pk_class = _data.form.pkClass;
                            window.shell.initTreeModel(pk_metadata, pk_class);
                        }

                        window.engine.pkMetadata = pk_metadata;
                        window.engine.loadModel(_data);
                        var formData = _data.formData;
                        if (typeof formData !== 'string') {
                            formData = JSON.stringify(formData);
                        }
                        window.shell.setTplDataStr(formData);
                        window.shell.setEngineTplData();
                    }
                })
            },
            loadBoData: function (pk_bo) {
                var oThis = this;
                $.ajax({
                    type: 'get',
                    url: '/iform_web/iform_ctr/iform_design_ctr/openUIForm?pk_bo=' + pk_bo,
                    success: function (data) {
                        if (typeof data === 'string') {
                            var _data = JSON.parse(data);
                        } else {
                            var _data = data;
                        }
                        _data.form.id = _data.form.id || pk_bo;
                        oThis.formType = _data.formType;
                        window.engine.loadModel(_data);
                        // window.shell.setTplDataStr(JSON.stringify(_data.formData));
                        // window.shell.setEngineTplData();
                    }
                })
            },

            selectElement: function (item) {
                window.engine.activeNode(item.ele);
                // window.engine.actived_ele = item.ele;
                // top.shell.actived_ele = item.ele;
            },
            manager: function () {
                this.manageDialogVisible = true;
            },
            manageOpen: function () {
                var comp = this.actived_ele['comp'];
                var name = comp.$options.name + '-manage';
                var Comp = Vue.component(name);
                if (!Comp)
                    throw new Error("组件:" + name + " 未定义");
                var component = new Comp().$mount();
                Vue.nextTick(function () {
                    $("#manageDialogContent").html('');
                    $("#manageDialogContent").append(component.$el);
                })

            },
            /**
             * 组件管理面板关闭
             */
            manageDialogClose: function () {

                this.manageDialogVisible = false;
            },
            treeDialogClose: function () {
                if (this.dragShowType === 'form') {
                    window.engine.batchCreateFormComp(this.dragTreeData, window._targetDropElement);
                } else if (this.dragShowType === 'table') {
                    window.engine.batchCreateTableComp(this.dragTreeData, window._targetDropElement);
                } else if (this.dragShowType === 'tableform') {
                    window.engine.batchCreateFormComp(this.dragTreeData, window._targetDropElement);
                    window.engine.batchCreateTableComp(this.dragTreeData, window._targetDropElement);
                }
                window._targetDropElement = null;
                this.treeDialogVisible = false;
            },

            cancelFun: function () {
                this.treeDialogVisible = false;
                var dropPosDom = $('#ifr_content')[0].contentWindow.$dropPosDom;
                dropPosDom && dropPosDom.remove && dropPosDom.remove();
            },
            /**
             * 拖拽的数节点排序上移
             */
            dragTreeNodeUp: function (index) {
                var temp = this.dragTreeData[index]
                this.dragTreeData.splice(index, 1);
                this.dragTreeData.splice(index - 1, 0, temp);
            },
            /**
             * 拖拽的数节点排序下移
             */
            dragTreeNodeDown: function (index) {
                var temp = this.dragTreeData[index]
                this.dragTreeData.splice(index, 1);
                this.dragTreeData.splice(index + 1, 0, temp);
            },
            /**
             * 删除拖拽的数节点
             */
            dragTreeNodeDelete: function (index) {
                this.dragTreeData.splice(index, 1);
            },

            treeNodeDropCallBack: function (srcElement, targetElement) {
                if ("DataTable" == $(srcElement).attr("componentkey")) { //如果是左侧子表拖拽
                } else if ($(srcElement).hasClass('el-tree-node__content')) {
                    var treeNodeComp = $(srcElement).parent()[0]['__vue__'];
                    var baseData = treeNodeComp.getBaseData();
                    if (treeNodeComp.isLeaf() || baseData.ctrltype === 'Reference') {
                        var _id = $(targetElement).attr('_id');
                        var ele = window.engine.currentDom.find('[_id=' + _id + ']');
                        if (targetElement.comp && ($(targetElement.comp.$el.parentNode).hasClass('hidden-columns') || $($(targetElement).children()[0]).hasClass('el-table'))) {
                            var $dom = window.engine.createTableColumnComp({
                                compAttr: baseData,
                                ele: ele[0]
                            });
                        } else {
                            var $dom = window.engine.createFormElementComp({
                                compAttr: baseData,
                                ele: ele[0]
                            });
                        }
                    } else {
                        this.dragTreeData = treeNodeComp.getChildrenBaseData();
                        this.treeDialogVisible = true;
                        $('.el-dialog--full').perfectScrollbar();
                        window._targetDropElement = targetElement;
                    }
                }
            },
            preview: function () {
                // window.localStorage.setItem('formLayoutDom', window.engine.currentDom.html());
                // window.localStorage.setItem('ovpDom', window.engine.currentDom.html());
                // window.localStorage.setItem('formData', JSON.stringify(window.engine.getTplData()));
                // window.localStorage.setItem('formInfo', JSON.stringify(window.engine.formInfo));
                // // window.localStorage.setItem('isIform', window.shell.isIform);
                // // if (window.shell.isIform){
                // // 	window.localStorage.setItem('form_model', JSON.stringify(window.engine.getModel()));
                // // }
                // // window.open('preview.html');
            },
            showCode: function (showType) {
                // 为了解决直接点击data只有就点击view会导致数据丢失，每次都调用codeEditor的setValue
                if (showType === 'HTML') {
                    compUtil.removeDesignAttr(window.engine.currentDom);
                    var g = html_beautify(window.engine.currentDom.html());
                    // g = g.replace(/>/g, "&gt;").replace(/</g, "&lt;");
                    window.codeEditor.setValue(g);
                    window.codeEditor.clearSelection();
                } else if (showType === 'VIEW') {
                    var html = window.codeEditor.getValue().replace(/[\r\n]/g, '');
                    html = html.replace(/>[ ]*</g, '><');
                    window.engine.currentDom.html(html);
                    window.engine.refreshDom();
                } else if (showType === 'DATA') {
                    this.tplDataStrFormat = formatJson(this.tplDataStr);
                }
                this.showType = showType;
            },
            attrChange: function (attr, level) {
                if (window.shell.activeNodeFlag) {
                    return;
                }
                if (this.isIform && attr.attrName == 'label' && this.actived_ele['comp'].$options._componentTag == 'el-form-item') {
                    var _id = $(this.childCompEl).attr('_id');
                    var modelName = window.engine.currentDom.find('[_id=' + _id + ']').attr('v-model');
                    var modelPath = modelName.split('.');
                    window.engine.tplData[modelPath[0]][modelPath[1]].showName = this.currentModel.label;
                }

                if (level == 0) {
                    compUtil.updateCompAttr(this.actived_ele, this.currentModel, attr);
                } else {
                    compUtil.updateCompAttr(this.childCompEl, this.childModel, attr);
                }

            },
            addOptionsEditor: function (models, item, index) {
                var itemModel = item.model;
                var itemModelVar = itemModel + '-var';
                var modelVar = models[index][itemModelVar];
                if (!modelVar) {
                    this.$message({
                        message: '请设置选项对象'
                    })
                    return;
                }
                window.engine.tplData[modelVar] = window.engine.tplData[modelVar] || [];
                models[index][itemModel] = window.engine.tplData[modelVar];
                var model = models[index][itemModel];
                model.push({
                    "value": "",
                    "label": ""
                });
                this.attrChange(item, index);
            },
            deleteOptionsEditor: function (model, optIndex, item, index) {
                model.splice(optIndex, 1);
                this.attrChange(item, index);
            },
            addShortcut: function (model) {
                this.shortcutVisible = true;
                this.shortcutform = {
                    "name": "",
                    "links": "",
                    "imgSrc": "",
                    "iconClass": "ifbp-icon-receipt",
                    "render": "",
                    "renderType": "js",
                    "renderLinks": [{
                        "text": "",
                        "link": ""
                    }]
                };
                this.isAdd = true;
            },
            addShortcutApp: function () {
                this.getCollection();
                this.dialogVisible = true;
                //在这里添加磁贴操作弹窗
            },
            getCollection: function () {
                //获取收藏的数据
                var data = {"title": ""};
                var _this = this;
                var params = _this.showWindowHref()
                var roleId = params['roleid'] ? params['roleid'] : ""
                var url = roleId ? "/ifbp-app-sm/roleFavorite/list" : "/ifbp-app-sm/favorite/list"
                if (roleId) {
                    data.pk_role = roleId;
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: JSON.stringify(data),
                    dataType: "json",
                    contentType: 'application/json;charset=UTF-8',
                    success: function (res) {
                        if (res.success) {
                            _this.appLists = res.data;
                            var isUser = roleId ? false : true;
                            _this.getAppItems(roleId, isUser, "")
                        }
                    }
                })
            },


            changeShortcut: function (item, index) {
                this.shortcutVisible = true;
                item["renderLinks"] = [{
                    "text": "",
                    "link": ""
                }];
                this.shortcutform = item;
                this.isAdd = false;
                this.selectIndex = index;
            },
            deleteShortcut: function (index) {
                var that = this;
                var short = Array.from(window.engine.currentDom[0].getElementsByTagName('widget'));
                short.forEach(function (v) {
                    if (v.id === 'shortcutnew') {
                        var arr = JSON.parse(v.attributes[":shortcutarr"].nodeValue);
                        arr.splice(index, 1);
                        v.attributes[":shortcutarr"].nodeValue = JSON.stringify(arr);
                        that.$message("删除成功！");
                    }
                })
                window.engine.refreshDom();
            },
            shortcutSure: function (form, index) {
                // console.log(form);
                var that = this;
                var short = Array.from(window.engine.currentDom[0].getElementsByTagName('widget'));
                short.forEach(function (v) {
                    if (v.id === 'shortcutnew') {
                        var arr = JSON.parse(v.attributes[":shortcutarr"].nodeValue);
                        if (that.isAdd) {
                            arr.push(form);
                            that.$message("添加成功！");
                        } else {
                            arr.splice(that.selectIndex, 1, form);
                            that.$message("修改成功！");
                        }
                        v.attributes[":shortcutarr"].nodeValue = JSON.stringify(arr);
                        that.shortcutVisible = false;
                    }
                })
                window.engine.refreshDom();
            },
            changeIcon: function () {
                this.iconListShow = true;
            },
            choiceIcon: function (index) {
                this.shortcutform.iconClass = "ifbp-icon-" + this.iconList[index][0];
                this.iconListShow = false;
            },
            showRenderType: function () {
                var renderType = this.shortcutform.renderType;
            },
            addLinks: function () {
                var render_links = this.shortcutform.renderLinks;
                var link = {
                    "text": "",
                    "link": ""
                }
                render_links.push(link);
                if (render_links.length == 2) {
                    this.addLinksShow = false;
                    return
                } else {
                    this.addLinksShow = true;
                }

            },
            deleteLinks: function (index) {
                this.shortcutform.renderLinks.splice(index, 1);
                var render_links = this.shortcutform.renderLinks;
                if (render_links.length == 2) {
                    this.addLinksShow = false;
                    return
                } else {
                    this.addLinksShow = true;
                }
            },
            showAll: function (show) {
                for (var i = 0; i < this.dragTreeData.length; i++) {
                    this.dragTreeData[i].showFlag = show;
                }
            },
            formInfoChange: function () {
                window.engine.formInfo = this.formInfo;
            },
            setTplDataStr: function (data) {
                this.tplDataStr = data;
            },
            setEngineTplData: function () {
                try {
                    if (this.tplDataStr)
                        window.engine.setTplData(JSON.parse(this.tplDataStr));
                } catch (e) {
                    // console.log(e);
                    this.$message({
                        showClose: true,
                        message: 'data 格式不正确'
                    });
                }
            },
            tplDataBlur: function () {
                this.setEngineTplData();
            },

            ready: function () {
                window.engine.formInfo = {
                    name: '标题',
                    describe: '描述'
                }
                var dologin = $.getUrlParam('dologin');
                var host = window.location.hostname;
                if (dologin && (host == 'localhost' || host == '127.0.0.1')) {
                    var d = {
                        "loginname": 'admin',
                        "pwd": '123456',
                        "encrypt": "ON"
                    }
                    $.ajax({
                        url: '/wbalone/sso/appLogin',
                        data: JSON.stringify(d),
                        // data: d,
                        type: "post",
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.success === true) {
                                // window.location.href = '/wbalone/index.html';
                            } else {
                                alert(data.data);
                            }
                        },
                        error: function (e) {
                        }
                    })
                }
                var pk_temp = $.getUrlParam('pk_temp');
                if (pk_temp) {
                    window.shell.loadTempData(pk_temp);
                } else {
                    var component_id = $.getUrlParam('pk_metadata');
                    if (component_id) {
                        window.shell.initTreeModel(component_id);
                    }
                }

                var pk_bo = $.getUrlParam('pk_bo');
                if (pk_bo) {
                    window.shell.loadBoData(pk_bo);
                }
                if (this.doReady) this.doReady();
            }
        },
        computed: {

            showPermissionList: function () {
                var list = [];
                this.permissionList.forEach(function (group, inx) {
                    group.check = [];
                    group.uncheck = [];
                    group.indeterminate = false;
                    //group.checked = false;
                    group.children.forEach(function (item, index) {
                        if (item.checked) {
                            group.check.push(item);
                        } else {
                            group.uncheck.push(item);
                        }
                        item.hidden = item.hidden || false;
                    });
                    if (group.check.length == group.children.length) {
                        group.checked = true;
                    }
                    if (group.uncheck.length == group.children.length) {
                        group.checked = false;
                    }
                    if (group.check.length > 0 && group.check.length < group.children.length) {
                        group.indeterminate = true;
                    }
                    list.push(group);
                });
                return list;
            },
            showPermission: function () {
                var showPer = false;
                this.permissionList.forEach(function (group, index) {
                    group.app.forEach(function (item, index) {
                        if (item.checked) {
                            showPer = true;
                        }
                    });
                });
                return showPer;
            },
        }

    }
</script>

<style scoped lang="less">
    .designer {
        > div {
            display: inline-block;
            vertical-align: top;
            width: 50%;
        }
    }
</style>