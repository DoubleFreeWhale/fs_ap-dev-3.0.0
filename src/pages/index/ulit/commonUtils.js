var enumerables = true,
  enumerablesTest = {
    toString: 1
  },
  toString = Object.prototype.toString;

for (var i in enumerablesTest) {
  enumerables = null;
}
if (enumerables) {
  enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'constructor'
  ];
}


var _extend = function(object, config) {
  var args = arguments,
    options;
  if (args.length > 1) {
    for (var len = 1; len < args.length; len++) {
      options = args[len];
      if (object && options && typeof options === 'object') {
        var i, j, k;
        for (i in options) {
          object[i] = options[i];
        }
        if (enumerables) {
          for (j = enumerables.length; j--;) {
            k = enumerables[j];
            if (options.hasOwnProperty && options.hasOwnProperty(k)) {
              object[k] = options[k];
            }
          }
        }
      }
    }
  }
  return object;
}

var setCookie = function(sName, sValue, oExpires, sPath, sDomain, bSecure) {
  var sCookie = sName + "=" + encodeURIComponent(sValue);
  if (oExpires)
    sCookie += "; expires=" + oExpires.toGMTString();
  if (sPath)
    sCookie += "; path=" + sPath;
  if (sDomain)
    sCookie += "; domain=" + sDomain;
  if (bSecure)
    sCookie += "; secure=" + bSecure;
  document.cookie = sCookie;
}

var getCookie = function(sName) {
  // if (sName === 'u_logints') return 'aaaaaaaaaaaaaaa';
  var sRE = "(?:; )?" + sName + "=([^;]*);?";
  var oRE = new RegExp(sRE);

  if (oRE.test(document.cookie)) {
    return decodeURIComponent(RegExp["$1"]);
  } else
    return null;
}

var setSessionItem = function(key, item) {
  var itemString = JSON.stringify(item);
  window.sessionStorage.setItem(key, itemString);
}

var getSessionItem = function(key) {
  var itemString = window.sessionStorage.getItem(key);
  return JSON.parse(itemString);
}

var setLocalItem = function(key, item) {
  var itemString = JSON.stringify(item);
  // window.localStorage.setItem(key, itemString);
  localStorage.setItem(key, itemString);
}

var getLocalItem = function(key) {
  var itemString = window.localStorage.getItem(key);
  return JSON.parse(itemString);
}

/**
 * 本次登录有效
 */
var setTempLocalItem = function(key, item) {
  var login_ts = getCookie('u_logints') || getCookie('login_ts');
  var windowName = getWindowName();
  var itemString = window.localStorage.getItem('temp_item');
  var tempItem = JSON.parse(itemString) || {};
  var tsItem = tempItem[login_ts] = tempItem[login_ts] || {};
  var currItem = tsItem[windowName] = tsItem[windowName] || {};
  currItem[key] = item;
  // 删除过期storage
  tempItem = {};
  tempItem[login_ts] = tsItem;
  itemString = JSON.stringify(tempItem);
  // window.localStorage.setItem('temp_item', itemString);
 localStorage.setItem('temp_item', itemString);
}

/**
 * 本次登录有效
 */
var getTempLocalItem = function(key) {
  var login_ts = getCookie('u_logints') || getCookie('login_ts');
  var itemString = window.localStorage.getItem('temp_item');
  var tempItem = JSON.parse(itemString) || {};
  var windowName = getWindowName();
  var tsItem = tempItem[login_ts];
  // if (!tsItem || !tsItem[windowName] || !tsItem[windowName]['tiles'] || !tsItem[windowName]['tiles'][key]){
  if (!tsItem || !tsItem[windowName] || !tsItem[windowName][key]) {
    return '';
  } else {
    return tsItem[windowName][key];
  }
}

function _getQueryObj(query) {
  var obj = {};
  var arr = query.split("&");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].split("=");
    obj[arr[i][0]] = arr[i][1];
  };
  return obj;
}

var _fetchTileFuncode = function(tile) {
  if (tile.pathStack && tile.pathStack.length > 0) {
    var lastPath = tile.pathStack[tile.pathStack.length - 1].path;
    var query = lastPath.split('?')[1];
    if (query) {
      var queryObj = _getQueryObj(query);
      return queryObj['funcode'] || null;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
var getTileFuncode = function(path) {
    if (path) {
      var query = path.split('?')[1];
      if (query) {
        var queryObj = _getQueryObj(query);
        return queryObj['funcode'] || null;
      } else {
        return null;
      }
    } else {
      return null;
    }


  }
  /**
   * 获取所有打开的功能号
   */
var getOpenedFuncodes = function() {
  var login_ts = getCookie('u_logints') || getCookie('login_ts');
  var itemString = window.localStorage.getItem('temp_item');
  var tempItem = JSON.parse(itemString) || {};
  var tsItem = tempItem[login_ts];
  var funcodes = []
  if (!tsItem) return funcodes;
  for (var key in tsItem) {
    var winItem = tsItem[key];
    if (winItem['tiles'] && winItem['destory'] !== true) {
      for (var tileId in winItem['tiles']) {
        var tile = winItem['tiles'][tileId];
        var funcode = _fetchTileFuncode(tile);
        if (funcode && funcodes.indexOf(funcode) === -1) {
          funcodes.push(funcode);
        }
      }
    }
  }
  return funcodes;
}


var _setWinStatus = function(status) {
  var login_ts = getCookie('u_logints') || getCookie('login_ts');
  var itemString = window.localStorage.getItem('temp_item');
  var tempItem = JSON.parse(itemString) || {};
  var windowName = getWindowName();
  var tsItem = tempItem[login_ts];
  if (tsItem && tsItem[windowName]) {
    tsItem[windowName].destory = status;
    itemString = JSON.stringify(tempItem);
    window.localStorage.setItem('temp_item', itemString);
  }
}

var restoreWinStatus = function() {
  _setWinStatus(false);
  $(window).on('unload', function() {

    _setWinStatus(true);
  })
}


var getUrlParam = function(name, path) {
  path = path || window.location.search;
  var reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)");
  var r = path.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
var getUrlParams = function(path) {
  var params = {}
  var index = path.indexOf('?')
  if (index > 0) {
    var pathParams = path.substring(index + 1);
    var strs = pathParams.split("&");
    for (var i = 0; i < strs.length; i++) {
      params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return params;
}
var getWindowName = function() {
  if (!window.name || (window.name.indexOf('winid_ifbp') !== 0)) {
    window.name = 'winid_ifbp' + Math.random().toString(36).substr(2);
  }
  return window.name;
}
var formateDate = function(date, dateStr, flag, type) {
  if (typeof date === "number") {
    var d = new Date();
    d.setTime(date);
    date = d;
  }
  var arr = dateStr.split(/\/|-|:| /); //分割字符串,- / : 空格
  var timeArr = [];
  for (var i = 0; i < arr.length; i++) { //按照需要将日期放入数组timeArr
    switch (arr[i]) {
      case "yyyy":
        timeArr.push(date.getFullYear());
        break;
      case "MM":
        timeArr.push(date.getMonth() + 1);
        break;
      case "dd":
        timeArr.push(date.getDate());
        break;
      case "hh":
        timeArr.push(date.getHours());
        break;
      case "mm":
        timeArr.push(date.getMinutes());
        break;
      case "ss":
        timeArr.push(date.getSeconds());
        break;
    }
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == ":") {
      arr[i] = '';
    }
    if (timeArr[i] < 10) {
      timeArr[i] = '0' + timeArr[i];
    }
    dateStr = dateStr.replace(arr[i], timeArr[i]);
  }
  return dateStr;
}

export default {
  extend: _extend,
  setCookie: setCookie,
  getCookie: getCookie,
  setSessionItem: setSessionItem,
  getSessionItem: getSessionItem,
  setLocalItem: setLocalItem,
  getLocalItem: getLocalItem,
  setTempLocalItem: setTempLocalItem,
  getTempLocalItem: getTempLocalItem,
  getUrlParam: getUrlParam,
  getUrlParams: getUrlParams,
  getWindowName: getWindowName,
  getOpenedFuncodes: getOpenedFuncodes,
  restoreWinStatus: restoreWinStatus,
  formateDate: formateDate,
  fetchTileFuncode: _fetchTileFuncode,
  getTileFuncode: getTileFuncode
}

