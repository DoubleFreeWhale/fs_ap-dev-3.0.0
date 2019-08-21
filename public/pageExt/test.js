pageExtDefine(function () {
  var func1 = function () {
    alert('call func1');
  }
  return {
    beforeCreated: function (page) {
      debugger;
      var myMixin = {
        created() {
          alert("项目扩展的输出");
        },
        methods: {
          myClick: function () {
            alert("触发二开按钮点击事件");
          }
        }
      };
      page.mixins = page.mixins || [];
      page.mixins.push(myMixin);

      var $dom = $(page.template);
      $dom.find('ifbp-button-area').append('<el-button @click="myClick">二开按钮</el-button>');
      page.template = $dom[0].outerHTML;
    },
    dispatch: function (methodName, type, args) {
      debugger;
      func1();
    }

  }
})
