

import compUtil from '../js/editor/compUtil'
function Map() {

  this.keys = new Array();
  this.data = new Object();

  this.set = function(key, value) {
    if (this.data[key] == null) {
      if (this.keys.indexOf(key) == -1) {
        this.keys.push(key);
      }
    }
    this.data[key] = value;
  }

  this.get = function(key) {
    return this.data[key];
  }
}
var par = new Map();
export default {
  mounted: function() {
    this.dType = 'ovpdesigner';
    if ($.getUrlParam('flag') == 'workbench') {
      this.logoText = '个人工作台设计器';
      this.showDeleteBtn = true;
    } else if ($.getUrlParam('roleid')) {
      this.logoText = '角色工作台设计器'
    } else {
      this.logoText = 'ovp设计器'
    }
    this.leftPanelShow = 'element';
    this.widgetCate = {};
  },
  methods: {
    getPlatform: function() {
      var sRE = "(?:; )?platform=([^;]*);?";
      var oRE = new RegExp(sRE);
      var cookieValue = 'ifbp';
      if (oRE.test(document.cookie)) {
        cookieValue = decodeURIComponent(RegExp["$1"]);
      }
      return cookieValue;
    },
    /**
     * 布局模板
     */
    selectTemplateLayout: function(item) {
      window.engine.currentDom = $('<div id="form_top" v-drop v-on:click="backPanelClick" style="height:100%"><Page v-drop v-comp id=' + item.id + ' :layoutcontext="layoutcontext">' + item.tpl + '</Page></div>');
      window.engine.refreshDom();
    },
    doSave: function() {
      var oThis = window.engine;
      var widget = oThis.currentDom[0].querySelectorAll('widget');
      var layout = oThis.currentDom[0].querySelectorAll('.ui-grid');
      var page = oThis.currentDom[0].querySelectorAll('page');

      widget = Array.prototype.slice.apply(widget);
      layout = Array.prototype.slice.apply(layout);
      page = Array.prototype.slice.apply(page);

      var param = { order: [], templateId: '', layoutId: '', layout: [], modifytime: '', content: "" };
      widget.forEach(function(v, i) {
        var index = i + 1;
        var obj = {
          wbid: 'widgetbox' + index + '_t',
          wid: [v.id]
        };
        param.order.push(obj);
      });

      layout.forEach(function(v, i) {
        var index = i + 1;
        var obj = {
          wbid: 'widgetbox' + index,
          attr: {
            width: v.classList[1]
          }
        };
        param.layout.push(obj);
      });
      param.templateId = page[0].id;

      param.layoutId = $.getUrlParam('layoutid');
      param.modifytime = this.getPlatform() === 'ifbp' ? $.getUrlParam('modify') : window.localStorage.getItem('layoutid_' + param.layoutId);
      if (this.getPlatform() === 'fbp' && !param.modifytime) {
        oThis.$message({
          message: '请重新设计布局',
          type: 'error'
        });
      }
      compUtil.removeDesignAttr(window.engine.currentDom);
      param.content = window.engine.currentDom.html();


      var include_flag;
      if (param.content.indexOf("widget") != -1) {
        include_flag = true;
      } else {
        include_flag = false;
      }


      if (window.engine.currentDom.children().length > 1) {
        window.engine.repairOvpData();
        this.doSave();
      } else if (!include_flag) {
        oThis.$message({
          message: '请至少拖拽一个小部件！'
        })
      } else if (window.engine.currentDom.children().length === 1) {
        if (this.getPlatform() === 'ifbp') {
          if ($.getUrlParam('flag') == 'workbench') {
            param.layoutId = par.get('pk');
            param.modifytime = par.get('modify');
            $.ajax({
              url: '/wbalone/page/sort/save/user',
              type: 'POST',
              data: JSON.stringify(param),
              contentType: 'application/json',
              success: function(data) {
                if (data.status === '1') {
                  oThis.$message({
                    message: '保存成功！'
                  });
                } else {
                  oThis.$message({
                    message: data.message,
                    type: 'error'
                  });
                }
              },
              error: function(res) {
                console.error(res);
              }
            });
          } else {
            $.ajax({
              url: '/wbalone/page/sort/save/v2',
              type: 'POST',
              data: JSON.stringify(param),
              contentType: 'application/json',
              success: function(data) {
                if (data.status === '1') {
                  oThis.$message({
                    message: '保存成功！'
                  });
                } else {
                  oThis.$message({
                    message: data.message,
                    type: 'error'
                  });
                }
              },
              error: function(res) {
                console.error(res);
              }
            });
          }
        } else {
          $.ajax({
            url: '/wbalone/layout/design/save2',
            type: 'POST',
            data: JSON.stringify(param),
            contentType: 'application/json',
            success: function(data) {
              if (data.status === '1') {
                window.localStorage.setItem('layoutid_' + data.data.layoutid, data.data.modifytime);
                oThis.$message({
                  message: '保存成功！'
                });
              } else {
                oThis.$message({
                  message: data.message,
                  type: 'error'
                });
              }
            },
            error: function(res) {
              console.error(res);
            }
          });
        }
      }
    },
    doClear: function() {
      window.engine.currentDom = $('<div id="form_top" v-drop v-on:click="backPanelClick" style="height:100%"><Page v-drop :layoutcontext="layoutcontext"></Page></div>');
      window.engine.tplData.layoutcontext = JSON.parse(window.localStorage.getItem('layoutcontext'));
      window.engine.refreshDom();
    },
    wbaloneLogin: function(user) {
      var d = {
        loginname: user,
        pwd: '123456',
        encrypt: "ON"
      };
      $.ajax({
        url: '/wbalone/sso/appLogin',
        data: JSON.stringify(d),
        type: "POST",
        contentType: 'application/json',
        success: function(data) {
          if (data.success === true) {
            console.log('login success')
          } else {
            alert(data.data);
          }
        }
      });
    },
    doReady: function() {
      this.getLayout();
    },
    getLayout: function() {
      var id = $.getUrlParam('layoutid');
      if (this.getPlatform() === 'ifbp') {
        var oThis = this;
        if (id) {
          oThis.getLayoutSource(id);
        } else {
          $.ajax({
            url: '/wbalone/userDesign/getUserExistLayout',
            type: 'POST',
            success: function(res) {
              if (res.status === '1') {
                id = $.getUrlParam('layoutid') ? $.getUrlParam('layoutid') : res.data.id;
                par.set('id', res.data.id);
                par.set('modify', res.data.modify);
                par.set('pk', res.data.layoutpk);
                oThis.getLayoutSource(id);
              } else if (res.status === '0') {
                // 创建默认布局
                /*  window.engine.$message({
                    message: res.msg
                });*/
                window.engine.currentDom = $('<div id="form_top" v-on:click="backPanelClick" style="height:100%"><Page v-drop :layoutcontext="layoutcontext"></Page></div>');
              }
            }
          });
        }
      } else {
        $.ajax({
          url: '/wbalone/data:layoutSource/' + id,
          type: 'get',
          dataType: 'json',
          success: function(rs) {
            if (rs) {
              window.localStorage.setItem('layoutid_' + id, rs.modifytime);
              var layoutMeta = JSON.parse(rs.layoutMeta);
              window.engine.tplData.layoutcontext = {
                container: '',
                options: '',
                layoutMeta: layoutMeta[0].result,
              };
              window.localStorage.setItem('layoutcontext', JSON.stringify(window.engine.tplData.layoutcontext));

              var include_flag;
              if (rs.source.indexOf("page") != -1) {
                include_flag = true;
              } else {
                include_flag = false;
              }

              if (include_flag) {
                window.engine.currentDom = $('<div id="form_top" v-drop v-on:click="backPanelClick" style="height:100%">' + rs.source + '</div>');
              } else {
                window.engine.currentDom = $('<div id="form_top" v-on:click="backPanelClick" style="height:100%"><Page v-drop :layoutcontext="layoutcontext">' + rs.source + '</Page></div>');
              }
            } else {
              window.engine.currentDom = $('<div id="form_top" v-on:click="backPanelClick" style="height:100%"><Page v-drop :layoutcontext="layoutcontext"></Page></div>');
            }
            window.engine.refreshDom();
          },
          error: function() {
            window.engine.currentDom = $('<div id="form_top" v-on:click="backPanelClick" style="height:100%"><Page v-drop :layoutcontext="layoutcontext"></Page></div>');
            window.engine.refreshDom();
          }
        });
      }
    },
    getLayoutSource: function(id) {
      $.ajax({
        url: '/wbalone/data:layoutSource/' + id,
        type: 'get',
        dataType: 'json',
        success: function(rs) {
          if (rs) {
            var layoutMeta = JSON.parse(rs.layoutMeta);
            window.engine.tplData.layoutcontext = {
              container: '',
              options: '',
              layoutMeta: layoutMeta[0].result,
            };
            window.localStorage.setItem('layoutcontext', JSON.stringify(window.engine.tplData.layoutcontext));


            var include_flag;
            if (rs.source.indexOf("page") != -1) {
              include_flag = true;
            } else {
              include_flag = false;
            }

            if (include_flag) {
              window.engine.currentDom = $('<div id="form_top" v-drop v-on:click="backPanelClick" style="height:100%">' + rs.source + '</div>');
            } else {
              window.engine.currentDom = $('<div id="form_top" v-on:click="backPanelClick" style="height:100%"><Page v-drop :layoutcontext="layoutcontext">' + rs.source + '</Page></div>');
            }
          } else {
            window.engine.currentDom = $('<div id="form_top" v-on:click="backPanelClick" style="height:100%"><Page v-drop :layoutcontext="layoutcontext"></Page></div>');
          }
          window.engine.refreshDom();
        },
        error: function() {
          window.engine.currentDom = $('<div id="form_top" v-on:click="backPanelClick" style="height:100%"><Page v-drop :layoutcontext="layoutcontext"></Page></div>');
          window.engine.refreshDom();
        }
      });
    },
    getWidgetCate: function() {
      $.ajax({
        url: '/wbalone/widget/catels',
        async: false,
        type: 'GET',
        success: function(res) {
          res.data.forEach(function(v) {
            $.ajax({
              url: '/wbalone/widget/query',
              type: 'post',
              data: { 'category': v.id, 'keyword': '' },
              success: function(re) {
                window.engine.widgetCate[v.id] = re.data;
              }
            })
          });
        }
      });
    }
  }
}