<template>
    <div class="tabDialog" id="addressBox" :style="panelStyle">
        <el-tabs type="border-card" v-model="treeNodePanel" @tab-click="handleTabClick">
            <el-tab-pane v-for="(node, index) in selectedNodesInPanel"
                         :key="index"
                         :name="node.panelName"
                         :label="node.currentNodeName ? node.currentNodeName : '请选择'">
                <div class="tree-node-panel-content" :style="{maxHeight: contentHeight - 84 + 'px'}">
                    <div v-if="isCountry" class="flat-ref-groups">
              <span v-for="(groupName, groupNameIndex) in strFieldName"
                    :class="{current: currentFlatGroupIndex === groupNameIndex}"
                    :key="groupNameIndex"
                    @click="flatRefGroupChange(groupNameIndex,node)">{{ groupName }}</span>
                    </div>
                    <el-row v-if="isCountry" class="flat-ref-content">
                        <el-col v-for="(flatOptions, flatLabel) in node.children"
                                :key="flatLabel">
                            <el-col class="flat-ref-label" :span="1" v-if="flatLabel !== 'hot'&&flatLabel !== 'other'">
                                {{ flatLabel }}
                            </el-col>
                            <el-col :span="flatLabel === 'hot'||flatLabel === 'other'?24:23">
                                <el-row>
                                    <el-col :span="4"
                                            v-for="(option, optionIndex) in flatOptions"
                                            :key="optionIndex"
                                            :title="option.name"
                                            class="flat-ref-option"
                                            :class="{
                      current: node.id === option.pid
                    }"
                                            @click.native="selectTreeNode(node,option,index)">{{ option.name }}
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row v-else class="tree-node-childnodes"
                            :gutter="8">
                        <el-col v-for="(childNode, childIndex) in node.children"
                                :key="childIndex"
                                class="tree-node-childnode"
                                :class="{current: node.id === childNode.pid}"
                                :span="6"
                                :title="childNode.name"
                                @click.native="selectTreeNode(node, childNode, index)">
                            {{ childNode.name }}
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>

    export default {
        name: 'refInput',
        props: {
            data: {},
            dataName: {},
            width: {
                type: Number,
                default: 300
            },
            offsetLeft: {
                type: Number,
                default: 300
            },
            offsetTop: {
                type: Number,
                default: 300
            },
            position: {}
        },
        data() {
            return {
                formData: {
                    country: null, // 国家id
                    province: null, // 省份id
                    city: null, // 城市id
                    vsection: null// 县区id
                },
                formDataName: {
                    country: null, // 国家id
                    province: null, // 省份id
                    city: null, // 城市id
                    vsection: null// 县区id
                },
                // 当前选中panel
                treeNodePanel: null,
                // tab数组
                selectedNodesInPanel: [],
                contentHeight: 400,
                tabWidth: '',
                offSetTop: '',
                offSetLeft: '',
                currentType: '',
                addressName: [],
                tabIndex: null,
                // 国家分类
                strFieldName: ['常用', 'ABCD', 'EFGH', 'IJKL', 'MNOPQ', 'RST', 'UVW', 'XYZ', '其他'],
                defaultName: ['中国', '美国', '英国', '法国', '德国', '日本', '澳大利亚'],
                allCountry: [],
                currentFlatGroupIndex: 0,
                isCountry: false
            };
        },
        computed: {
            panelStyle() {
                return {
                    width: this.width + 'px',
                    top: this.offsetTop + 'px',
                    left: this.offsetLeft + 'px'
                };
            }
        },
        methods: {
            // 重置选项
            reset() {
                this.selectedNodesInPanel = [];
                this.addressName = [];
                this.requestData('/wbalone/address/queryAllCountry', 'country');
            },
            // 自适应窗口设置
            adjustRefData() {
                const calcHeight = window.innerHeight - 64 * 2 - 65 - 48 - 48;
                this.contentHeight = Math.min(parseInt(calcHeight, 10), 426);
            },
            // 获取城市列表数据
            requestData(url, type, pid) {
                var self = this;
                this.$http({
                    url: url,
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: pid
                }).then(res => {
                    var resData = res.data.data || [];
                    if (!resData) {
                        return;
                    }
                    this.currentType = type;
                    if (resData.length !== 0) {
                        const panelCount = this.selectedNodesInPanel.length;
                        var item = {
                            name: '',
                            panelName: 'treeNodePanel_' + panelCount,
                            children: resData
                        };
                        if (type === 'country') {
                            this.allCountry = resData;
                            item.children = this.sortFlatRefData('常用');
                            this.isCountry = true;
                        } else {
                            this.isCountry = false;
                        }
                        this.treeNodePanel = 'treeNodePanel_' + panelCount;
                        this.selectedNodesInPanel.push(item);
                    } else {
                        this.$parent.showPanel = false;
                    }
                }).catch(() => {
                    this.$message({type: 'error', message: '请求失败!'});
                });
            },
            // 切换tab
            handleTabClick(tab) {
                this.tabIndex = parseInt(tab.index, 10);
                if (this.tabIndex < this.selectedNodesInPanel.length - 1) {
                    this.selectedNodesInPanel = this.selectedNodesInPanel.slice(0, this.tabIndex + 1);
                    this.addressName = this.addressName.slice(0, this.tabIndex + 1);
                    this.$emit('select', this.addressName);
                }
                // 如果在第一级，重置currentType值为国家
                if (this.tabIndex === 0) {
                    this.currentType = 'country';
                    this.isCountry = true;
                } else if (this.tabIndex === 1) {
                    this.currentType = 'province';
                    this.isCountry = false;
                } else if (this.tabIndex === 2) {
                    this.currentType = 'city';
                    this.isCountry = false;
                }
                ;
                this.resetForm(this.tabIndex, this.currentType);
            },
            // 清空form其他项数据
            resetForm(tabIndex, type) {
                var self = this;
                Object.keys(this.formData).forEach((key, index) => {
                    if (index > tabIndex) {
                        self.formData[key] = '';
                    }
                    ;
                });
            },
            // 选中某节点
            selectTreeNode(node, childNode, itemIndex) {
                if (!node || !childNode) {
                    return;
                }
                node.currentNodeName = childNode.name;
                node.currentNodeId = childNode.id;
                // 如果超出长度则裁剪
                if (itemIndex < this.selectedNodesInPanel.length - 1) {
                    this.selectedNodesInPanel = this.selectedNodesInPanel.slice(0, itemIndex + 1);
                }
                // 子菜单不重复push
                if (this.addressName.length < this.selectedNodesInPanel.length) {
                    this.addressName.push(node.currentNodeName);
                } else {
                    this.addressName.splice(this.selectedNodesInPanel.length - 1, 1, node.currentNodeName);
                }
                var url, type, params;
                if (this.currentType === 'country') {
                    url = '/wbalone/address/queryRegionByCountry';
                    type = 'province';
                    params = childNode.id;
                    this.country = childNode.id;
                } else if (this.currentType === 'province' || this.currentType === 'city') {
                    if (this.currentType === 'province') {
                        type = 'city';
                    } else {
                        type = 'vsection';
                    }
                    url = '/wbalone/address/queryRegionByFather';
                    params = {pk_country: this.country, pk_father: childNode.id};
                }
                ;
                if (this.currentType === 'country') {
                    this.formData.province = '';
                    this.formDataName.province = '';
                    this.formData.city = '';
                    this.formDataName.city = '';
                    this.formData.vsection = '';
                    this.formDataName.vsection = '';
                }
                if (this.currentType === 'province') {
                    this.formData.city = '';
                    this.formDataName.city = '';
                    this.formData.vsection = '';
                    this.formDataName.vsection = '';
                }
                if (this.currentType === 'city') {
                    this.formData.vsection = '';
                    this.formDataName.vsection = '';
                }
                this.formData[this.currentType] = childNode.id;
                this.formDataName[this.currentType] = childNode.name;
                if (url) {
                    this.requestData(url, type, params);
                } else {
                    this.$parent.showPanel = false;
                }
                ;
                this.$emit('select', this.addressName);
            },
            // 保存
            sendPks() {
                this.$emit('pkchange', this.formData, this.formDataName);
            },
            // 参照筛选
            flatRefGroupChange(index, node) {
                this.currentFlatGroupIndex = index;
                var filterName = this.strFieldName[index];
                node.children = this.sortFlatRefData(filterName);
                console.log(node.children);
            },
            sortFlatRefData(filterName) {
                var tmp = {};
                if (filterName === '常用') {
                    tmp.hot = this.allCountry.filter(val => {
                        return this.defaultName.indexOf(val.name) > -1;
                    });
                } else if (filterName === '其他') {
                    tmp.other = this.allCountry.filter(val => {
                        return !/[A-Za-z]/.test(val.sortIndex);
                    });
                } else {
                    var children = this.allCountry.filter(val => {
                        return filterName.indexOf(val.sortIndex) > -1;
                    });
                    children.forEach(val => {
                        if (!Array.isArray(tmp[val.sortIndex])) {
                            tmp[val.sortIndex] = [val];
                        } else {
                            tmp[val.sortIndex].push(val);
                        }
                    });
                }
                return tmp;
            },
            resizeListener() {
                this.adjustRefData.call(this);
            }
        },
        mounted() {
            this.formData = this.data;
            this.formDataName = this.dataName;
            this.$nextTick(() => {
                this.adjustRefData();
            });
            window.addEventListener('resize', this.resizeListener);
            // window.addEventListener('resize', () => {
            //   this.adjustRefData.call(this);
            // });
            // 加载国家列表
            this.requestData('/wbalone/address/queryAllCountry', 'country');
        },
        beforeDestroy() {
            this.reset();
            '';
            this.sendPks();
            window.removeEventListener('resize', this.resizeListener);
        }
    };
</script>
<style scoped>
    .tabDialog {
        z-index: 9999;
        position: fixed;
    }

    .tree-node-panel-content {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .tree-node-childnode {
        padding: 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #2D2D2D;
        cursor: pointer;
        font-size: 14px;
        line-height: 14px;
    }

    .tree-node-childnode:hover,
    .tree-node-childnode.current {
        color: #5AC8FA;;
    }

    .flat-ref-groups {
        display: flex;
        height: 40px;
        line-height: 40px;
        text-align: center;
    }

    .flat-ref-groups span {
        flex: 1;
        background: #EAF9FF;
        font-size: 14px;
        color: #2D2D2D;
        border-right: 1px solid #fff;
        cursor: pointer;
    }

    .flat-ref-groups .current,
    .flat-ref-groups span:hover {
        background: #5AC8FA;
        color: #FFFFFF;
    }

    .flat-ref-label,
    .flat-ref-option {
        margin-top: 8px;
        padding: 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
        line-height: 14px;
        color: #2D2D2D;
    }

    .flat-ref-option {
        cursor: pointer;
    }

    .flat-ref-option::selection,
    .tree-node-childnode::selection,
    .tree-breadcrumbs span::selection {
        color: inherit;
    }

    .flat-ref-label,
    .flat-ref-option:hover,
    .flat-ref-option.current {
        color: #5AC8FA;
    }
</style>
