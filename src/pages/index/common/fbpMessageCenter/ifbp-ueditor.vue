<template>
    <div>
      <!-- 富文本编辑器 -->
      <div id="editor-content" type="text/plain" ref="ueContent"></div>
    </div>
</template>
<script>
  import "@/Ueditor/ueditor.config.js";
  import "@/Ueditor/ueditor.all.js";
  import "@/Ueditor/lang/zh-cn/zh-cn.js";
  export default {
    name: 'ifbpUeditor',
    props: {
      //富文本编辑器展示内容
      ueditorData:{
        type:String,
        default:''
      },
      isReadonly:{
        type:Boolean,
        default:false
      }
    },
    data() {
      let vm = this;
      return {
        //富文本编辑器相关
        UeditorContent: null,
        wkParamContent:{},
        toolIcons:[
          'anchor', //锚点
          'undo', //撤销
          'redo', //重做
          'bold', //加粗
          'indent', //首行缩进
          //'snapscreen', //截图
          'italic', //斜体
          'underline', //下划线
          'strikethrough', //删除线
          'subscript', //下标
          'fontborder', //字符边框
          'superscript', //上标
          'formatmatch', //格式刷
          'source', //源代码
          'blockquote', //引用
          'pasteplain', //纯文本粘贴模式
          'selectall', //全选
          //'print', //打印
          //'preview', //预览
          'horizontal', //分隔线
          'removeformat', //清除格式
          'time', //时间
          'date', //日期
          'unlink', //取消链接
          'insertrow', //前插入行
          'insertcol', //前插入列
          'mergeright', //右合并单元格
          'mergedown', //下合并单元格
          'deleterow', //删除行
          'deletecol', //删除列
          'splittorows', //拆分成行
          'splittocols', //拆分成列
          'splittocells', //完全拆分单元格
          'deletecaption', //删除表格标题
          'inserttitle', //插入标题
          'mergecells', //合并多个单元格
          'deletetable', //删除表格
          'cleardoc', //清空文档
          'insertparagraphbeforetable', //"表格前插入行"
          'insertcode', //代码语言
          'fontfamily', //字体
          'fontsize', //字号
          'paragraph', //段落格式
          //'simpleupload', //单图上传
          //'insertimage', //多图上传
          'edittable', //表格属性
          'edittd', //单元格属性
          'link', //超链接
          'emotion', //表情
          'spechars', //特殊字符
          'searchreplace', //查询替换
          //'map', //Baidu地图
          //'gmap', //Google地图
          //'insertvideo', //视频
          'help', //帮助
          'justifyleft', //居左对齐
          'justifyright', //居右对齐
          'justifycenter', //居中对齐
          'justifyjustify', //两端对齐
          'forecolor', //字体颜色
          'backcolor', //背景色
          'insertorderedlist', //有序列表
          'insertunorderedlist', //无序列表
          //'fullscreen', //全屏
          'directionalityltr', //从左向右输入
          'directionalityrtl', //从右向左输入
          'rowspacingtop', //段前距
          'rowspacingbottom', //段后距
          'pagebreak', //分页
          'insertframe', //插入Iframe
          //'imagenone', //默认
          //'imageleft', //左浮动
          //'imageright', //右浮动
          //'attachment', //附件
          //'imagecenter', //居中
          //'wordimage', //图片转存
          'lineheight', //行间距
          'edittip ', //编辑提示
          'customstyle', //自定义标题
          'autotypeset', //自动排版
          //'webapp', //百度应用
          'touppercase', //字母大写
          'tolowercase', //字母小写
          'background', //背景
          //'template', //模板
          //'scrawl', //涂鸦
          //'music', //音乐
          'inserttable', //插入表格
          //'drafts', // 从草稿箱加载
          //'charts', // 图表
        ]
      };
    },
    mounted() {
      // 修改页面默认不可编辑
      this.setUeditor();
    },
    watch:{
      isReadonly(val,oldval){
        if(this.isReadonly){
          $('#editor-content .edui-editor-toolbarbox,#editor-content .edui-editor-bottomContainer').html('');
          this.UeditorContent.setDisabled();
        }
      }
    },
    methods: {
      //富文本编辑器
      setUeditor(){
        // 修改页面默认不可编辑
        const self = this;
        this.getWkParam();
        this.UeditorContent = UE.getEditor('editor-content', {
          toolbars:self.isReadonly?null:[this.toolIcons],
          elementPathEnabled: false,//页脚路径
          initialFrameHeight: 200,
          autoHeightEnabled: true,
          autoFloatEnabled: true,
          wordCount: self.isReadonly?false:true
        });
        Promise.all([self.wkParamContent]).then(() => {
          if(self.wkParamContent){
              let content = false;
              let ready = setInterval(function (){
                  if(self.UeditorContent.setContent){
                  if(self.wkParamContent.templateContent){
                      self.UeditorContent.setContent(self.wkParamContent.templateContent);
                      if(self.isReadonly){
                        self.UeditorContent.setDisabled();
                      }
                  } else{
                      self.UeditorContent.setContent("");
                  }
                  self.UeditorContent.addListener("click", self.selectVariableByClick);
                  self.UeditorContent.addListener("keyup", self.selectVariable);
                  content = true;
                  }
                  if(content){
                  clearInterval(ready);
                  return;
                  }
              },300);
            }
        });   
      },
      // 鼠标移到变量上的时候选中整个变量
      selectVariable() {
        var pattern = /\[(.)*\]/;
        var range = this.UeditorContent.selection.getRange();
        var str = range.startContainer.data;
        if (pattern.test(str)) {
          range = range.selectNode(range.startContainer);
          range.adjustmentBoundary();
          range.select();
        }
      },
      // 单击变量的时候选中整个变量
      selectVariableByClick() {
        var pattern = /\[(.)*\]/;
        var range = this.UeditorContent.selection.getRange();
        var str = range.startContainer.data;
        if (pattern.test(str)) {
          range = range.selectNode(range.startContainer);
          range.adjustmentBoundary();
          range.select();
        }
      },
      getWkParam(){
        this.wkParamContent = {
          templateContent: this.ueditorData
        };
      },
      getContentHtml(){
        return this.UeditorContent.getContent();
      },
    },
    destroyed() {
      this.UeditorContent.destroy();
      this.UeditorContent.removeListener("click", this.selectVariableByClick);
      this.UeditorContent.removeListener("keyup", this.selectVariable);
    }
  };
</script>
<style>
  #editor-content .edui-editor{
    max-width: 99.7%;
  }
  #editor-content div{
    line-height: 20px;
  }
</style>

