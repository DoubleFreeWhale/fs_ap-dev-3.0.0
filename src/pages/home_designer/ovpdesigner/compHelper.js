
import layoutArraydef from '../res/ovpLayouts.json'
import layoutDef from '../res/ovpLayoutsProperty.json'
import widgetDef from '../res/widgetProperty.json'
import bizCompArray from '../res/bizComp.json'
import bizCompDef from '../res/bizCompProperty.json'

console.log(layoutArraydef)
console.log(layoutDef)
console.log(widgetDef)
console.log(bizCompArray)
console.log(bizCompDef)

let layoutArray=layoutArraydef;
var layoutTempArray=[];
var widget_data = [];
var widget_category_data;
var getUrlParam = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.parent.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function getWidgetArray(name, init_flag) {
  var url = '/wbalone/role/widget/queryWidget';
  var data;
  var flag;

  if (getUrlParam('roleid')) {
    flag = "personal";
  } else if (getUrlParam('flag')) {
    flag = "workbench";
  } else {
    flag = "ovp";
  }
  data = {
    "roleId": getUrlParam('roleid') || '',
    "name": name || '',
    "type": flag
  }
  $.ajax({
    url: url,
    async: false,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(res) {
      if (res && res.success) {
        widget_category_data = res.data;
        for (var i = 0; i < widget_category_data.length; i++) {
          var widgetArray = widget_category_data[i]["widgetList"];
          if (!widgetArray) {
            window.engine.$message('没有授权小部件')
          };
          widgetArray.forEach(function(v) {
            v.key = 'widget';
            v.code = v.code ? v.code : v.id;
            v.content = '<Widget v-comp v-drag gadgeturl="file:' + v.url + '?id=' + v.code + '&lid=' + v.code + '" id="' + v.code + '" :layoutcontext="layoutcontext">';
            widget_data.push(v);
          });
        }
      } else {
        widget_category_data = [];
      }
    },
    error: function() {
      widget_category_data = []
    }
  });
  if (init_flag == 'init') {
    return widget_category_data;
  } else {
    return widget_data;
  }
}

function getLayoutTemplate() {
  $.ajax({
    url: '/wbalone/layout/tpl/list/v2',
    async: false,
    type: 'GET',
    success: function(res) {
      if (res && res.status === '1') {
        layoutTempArray = res.data
      } else {
        layoutTempArray = []
      }
    },
    error: function() {
      layoutTempArray = []
    }
  });
  return layoutTempArray;
}

export default {
  getLayoutArray: function() {
    return layoutArray;
  },
  getLayoutDef: function(key) {
    return layoutDef[key];
  },
  getWidgetArray: function(name, flag) {
    return getWidgetArray(name, flag);
  },
  getWidgetDef: function(key) {
    return widgetDef[key];
  },
  getBizCompArray: function() {
    return bizCompArray;
  },
  getBizCompDef: function(key) {
    return bizCompDef[key];
  },
  getLayoutTempArray: function() {
    return getLayoutTemplate();
  }
};