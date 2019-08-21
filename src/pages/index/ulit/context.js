import commonUtils from './commonUtils';


var IFBP_LANGUAGES = "i_languages";
var IFBP_CURRENT_LANGUAGE = "i_currrent_language";
var IFBP_THEME = "u_theme";
var IFBP_USERCODE = "_A_P_loginName";
var IFBP_USERORG = '_A_P_pk_org';
var IFBP_USERID = '_A_P_id';
var IFBP_isChangePassword = '_A_P_isChangePassword';
var IFBP_disabledate = '_A_P_disabledate';
var FBP_NCSESSION = "ncSession";
var FBP_USERID = "userid";
var FBP_USERSTATUS = "_FC_userStatus";
var FBP_ISFORCEPWD = "_FC_isForcePwd";
var IFBP_PLATFORM = "platform";

/**
 * 平台上下文
 */
var context = null;


/**
 * 创建一个带壳的对象,防止外部修改
 * @param {Object} proto
 */
var createShellObject = function(proto) {
    var exf = function() {}
    exf.prototype = proto;
    return new exf();
}
var execIgnoreError = function(a, b, c) {
    try {
        a.call(b, c);
    } catch (e) {}
}

// (function () {
//环境信息 包括主题、语种、用户信息、
var environment = {};
// var tiles = {};
// app实例
var app;



//数据类型显示格式
var maskerMeta = {
    'float': {
        precision: 2,
        isThousandth: true,
        thousandthChar: ',',
        red: true,
        point: '.',
        negative: '-123456' /* 其他选项有'- 123456','123456-','123456 -','(123456)' */
    },
    'datetime': {
        format: 'YYYY-MM-DD HH:mm:ss',
    },
    'time': {
        format: 'HH:mm'
    },
    'date': {
        format: 'YYYY-MM-DD',
        dateUnit1: "YYYY",
        delimit1: "-",
        dateUnit2: "MM",
        delimit2: "-",
        dateUnit3: "DD",
        delimit3: null
    },
    'currency': {
        precision: 2,
        curSymbol: '￥'
    },
    'percent': {

    },
    'addressbook': {
        format: 'N-P-C-D-S-Z' /*N-国家Nation, P-省Province, C-市City, D-区县District, S-详细地址Street，Z-邮编Zipcode*/
    }
};

var Tile = function(params) {
    this.id = params.id;
    this.name = params.name;
    this.path = params.path;
    this.app = app;
    this.pathStack = params.pathStack || [{ name: this.name, path: this.path }];
    this.saveToSessionStorage();
}

Tile.prototype.getPathStack = function() {
    return this.pathStack;
}

Tile.prototype.delPathStackByIndex = function(index) {
    this.pathStack = this.pathStack.slice(0, index);
    this.saveToSessionStorage();
};

Tile.prototype.popPath = function() {
    var path = this.pathStack.pop();
    this.saveToSessionStorage();
    return path;
};



/**
 *
 * @param path    {name:'订单列表',path:'/sales/orderList'}
 */
Tile.prototype.pushPath = function(path) {
    if (this.pathStack.length > 0) {
        for (var i = 0; i < this.pathStack.length; i++) {
            if (this.pathStack[i].path == path.path || this.pathStack[i].path == decodeURIComponent(path.path)) {
                this.delPathStackByIndex(i + 1);
                return;
            }
        }
    }
    this.pathStack.push(path);
    this.saveToSessionStorage();

    // var lastPath = this.pathStack[this.pathStack.length-1];
    // if (!lastPath || lastPath.path != path.path){
    //   this.pathStack.push(path);
    //   this.saveToSessionStorage();
    //   // this.app.$eventBus.$emit('tilePathChange', this);
    // }

}

Tile.prototype.back = function(router, index) {
    if (this.pathStack.length > 1) {
        var len = this.pathStack.length;
        if (typeof index !== 'number') {
            index = 1;
        }
        if (index >= len) {
            index = len - 1;
        }
        this.pathStack = this.pathStack.splice(0, len - index);
        var path = this.pathStack[this.pathStack.length - 1];
        router.push(path.path);
        this.saveToSessionStorage();
        // this.app.$eventBus.$emit('tilePathChange', this);
    }
}

Tile.prototype.saveToSessionStorage = function() {
    var tiles = commonUtils.getTempLocalItem('tiles');
    if (!tiles) {
        tiles = {};
    }
    tiles[this.id] = this;
    this.tabIndex = window.vueInstance.$children[0].tabIndex;
    commonUtils.setTempLocalItem('tiles', tiles);
}

var fn = {};

fn.setApp = function(appIns) {
    app = appIns;
};
fn.getApp = function() {
    return window.vueInstance;
};

/**
 * 获取环境信息
 * @return {environment}
 */
fn.getEnvironment = function() {
    return createShellObject(environment);
};

fn.getCurrentTileCode = function() {
    let app=vueInstance;
    var code = app.$route.query && app.$route.query.tilecode;
    if (code && app.$route.fullPath.indexOf('tilecode=') > 0) {
        return code;
    } else {
        return null;
    }
}

fn.getSortableTiles = function() {
    var tiles = commonUtils.getTempLocalItem('tiles');
    var sortTiles = [];
    for (var key in tiles) {
        var nowTile = tiles[key];
        var index = nowTile.tabIndex;
        sortTiles[index] = nowTile;
    }
    return sortTiles;
}

fn.getCurrentTile = function() {
    var tilecode = this.getCurrentTileCode();
    if (tilecode) {
        var tiles = commonUtils.getTempLocalItem('tiles');
        if (tiles && tiles[tilecode]) {
            return new Tile(tiles[tilecode]);
        }
    }
    return null;
}

fn.getTileByCode = function(tilecode) {
    var tileList = app.allList;
    for (var i = 0; i < tileList.length; i++) {
        if (tileList[i].code == tilecode) {
            return tileList[i];
        }
    }
    return null;
}

fn.createTile = function(tileId, tileName, tilePath) {
    var tile = new Tile({ id: tileId, name: tileName, path: tilePath });
    return tile;
}

fn.destroyCurrentTile = function() {
    var tilecode = this.getCurrentTileCode();
    if (tilecode) {
        this.destroyTileByCode(tilecode);
    }
}

fn.destroyTileByIndex = function(index) {
    var tiles = commonUtils.getTempLocalItem('tiles');
    if (tiles) {
        var delKey = '';
        for (var key in tiles) {
            var nowTile = tiles[key];
            var nowTabIndex = nowTile.tabIndex;
            if (parseInt(nowTabIndex) === parseInt(index)) {
                delKey = key
            }
            if (parseInt(nowTabIndex) > parseInt(index)) {
                nowTile.tabIndex = nowTabIndex - 1;
            }
        }
        delete tiles[delKey]
        commonUtils.setTempLocalItem('tiles', tiles);
    }
}

fn.destroyTileByCode = function(tilecode) {
    var tiles = commonUtils.getTempLocalItem('tiles');
    if (tiles) {
        var nowTile = tiles[tilecode];
        if (nowTile) {
            this.destroyTileByIndex(nowTile.tabIndex);
        }
    }
}

fn.destroyAllTiles = function() {
    commonUtils.setTempLocalItem('tiles', null);
}

function getQueryObj(query) {
    var obj = {};
    var arr = query.split("&");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split("=");
        obj[arr[i][0]] = arr[i][1];
    };
    return obj;
}

function comparePath(path1, path2) {
    // var url = path;
    path1 = decodeURIComponent(path1);
    path2 = decodeURIComponent(path2);
    var baseUrl1 = path1.split('?')[0];
    var query1 = path1.split('?')[1];
    var baseUrl2 = path2.split('?')[0];
    var query2 = path2.split('?')[1];
    if (baseUrl1 !== baseUrl2) {
        return false;
    } else if (query1 === query2) {
        return true;
    } else if (!query1 || !query2) {
        return false;
    } else {
        var obj1 = getQueryObj(query1);
        var obj2 = getQueryObj(query2);
        var tilecode1 = obj1['tilecode'] || 'null';
        var tilecode2 = obj2['tilecode'] || 'null';
        var funcode1 = obj1['funcode'] || 'null';
        var funcode2 = obj2['funcode'] || 'null';
        if (tilecode1 !== tilecode2 || funcode1 != funcode2) {
            return false;
        } else {
            delete obj1['tilecode'];
            delete obj1['funcode'];
            delete obj1['keepalivekey'];
            delete obj2['tilecode'];
            delete obj2['funcode'];
            delete obj2['keepalivekey'];
            for (var key in obj1) {
                if (obj1[key] !== obj2[key]) {
                    return false;
                }
                delete obj2[key];
            }
            if (JSON.stringify(obj2) !== '{}') {
                return false;
            } else {
                return true;
            }
        }
    }
}

fn.initTileItem = function(route, itemName) {
    var currPath = route.fullPath;
    var name = itemName || '';
    var pathStatck;
    var tile = this.getCurrentTile();
    if (!tile) {
        var tilecode = this.getCurrentTileCode();
        if (tilecode) {
            var tileInfo = this.getTileByCode(tilecode);
            if (!tileInfo) {
                tileInfo = { label: name, path: currPath };
            }
            if (tileInfo) {
                var breadcrumbName = name || tileInfo.label;
                var pathWithTileCode = tileInfo.path;
                if (pathWithTileCode.indexOf('tilecode=') == -1) {
                    pathWithTileCode = tileInfo.path.indexOf('?') != -1 ? tileInfo.path + '&tilecode=' + tilecode : tileInfo.path + '?tilecode=' + tilecode;
                }
                if (!comparePath(pathWithTileCode, currPath)) {
                    tile = this.createTile(tilecode, tileInfo.label, pathWithTileCode);
                    tile.pushPath({ name: name, path: currPath });
                    window.vueInstance.$eventBus.$emit('tilePathChange', tile);
                } else {
                    tile = this.createTile(tilecode, breadcrumbName, currPath);
                }
            }
        }
    } else if (typeof tile.pushPath === 'function') {
        var len = tile.pathStack.length;
        if (len == 0 || !comparePath(tile.pathStack[len - 1].path, currPath)) {
            tile.pushPath({ name: name, path: currPath });
            window.vueInstance.$eventBus.$emit('tilePathChange', tile);
        }
    }
}


/**
 * 获取多语信息
 */
fn.getLanguages = function() {
    // return this.getEnvironment().languages;
    return commonUtils.getCookie(IFBP_LANGUAGES) ? commonUtils.getCookie(IFBP_LANGUAGES).split(',') : navigator.language ? [navigator.language] : ['zh-CN'];
};

fn.getCurrentLang = function() {
    // return this.getEnvironment().currentLang;
    return commonUtils.getCookie(IFBP_CURRENT_LANGUAGE) ? commonUtils.getCookie(IFBP_CURRENT_LANGUAGE) : navigator.language ? navigator.language : 'zh-CN';
};

/**
 * 获取主题
 */
fn.getTheme = function() {
    // return this.getEnvironment().theme;
    return commonUtils.getCookie(IFBP_THEME);
};
/**
 * 获取usercode
 */
fn.getUserCode = function() {
    // return this.getEnvironment().usercode;
    return commonUtils.getCookie(IFBP_USERCODE);
};

fn.getUserId = function() {
    // return this.getEnvironment().userid;
    return commonUtils.getCookie(IFBP_USERID);
};

/**
 * 获取userorg
 */
fn.getUserOrg = function() {
    // return this.getEnvironment().userorg;
    return commonUtils.getCookie(IFBP_USERORG);
};

/**
 * 获取isChangePassword
 */
fn.getIsChangePassword = function() {
    // return this.getEnvironment().isChangePassword;
    return commonUtils.getCookie(IFBP_isChangePassword);
};

/**
 * 获取_FC_userStatus
 */
fn.getUserStatus = function() {
    return commonUtils.getCookie(FBP_USERSTATUS);
};

/**
 * 获取_FC_isForcePwd
 */
fn.getIsForcePwd = function() {
    return commonUtils.getCookie(FBP_ISFORCEPWD);
};

/**
 * 获取isChangePassword
 */
fn.getDisabledate = function() {
    // return this.getEnvironment().disabledate;
    return commonUtils.getCookie(IFBP_disabledate);
};

/**
 * fbp获取fbpGroupPk
 */
fn.getFbpGroupPk = function() {
    return this.getEnvironment().fbpGroupPk;
};
/**
 * fbp获取fbpUserId
 */
fn.getFbpUserId = function() {
    if (this.getEnvironment().fbpUserId)
        return this.getEnvironment().fbpUserId;
    else
        return commonUtils.getCookie(FBP_USERID);
};
/**
 * fbp获取fbpUserId
 */
fn.getFbpUserCode = function() {
    return this.getEnvironment().fbpUserCode;
};
/**
 * fbp获取fbpUserName
 */
fn.getFbpUserName = function() {
    return this.getEnvironment().fbpUserName;
};
/**
 * fbp获取fbpDsName
 */
fn.getFbpDsName = function() {
    return this.getEnvironment().fbpDsName;
};



/**
 * 收集环境信息(包括客户端参数)
 * @return {Object}
 */
/**
 * 设置数据格式信息
 * @param {Object} meta
 * "maskerMeta" : {
      "time" : {
        "format" : "hh\":\"mm\":\"ss\"\""
      },
      "date" : {
        "dateUnit1" : "YYYY",
        "delimit1" : "-",
        "dateUnit2" : "ME",
        "delimit2" : "-",
        "dateUnit3" : "DD",
        "delimit3" : null
      },
      "addressbook" : {
        "format" : "P,CS-TDR"
      },
      "num" : {
        "thousandthChar" : ",",
        "negative" : "- n",
        "point" : ".",
        "red" : true,
        "thousandth" : true
      }
    },
 * 
 */
fn.setMaskerMeta = function(meta) {
    var _meta = null;
    if (meta['num']) {
        _meta = maskerMeta['float'];
        _meta.thousandthChar = meta['num'].thousandthChar || _meta.thousandthChar;
        _meta.negative = meta['num'].negative || _meta.negative;
        _meta.point = meta['num'].point || _meta.point;
        _meta.red = meta['num'].red || _meta.red;
        _meta.isThousandth = meta['num'].thousandth || _meta.isThousandth;
    }
    if (meta['addressbook']) {
        _meta = maskerMeta['addressbook'];
        _meta.format = meta['addressbook'].format || _meta.format;
    }
    if (meta['date']) {
        _meta = maskerMeta['date'];
        _meta.dateUnit1 = meta['date'].dateUnit1 || _meta.dateUnit1;
        _meta.delimit1 = meta['date'].delimit1 || _meta.delimit1;
        _meta.dateUnit2 = meta['date'].dateUnit2 || _meta.dateUnit2;
        _meta.delimit2 = meta['date'].delimit2 || _meta.delimit2;
        _meta.dateUnit3 = meta['date'].dateUnit3 || _meta.dateUnit3;
        _meta.delimit3 = meta['date'].delimit3 || _meta.delimit3;
        _meta.format = _meta.dateUnit1 + _meta.delimit1 + _meta.dateUnit2 + _meta.delimit2 + _meta.dateUnit3 + _meta.delimit3;
    }
    if (meta['time']) {
        _meta = maskerMeta['time'];
        _meta.format = meta['time'].format || _meta.format;
    }
    if (meta['date'] && meta['time']) {
        _meta = maskerMeta['datetime'];
        _meta.format = maskerMeta['date'].format + ' ' + maskerMeta['time'].format;
    }
};

fn.getMaskerMeta = function(type) {
    return commonUtils.extend({}, maskerMeta[type] ? maskerMeta[type] : null);
};

fn.getMaskerValue = function(type, originValue) {

}

fn.getContextClone = function() {
    var environmentClone = commonUtils.extend({}, environment);
    var paramsClone = commonUtils.extend({}, params);
    var maskerMetaClone = commonUtils.extend({}, maskerMeta);
    return {
        environmentClone: environmentClone,
        paramsClone: paramsClone,
        maskerMetaClone: maskerMetaClone
    }
};

fn.getPlatform = function() {
    return commonUtils.getCookie(IFBP_PLATFORM) || ''; //this.getEnvironment().platform;  
}

// fn.setVueInstance = function(vueInstance){
//   this.vueInstance = vueInstance;
// }

environment.languages = commonUtils.getCookie(IFBP_LANGUAGES) ? commonUtils.getCookie(IFBP_LANGUAGES).split(',') : navigator.language ? [navigator.language] : ['zh-CN'];
environment.currentLang = commonUtils.getCookie(IFBP_CURRENT_LANGUAGE) ? commonUtils.getCookie(IFBP_CURRENT_LANGUAGE) : navigator.language ? navigator.language : 'zh-CN';

environment.theme = commonUtils.getCookie(IFBP_THEME);
environment.usercode = commonUtils.getCookie(IFBP_USERCODE);
environment.userid = commonUtils.getCookie(IFBP_USERID);
environment.userorg = commonUtils.getCookie(IFBP_USERORG);
environment.isChangePassword = commonUtils.getCookie(IFBP_isChangePassword);
environment.disabledate = commonUtils.getCookie(IFBP_disabledate);
environment.fbpGroupPk = commonUtils.getLocalItem(FBP_NCSESSION) ? commonUtils.getLocalItem(FBP_NCSESSION).groupPK : commonUtils.getCookie('groupid');
environment.fbpUserId = commonUtils.getLocalItem(FBP_NCSESSION) ? commonUtils.getLocalItem(FBP_NCSESSION).userID :'';
environment.fbpUserCode = commonUtils.getLocalItem(FBP_NCSESSION) ? commonUtils.getLocalItem(FBP_NCSESSION).userCode : '';
environment.fbpUserName = commonUtils.getLocalItem(FBP_NCSESSION) ? commonUtils.getLocalItem(FBP_NCSESSION).userName : '';
environment.fbpDsName = commonUtils.getLocalItem(FBP_NCSESSION) ? commonUtils.getLocalItem(FBP_NCSESSION).dsName : '';
environment.platform = commonUtils.getCookie(IFBP_PLATFORM) || '';


//init session attribute
document.cookie.replace(/ISES_(\w*)=([^;]*);?/ig, function(a, b, c) {
    sessionAttributes[b] = c;
});

let fontsConfigs = [];

fn.getFontsConfigs = function() {
    if (Array.isArray(fontsConfigs)) {
        return fontsConfigs;
    }
    return [];
};

fn.addFontsConfigs = function(config) {
    fontsConfigs.push(config);
    // this.getApp().$eventBus.$emit('fontConfigChange');
    return fontsConfigs;
}

fn.getOpenedFuncodes = function() {
    return commonUtils.getOpenedFuncodes();
}


fn.getAllTemplates = function(index) {
    let $doms;
    if (index > -1) {
        $doms = $($(this.getApp().$el).find('.list-complete-item')[index]).find('.yon-uitemplate,.ifbp-dynamic-panel');
    } else {
        $doms = $(this.getApp().$el).find('.yon-uitemplate,.ifbp-dynamic-panel');
    }
    let templates = [];
    for (let i = 0; i < $doms.length; i++) {
        let dom = $doms[i];
        let vueComp = dom.__vue__;
        try {
            if (vueComp.$vnode.componentOptions.tag === "ifbp-dynamic-panel") {
                templates = templates.concat(vueComp.getIfbpTemplates());
            } else if (vueComp.$vnode.componentOptions.tag === "ifbp-template") {
                templates.push(vueComp);
            }
        } catch (e) {}
    }
    return templates;
}

fn.checkPageBeforeClose = function(index, successFun, errorFun) {
    let canClose = true;
    if (index > -1) {
        let ifbpPageBeforeClose = null;
        let ifbpPageComp = null;

        if ($('.list-complete-item')[index] && $('.list-complete-item')[index].__vue__ && $('.list-complete-item')[index].__vue__.$vnode && $('.list-complete-item')[index].__vue__.$vnode.componentInstance && $('.list-complete-item')[index].__vue__.$vnode.componentInstance.ifbpPageBeforeClose) {
            ifbpPageBeforeClose = $('.list-complete-item')[index].__vue__.$vnode.componentInstance.ifbpPageBeforeClose;
            ifbpPageComp = $('.list-complete-item')[index].__vue__.$vnode.componentInstance;
        } else {
            if ($('.list-complete-item')[index] && $('.list-complete-item')[index].__vue__ && $('.list-complete-item')[index].__vue__.$vnode && $('.list-complete-item')[index].__vue__.$vnode.parent && $('.list-complete-item')[index].__vue__.$vnode.parent.componentInstance && $('.list-complete-item')[index].__vue__.$vnode.parent.componentInstance.ifbpPageBeforeClose) {
                ifbpPageBeforeClose = $('.list-complete-item')[index].__vue__.$vnode.parent.componentInstance.ifbpPageBeforeClose;
                ifbpPageComp = $('.list-complete-item')[index].__vue__.$vnode.parent.componentInstance;
            } else {
                if ($('.list-complete-item')[index] && $('.list-complete-item')[index].__vue__ && $('.list-complete-item')[index].__vue__._vnode && $('.list-complete-item')[index].__vue__._vnode.componentInstance && $('.list-complete-item')[index].__vue__._vnode.componentInstance.ifbpPageBeforeClose) {
                    ifbpPageBeforeClose = $('.list-complete-item')[index].__vue__._vnode.componentInstance.ifbpPageBeforeClose;
                    ifbpPageComp = $('.list-complete-item')[index].__vue__._vnode.componentInstance;
                }
            }
        }
        if (ifbpPageBeforeClose) {
            canClose = ifbpPageBeforeClose.call(ifbpPageComp);
        }
    } else {
        let l = this.getApp().editableTabs.length;
        for (let i = 0; i < l; i++) {
            let ifbpPageBeforeClose = null;
            let ifbpPageComp = null;
            let nowCanClose = true;

            if ($('.list-complete-item')[i] && $('.list-complete-item')[i].__vue__ && $('.list-complete-item')[i].__vue__.$vnode && $('.list-complete-item')[i].__vue__.$vnode.componentInstance && $('.list-complete-item')[i].__vue__.$vnode.componentInstance.ifbpPageBeforeClose) {
                ifbpPageBeforeClose = $('.list-complete-item')[i].__vue__.$vnode.componentInstance.ifbpPageBeforeClose;
                ifbpPageComp = $('.list-complete-item')[i].__vue__.$vnode.componentInstance;
            } else {
                if ($('.list-complete-item')[i] && $('.list-complete-item')[i].__vue__ && $('.list-complete-item')[i].__vue__.$vnode && $('.list-complete-item')[i].__vue__.$vnode.parent && $('.list-complete-item')[i].__vue__.$vnode.parent.componentInstance && $('.list-complete-item')[i].__vue__.$vnode.parent.componentInstance.ifbpPageBeforeClose) {
                    ifbpPageBeforeClose = $('.list-complete-item')[i].__vue__.$vnode.parent.componentInstance.ifbpPageBeforeClose;
                    ifbpPageComp = $('.list-complete-item')[i].__vue__.$vnode.parent.componentInstance;
                } else {
                    if ($('.list-complete-item')[i] && $('.list-complete-item')[i].__vue__ && $('.list-complete-item')[i].__vue__._vnode && $('.list-complete-item')[i].__vue__._vnode.componentInstance && $('.list-complete-item')[i].__vue__._vnode.componentInstance.ifbpPageBeforeClose) {
                        ifbpPageBeforeClose = $('.list-complete-item')[i].__vue__._vnode.componentInstance.ifbpPageBeforeClose;
                        ifbpPageComp = $('.list-complete-item')[i].__vue__._vnode.componentInstance;
                    }
                }
            }
            if (ifbpPageBeforeClose) {
                nowCanClose = ifbpPageBeforeClose.call(ifbpPageComp);
            }
            canClose = canClose && nowCanClose;
            if (!canClose) {
                break;
            }
        }
        // 单页签
        let ifbpPageBeforeClose = null;
        let ifbpPageComp = null;
        let nowCanClose = true;
        if ($('.view')[0] && $('.view')[0].__vue__ && $('.view')[0].__vue__._vnode && $('.view')[0].__vue__._vnode.componentInstance && $('.view')[0].__vue__._vnode.componentInstance.ifbpPageBeforeClose) {
            ifbpPageBeforeClose = $('.view')[0].__vue__._vnode.componentInstance.ifbpPageBeforeClose;
            ifbpPageComp = $('.view')[0].__vue__._vnode.componentInstance;
        } else {
            if ($('.view')[0] && $('.view')[0].__vue__ && $('.view')[0].__vue__.$vnode && $('.view')[0].__vue__.$vnode.parent && $('.view')[0].__vue__.$vnode.parent.componentInstance && $('.view')[0].__vue__.$vnode.parent.componentInstance.ifbpPageBeforeClose) {
                ifbpPageBeforeClose = $('.view')[0].__vue__.$vnode.parent.componentInstance.ifbpPageBeforeClose;
                ifbpPageComp = $('.view')[0].__vue__.$vnode.parent.componentInstance;
            } else {
                if ($('.view')[0] && $('.view')[0].__vue__ && $('.view')[0].__vue__.$vnode && $('.view')[0].__vue__.$vnode.componentInstance && $('.view')[0].__vue__.$vnode.componentInstance.ifbpPageBeforeClose) {
                    ifbpPageBeforeClose = $('.view')[0].__vue__.$vnode.componentInstance.ifbpPageBeforeClose;
                    ifbpPageComp = $('.view')[0].__vue__.$vnode.componentInstance;
                }
            }
        }
        if (ifbpPageBeforeClose) {
            nowCanClose = ifbpPageBeforeClose.call(ifbpPageComp);
        }
        canClose = canClose && nowCanClose;
    }
    if (canClose) {
        successFun && successFun.call(this.getApp())
    } else {
        errorFun && errorFun.call(this.getApp());
    }
}

fn.checkTemplatesEdit = function(index, successFun, errorFun) {
    let templates = this.getAllTemplates(index);
    let flag = false;
    for (var i = 0; i < templates.length; i++) {
        flag = flag || templates[i].editChange;
    }
    if (flag) {
        this.getApp().$confirm('数据已发生改变，如您离开将不会保存当前操作', '提示', {
            confirmButtonText: '离开',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            successFun && successFun.call(this.getApp());
        }).catch(() => {
            errorFun && errorFun.call(this.getApp());
        });
    } else {
        successFun && successFun.call(this.getApp());
    }
}

var Context = function() {
    // this.vueInstance;
};
Context.prototype = fn;

// context = new Context();
// })();
export default Context;