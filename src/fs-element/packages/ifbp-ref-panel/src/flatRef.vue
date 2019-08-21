<template>
  <div class="flat-ref">
    <div v-if="Array.isArray(strFieldName) && strFieldName.length"
      class="flat-ref-groups">
      <span
        v-if="showFrePanel"
        :class="{
          current: currentFlatGroupIndex === 'fre'
        }"
        @click="flatRefGroupChange('fre')">常用</span>
      <span v-for="(groupName, groupNameIndex) in strFieldName"
        :class="{
          current: currentFlatGroupIndex === groupNameIndex
        }"
        :key="groupNameIndex"
        @click="flatRefGroupChange(groupNameIndex)">{{ groupName }}</span>
    </div>
    <div class="flat-ref-options"
      :style="{
        height: contentHeight - 8 + 'px'
      }">
      <!-- 常用 -->
      <div v-if="currentFlatGroupIndex === 'fre'">
        <div
          v-if="!Array.isArray(frequentlyUsedRef) || !frequentlyUsedRef.length"
          style="padding: 16px;">
          {{ freErrMsg || '未获取到常用数据' }}
        </div>
        <el-row v-else>
          <el-col :span="23" :offset="1">
            <el-row>
              <el-col :span="4"
                v-for="(option, optionIndex) in frequentlyUsedRef"
                :key="optionIndex"
                :title="option.code ? option.code + ' ' + option.name : option.name"
                class="flat-ref-option"
                :class="{
                  current: selectedFlatRefIds.indexOf(option.id) !== -1
                }"
                @click.native="flatRefClicked(option)"
                @dblclick.native="nodeDblClick(option)">{{ option.name }}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!-- 带标签 -->
      <template v-else-if="Object.prototype.toString.call(flatData) === '[object Object]'">
        <el-row v-for="(flatOptions, flatLabel) in flatData"
          :key="flatLabel">
          <el-col class="flat-ref-label" :span="1">{{ flatLabel }}</el-col>
          <el-col :span="23">
            <el-row>
              <el-col :span="4"
                v-for="(option, optionIndex) in flatOptions"
                :key="optionIndex"
                :title="option.refcode ? option.refcode + ' ' + option.refname : option.refname"
                class="flat-ref-option"
                :class="{
                  current: selectedFlatRefIds.indexOf(option.id) !== -1
                }"
                @click.native="flatRefClicked(option)"
                @dblclick.native="nodeDblClick(option)">{{ option.name || option.refname }}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
      <!-- 不带标签 -->
      <template v-else-if="Array.isArray(flatData) && flatData.length">
        <el-row>
          <el-col :span="23" :offset="1">
            <el-row>
              <el-col :span="4"
                v-for="(option, optionIndex) in flatData"
                :key="optionIndex"
                :title="option.refcode ? option.refcode + ' ' + option.refname : option.refname"
                class="flat-ref-option"
                :class="{
                  current: selectedFlatRefIds.indexOf(option.id) !== -1
                }"
                @click.native="flatRefClicked(option)"
                @dblclick.native="nodeDblClick(option)">{{ option.name || option.refname }}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
      <div v-else style="padding: 12px 12px 100px;">
        <!-- 暂无数据…… -->
      </div>
    </div>
  </div>
</template>

<script>
  import Utils from './utils.js';
  export default {
    name: 'IfbpFlatRef',
    props: {
      templateValue: Object,
      refCode: String,
      refInfo: Object,
      selected: Array,
      showFrePanel: Boolean,
      queryParams: Object,
      contentHeight: Number,
    },
    data() {
      return {
        currentFlatGroupIndex: 'fre',
        flatData: null,
        strFieldName: [],
        strFieldCode: [],
        frequentlyUsedRef: [],
        freErrMsg: '',
      };
    },
    computed: {
      // flat ref ids selected
      selectedFlatRefIds() {
        let arr = [];
        this.selected.map(ref => {
          if (ref.id) {
            arr.push(ref.id);
          }
        });
        return arr;
      },
    },
    methods: {

      // group change
      flatRefGroupChange(index) {
        if (this.currentFlatGroupIndex === index) {
          return;
        }
        // use cached frequently used data when changing to 'fre' tab
        if (index === 'fre') {
          this.currentFlatGroupIndex = index;
          return;
        }
        // otherwise request data of flat ref
        this.getFlatRef(index);
      },

      // request data of flat ref
      getFlatRef(index) {
        if (
          !this.refInfo ||
          !Array.isArray(this.refInfo.strFieldCode) ||
          index > this.refInfo.strFieldCode.length - 1
        ) {
          return;
        }
        this.$http({
          url: '/uitemplate_web/iref_ctr/getFlatRefData',
          method: 'post',
          data: {
            refModelUrl: this.refInfo.refModelUrl,
            content: this.refInfo.strFieldCode[index],
            isUseDataPower: this.refInfo.isUseDataPower,
            dataPowerOperation_Code: this.refInfo.dataPowerOperation_Code
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (!res || !res.data || !res.data.data) {
            return;
          }
          var refData = res.data.data;
          this.flatData = refData;
          this.currentFlatGroupIndex = index;
        });
      },

      getFrequentlyUsedRefs() {
        Utils.getFrequentlyUsedRefs(this).then(resData => {
          if (resData && Array.isArray(resData.frequentlyUsedRef)) {
            this.frequentlyUsedRef = resData.frequentlyUsedRef;
          }
        }).catch(errMsg => {
          this.freErrMsg = errMsg;
          console.log(errMsg);
        });
      },

      initRefInfoRelated() {
        this.strFieldName = this.refInfo.strFieldName;
        this.strFieldCode = this.refInfo.strFieldCode;
      },

      flatRefClicked(ref) {
        this.$emit('select', [ref]);
      },

      nodeDblClick(ref) {
        this.$emit('nodeDblClick', ref);
      },
    },
    created() {
      this.initRefInfoRelated();
      if (this.showFrePanel) {
        this.getFrequentlyUsedRefs();
      } else {
        this.getFlatRef(0);
      }
    },
  };
</script>
<style scoped>
  .flat-ref {
    box-sizing: border-box;
    padding: 8px 16px;
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
  .flat-ref-options {
    overflow: auto;
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
  .tree-node-childnode:selection,
  .tree-breadcrumbs span::selection {
    color: inherit;
  }
  .flat-ref-label,
  .flat-ref-option:hover,
  .flat-ref-option.current {
    color: #5AC8FA;
  }
</style>