<script>
    export default {
        name: "sadqwdq",
        template: `    <div id="main_area" style="width:100%;height:100%;" _id="ifc90xra7sa">
        <div id="table_area" style="width:100%;padding-bottom:30px;" _id="2ciq8hoeelo">
            <el-table _id="malc0pjf41l" :inline="true" :data="hi_tag_t">
                <el-table-column _id="dx8ru1sbudj" :sortable="true" render-type="default"
                                 render-template="default" separator="," symbol="￥" align="left"
                                 header-align="left" prop="name" v-if="tableCoulmnVIfname" label="标签名称"
                                 width="150" format=""></el-table-column>
                <el-table-column _id="6ey1969wpny" :sortable="true" render-type="select"
                                 render-template="default" separator="," symbol="￥" align="center"
                                 header-align="center" prop="scope" v-if="tableCoulmnVIfscope" label="权限"
                                 width="150" format="" :render-select-options-var="scopevar"></el-table-column>
                <el-table-column _id="zvfy32i6nkg" :sortable="true" render-type="default"
                                 render-template="default" separator="," symbol="￥" align="left"
                                 header-align="left" prop="remark" v-if="tableCoulmnVIfremark" label="备注"
                                 width="200" format=""></el-table-column>
                <el-table-column _id="pujyvjov2rl" :sortable="true" render-type="boolean"
                                 render-template="default" separator="," symbol="￥" align="center"
                                 header-align="center" prop="enablestate" v-if="tableCoulmnVIfenablestate"
                                 label="是否启用" width="100" format=""
                                 :render-select-options-var="enablestatevar"></el-table-column>
                <el-table-column  type="noIconExpand">
                                 <template scope="props">

                                 </template>
                </el-table-column>
            </el-table>
        </div>
        <div id="form_area" style="width:100%;" _id="rl98c80fe1c">
            <el-form _id="lgy8i5495rk" :inline="true" :rules="rules" label-width="150px" :adaptation="true"
                     :model="hi_tag">
                <el-form-item _id="86sq0tsug02" label="标签名称" v-if="formItemVIfname" prop="name"
                              :required="true">
                    <el-input _id="5uik7hmxuca" v-model="hi_tag.name" :editable="editable"></el-input>
                </el-form-item>
                <el-form-item _id="7b03dko0n77" label="使用范围" v-if="formItemVIfscope" prop="scope"
                              :required="true">
                    <el-radio-group _id="a9jo4wi35bl" v-model="hi_tag.scope" :editable="editable">
                        <el-radio v-for="item in scopevar
                        " :label="item.value" :disabled="item.disabled"
                        _id="frjxin0zcxu">{{item.label}}</el-radio></el-radio-group>
                </el-form-item>
                <el-form-item _id="w9x3mtjfzai" label="已授权" v-if="formItemVIfpowerstr" prop="powerstr">
                    <el-input _id="snogz1xbm6" v-model="hi_tag.powerstr" :editable="editable" icon="menu"
                               :readonly="true"></el-input>
                </el-form-item>
                <el-form-item _id="wgkkdqlzsub" label="启用状态" v-if="formItemVIfenablestate" prop="enablestate">
                    <el-switch _id="vrdraxhgod" v-model="hi_tag.enablestate" :editable="editable"
                               on-color="#4BD762" off-color="#AFAFAF" on-text="是" off-text="否"></el-switch>
                </el-form-item>
                <el-form-item _id="ui1ybf5n3zn" label="是否发送到移动端" v-if="formItemVIfmobileflag" prop="mobileflag">
                    <el-switch _id="g755hk10b2m" v-model="hi_tag.mobileflag" :editable="editable"
                               on-color="#4BD762" off-color="#AFAFAF" on-text="是" off-text="否"></el-switch>
                </el-form-item>
                <el-form-item _id="shge0bzxe7c" label="本人是否可见" v-if="formItemVIfselfshow" prop="selfshow">
                    <el-switch _id="aywr8atvdqg" v-model="hi_tag.selfshow" :editable="editable"
                               on-color="#4BD762" off-color="#AFAFAF" on-text="是" off-text="否"></el-switch>
                </el-form-item>
                <el-form-item _id="8tqzipanvar" label="备注" v-if="formItemVIfremark" prop="remark">
                    <el-input _id="m1kjivcwnwq" v-model="hi_tag.remark" :editable="editable"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>`,
        data() {
            return {
                "formItemVIfremark": true,
                "headData": {},
                "editFormulas": {"id": [{"originalFormula": "defitem1defitem1defitem1"}]},
                "tableCoulmnVIfname": true,
                "formItemVIfpowerstr": true,
                "mobileflagvar": [{}],
                "scopevar": [{"value": 0, "label": "本级"}, {"value": 1, "label": "本级及下级"}, {
                    "value": 2,
                    "label": "授权使用"
                }],
                "hi_tag_t": [],
                "tableCoulmnVIfenablestate": true,
                "formItemVIfselfshow": true,
                "headDataMeta": {},
                "formItemVIfscope": true,
                "rules": {
                    "remark": [{"message": "输入长度不能大于200", "trigger": "blur", "max": 200}],
                    "name": [{"message": "输入长度不能大于200", "trigger": "blur", "max": 200}],
                    "powerstr": [{"message": "输入长度不能大于200", "trigger": "blur", "max": 200}]
                },
                "editable": true,
                "formItemVIfname": true,
                "hi_tag": {},
                "enablestatevar": [{}],
                "tableCoulmnVIfscope": true,
                "tableCoulmnVIfremark": true,
                "formItemVIfenablestate": true,
                "selfshowvar": [{}],
                "formItemVIfmobileflag": true
            }
        }
    }
</script>

<style scoped>

</style>