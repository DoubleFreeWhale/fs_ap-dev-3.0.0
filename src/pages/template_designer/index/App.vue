<template>
    <div id="app">
        <div id="pagePanel"
             v-bind:class="{'openPanel': rightPanelOn, 'openPanel_left':leftPanelOn,'isNewtem':isNewtem}">
            <!--左侧组件面板c-->
            <div v-show="!previewed" class="f_panel_left hideTop" id="toolsLeft">
                <div class="f_panelNav_left clearfix">
                    <ul role="toolsBar">
                        <li v-bind:class="{active : leftPanelShow == 'element'}" v-on:click="showElementPanel">控件</li>
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
                            <dl class="setPanel">
                                <dt v-on:click="layoutPanelOn = !layoutPanelOn">
                                    <i v-bind:class="['el-tree-node__expand-icon',  layoutPanelOn ? 'expanded' : '']"></i>常用布局
                                </dt>
                                <dd>
                                    <div class="setPanelMain addPanelList" v-bind:class="{'active': layoutPanelOn}">
                                        <ul class="clearfix">
                                            <li v-for="item in layoutArray">
                                                <div v-drag class="custom_module_box ui-draggable"
                                                     v-bind="{key:item.key,name:item.name}">
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
                                                <div v-drag class="custom_module_box ui-draggable"
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
                            <dl class="setPanel">
                                <dt v-on:click="formCompPanelOn = !formCompPanelOn">
                                    <i v-bind:class="['el-tree-node__expand-icon', formCompPanelOn ? 'expanded' : '']"></i>表单控件
                                </dt>
                                <dd>
                                    <div class="setPanelMain addPanelList" v-bind:class="{'active': formCompPanelOn}">
                                        <ul class="clearfix">
                                            <li v-for="item in formCompArray">
                                                <div v-drag class="custom_module_box ui-draggable"
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
                                                <div v-drag class="custom_module_box ui-draggable"
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

                            <!--系统组件-->
                            <dl class="setPanel" v-if="false">
                                <dt v-on:click="sysCompPanelOn = !sysCompPanelOn">
                                    <i v-bind:class="['el-tree-node__expand-icon', sysCompPanelOn ? 'expanded' : '']"></i>系统组件
                                </dt>
                                <dd>
                                    <div class="setPanelMain addPanelList" v-bind:class="{'active': sysCompPanelOn}">
                                        <ul class="clearfix">
                                            <li v-for="item in sysCompArray">
                                                <div v-drag class="custom_module_box ui-draggable"
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
                            </div>
                        </div>
                    </div>
                    <!--业务对象 end-->
                </div>
            </div>
            <!--左侧组件面板 end-->
            <div class="f_main">
                <div  v-show="!previewed" :class="[isNewtem ? 'f_mainTool_new' : 'f_mainTool']">
                    <div :class="[isNewtem ? 'f_mainToolImg_new' : 'f_mainToolImg']">
                        <div v-text="logoText" class="logo-text"></div>
                    </div>
                    <div class="f_mainToolLeft">
                        <el-button :type="isNewtem ? 'newtext' : 'text'" @click="business" showtipsel="1" title="同步业务对象"
                                   v-if="dType == 'uitemplate'" style="display:none;">同步业务对象
                        </el-button>
                        <el-button :type="isNewtem ? 'newtext' : 'text'" id="repairBtn" @click="repair" showtipsel="1"
                                   title="修复" v-if="dType == 'uitemplate'" style="display:none;">修复
                        </el-button>
                        <el-button :type="isNewtem ? 'newtext' : 'text'" id="clearBtn" @click="clear" showtipsel="1"
                                   title="清空" style="display:none;">清空
                        </el-button>
                        <el-button :type="isNewtem ? 'newtext' : 'text'" id="saveBtn" @click="save" showtipsel="1"
                                   title="保存" style="display:none;">保存
                        </el-button>
                        <el-button :type="isNewtem ? 'newtext' : 'text'" v-if="dType == 'ifrom'" id="moreSaveBtn"
                                   @click="save(true)" showtipsel="1" title="保存并启用" style="display:none;">保存启用
                        </el-button>

                        <el-button :type="isNewtem ? 'newtext' : 'text'" v-if="dType == 'pagedesigner'"
                                   @click="showTemplateDialog" showtipsel="1" title="选择模板" style="display:none;">选择模板
                        </el-button>
                        <el-button :type="isNewtem ? 'newtext' : 'text'" v-if="dType == 'pagedesigner'"
                                   @click="exportCode" showtipsel="1" title="导出代码" style="display:none;">导出代码
                        </el-button>
                        <el-button :type="isNewtem ? 'newtext' : 'text'" @click="previewed=true" showtipsel="1" title="预览"
                                   style="display:none;">预览
                        </el-button>
                    </div>
                    <div class="f_mainToolMedia" id="rulers">
                        <span class="fa fa-desktop" data-width="max" v-on:click="changeToPc"
                              v-bind:class="{active : frameWidth == '100%'}"></span>
                        <span class="fa fa-tablet fa-rotate-270" v-on:click="changeToTabletH" style="font-size:24px;"
                              title="pad-横屏" v-bind:class="{active : frameWidth == '1024px'}"></span>
                        <span class="fa fa-tablet" v-on:click="changeToTabletV" title="pad-竖屏" style="font-size:24px;"
                              v-bind:class="{active : frameWidth == '768px'}"></span>
                    </div>
                    <div class="f_mainToolRight">

                    </div>
                </div>
                <div  :style="previewed?{ top:0,
                       left:0,
                       bottom:0,
                       right:0}:{

                }" class="f_content" id="pageContainer" v-show="true" style="display:none;">
                    <i class="el-icon-close"
                       v-if="previewed"
                       @click="previewed=false"
                       style="position: absolute;right: 20px;top:16px;cursor: pointer"></i>
                    <div class="f_web" id="frameContainer" v-bind:style="{width:frameWidth}">
                        <iframe id="ifr_content"></iframe>
                    </div>
                </div>
                <div v-show="!previewed" class="f_footTool">
                    <ul class="clearfix" id="pathPanel">
                        <li v-for="(item,index) in modelParents" v-on:click="selectElement(item)"
                            v-bind:class="{'lastLi': index == (modelParents.length -1)}">{{item.text}}
                        </li>
                    </ul>
                </div>
                <div v-show="!previewed" class="f_footer">
                    <div class="view-btn" :class="{'active': showType === 'VIEW'}" @click="showCode('VIEW')">VIEW</div>
                    <div class="view-btn" :class="{'active': showType === 'HTML'}" @click="showCode('HTML')">HTML</div>
                    <div class="view-btn" :class="{'active': showType === 'DATA'}" @click="showCode('DATA')">DATA</div>
                </div>

            </div>
            <!--右侧属性面板-->
            <div v-show="!previewed"  class="f_panel hideTop" id="toolsMain">

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
                                    <!-- <div class="ct_2 h6">名称：{{currentCompText}}</div> -->
                                    <!--
                                                      <div class="ct_2 pt5 h6">ID：el_1416293039468xv2j1</div>
                                                      -->
                                    <div role="setLayoutContainer" class="ct_2">
                                        <!-- <hr class="ct_7 mt10"> -->
                                        <ul v-for="(propertyItem, index) in propertyUIs" class="">
                                            <label class="propertyLabel propertyTitle form_property_split">{{index == 0
                                                ? currentCompName : childCompName}} </label>
                                            <li v-for="item in propertyItem"
                                                v-if="!item.hidden"
                                                class="propertyLi">
                                                <label v-if="item.type != 'boolean' && item.show !=='showfalse' "
                                                       class="propertyLabel">{{item.name}} </label>
                                                <!-- 文本输入 -->
                                                <el-input v-if="item.type == 'string' || item.type == 'number'"
                                                          :disabled="item.disabled" v-model="models[index][item.model]"
                                                          @blur="attrChange(item, index)"
                                                          class="propertyInput"></el-input>
                                                <!-- 复选框 -->
                                                <!-- <input type="checkbox" v-bind:id="item.model" v-if="item.type == 'boolean'" v-model="models[index][item.model]" @change="attrChange(item, index)">
                                                <label v-if="item.type == 'boolean'" v-bind:for="item.model" class="propertyCheckLabel">{{ item.name }}</label> -->
                                                <el-checkbox v-if="item.type == 'boolean'" :disabled="item.disabled"
                                                             v-model="models[index][item.model]"
                                                             @change="attrChange(item, index)">{{ item.name }}
                                                </el-checkbox>
                                                <!-- 下拉框 -->
                                                <el-select :allow-create="item.allowCreate"
                                                           :filterable="item.filterable" :multiple="item.multiple"
                                                           :disabled="item.disabled" class="propertyInput"
                                                           v-if="item.show ? item.type === 'select'&&item.show==='showtrue' : item.type === 'select'"
                                                           v-model="models[index][item.model]"
                                                           @change="attrChange(item, index)">
                                                    <el-option v-for="opt in item.options" :key="opt.value"
                                                               :label="opt.label" :value="opt.value"></el-option>
                                                </el-select>

                                                <!-- 颜色选择器 -->
                                                <el-color-picker v-if="item.type === 'labelColor'"
                                                                 v-model="models[index][item.model]"
                                                                 @change="attrChange(item, index)"></el-color-picker>
                                                <ifbp-default-value-input :disabled="item.disabled"
                                                                          class="propertyInput"
                                                                          v-if="item.type === 'defaultValue'"
                                                                          :show-value="models[index][item.model]"
                                                                          @change="function(showValue,realValue){saveDefaultValue(item, index, showValue, realValue)}"></ifbp-default-value-input>
                                                <!-- radio、checkbox、select 选择项编辑 -->
                                                <ul v-if="item.type == 'optionsEditor'" class="optionsEditor">
                          <span v-if="!models[index][item.model] || models[index][item.model].length === 0 || leftPanelShow == 'element'"
                                class="fa fa-plus-circle options-icon"
                                title="添加一个新的选择项" @click="addOptionsEditor(models,item,index)"></span>
                                                    <li v-for="(opt,optIndex) in models[index][item.model]">
                                                        <el-input :disabled="item.disabled" type="text"
                                                                  class="options-value" v-model="opt.value"
                                                                  placeholder="选项实际值"
                                                                  @chang="attrChange(item, index)"></el-input>
                                                        <el-input :disabled="item.disabled" type="text"
                                                                  class="options-name" v-model="opt.label"
                                                                  placeholder="选项显示值"
                                                                  @chang="attrChange(item, index)"></el-input>
                                                        <span v-if="!item.disabled"
                                                              class="fa fa-plus-circle options-icon" title="添加一个新的选择项"
                                                              @click="addOptionsEditor(models,item,index)"></span>
                                                        <span v-if="!item.disabled"
                                                              class="fa fa-minus-circle options-icon" title="删除此选择项"
                                                              @click="deleteOptionsEditor(models[index][item.model],optIndex,item,index)"></span>
                                                    </li>
                                                </ul>

                                                <!-- 公式 -->
                                                <ifbp-fomula-designer :disabled="item.disabled"
                                                                      v-if="item.type === 'formula'"
                                                                      class="propertyInput"
                                                                      v-model="models[index][item.model]"
                                                                      :validate-function="validateFunction"
                                                                      :parser-function="parserFunction"
                                                                      :get-fomula-tpls-function="getFomulaTplsFunction"
                                                                      :get-database-function="getDatabaseFunction"
                                                                      :get-database-tables-function="getDatabaseTablesFunction"
                                                                      :get-table-fields-function="getTableFieldsFunction"
                                                                      @fomulachange="function(formulaData){formulaSave(item, formulaData)}">
                                                </ifbp-fomula-designer>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 属性面板 end -->
                    <!-- 表单面板 begin -->
                    <div v-bind:style="{display:  rightPanelShow == 'form' ? 'block' : 'none'}">
                        <div class="f_panelMain_left boxscroll">
                            <div class="boxPadRight">
                                <div role="properties">
                                    <ul v-if="dType != 'iform'">
                                        <li class="propertyLi">
                                            <label class="propertyLabel">表单标题</label>
                                            <el-input v-model="formInfo.name" class="propertyInput"
                                                      @blur="formInfoChange"/>
                                        </li>
                                        <li class="propertyLi">
                                            <label class="propertyLabel">描述</label>
                                            <el-input v-model="formInfo.describe" class="propertyInput"
                                                      @blur="formInfoChange"/>
                                        </li>
                                    </ul>
                                    <ul v-if="dType == 'ifrom'">
                                        <li class="propertyLi">
                                            <label class="propertyLabel">表单标题</label>
                                            <input v-model="formInfo.name" class="propertyInput"
                                                   @change="formInfoChange"/>
                                        </li>
                                        <li class="propertyLi">
                                            <label class="propertyLabel">描述</label>
                                            <input v-model="formInfo.describe" class="propertyInput"
                                                   @change="formInfoChange"/>
                                        </li>
                                        <li class="propertyLi">
                                            <label class="propertyLabel">表单分类</label>
                                            <select class="propertyInput" v-model="formInfo.pk_botype"
                                                    @change="formInfoChange">
                                                <option v-for="opt in formType" v-bind:value="opt.id">{{opt.name}}
                                                </option>
                                            </select>
                                        </li>
                                        <li class="propertyLi">
                                            <input type="checkbox" id="showThankPage" v-model="formInfo.showThankPage"
                                                   @change="formInfoChange">
                                            <label for="showThankPage" class="propertyCheckLabel">提交后显示反馈界面</label>
                                            <textarea v-show="formInfo.showThankPage == true" id="" style="width:100%;"
                                                      rows="2" v-model="formInfo.thankPageMessage"></textarea>
                                        </li>
                                    </ul>
                                    <ul v-if="dType == 'ifrom'" class="form_property_split">
                                        <li class="propertyLi">
                                            <input type="radio" id="refProcess" value="true" v-model="isRefProcess">
                                            <label for="refProcess" class="propertyCheckLabel">关联流程</label>
                                        </li>
                                        <li class="propertyLi" v-show="isRefProcess == 'true'">
                                            <input v-model="formInfo.processDefName" v-if="!formInfo.processDefId"
                                                   class="propertyInput"/>
                                            <label class="propertyCheckLabel" v-text="formInfo.processDefName"
                                                   v-if="formInfo.processDefId"
                                                   style="padding-left: 20px;color: #39f;"></label>
                                        </li>
                                        <li class="propertyLi" v-show="isRefProcess == 'true'">
                                            <el-button type="primary" v-if="!formInfo.processDefId" icon="plus"
                                                       size="mini" @click="newProcess">创建新流程
                                            </el-button>
                                            <el-button type="primary" v-if="formInfo.processDefId" @click="editProcess"
                                                       size="mini">编辑
                                            </el-button>
                                            <el-button type="primary" v-if="formInfo.processDefId"
                                                       @click="deleteProcess" size="mini">删除
                                            </el-button>
                                        </li>
                                        <li class="propertyLi">
                                            <input type="radio" id="notRefProcess" value="false" v-model="isRefProcess">
                                            <label for="notRefProcess" class="propertyCheckLabel">数据收集</label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--表单面板 end-->
                    <!-- data面板 begin -->
                    <div v-bind:style="{display:  rightPanelShow == 'data'  ? 'block' : 'none'}">
                        <div class="f_panelMain_left boxscroll">
                            <el-input type="textarea"
                                      style="height:100%;padding:20px;box-sizing:border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;"
                                      @blur="tplDataBlur" v-model="tplDataStr">
                            </el-input>
                        </div>
                    </div>
                    <!--表单面板 end-->
                </div>
            </div>
            <!--右侧属性面板 end-->
            <div v-show="!previewed" class="f_code" :class="{'show_code': showType === 'HTML'}">
                <pre id="code_editor" style="width:100%;height:100%;margin:0;"></pre>
            </div>

            <div v-show="!previewed" class="f_code" :class="{'show_code': showType === 'DATA'}">
                <el-input type="textarea" :disabled="true"
                          style="height:100%;padding:20px;box-sizing:border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;"
                          v-model="tplDataStrFormat">
                </el-input>
            </div>

        </div>
        <!--元素管理面板-->
        <el-dialog title="管理" v-on:open="manageOpen" :visible="manageDialogVisible" size="large">
            <div id="manageDialogContent">

            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="manageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="manageDialogClose">确 定</el-button>
      </span>
        </el-dialog>
        <!--业务对象树排序面板-->
        <el-dialog title="对象管理" :visible="treeDialogVisible" @update:visible="val => treeDialogVisible = val"
                   size="full">
            <div style="padding-right: 50px;padding-bottom: 20px;">
                <label class="propertyLabel" style="display: inline-block;width: 65px;font-size: 14px;">展示类型:</label>
                <el-select v-model="dragShowType" size="small" style="width:120px" placeholder="请选择">
                    <el-option label="表单" value="form"></el-option>
                    <el-option label="表格" value="table"></el-option>
                    <el-option label="表格&表单" value="tableform"></el-option>
                </el-select>
                <el-button @click="showAll('1')">全部显示</el-button>
                <el-button @click="showAll('0')">全部取消</el-button>
            </div>

            <el-table :data="dragTreeData" stripe style="width: 100%">
                <el-table-column prop="name" label="名称" width="180">
                </el-table-column>
                <el-table-column prop="code" label="编码" width="180">
                </el-table-column>
                <el-table-column prop="ctrltype" label="类型" width="180">
                </el-table-column>
                <el-table-column prop="showFlag" label="是否显示">
                    <template slot-scope="scope">
                        <div style="text-align:left;">
                            <el-switch v-model="scope.row.showFlag" off-color="#ccc" on-value="1" off-value="0"
                                       on-text="" off-text="">
                            </el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="dragTreeNodeUp(scope.$index, scope.row)">上移</el-button>
                        <el-button size="small" @click="dragTreeNodeDown(scope.$index, scope.row)">下移</el-button>
                        <el-button size="small" @click="dragTreeNodeTop(scope.$index, scope.row)">置顶</el-button>
                        <el-button size="small" @click="dragTreeNodeBottom(scope.$index, scope.row)">置底</el-button>
                        <!-- <el-button size="small" type="danger" @click="dragTreeNodeDelete(scope.$index, scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">取 消</el-button>
        <el-button type="primary" @click="treeDialogClose">确 定</el-button>
      </span>
        </el-dialog>
        <el-dialog class="preview_el-dialog" title="预览" :visible="previewVisble"
                   @update:visible="val => previewVisble = val" size="full">
            <iframe id="preview_content"></iframe>
        </el-dialog>
    </div>
</template>

<script>
    import compUtil from '../js/editor/compUtil'

    let baseCompArray = compUtil.getBaseCompArray();
    let formCompArray = compUtil.getFormCompArray();
    let layoutArray = compUtil.getLayoutArray();
    let sysCompArray = compUtil.getSysCompArray();
    let bizCompArray = compUtil.getBizCompArray();

    let compTypes = [];
    for (let i = 0; i < formCompArray.length; i++) {
        if (formCompArray[i].key !== 'el-table' && formCompArray[i].key !== 'el-table-column' && formCompArray[i].key !== 'el-form-panel') {
            compTypes.push({
                label: formCompArray[i].name,
                value: formCompArray[i].key
            })
        }
    }

    export default {
        name: 'app',
        data() {
            return {
                dType: 'uitemplate',
                logoPath: '',
                logoText: '',
                previewed:false,
                showType: 'VIEW',
                actived_ele: null,
                childCompEl: null,
                formInfo: {},
                modelParents: {},
                currentCompName: '',
                childCompName: '',
                currentModel: {},
                currentPropertyUI: {},
                childModel: {},
                childPropertyUI: {},
                models: [],
                treeData: [],
                treeDataObj: {},
                treeProps: {
                    id: 'id',
                    pid: 'pid',
                    children: 'children',
                    label: 'name'
                },
                ss: "",
                propertyUIs: [],
                leftPanelOn: true, //左侧面板显示隐藏
                rightPanelOn: true, //右侧面板显示隐藏
                previewVisble: false,//预览
                layoutPanelOn: true, //布局panel显示隐藏
                baseCompPanelOn: true, //组件panel显示隐藏
                sysCompPanelOn: true, //系统组件panel显示隐藏
                bizCompPanelOn: true, //系统组件panel显示隐藏
                formCompPanelOn: true, //系统组件panel显示隐藏
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
                //系统组件信息
                sysCompArray: sysCompArray,
                //业务组件信息
                bizCompArray: bizCompArray,


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
                exportCodeDialogVisible: false,
                isNewtem: false
            }
        },
        created:function(){
            this.dType = 'uitemplate';
            this.logoPath = './static/UIDesigner.svg';
            this.logoText = 'UI模板设计器'
        },
        watch: {
            actived_ele: function (element) {
                let oThis = this;
                this.activeNodeFlag = true;
                if (!element) {
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
                    this.propertyUIs = [];
                    return;
                }
                // let el = $(element);
                let comp = element['comp'];
                let eleId = $(element).attr('_id');
                let eleDom = window.engine.currentDom.find('[_id=' + eleId + ']');
                let eleType = eleDom.attr('render-type');
                let elepk = eleDom.attr('pk');
                this.currentModel = {
                    "render-type": "default",
                    "fixed": false,
                    ":show-summary": false,
                    ":show-header": true,
                    ":table-tree": false,
                    ":expand-tree-all": false,
                    ":multiple": false,
                    "align": "left",
                    "header-align": "left"
                };
                let nameOptions = [];
                let labelOptions = [];
                let modelOptions = [];
                for (let key in oThis.treeDataObj) {
                    if (key.indexOf(".") !== -1) {
                        let name = key.split(".")[1]
                        nameOptions.push({
                            label: name,
                            value: name
                        })
                        labelOptions.push({
                            label: oThis.treeDataObj[key].name,
                            value: name
                        })
                        modelOptions.push({
                            label: key,
                            value: name
                        })
                    }
                }

                // $.extend(this.currentModel,comp.$props); //comp.$data
                this.currentPropertyUI = comp.$options.meta.propertyUI;
                for (let i = 0; i < this.currentPropertyUI.length; i++) {
                    let _key = this.currentPropertyUI[i].model;

                    if (_key === 'compType') {
                        this.currentPropertyUI[i].options = compTypes;
                    }
                    if (_key === 'prop') {
                        this.currentPropertyUI[i].options = nameOptions;
                    }
                    if (_key === 'label') {
                        this.currentPropertyUI[i].options = labelOptions;
                    }
                    if (_key === "ref-code" && eleType === 'ref') {
                        this.currentPropertyUI[i].show = "showtrue";
                        if (elepk) {
                            if (!window.engine.refCodeSelectPk[elepk]) {
                                $.ajax({
                                    type: "POST",
                                    url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryRef",
                                    data: {
                                        pk_md: elepk
                                    },
                                    dataType: "json",
                                    async: false,
                                    success: function (result) {
                                        oThis.setRefByPk(result, oThis.currentPropertyUI[i], elepk);
                                    },
                                    error: function () {
                                        oThis.setRefByPk(null, oThis.currentPropertyUI[i], elepk);
                                    }
                                });
                            } else {
                                this.currentPropertyUI[i].options = window.engine.refCodeSelectPk[elepk];
                            }
                        } else {
                            if (!window.engine.refCodeSelectNoPk) {
                                $.ajax({
                                    type: "POST",
                                    url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryRef",
                                    dataType: "json",
                                    async: false,
                                    success: function (result) {
                                        oThis.setRefByPk(result, oThis.currentPropertyUI[i], elepk)
                                    },
                                    error: function () {
                                        oThis.setRefByPk(null, oThis.currentPropertyUI[i], elepk)
                                    }
                                });
                            } else {
                                this.currentPropertyUI[i].options = window.engine.refCodeSelectNoPk;
                            }
                        }


                    }
                    if (_key === "ref-code" && eleType !== 'ref') {
                        this.currentPropertyUI[i].show = "showfalse";
                    }
                    // 根据某一属性改变其他属性是否显示
                    if (_key === ':render-select-options-let' || _key === ':render-select-options') {
                        if (comp.$options._componentTag === 'el-table-column') {
                            let renderType = comp.$options.propsData.renderType;
                            this.currentPropertyUI[i].hidden=!(renderType && renderType === 'select')
                        }
                    }
                    if (_key === 'download-url') {
                        if (comp.$options._componentTag === 'el-table-column') {
                            let renderType = comp.$options.propsData.renderType;
                            if (renderType && renderType === 'file' || renderType === 'image') {
                                this.currentPropertyUI[i].hidden = false;
                            } else {
                                this.currentPropertyUI[i].hidden = true;
                            }
                        }
                    }
                    if (_key === 'format') {
                        if (comp.$options._componentTag === 'el-table-column') {
                            let renderType = comp.$options.propsData.renderType;
                            if (renderType && renderType === 'date') {
                                this.currentPropertyUI[i].hidden = false;
                            } else {
                                this.currentPropertyUI[i].hidden = true;
                            }
                        }
                    }
                    if (_key === 'symbol') {
                        if (comp.$options._componentTag === 'el-table-column') {
                            let renderType = comp.$options.propsData.renderType;
                            if (renderType && renderType === 'money') {
                                this.currentPropertyUI[i].hidden = false;
                            } else {
                                this.currentPropertyUI[i].hidden = true;
                            }
                        }
                    }
                    if (_key === ':multiply') {
                        if (comp.$options._componentTag == 'el-table-column') {
                            let renderType = comp.$options.propsData.renderType;
                            if (renderType && renderType === 'percent') {
                                this.currentPropertyUI[i].hidden = false;
                            } else {
                                this.currentPropertyUI[i].hidden = true;
                            }
                        }
                    }
                    if (_key === 'decimals' || _key === 'separator') {
                        if (comp.$options._componentTag == 'el-table-column') {
                            let renderType = comp.$options.propsData.renderType;
                            if (renderType && (renderType === 'money' || renderType === 'number' || renderType === 'percent')) {
                                this.currentPropertyUI[i].hidden = false;
                            } else {
                                this.currentPropertyUI[i].hidden = true;
                            }
                        }
                    }
                    if (compUtil.setEditorEditorAttr(_key, element, this.currentModel)) {
                    } else {
                        let value = eleDom.attr(_key);
                        this.currentModel[_key] = value;
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

                        let childId = $(this.childCompEl).attr('_id');
                        let childDom = window.engine.currentDom.find('[_id=' + childId + ']');
                        let childComp = this.childCompEl['comp'];
                        this.childCompName = childComp.$options.meta.name;
                        if (this.childCompName === '日期') {
                            childDom.attr(':valuetoms', true)
                        } else {
                            childDom.removeAttr(':valuetoms')
                        }
                        this.childModel = {
                            compType: '',
                            'validate-type': [],
                            'ref-code': ''
                        };
                        // $.extend(this.childModel ,childComp.$props); //comp.$data
                        this.childPropertyUI = childComp.$options.meta.propertyUI;
                        for (let i = 0; i < this.childPropertyUI.length; i++) {
                            let _key = this.childPropertyUI[i].model;

                            if (_key === 'compType') {
                                this.childPropertyUI[i].options = compTypes;
                            }
                            if (_key === 'v-model') {
                                this.childPropertyUI[i].options = modelOptions;
                            }
                            if (_key === 'ref-code') {
                                let pk = childDom.attr('pk');
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
                                if (_key === 'validate-type') {
                                    this.childModel[_key] = childDom.attr(_key) ? childDom.attr(_key).split(",") : [];

                                } else {
                                    this.childModel[_key] = childDom.attr(_key);
                                }
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
                let parentNode = element.parentNode;
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
            setRefByPk: function (result, nowChildPropertyUI, pk) {
                console.log(result && result.length > 0);
                if (result && result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
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
                    this.treeDataObj[node.data.data.code] = node.data.data;
                    return true;
                }
                this.treeDataObj[node.data.data.code] = node.data.data;
                return true;
            },
            leftPaneltoggle: function () {
                this.leftPanelOn = !this.leftPanelOn;
            },
            rightPaneltoggle: function () {
                this.rightPanelOn = !this.rightPanelOn;
            },

            handleDragStart: function (elem, e) {
                // console.log('handleDragStart', elem);
                // e.dataTransfer.addElement(elem.parentNode);
                this.loggedEvent = 'handleDragStart';
            },
            handleDragOver: function (elem) {
                // console.log('handleDragOver', elem);
                this.loggedEvent = 'handleDragOver';
            },
            handleDragEnter: function (elem) {
                // console.log('handleDragEnter', elem);
                this.loggedEvent = 'handleDragEnter';
            },
            handleDragLeave: function (elem) {
                // console.log('handleDragLeave', elem);
                this.loggedEvent = 'handleDragLeave';
            },
            handleDragEnd: function (elem) {
                // console.log('handleDragEnd', elem);
                this.loggedEvent = 'handleDragEnd';
            },
            handleDrop: function (itemOne, itemTwo) {
                console.log('handleDrop', itemOne.id, itemTwo.id);
            },
            handleImageDrop: function (itemOne, itemTwo) {
                console.log('handleImageDrop', itemOne.getAttribute('data-index'), itemTwo.getAttribute('data-index'));
                // this.loggedEvent = 'handleImageDrop';
                // let dummy = this.images[itemOne.getAttribute('data-index')];
                // this.images.$set(itemOne.getAttribute('data-index'), this.images[itemTwo.getAttribute('data-index')]);
                // this.images.$set(itemTwo.getAttribute('data-index'), dummy);
            },
            handleDrag: function (elem) {
                //console.log('handleDrag', elem);
                this.loggedEvent = 'handleDrag';
            },
            /**
             * 保存
             */
            save: function (isEnable) {
                window.engine.save(isEnable);
                try {
                    if (window.opener && typeof window.opener.designerCB === 'function') {
                        let pk_temp = this.$route.query.pk_temp;
                        window.opener.designerCB(pk_temp);
                    }
                    if (top.vueInstance && top.vueInstance.$children[0] && top.vueInstance.$children[0].$eventBus) {
                        top.vueInstance.$children[0].$eventBus.$emit('uitemplateSave', pk_temp);
                    }
                } catch (e) {
                    console.log(e);
                }
            },

            clear: function () {
                window.engine.clear();
            },

            repair: function () {
                window.engine.repair();
            },

            business: function () {
                window.engine.business();
            },
            /**
             * 显示模板
             */
            // showTemplateDialog: function () {
            // 	this.templateUrl = '/iform_web/iform_ctr/iform_design_ctr/manage#forms/cloud'
            // 	this.templateDialogVisible = true;
            // },
            // selectTemplate: function(){
            // 	this.templateDialogVisible = false;
            // },
            manageTemplateDialogOpen: function () {
                let oThis = this;
                this.$nextTick(function () {
                    let dialogHeight = this.$refs.templateDialog.$el.offsetHeight;
                    $('#templateFrame').css('height', dialogHeight - 120);
                    $('#templateFrame')[0].contentWindow.formDesignCallback = function (templateId) {
                        oThis.$confirm('确定后已经设计的表单会被重置', '确认').then(function () {
                            $.ajax({
                                type: "POST",
                                data: {
                                    templateId: templateId,
                                    pk_bo: this.$route.query.pk_bo
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
            /**
             * 另存为模板
             */
            saveAsTemplate: function () {
                this.saveAsTemplateDialogVisible = true;
            },
            doSaveTemplate: function () {
                let oThis = this;
                this.$refs.templateNameForm.validate(function (valid) {
                    if (valid) {
                        let params = {
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
                                    let model = {
                                        form: oThis.formInfo,
                                        formLayout: window.engine.currentDom.html(),
                                        formData: window.engine.tplData,
                                        formVersion: '1'
                                    }
                                    model.formData = window.engine.tplData;
                                    model.saveToTemplate = true;
                                    model.form.id = data.data.pk_bo;
                                    let params = {
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
                let oThis = this;
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
                            pk_bo: this.$route.query.pk_bo,
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
                let oThis = this;
                $.ajax({
                    type: "POST",
                    data: {
                        processDefinionId: oThis.formInfo.processDefId,
                        formlayout: window.engine.getModel(),
                        pk_bo: this.$route.query.pk_bo
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
                let oThis = this;
                this.$confirm('确定删除关联的流程吗？', '确认').then(function () {
                    $.ajax({
                        type: "post",
                        url: "/iform_web/form_manage/deleteProcessDirectly",
                        dataType: "json",
                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                        data: {
                            formId: this.$route.query.pk_bo
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
                let editDiv = $('#ifr_content')[0].contentWindow.$('#editor');
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
            mainShowForm: function () {
                this.mainShowChange(true);
            },
            mainShowTable: function () {
                this.mainShowChange(false);
            },
            initTreeModel: function (table_name) {
                if (!table_name) {
                    return;
                }
                let oThis = this;
                let cache = this.$route.query.cache || "no";
                $.ajax({
                    type: 'get',
                    url: '/uitemplate_web/uitemplate_ctr/mdadptor_ctr/loadTableInfo?table_name=' + table_name + '&cache=' + cache,
                    success: function (data) {
                        window.engine.table_name = table_name;
                        let _data;
                        if (typeof data === 'string') {
                             _data = JSON.parse(data);
                        } else {
                             _data = data;
                        }
                        for (let i = 0; i < _data.length; i++) {
                            _data[i].showFlag = 1;
                        }
                        oThis.treeDataObj = {};
                        oThis.treeData = _data;
                        oThis.$nextTick(function () {
                            $("#form-businessObj .el-tree-node__content").attr('draggable', true);
                            $("#form-businessObj .el-tree-node__content").off('dragstart');
                            for (let i = 0; i < $("#form-businessObj .el-tree-node__content").length; i++) {
                                oThis.addDragEvent($("#form-businessObj .el-tree-node__content")[i]);
                            }
                            oThis.$refs['businessTree'].filter('1');
                            $('.boxscroll').perfectScrollbar('update');
                        });

                        window.engine.formInfo = window.engine.formInfo || {
                            name: '标题'
                        };
                        if (window.engine.formInfo.name === '标题') {
                            let rootNode = oThis.$refs['businessTree'].root;
                            let rootNodeName = rootNode.label;
                            window.engine.formInfo.name = rootNodeName;
                        }
                        //模拟手动拖拽事件
                        if (window.location.href.indexOf("&autoCreated=true") > -1) {
                            window.engine.clear();
                            oThis.$nextTick(function () {
                                let srcEle = $(".el-tree-node__content")[0];
                                let targetEle = $("#app");
                                oThis.treeNodeDropCallBack(srcEle, targetEle);
                                oThis.showAll('0');
                                let showData = parent.defaultShowData;
                                oThis.dragShowType = 'tableform';
                                for (let i = 0; i < oThis.dragTreeData.length; i++) {
                                    if (showData.indexOf(oThis.dragTreeData[i].name) !== -1) {
                                        this.dragTreeData[i].showFlag = "1";
                                    }
                                }
                                oThis.treeDialogClose();
                                window.engine.repair();
                                window.engine.business();
                                window.engine.saveWithFeedback();
                            })
                        }
                    }
                })

            },
            loadTempData: function (pk_temp) {

                window.nowPkTemp = pk_temp;
                $.ajax({
                    type: 'get',
                    url: '/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplate?pk_temp=' + pk_temp,
                    success: function (data) {
                        let _data;
                        if (typeof data === 'string' && data !== '') {
                             _data = JSON.parse(data);
                        } else {
                             _data = data;
                        }
                        let table_name ;
                        if (_data.form) {
                            table_name = _data.form.table_name;
                            window.shell.initTreeModel(table_name);
                        }

                        window.engine.table_name = table_name;
                        window.engine.loadModel(_data);
                        let formData = _data.formData;
                        if (typeof formData !== 'string') {
                            formData = JSON.stringify(formData);
                        }
                        window.shell.setTplDataStr(formData);
                        window.shell.setEngineTplData();
                    }
                })
            },
            loadBoData: function (pk_bo) {
                let oThis = this;
                $.ajax({
                    type: 'get',
                    url: '/iform_web/iform_ctr/iform_design_ctr/openUIForm?pk_bo=' + pk_bo,
                    success: function (data) {
                        let _data;
                        if (typeof data === 'string') {
                             _data = JSON.parse(data);
                        } else {
                             _data = data;
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
                // parent.shell.actived_ele = item.ele;
            },
            manager: function () {
                this.manageDialogVisible = true;
            },
            manageOpen: function () {
                let comp = this.actived_ele['comp'];
                let name = comp.$options.name + '-manage';
                let Comp = Vue.component(name);
                if (!Comp)
                    throw new Error("组件:" + name + " 未定义");
                let component = new Comp().$mount();
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
                let dropPosDom = $('#ifr_content')[0].contentWindow.$dropPosDom;
                dropPosDom && dropPosDom.remove && dropPosDom.remove();
            },
            /**
             * 拖拽的数节点排序上移
             */
            dragTreeNodeUp: function (index) {
                let temp = this.dragTreeData[index]
                this.dragTreeData.splice(index, 1);
                this.dragTreeData.splice(index - 1, 0, temp);
            },
            /**
             * 拖拽的数节点排序下移
             */
            dragTreeNodeDown: function (index) {
                let temp = this.dragTreeData[index]
                this.dragTreeData.splice(index, 1);
                this.dragTreeData.splice(index + 1, 0, temp);
            },
            /**
             * 拖拽的数节点排序置顶
             */
            dragTreeNodeTop: function (index) {
                let temp = this.dragTreeData[index]
                this.dragTreeData.splice(index, 1);//删除数组中下标为index的元素
                this.dragTreeData.splice(0, 0, temp);//将删除的元素放在数组的首位
            },
            /**
             * 拖拽的数节点排序置底
             */
            dragTreeNodeBottom: function (index) {
                let temp = this.dragTreeData[index]
                this.dragTreeData.splice(index, 1);//删除数组中下标为index的元
                this.dragTreeData.push(temp)//将删除的元素放在数组的末尾
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
                    let treeNodeComp = $(srcElement).parent()[0]['__vue__'];
                    let baseData = treeNodeComp.getBaseData();
                    if (treeNodeComp.isLeaf() || baseData.ctrltype === 'Reference') {
                        let _id = $(targetElement).attr('_id');
                        let ele = window.engine.currentDom.find('[_id=' + _id + ']');
                        if (targetElement.comp && ($(targetElement.comp.$el.parentNode).hasClass('hidden-columns') || $($(targetElement).children()[0]).hasClass('el-table'))) {
                            let $dom = window.engine.createTableColumnComp({
                                compAttr: baseData,
                                ele: ele[0]
                            });
                        } else {
                            let $dom = window.engine.createFormElementComp({
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
            showCode: function (showType) {
                // 为了解决直接点击data只有就点击view会导致数据丢失，每次都调用codeEditor的setValue
                if (showType !== 'VIEW') {
                    compUtil.removeDesignAttr(window.engine.currentDom);
                    let g = html_beautify(window.engine.currentDom.html());
                    // g = g.replace(/>/g, "&gt;").replace(/</g, "&lt;");
                    window.codeEditor.setValue(g);
                    window.codeEditor.clearSelection();
                }

                if (showType === 'VIEW') {
                    let html = window.codeEditor.getValue().replace(/[\r\n]/g, '');
                    html = html.replace(/>[ ]*</g, '><');

                    window.engine.currentDom.html(html);
                    window.engine.refreshDom();
                } else if (showType === 'DATA') {
                    this.tplDataStrFormat = formatJson(window.engine.getTplData());
                }
                this.showType = showType;
            },
            attrChange: function (attr, level) {
                // if (window.shell.activeNodeFlag) {
                // 	return;
                // }
                if (this.isIform && attr.attrName === 'label' && this.actived_ele['comp'].$options._componentTag === 'el-form-item') {
                    let _id = $(this.childCompEl).attr('_id');
                    let modelName = window.engine.currentDom.find('[_id=' + _id + ']').attr('v-model');
                    let modelPath = modelName.split('.');
                    window.engine.tplData[modelPath[0]][modelPath[1]].showName = this.currentModel.label;
                }
                if (level == 0) {
                    compUtil.updateCompAttr(this.actived_ele, this.currentModel, attr);
                } else {
                    compUtil.updateCompAttr(this.childCompEl, this.childModel, attr);
                }

            },

            saveDefaultValue: function (item, index, showValue, realValue) {
                this.childModel['defaultValueShowValue'] = showValue;
                this.childModel['defaultValueRealValue'] = realValue;
                this.attrChange(item, index);
            },
            addOptionsEditor: function (models, item, index) {
                let itemModel = item.model;
                let itemModelVar = itemModel + '-let';
                let modelVar = models[index][itemModelVar];
                if (!modelVar) {
                    this.$message({
                        message: '请设置选项对象'
                    })
                    return;
                }
                window.engine.tplData[modelVar] = window.engine.tplData[modelVar] || [];
                models[index][itemModel] = window.engine.tplData[modelVar];
                let model = models[index][itemModel];
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

            showAll: function (show) {
                for (let i = 0; i < this.dragTreeData.length; i++) {
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
                    console.log(e);
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
                };
                let dologin = this.$route.query.dologin;
                let host = window.location.hostname;
                if (dologin && (host === 'localhost' || host === '127.0.0.1')) {
                    let d = {
                        "loginname": 'admin',
                        "pwd": '123456',
                        "encrypt": "ON"
                    };
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
                let pk_temp = this.$route.query.pk_temp;
                if (pk_temp) {
                    this.loadTempData(pk_temp);
                } else {
                    let table_name = this.$route.query.table_name;
                    if (table_name) {
                       this.initTreeModel(table_name);
                    }
                }

                let pk_bo = this.$route.query.pk_bo;
                if (pk_bo) {
                    this.loadBoData(pk_bo);
                }
            },
            /**
             * fomula related methods begin
             */
            // 校验按钮点击事件处理函数
            validateFunction: function (fomulaStr) {
                let validateResult = false;
                let url = '/wbalone/formula/validate';
                if (this.getCookie('platform') == 'ifbp') {
                    url = '/ifbp-app-bd/wbalone/formula/validate';
                }
                $.ajax({
                    type: 'POST',
                    url: url,
                    dataType: 'json',
                    contentType: 'application/json',
                    data: fomulaStr,
                    // data: '123', //JSON.stringify(fomulaStr),
                    async: false,
                    success: function (result) {
                        if (result.success == true) {
                            validateResult = true;
                        }
                    },
                    error: function (e) {
                        console.error(e);
                    }
                });
                return validateResult;
            },
            getCookie: function (cName) {
                let cStart;
                let cEnd;
                if (document.cookie.length > 0) {
                    cStart = document.cookie.indexOf(cName + "=");
                    if (cStart !== -1) {
                        cStart = cStart + cName.length + 1;
                        cEnd = document.cookie.indexOf(";", cStart);
                        if (cEnd === -1) {
                            cEnd = document.cookie.length;
                        }
                        return decodeURIComponent(document.cookie.substring(cStart, cEnd));
                    }
                }
                return "";

            },
            //解析公式
            parserFunction: function (fomulaStr) {
                let formulaResult;
                // fomulaStr = encodeURIComponent(fomulaStr);
                let url = '/wbalone/formula/formulaParser';
                if (this.getCookie('platform') == 'ifbp') {
                    url = '/ifbp-app-bd/wbalone/formula/formulaParser';
                }
                this.formu
                $.ajax({
                    type: 'POST',
                    url: url,
                    dataType: 'json',
                    contentType: 'application/json',
                    data: fomulaStr,
                    async: false,
                    success: function (result) {
                        if (result.success == true || result.status == 1) {
                            formulaResult = result.data;
                        }
                    },
                    error: function (e) {
                        console.error(e);
                    }
                });
                return formulaResult;
            },
            //公式确认
            formulaSave: function (attr, formulaData) {
                let table_formula = false;
                if (window.shell.activeNodeFlag) {
                    return;
                }
                let field = this.currentModel.prop;
                if (!formulaData) {
                    if (attr.model === 'editFormula' && window.engine.tplData.editFormulas) {
                        window.engine.tplData.editFormulas = window.engine.tplData.editFormulas || {};
                        delete window.engine.tplData.editFormulas[field];
                    } else if (attr.model === 'validateFormula') {
                        window.engine.tplData.validateFormulas = window.engine.tplData.validateFormulas || {};
                        delete window.engine.tplData.validateFormulas[field];
                    } else if (attr.model === 'showFormula') {
                        let componentType = window.shell.actived_ele.comp.$options._componentTag;
                        let showFormulas = window.engine.tplData.showFormulas = window.engine.tplData.showFormulas || {};
                        if (componentType === 'el-form-item') {
                            showFormulas.form = showFormulas.form || {};
                            delete showFormulas.form[field];
                        } else {
                            table_formula = true;
                            showFormulas.table = showFormulas.table || {};
                            delete showFormulas.table[field];
                        }
                    }
                    this.childModel[attr.model] = "";
                } else {
                    if (attr.model === 'editFormula') {
                        window.engine.tplData.editFormulas = window.engine.tplData.editFormulas || {};
                        window.engine.tplData.editFormulas[field] = formulaData;

                    } else if (attr.model === 'validateFormula') {
                        window.engine.tplData.validateFormulas = window.engine.tplData.validateFormulas || {};
                        window.engine.tplData.validateFormulas[field] = formulaData;

                    } else if (attr.model === 'showFormula') {
                        let componentType = window.shell.actived_ele.comp.$options._componentTag;
                        let showFormulas = window.engine.tplData.showFormulas = window.engine.tplData.showFormulas || {};

                        if (componentType === 'el-form-item') {
                            showFormulas.form = showFormulas.form || {};
                            showFormulas.form[field] = formulaData;
                        } else {
                            table_formula = true;
                            showFormulas.table = showFormulas.table || {};
                            showFormulas.table[field] = formulaData;
                        }
                    }
                    let originalFormulaStr = '';
                    for (let i = 0; i < formulaData.length; i++) {
                        if (i == 0)
                            originalFormulaStr = formulaData[i].originalFormula;
                        else
                            originalFormulaStr = originalFormulaStr + ';' + formulaData[i].originalFormula;
                    }

                    this.childModel[attr.model] = originalFormulaStr;
                }
                if (table_formula) {
                    let _id = this.currentModel._id;
                    let element = window.engine.currentDom.find('[_id=' + _id + ']')[0]
                    compUtil.updateCompAttr(element, this.childModel, attr);
                } else {
                    compUtil.updateCompAttr(this.childCompEl, this.childModel, attr);
                }

            },
            // 获取左下角公式模板函数
            getFomulaTplsFunction: function () {
                let resData;
                let url = '/wbalone/formula/getFormulatpls';
                if (this.getCookie('platform') == 'ifbp') {
                    url = '/ifbp-app-bd/wbalone/formula/getFormulatpls';
                }
                $.ajax({
                    type: 'POST',
                    url: url,
                    dataType: 'json',
                    async: false,
                    success: function (result) {
                        resData = result;
                    },
                    error: function () {
                        console.log('获取fomula模板失败');
                    }
                });
                return resData;
            },


            // 获取右下角数据库tab内容函数
            getDatabaseFunction: function () {
                let resData = {}, $items, fields = [];
                let componentType = window.shell.actived_ele.comp.$options._componentTag;
                if (componentType === 'el-form-item') {
                    $items = window.engine.currentDom.find('#form_area').find('el-form-item');
                } else {
                    $items = window.engine.currentDom.find('#table_area').find('el-table-column');
                }
                $items.each(function (index, item) {
                    let $item = $(item);
                    let label = $item.attr('label');
                    let prop = $item.attr('prop');
                    fields.push({displayName: label, inputSig: prop});
                })
                resData.fields = fields;
                resData.tableId = 'whatever';
                resData.tableName = '当前业务对象';
                return resData;
            },
            // 获取右下角表和字段tab中数据库列表
            getDatabaseTablesFunction: function () {
                let resData;
                let url = '/wbalone/formula/getDatabaseTables';
                if (this.getCookie('platform') == 'ifbp') {
                    url = '/ifbp-app-bd/wbalone/formula/getDatabaseTables';
                }
                $.ajax({
                    type: 'POST',
                    url: url,
                    dataType: 'json',
                    async: false,
                    success: function (result) {
                        resData = result;
                    },
                    error: function () {
                        console.log('获取表列表失败');
                    }
                });
                return resData;
            },
            // 获取右下角表和字段tab中某表对应的字段列表
            getTableFieldsFunction: function (tableId) {
                if (!tableId) {
                    return null;
                }
                let resData;
                let url = '/wbalone/formula/getTableFields';
                if (this.getCookie('platform') == 'ifbp') {
                    url = '/ifbp-app-bd/wbalone/formula/getTableFields';
                }

                $.ajax({
                    type: 'POST',
                    url: url,
                    dataType: 'json',
                    async: false,
                    data: {
                        id: tableId
                    },
                    success: function (result) {
                        resData = result;
                    },
                    error: function () {
                        console.log('获取字段列表失败');
                    }
                });
                return resData;
            },

            testFomulaChange: function () {
                alert(1);
            }

            // fomula related methods end
        },
        mounted () {
            setTimeout(()=>{
                this.isNewtem=Boolean(this.$route.query.isNewtem);
                window.codeEditor = ace.edit("code_editor");
                window.codeEditor.setTheme("ace/theme/chrome");
                window.codeEditor.getSession().setMode("ace/mode/html");
                $('#ifr_content')[0].src = 'designer.html';
                window.shell=this;
                console.log($('#preview_content').contentWindow)
                $('.boxscroll').perfectScrollbar();
                let myIn=setInterval(()=>{
                    if(window.engine){
                        clearInterval(myIn)
                        this.ready()
                    }
                },10);
                // this.ready()
            },0);

        },
    }
</script>

<style scoped>

</style>