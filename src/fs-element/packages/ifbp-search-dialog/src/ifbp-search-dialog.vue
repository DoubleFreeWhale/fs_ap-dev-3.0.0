<template>
    <div class="search-dialog-container" :class="customerClass">
        <!-- 一直显示的搜索框,展示弹出框的切换按钮-->
        <!-- search-input-wrap  begin -->
		<div class="search-input-wrap">
            <!-- 有模糊搜索关键字 -->
            <el-input  
                v-if="currentTpl && currentTpl.keyword.fields.length" 
                :placeholder="searchPlaceholder" 
                v-model="currentTpl.keyword.value" 
                icon="search" 
                ref="searchInput"
                @keyup.enter.native="search" 
                :on-icon-click="search"
                >
            </el-input>
            <!-- 无模糊搜索关键字 -->
            <el-input 
                v-else 
                placeholder="未配置模糊搜索"
                :disabled="true">
            </el-input>
            <span class="btn-more"  
                @click="dialogVisible=true">
                <i class="ifbp-icon-filter"></i>
            </span>
		</div>
        <!-- search-input-wrap  end -->
        <!-- search-dialog-wrap begin-->
        <div class="search-dialog-wrap">
            <el-dialog
                :title="dialogTitle"
                :visible="dialogVisible"
                @update:visible="val => dialogVisible = val"
                size="small"
                :width="currentDialogWidth"
                class="search-dialog"
                :class="dialogClass"
                >
                <el-form v-for="(condition, index) in conditionList" :key="index">
                    <el-form-item :label="condition.fieldname" :label-width="currentLabelWidth">
                        <!-- 日期类型 -->
                        <template v-if="condition.ctrltype === 'DateTime'">
                            <div class="search-dialog-item-half">
                                <el-date-picker
                                    v-model="condition.optionList.def_min_value"
                                    :type="condition.dateformat || 'datetime'"
                                    size="small"
                                    :format="condition.dateformat === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                                    :placeholder="condition.dateformat === 'date' ? '请选择日期' : '请选择日期时间'"
                                    @change="handleDateChange(condition.optionList, 'def_min_value', $event, condition)"
                                    >
                                </el-date-picker>
                            </div>
                            <div class="search-dialog-separate"> - </div>
                            <div class="search-dialog-item-half fr">
                                <el-date-picker
                                    v-model="condition.optionList.def_max_value"
                                    :type="condition.dateformat || 'datetime'"
                                    size="small"
                                    :format="condition.dateformat === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                                    :placeholder="condition.dateformat === 'date' ? '请选择日期' : '请选择日期时间'">
                                </el-date-picker>
                            </div>
                        </template>
                        <!-- 数字类型 -->
                        <template v-else-if="condition.ctrltype === 'NumberComponent'">
                            <div class="search-dialog-item-half">
                                <el-input
                                    v-model="condition.optionList.def_min_value"
                                    size="small"
                                    placeholder="请选择最小值">
                                </el-input>
                            </div>
                            <div class="search-dialog-separate"> - </div>
                            <div class="search-dialog-item-half fr">
                                <el-input
                                    v-model="condition.optionList.def_max_value"
                                    size="small"
                                    placeholder="请选择最大值">
                                </el-input>
                            </div>
                        </template>
                        <!-- 参照类型 -->
                        <template v-else-if="condition.ctrltype === 'Reference' && condition.refcode">
                            <el-ref
                                :placeholder="placehoderStr+condition.fieldname"
                                field="value"
                                :is-muti-select="true"
                                :ref-code="condition.refcode"
                                :template-value="condition.optionList"
                                :is-edit="true"
                                :query-params="condition.filtercondition">
                            </el-ref>
                        </template>
                        <!-- 普通类型 -->
                        <template v-else-if="condition.optionList.options.length">
                            <el-select 
                                v-model="condition.optionList.value" 
                                :placeholder="placehoderStr+condition.fieldname"  
                                @change="handleSelectedOption(condition.optionList, $event, condition)">
                                <el-option
                                    v-for="(option,optionIndex) in condition.optionList.options"  
                                    :key="optionIndex" 
                                    :value="option.value"
                                    :label="option.name">
                                </el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeSearchForm">取 消</el-button>
                    <el-button @click="clearSearchForm">清 空</el-button>
                    <el-button type="primary" @click="handleSearch">搜 索</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- search-dialog-wrap end-->
    </div>
</template>
<script>
export default {
  name: 'IfbpSearchDialog',
  props:{
      // 搜索模板对象
      searchTemplate:{
        type: Object
      },
      //模板 code 值
      templateCode: {
        type: String
      },
      //弹出框中 label宽度
      formLabelWidth: {
          type:Number,
          default:96
      },
      //对话框宽度
      dialogWidth: {
          type:Number,
          default:608
      },
      //弹出框标题;
      dialogTitle:{
          type:String,
          default:"高级搜索框"
      },
      //自定义Class;
      customerClass:{
          type:Array,
      },
      //给Dialog传的自定义Class;
      dialogClass:{
          type:Array,
      }
  },
  methods:{
    // 根据 查询模板的code值获取查询模板;
    requestSearchTpl() {
      var requestUrl = '/ifbp-app-sm-qt-web/quyerTemplate/getByCode';
      this.$http({
        url: requestUrl,
        method: 'post',
        data: this.templateCode,
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (!res.data) {
            console.log('查询模板获取失败: ', JSON.stringify(res));
            return;
          }
          if (res.data.success) {
            this.currentTpl = res.data.data;
            this.initSearchTpl();
          } else if (res.data.error) {
            console.log('查询模板获取失败: ', JSON.stringify(res.data.error));
          }
        })
        .catch(() => {
          console.log('未获取到查询模板');
        });
    },
    // 根据 查询到的或者是prop传入的模板对象,初始化 searchTemplate;
    initSearchTpl() {
      this.searchPlaceholder = this.formatPlaceholder(this.currentTpl.keyword.fields);
      var conditionList = this.currentTpl.conditionList;
      for (let i = 0; i < conditionList.length; i++) {
        var condition = conditionList[i];
        // parse queryParams for ref
        if (condition.ctrltype === 'Reference' && condition.filtercondition) {
          try {
            condition.filtercondition = JSON.parse(condition.filtercondition);
          } catch (error) {
            console.log(condition.fieldname, '条件中filtercondition字段非合法JSON字符串');
            condition.filtercondition = null;
          }
        }
        if (!condition.default_option) {
          condition.default_option = false;
        }
        if (!condition.optionList) {
          this.$set(condition, 'optionList', {
            def_min_value: null,
            def_max_value: null,
            value: null,
            options: []
          });
          continue;
        }
        var optionList = condition.optionList;
        if (typeof optionList.def_min_value === 'undefined') {
          this.$set(optionList, 'def_min_value', null);
        }
        if (typeof optionList.def_max_value === 'undefined') {
          this.$set(optionList, 'def_max_value', null);
        }
        if (typeof optionList.value === 'undefined') {
          this.$set(optionList, 'value', null);
        }
        if (typeof optionList.options === 'undefined') {
          this.$set(optionList, 'options', []);
        }
        var options = optionList.options;
      }

      this.conditionList = conditionList;

      this.$emit('ready', this.currentTpl);
    },
    // 搜索框 placeholder
    formatPlaceholder(fields) {
      var keywords = [];
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var keyword = field.fieldname;
        if (keyword && field.iskeyword) {
          keywords.push(keyword);
        }
      }
      return '搜索' + keywords.join('/');
    },
    // 下拉选 select chang事件
    handleSelectedOption(optionList,$event,condition){
        var options=optionList["options"];
        var selectOptVal=$event;
        for(var i=0;i<options.length;i++){
            var tmpOps=options[i];
            tmpOps.selected=false;
            if(selectOptVal==tmpOps["value"]){
                tmpOps.selected=true;
            }
        }
    },
    //触发搜索
    search() {
      // debugger;
      const copyOfTpl = this.currentTpl;
      this.$emit('search', copyOfTpl);
    },

    // 触发date组件change事件时, 使用格式化后的值
    handleDateChange(optionList, key, formatedValue, condition) {
      if (condition && condition.dateformat) {
          var dateformat=condition.dateformat;
          var formatedDate= this.handleFormateDate(formatedValue,dateformat);
          optionList[key] = formatedDate;
      }
    },
    handleFormateDate(tempDate,dateformat){
      const date = new Date(tempDate);
      if (date === 'Invalid Date') {
        return null;
      }
      const ymd = date.getFullYear() + '-' + ((date.getMonth()) >= 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() > 9 ? date.getDate() : ('0' + date.getDate()));
      const hms = (date.getHours() > 9 ? date.getHours() : ('0' + date.getHours())) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes())) + ':' + (date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds()));
      if (dateformat === 'date') {
        return ymd;
      } else if (dateformat === 'datetime') {
        return ymd + ' ' + hms;
      } 
    },
    // 点击 清空按钮
    clearSearchForm() {
      var conditions = this.conditionList;
      for (var i = 0; i < conditions.length; i++){
          var condition=conditions[i];
          if("NumberComponent"===condition.ctrltype || "DateTime" === condition.ctrltype){
              condition.optionList.def_max_value="";
              condition.optionList.def_min_value="";
          }else{
              // 参照类型清空;
              var beanMap=condition.optionList.beanMap;
              if("Reference" === condition.ctrltype && beanMap){
                  condition.optionList.beanMap=null;
              }
              // 下拉选 组件清空处理；
              condition.optionList.value="";
                var options=condition.optionList.options;
                if(condition && options){
                    for(var j=0;j<options.length;j++){
                        var tempOption=options[j];
                        if(tempOption["selected"]){
                            tempOption["selected"]=false;
                        }
                    }
                }
          }
      }
      this.currentTpl.conditionList=conditions;
      this.search();
    },
    // 点击 关闭按钮
     closeSearchForm(){
        this.dialogVisible = false;
    },
    // 点击 查询按钮
    handleSearch(){
        this.dialogVisible = false;
        this.search();
    }
  },
  data:function(){
      return{
        searchPlaceholder: '',
        // 临时的查询模板对象;
        currentTpl: null,
        // 搜索项 条件列表
        conditionList: [],
        selectedOps:null,
        dialogVisible:false,
        placehoderStr:"请选择",
      }
  },
  watch:{

  },
  computed:{
      currentLabelWidth:function(){
          return this.formLabelWidth+"px"
      },
      currentDialogWidth:function(){
          return this.dialogWidth + "px"
      }
  },
  created(){
    //   debugger;
      if (this.templateCode){
        this.requestSearchTpl();
      } else if (this.searchTemplate) {
        this.currentTpl = this.searchTemplate;
        this.initSearchTpl();
      } else {
        console.log('创建查询模板失败, 未传入 searchTemplate 或 templateCode 参数');
      }
  }
}
</script>
<style></style>


