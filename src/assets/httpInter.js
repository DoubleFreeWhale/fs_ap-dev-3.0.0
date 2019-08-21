/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
window.axios = axios;
import SHA256 from 'crypto-js/sha256';

import Context from '../pages/index/ulit/context';
import md5 from 'js-md5'

var intercept_context = new Context();
var timestamp = '';
var headtoken = '';
var signtoken = '';
var sign = '';
var domain = '/ifbp-uc-web';
var instance = axios.create();
var requestCount = 0;
var reponseCount = 0;

function buildParamStr(param, timestamp, url, signtoken) {
  var vmparam = JSON.parse(JSON.stringify(param));
  vmparam["timestamp"] = timestamp;
  vmparam["url"] = url;
  vmparam["signtoken"] = signtoken;
  var keys = [];
  var paramstr = "";
  for (var paramkey in vmparam) {
    keys.push(paramkey);
  }
  keys.sort();
  for (var i = 0; i < keys.length; i++) {
    var itemkey = keys[i];
    if (typeof(vmparam[itemkey]) === 'object') {
      vmparam[itemkey] = JSON.stringify(vmparam[itemkey]);
    }
    if (i === keys.length - 1) {
      paramstr += itemkey + "=" + vmparam[itemkey];
    } else {
      paramstr += itemkey + "=" + vmparam[itemkey] + "&";
    }
  }
  // console.log(paramstr);
  return paramstr;
}

function bulidSign(paramdata, timestamp, url, signtoken) {
  var paramStr = buildParamStr(paramdata, timestamp, url, signtoken);
  var hash = SHA256(paramStr);
  // console.log(hash.toString());
  return hash.toString();
}

function getToken() {
  return instance({ url: domain + '/token/getToken', method: 'get' });
}

function isExistence(arr, item) {
  var result = arr.some((a, index) => {
    if (a.id == item.id) {
      return true
    }
  })
  return result;
}

function getCurNum(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == item.id) {
      return i
    }
  }
}

// 超时时间
var axiosTimeout = 0;
if (typeof window.ifbpAxiosTimeout !== 'undefined') {
  axiosTimeout = window.ifbpAxiosTimeout;
}
axios.defaults.timeout = axiosTimeout;

// http请求拦截器
// 实例化一个axios请求
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
let localStorage = window.ifbpLocalCache || window.localStorage;
let ifbp_repeat_request = localStorage.getItem('fsRepeatRequest');
if (!ifbp_repeat_request) {
  localStorage.setItem('fsRepeatRequest', '[]');
}

// http请求拦截器
axios.interceptors.request.use((config) => {

  let userCode = intercept_context.getUserCode();
  // && config.useInterceptRepeat
  if (window.appDefaultConfig.useInterceptRepeat && config.useInterceptRepeat) {
    let today = new Date();
    let id = '';
    let url = '';
    if (config.id) {
      id = config.id;
    } else {
      url = config.url + userCode + today.toLocaleDateString();
      id = md5(url);
    }
    config.headers['x-transaction-id'] = id;
    let localStorage = window.ifbpLocalCache || window.localStorage;
    let fsRepeatRequest = JSON.parse(localStorage.getItem('fsRepeatRequest'));
    let reqIsExistence = false;
    fsRepeatRequest.map(item => {
      if (item.id == id) {
        reqIsExistence = true;
        $.ajax({
          url: '/wbalone/auth/checkTransaction?id=' + id,
          type: 'GET',
          async: false,
          contentType: 'application/json',
          success(data) {
            if (data.success) {
              if (data.data == '200') {
                Vue.prototype.$message.error.error({
                  message: '请勿重复提交'
                });
                return
              }
            }
          }
        });
      } else {
        reqIsExistence = false;
      }
    })
    if (!reqIsExistence) {
      let request_obj = {
        "url": url,
        "id": id,
      }
      let req_existence_flag = isExistence(fsRepeatRequest, request_obj);
      if (!req_existence_flag) {
        fsRepeatRequest.push(request_obj);
        localStorage.setItem('fsRepeatRequest', JSON.stringify(fsRepeatRequest));
      }
    }
  }
  // if(config.method === 'get' && !config.ifbpNotUseCache){
  if (!config.ifbpNotUseCache) {
    var nowURL = config.url;
    nowURL = nowURL + (nowURL.indexOf('?') > 0 ? '&dsahjdsarm=' + new Date().getTime() : '?dsahjdsarm=' + new Date().getTime())
    config.url = nowURL;
  }

  if (window.isAPM) {
    config.noLoading = true;
  }
  if (config.url.indexOf('/ifbp-bpm-service/task/count') > -1) {
    config.noLoading = true;
  }

  //   this.$http({
  //    url: url,
  //    noLoading:true,    //调用接口时如果多加入  此行代码 说明用户不想用loading效果
  //    method: 'get'
  //	}).then(res=>{
  //
  //	})
  if (!config.noLoading) {
    requestCount++;
  }
  //1秒钟之后响应的数量小于请求的数量 说明有请求一秒钟没有返回
  setTimeout(function() {
    if (requestCount > reponseCount) {
      window.vueInstance.$children[0].loadingMain = true;
    }
  }, 1000)

  //请求 透明遮罩层
  // if (requestCount > reponseCount) {
  //     window.vueInstance.$children[0].showTransparentDialog = true;
  // }


  var query = window.vueInstance && window.vueInstance.$route.query;
  var params = window.vueInstance && window.vueInstance.$route.params;
  if (query) {
    if (intercept_context.getPlatform() !== 'ifbp' && config.url.indexOf('?') !== -1) {
      var configParamsStr = config.url.split('?')[1];
      var configParams = configParamsStr.split('&');
      for (var i = 0; i < configParams.length; i++) {
        if (configParams[i] && configParams[i].indexOf('funcode=') !== -1) {
          query.funcode = configParams[i].split('=')[1];
          break;
        }
      }
    }
    config.headers.routeQuery = encodeURIComponent(JSON.stringify(query));
  }
  if (params) {
    config.headers.routeParams = encodeURIComponent(JSON.stringify(params));
  }
  if (window.useAPM) {
    let st = new Date().getTime();
    let ts = st;
    let mr = parseInt(Math.random() * 100);
    let traceSegmentId = window.APMObj.appInsId + '.' + mr + '.' + ts;
    let sw3 = traceSegmentId + '|0|-1|' + window.APMObj.appInsId + '|#' + location.host + '|' + location.hash + '|-1|' + traceSegmentId + '|' + userCode;
    config.headers.sw3 = sw3;
    config.ts = ts;
    config.st = st;
    config.mr = mr;
  }
  return config;
}, (error) => {
  alert(error);
  return Promise.reject(error);
});
// http响应拦截器
axios.interceptors.response.use((res) => {
  let x_id = res.headers['x-transaction-id'];
  let localStorage = window.ifbpLocalCache || window.localStorage;
  if (x_id) {
    let fsRepeatRequest = JSON.parse(localStorage.getItem('fsRepeatRequest'));
    let del_flag = false;
    let interceptData = {
      id: x_id
    };
    let req_existence_flag = isExistence(fsRepeatRequest, interceptData);
    if (req_existence_flag) {
      var del_index = getCurNum(fsRepeatRequest, interceptData);
      del_flag = true;
    } else {
      del_flag = false;
    }
    if (del_flag) {
      fsRepeatRequest.splice(del_index, 1);
      localStorage.setItem('fsRepeatRequest', JSON.stringify(fsRepeatRequest));
    }
  }
  if (window.useAPM) {
    let et = new Date().getTime();
    let intt = setInterval(() => {
      if (window.APMregister) {
        let ts = res.config.ts;
        let st = res.config.st;
        let mr = res.config.mr;
        let d = {};
        d.gt = [
          [window.APMObj.appInsId, mr, st]
        ];
        d.sg = {
          ts: [window.APMObj.appInsId, mr, ts],
          ai: window.APMObj.appId + '',
          ii: window.APMObj.appInsId,
          ss: [{
            si: 0,
            tv: 0,
            lv: 0,
            ps: -1,
            st: st,
            et: et,
            ci: 0,
            cn: '',
            oi: 0,
            on: 'fe:' + res.config.url,
            pi: 0,
            pn: '',
            ie: false,
            to: [],
            lo: []
          }]

        }
        let dd = [d]
        $.ajax({
          url: '/segments',
          data: JSON.stringify(dd),
          type: 'POST',

          contentType: 'application/json',
          success(data) {
            console.log(data)
          }
        });
        clearInterval(intt);
      }
    })
  }

  if (res.config.url.indexOf('/ifbp-bpm-service/task/count') > -1) {
    res.config.noLoading = true;
  }
  if (!res.config.noLoading) {
    reponseCount++;
  }
  if (reponseCount == requestCount) {
    window.vueInstance.$children[0].loadingMain = false;

  }
  //请求 透明遮罩层
  // if (reponseCount == requestCount) {
  //   window.vueInstance.$children[0].showTransparentDialog = false;
  // }

  if (window.isAPM) {
    return res;
  }

  if (res.headers.sessionstatus === 'timeout' && res.request.responseURL.indexOf('wbalone') > 0) {
    window.vueInstance.$children[0].$alert('登录信息已过期，请重新登录！', '超时提醒', {
      confirmButtonText: '确定',
      callback: action => {
        var url = btoa(window.location.href);
        if (intercept_context.getPlatform() === 'ifbp') {
          window.location.replace(window.ctxs.ap + "/sso/login.jsp?r=" + url) ;
        } else {
          window.location.replace("/ap/login.html?r=" + url) ;
        }
      }
    });


  }

  return res;
}, (error) => {
  reponseCount++;
  if (reponseCount == requestCount) {
    window.vueInstance.$children[0].loadingMain = false;
  }
  //请求 透明遮罩层
  // if (reponseCount == requestCount) {
  //   window.vueInstance.$children[0].showTransparentDialog = false;
  // }
  if (error.response.status === 306) {
    var url = btoa(window.location.href);
    if (error.response.data !== null) {
      if (error.response.data.type === 1) {
        window.vueInstance.$children[0].$alert(error.response.data.msg, '系统提示', {
          confirmButtonText: '确定',
          callback: function(action) {

          }
        });
      } else if (error.response.data.type === 0) {
        if (error.response.data.isshowerror) {
          window.vueInstance.$children[0].$alert(error.response.data.msg, '系统提示', {
            confirmButtonText: '确定',
            callback: function(action) {
              if (error.response.data.redirecturl) {
                window.location.replace(error.response.data.redirecturl + "?r=" + url) ;
              } else {
                window.location.replace("/ap/login.html?r=" + url) ;
              }
            }
          });
        } else {
          if (error.response.data.redirecturl) {
            window.location.replace(error.response.data.redirecturl + "?r=" + url)  ;
          } else {
            window.location.replace("/ap/login.html?r=" + url) ;
          }
        }
      }
    }
  }

  return Promise.reject(error);
});
// 暂时去掉此功能，待金府升级之后放开
// axios.interceptors.request.use(
//   config => {
//     return getToken().then((res) => {
//       timestamp = res.data.data.timestamp;
//       headtoken = res.data.data.headtoken;
//       signtoken = res.data.data.signtoken;
//
//       config = config ? config : {};
//       config.params = config.params ? config.params : {};
//       config.data = config.data ? config.data : {};
//
//       if (config.method === 'get') {
//         sign = bulidSign(config.params, timestamp, config.url, res.data.data.signtoken);
//       } else if(config.method === 'post') {
//         sign = bulidSign(config.data, timestamp, config.url, res.data.data.signtoken);
//       }
//
//       config.headers.timestamp = timestamp;
//       config.headers.headtoken = headtoken;
//       config.headers.sign = sign;
//       // config.url = domain + config.url;
//       return config;
//     }).catch((res) => {
//       console.log(res);
//     });
//
//     // return Promise.reject(error)
//   }, error => {
//     Message.error({
//       message: '加载超时'
//     });
//     return Promise.reject(error)
//   });

export default axios
