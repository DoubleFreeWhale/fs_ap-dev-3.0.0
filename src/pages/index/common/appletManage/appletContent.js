export default {
  data() {
    return {
      // contentIconsEdit: true,
      appletContentStyle: false,
      isShowFontIcon: false,
      isShowImgIcon: false,
      isShowApi: false,
      isShowCharts: false,
      isFooterUrl: false,
      isFooterContent: false,
      isShowEditFontIcon: false,
      isShowEditImgIcon: false,
      isShowEditApi: false,
      isShowEditCharts: false,
      appContentExpandFormDataOrg: {},
      appContentFooterData: {
        footer:'',
        footerUrl: '',
        footerType: ''
      },
      appContentIndex:0,
      appContentRules: {
        chartType:[{required: true, message: '请选择磁贴图表类型', trigger: 'change' }],
        chartUrl:[{required: true, message: '请输入磁贴图表url', trigger: 'blur' }],
        numberUrl:[{required: true, message: '请输入磁贴数值url', trigger: 'blur' }],
        // numberValue:[{ validator:valiNumberValue, trigger: 'blur' }],
      },
      appContentFormData: {
        tileType: '',
        chartType: '',
        chartUrl: '',
        appIcon: '',
        numberUrl:'',
        numberUnit:'',
        numberColor:'',
        iconContent:'',
        appIconColor: '',
      },
      appContentExpandFormData: {},
      appMagnetRules:[],
      appStyle: [
        {
          name: "字体图标",
          value: "fontIcon"
        },
        {
          name: "图片图标",
          value: "imgIcon"
        },
        {
          name: "图表",
          value: "charts"
        },
        {
          name: "数字",
          value: 'api'
        }
      ],
      chartTypeOptions:[
        // {name:"请选择图表类型", value:""},
        {name:"子弹图", value:"bulletChart"},
        {name:"折线图", value:"lineChart"},
        {name:"柱状图", value:"cloumnChart"},
        {name:"饼图", value:"pieChart"},
        {name:"进度条", value:"appProgress"},
        {name:"带箭头的数值", value:"arrowKpi"},
       //  {name:"自定义", value:"customChart"}
      ],
      appFooterOptions: [
        {name:"页脚地址", value:"url"},
        {name:"页脚内容", value:"content"},
      ]
    };
  },
  computed: {
    //磁贴内容图标
    appletContentIcons() {
      let vm = this;
      let contentIcons = [{
        icon: "plus",
        show: vm.contentIconsEdit,
        click: function() {
          vm.$refs.appletContentTable.closeExpandRow();
          vm.contentIconsEdit = false;
          vm.appletContentStyle = true;
        }
      }];
      return contentIcons;
    }
  },
  methods: {
    selectIcon(val) {

      this.appContentFormData.appIcon = val.class;
      this.appContentFormData.appIconColor = val.color;
    },
    selectEditIcon(val) {
      this.appContentExpandFormData.appIcon = val.class;
      this.appContentExpandFormData.appIconColor = val.color;
    },
    //磁贴内容上移操作
    appContentUp(scope) {
      var index = scope.$index;
      if (index === 0) {
        return;
      }
      var btnToUp = this.appContentData.splice(index, 1)[0];
      this.appContentData.splice(index - 1, 0, btnToUp);
    },
    //磁贴内容下移操作
    appContentDown(scope) {
      var index = scope.$index;
      var btnToDown = this.appContentData.splice(index, 1)[0];
      this.appContentData.splice(index + 1, 0, btnToDown);
    },
    //磁贴内容编辑操作
    appContentEdit(scope) {
      this.appContentExpandFormDataOrg = JSON.parse(JSON.stringify(scope.row));
      this.appContentExpandFormData = JSON.parse(JSON.stringify(scope.row));
      this.setTypeEdit(scope.row.tileType);
      this.$refs.appletContentTable.expandRow(scope.row);
      this.appContentIndex = scope.$index;
      // this.issysUiFormData =scope.row;
    },
    //磁贴内容删除操作
    appContentDelete(scope) {
      this.appContentData.splice(scope.$index,1);
    },
    //磁贴内容取消操作
    appContentCancel() {
      this.contentIconsEdit = true;
      this.appletContentStyle = false;
      this.appContentFormData = {};
      this.isShowFontIcon = false;
      this.isShowImgIcon = false;
      this.isShowApi = false;
      this.isShowCharts = false;
    },
    //磁贴内容新增提交操作
    appContentSubmit() {

      this.$refs.AppMagnetType.validate((valid) => {
        if(valid) {

          this.appContentData.unshift(this.appContentFormData);
          this.appContentFormData = {
            tileType: '',
            chartType: '',
            chartUrl: '',
            appIcon: '',
            numberUrl:'',
            numberUnit:'',
            numberColor:'',
            iconContent:'',
            appIconColor: '',
          };
          this.appletContentStyle = false;
          this.contentIconsEdit = true;
          this.isShowFontIcon = false;
          this.isShowImgIcon = false;
          this.isShowApi = false;
          this.isShowCharts = false;
        }
      });
    },
    //磁贴内容修改的取消操作
    appContentUpdateCancel(scope) {
      this.$refs.appletContentTable.closeExpandRow(scope.row);

    },
    //磁贴内容修改的保存操作
    appContentUpdate(scope) {
      this.$refs.AppMagnetExpandType.validate((valid) => {
        if(valid) {
          this.appContentData[this.appContentIndex] = this.appContentExpandFormData;
          this.$refs.appletContentTable.closeExpandRow(scope.row);
        }
      })
    },
    //磁贴内容为上传图标时取消上传的操作
    // clearUploadFiles() {
    //   this.appContentFormData.iconContent = "";
    // },
    // clearEditUploadFiles() {
    //   this.appContentExpandFormData.iconContent = "";
    // },
    //磁贴内容为上传图标时上传成功的操作
    handleAvatarSuccess(res) {
      this.appContentFormData.iconContent = res.data;
    },
    handleAvatarEditSuccess(res) {
      console.log(res);
      this.appContentExpandFormData.iconContent = res.data;
    },
    setTypeEdit(val) {

      if(val === 'fontIcon') {
        this.isShowEditFontIcon = true;
        this.isShowEditApi = false;
        this.isShowEditCharts = false;
        this.isShowEditImgIcon = false;
      }
      if(val === 'imgIcon') {
        this.isShowEditFontIcon = false;
        this.isShowEditApi = false;
        this.isShowEditCharts = false;
        this.isShowEditImgIcon = true;
      }
      if(val === "charts"){
        this.isShowEditFontIcon = false;
        this.isShowEditApi = false;
        this.isShowEditCharts = true;
        this.isShowEditImgIcon = false;
      }
      if(val === "api") {
        this.isShowEditFontIcon = false;
        this.isShowEditApi = true;
        this.isShowEditCharts = false;
        this.isShowEditImgIcon = false;
      }
      if(val === "") {
        this.isShowEditFontIcon = false;
        this.isShowEditApi = false;
        this.isShowEditCharts = false;
        this.isShowEditImgIcon = false;
      }
    },
    setType(val) {
      if(val === 'fontIcon') {
        this.isShowFontIcon = true;
        this.isShowApi = false;
        this.isShowCharts = false;
        this.isShowImgIcon = false;
      }
      if(val === 'imgIcon') {
        this.isShowFontIcon = false;
        this.isShowApi = false;
        this.isShowCharts = false;
        this.isShowImgIcon = true;
      }
      if(val === "charts"){
        this.isShowCharts = true;
        this.isShowApi = false;
        this.isShowFontIcon = false;
        this.isShowImgIcon = false;
      }
      if(val === "api") {
        this.isShowApi = true;
        this.isShowCharts = false;
        this.isShowFontIcon = false;
        this.isShowImgIcon = false;
      }
      if(val === "") {
        this.isShowFontIcon = false;
        this.isShowImgIcon = false;
        this.isShowApi = false;
        this.isShowCharts = false;
      }
    },
    //磁贴内容类型处理
    magnetTypeChange(val) {
      this.setType(val);
    },
    magnetTypeEditChange(val) {
      this.setTypeEdit(val);
    },
    //页脚处理
    appletFooterChange(val) {
      this.getFooterType(val);
    }

  },
  mounted() {

    // this.appContentData = contentJSon.data.contents;
  }
}
