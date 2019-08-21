<template>
    <el-dialog :title="editRowIndex > -1 ? '编辑修改' : '新增创建'" v-model="s_editFormVisible" size="tiny">
        <el-form ref="formData" :model="formData" label-width="100px">
            <el-form-item label="工号">
                <el-input v-model="formData.uId" :disabled="editRowIndex > -1"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="formData.name" :disabled="editRowIndex > -1"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="formData.sex" placeholder="请选择">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上班打卡时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formData.startTime" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="formData.startTime" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="下班打卡时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formData.endTime" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="formData.endTime" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">完成</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
  export default {
    name: 'ElEditForm',
    data() {
      return {
        s_editFormVisible: false
      };
    },
    props: ['formData', 'editFormVisible', 'editRowIndex'],
    methods: {
      onSubmit() {
        this.s_editFormVisible = false;
        this.$emit('onSubmit', this.formData);
      },
      onCancel() {
        this.s_editFormVisible = false;
      },
      date2str(date) {
        if (!(date instanceof Date)) return date;
        function Num(num) {
          if (Number(num) < 10) {
            return '0' + num;
          }
          return num ;
        }
        const z = {
          y: date.getFullYear(),
          M: Num(date.getMonth() + 1),
          d: Num(date.getDate()),
          h: Num(date.getHours()),
          m: Num(date.getMinutes()),
          s: Num(date.getSeconds())
        };
        return z.y + '-' + z.M + '-' + z.d + ' ' + z.h + ':' + z.m + ':' + z.s;
      }
    },
    computed: {
      form: function() {
        console.log('computed', this.formData);
        const a = this.formData;
        return {
          name: a.name,
          uId: a.uId,
          sex: a.sex,
          startTime: a.startTime,
          endTime: a.endTime
        };
      }
    },
    watch: {
      editFormVisible: function(value) {
        this.s_editFormVisible = value;
      },
      s_editFormVisible: function(value) {
        this.$emit('changeVisible', value);
      },
      formData: {
        handler: function() {
          this.formData.startTime = this.date2str(this.formData.startTime);
          this.formData.endTime = this.date2str(this.formData.endTime);
        },
        deep: true
      }
    },
    created: function() {

    }
  };
</script>

