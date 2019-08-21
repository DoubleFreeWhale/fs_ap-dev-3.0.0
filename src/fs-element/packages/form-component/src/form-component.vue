<template>
    <!-- 一列显示form -->
    <el-form class="formBox"
             v-if="!(formStyle && formStyle.simpleColumn === false)"
             :style="formStyle !== undefined ? formStyle.styleObject : {}"
             :model="form"
             ref="form">
        <!-- 按 settingData 循环显示行 -->
        <el-form-item class="formItem form-item__label" v-for="(item, index) in settingData" :key="'key'+index" :label="item.label">
            <!-- 左边列开始 -->
            <el-col :span="4" style="position:absolute;left:-8px; width:130px;">
                <span style="color:red;" v-if="item.required">*</span>
            </el-col>
            <el-col :span="8" style="margin-left: 10px; width:300px;">
                <el-input class="formItem__content" v-model="formData[index].value" :placeholder="item.placeholder" :type="item.type ? item.type : 'text'" v-if="item.el==='input'">
                    <template slot="prepend" v-if="item.prepend">
                        <span class="formItem__prepend">{{item.prepend}}</span>
                    </template>
                </el-input>
                <el-select v-model="formData[index].value" :placeholder="item.placeholder" style="width: 100%" v-else>
                    <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value" :disabled="option.disabled">
                    </el-option>
                </el-select>
            </el-col>
        </el-form-item>
        <!-- 底部操作按钮 -->
        <el-row v-if="formStyle && formStyle.showButtons">
            <el-col :span="8" style="margin-left:140px; width:300px;">
                <el-button size="large" @click="onSubmit" type="success">确定保存</el-button>
                <el-button size="large" @click="onCancel" type="success" :plain="true">取消</el-button>
            </el-col>
        </el-row>
    </el-form>

    <!-- 两列显示form -->
    <!--<form class="formBox" v-else>-->
        <!--&lt;!&ndash; 按 settingData 循环显示行 &ndash;&gt;-->
        <!--<el-row class="formItem" v-for="index in rowCount">-->
            <!--&lt;!&ndash; 第一列开始 &ndash;&gt;-->
            <!--<el-col :span="4" style="text-align:right; width:130px; margin-left:40px;">-->
                <!--<label class="formItem__label font_default">-->
                    <!--<span style="color:red;" v-if="settingData[index*2-2].required">*</span>-->
                    <!--{{settingData[index*2-2].label}}-->
                <!--</label>-->
            <!--</el-col>-->
            <!--<el-col :span="8" style="margin-left: 10px; width:300px;">-->
                <!--<el-input class="formItem__content" v-model="formData[index*2-2].value" :placeholder="settingData[index*2-2].placeholder" :type="settingData[index*2-2].type ? settingData[index*2-2].type : 'text'" v-if="settingData[index*2-2].el==='input'">-->
                    <!--<template slot="prepend" v-if="settingData[index*2-2].prepend">-->
                        <!--<span class="formItem__prepend">{{settingData[index*2-2].prepend}}</span>-->
                    <!--</template>-->
                <!--</el-input>-->
                <!--<el-select v-model="formData[index*2-2].value" :placeholder="settingData[index*2-2].placeholder" style="width: 100%" v-else>-->
                    <!--<el-option v-for="option in settingData[index*2-2].options" :label="option.label" :value="option.value" :disabled="option.disabled">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            <!--</el-col>-->
            <!--&lt;!&ndash; 第一列结束 &ndash;&gt;-->
            <!--&lt;!&ndash; 第二列开始 &ndash;&gt;-->
            <!--<el-col :span="4" style="text-align:right; width:130px; margin-left:40px;" v-if="settingData[index*2-1] !== undefined">-->
                <!--<label class="formItem__label font_default">-->
                    <!--<span style="color:red;" v-if="settingData[index*2-1].required">*</span>-->
                    <!--{{settingData[index*2-1].label}}-->
                <!--</label>-->
            <!--</el-col>-->
            <!--<el-col :span="8" style="margin-left: 10px; width:300px;" v-if="settingData[index*2-1] !== undefined">-->
                <!--<el-input class="formItem__content" v-model="formData[index*2-1].value" :placeholder="settingData[index*2-1].placeholder" :type="settingData[index*2-1].type ? settingData[index*2-1].type : 'text'" v-if="settingData[index*2-1].el==='input'">-->
                    <!--<template slot="prepend" v-if="settingData[index*2-1].prepend">-->
                        <!--<span class="formItem__prepend">{{settingData[index*2-1].prepend}}</span>-->
                    <!--</template>-->
                <!--</el-input>-->
                <!--<el-select v-model="formData[index*2-1].value" :placeholder="settingData[index*2-1].placeholder" style="width: 100%" v-else>-->
                    <!--<el-option v-for="option in settingData[index*2-1].options" :label="option.label" :value="option.value" :disabled="option.disabled">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            <!--</el-col>-->
            <!--&lt;!&ndash; 第二列结束 &ndash;&gt;-->
        <!--</el-row>-->
        <!--&lt;!&ndash; 底部操作按钮 &ndash;&gt;-->
        <!--<el-row v-if="formStyle && formStyle.showButtons">-->
            <!--<el-col style="text-align:center">-->
                <!--<el-button size="large" @click="onSubmit" type="success">确定保存</el-button>-->
                <!--<el-button size="large" @click="onCancel" type="success" :plain="true">取消</el-button>-->
            <!--</el-col>-->
        <!--</el-row>-->
    <!--</form>-->
</template>
<script>
  export default {
    name: 'ElFormComponent',
    props: ['form'],
    data() {
      return {};
    },
    methods: {
      onSubmit() {
        const data = {};
        this.formData.forEach((item) => {
          data[item.key] = item.value;
        });
        this.$emit('onsubmit', data);
      },
      onCancel() {
        this.$emit('oncancel');
      }
    },
    created() {
      if (this.form.settingData.length !== this.form.formData.length) {
        throw new Error('请确保settingData和formData均为数组且长度一致！');
      }
      console.log(this.settingData);
    },
    computed: {
      formData() {
        return this.form.formData;
      },
      settingData() {
        return this.form.settingData;
      },
      formStyle() {
        return this.form.formStyle;
      },
      // 按两列显示的行数
      rowCount() {
        console.log(Math.ceil(this.settingData.length / 2));
        return Math.ceil(this.settingData.length / 2);
      }
    }
  };
</script>


