import commonUtils from './commonUtils';

function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

function Diff(kind, path) {
  Object.defineProperty(this, 'kind', {
    value: kind,
    enumerable: true
  });
  if (path && path.length) {
    Object.defineProperty(this, 'path', {
      value: path,
      enumerable: true
    });
  }
}

function DiffEdit(path, origin, value) {
  DiffEdit.super_.call(this, 'E', path);
  Object.defineProperty(this, 'lhs', {
    value: origin,
    enumerable: true
  });
  Object.defineProperty(this, 'rhs', {
    value: value,
    enumerable: true
  });
}
inherits(DiffEdit, Diff);

function DiffNew(path, value) {
  DiffNew.super_.call(this, 'N', path);
  Object.defineProperty(this, 'rhs', {
    value: value,
    enumerable: true
  });
}
inherits(DiffNew, Diff);

function DiffDeleted(path, value) {
  DiffDeleted.super_.call(this, 'D', path);
  Object.defineProperty(this, 'lhs', {
    value: value,
    enumerable: true
  });
}
inherits(DiffDeleted, Diff);

function DiffArray(path, index, item) {
  DiffArray.super_.call(this, 'A', path);
  Object.defineProperty(this, 'index', {
    value: index,
    enumerable: true
  });
  Object.defineProperty(this, 'item', {
    value: item,
    enumerable: true
  });
}
inherits(DiffArray, Diff);

function arrayRemove(arr, from, to) {
  var rest = arr.slice((to || from) + 1 || arr.length);
  arr.length = from < 0 ? arr.length + from : from;
  arr.push.apply(arr, rest);
  return arr;
}

function realTypeOf(subject) {
  var type = typeof subject;
  if (type !== 'object') {
    return type;
  }

  if (subject === Math) {
    return 'math';
  } else if (subject === null) {
    return 'null';
  } else if (Array.isArray(subject)) {
    return 'array';
  } else if (Object.prototype.toString.call(subject) === '[object Date]') {
    return 'date';
  } else if (typeof subject.toString === 'function' && /^\/.*\//.test(subject.toString())) {
    return 'regexp';
  }
  return 'object';
}

function deepDiff(lhs, rhs, changes, prefilter, path, key, stack, pk, inArray) {
  path = path || [];
  stack = stack || [];
  var currentPath = path.slice(0);
  if (typeof key !== 'undefined' && key !== null) {
    if (prefilter) {
      if (typeof(prefilter) === 'function' && prefilter(currentPath, key)) {
        return; } else if (typeof(prefilter) === 'object') {
        if (prefilter.prefilter && prefilter.prefilter(currentPath, key)) {
          return; }
        if (prefilter.normalize) {
          var alt = prefilter.normalize(currentPath, key, lhs, rhs);
          if (alt) { 
            lhs = alt[0];
            rhs = alt[1];
          }
        }
      }
    }
    currentPath.push(key);
  }

  // Use string comparison for regexes
  if (realTypeOf(lhs) === 'regexp' && realTypeOf(rhs) === 'regexp') {
    lhs = lhs.toString();
    rhs = rhs.toString();
  }

  var ltype = typeof lhs;
  var rtype = typeof rhs;

  var ldefined = ltype !== 'undefined' || (stack && stack[stack.length - 1].lhs && stack[stack.length - 1].lhs.hasOwnProperty(key));
  var rdefined = rtype !== 'undefined' || (stack && stack[stack.length - 1].rhs && stack[stack.length - 1].rhs.hasOwnProperty(key));

  if (!ldefined && rdefined) {
    if (inArray){
      var i = currentPath.shift();
      changes(new DiffArray(currentPath, i, new DiffNew(undefined, rhs)));
    }else{
      changes(new DiffNew(currentPath, rhs));
    }
  } else if (!rdefined && ldefined) {
    if (inArray){
      var i = currentPath.shift();
      changes(new DiffArray(currentPath, i, new DiffDeleted(undefined, lhs)));
    }else{
      changes(new DiffDeleted(currentPath, lhs));
    }  
  } else if (realTypeOf(lhs) !== realTypeOf(rhs)) {
    if (inArray){
      var i = currentPath.shift();
      changes(new DiffArray(currentPath, i, new DiffEdit(undefined, lhs, rhs)));
    }else{
      changes(new DiffEdit(currentPath, lhs, rhs));
    }
  } else if (realTypeOf(lhs) === 'date' && (lhs - rhs) !== 0) {
    if (inArray){
      var i = currentPath.shift();
      changes(new DiffArray(currentPath, i, new DiffEdit(undefined, lhs, rhs)));
    }else{
      changes(new DiffEdit(currentPath, lhs, rhs));
    }
  } else if (ltype === 'object' && lhs !== null && rhs !== null) {
    if (!stack.filter(function(x) {
        return x.lhs === lhs; }).length) {
      stack.push({ lhs: lhs, rhs: rhs });
      if (Array.isArray(lhs)) {
        var i,j, len = lhs.length;
        if (pk){
          var rhsClone = JSON.parse(JSON.stringify(rhs));
          for (i = 0; i < lhs.length; i++) {
            var _pk = lhs[i][pk];
            var isDelete = true;
            for (j = 0; j<rhsClone.length; j++){
              if (rhsClone[j][pk] == _pk){
                deepDiff(lhs[i], rhsClone[j], changes, prefilter, currentPath, i, stack,null, true);
                rhsClone.splice(j,1);
                isDelete = false;
                break;
              }
            }
            if (isDelete){
              changes(new DiffArray(currentPath, i, new DiffDeleted(undefined, lhs[i])));
            }
          }  
          //新增的
          while (rhsClone.length > 0){
            changes(new DiffArray(currentPath, i, new DiffNew(undefined, rhsClone[0])));
            rhsClone.splice(0,1);
          }
        }else{
          for (i = 0; i < lhs.length; i++) {
            if (i >= rhs.length) {
              changes(new DiffArray(currentPath, i, new DiffDeleted(undefined, lhs[i])));
            } else {
              deepDiff(lhs[i], rhs[i], changes, prefilter, currentPath, i, stack,null, inArray);
            }
          }
          while (i < rhs.length) {
            changes(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i++])));
          }
        }
      } else {
        var akeys = Object.keys(lhs);
        var pkeys = Object.keys(rhs);
        akeys.forEach(function(k, i) {
          var other = pkeys.indexOf(k);
          if (other >= 0) {
            deepDiff(lhs[k], rhs[k], changes, prefilter, currentPath, k, stack, null,inArray);
            pkeys = arrayRemove(pkeys, other);
          } else {
            deepDiff(lhs[k], undefined, changes, prefilter, currentPath, k, stack, null, inArray);
          }
        });
        pkeys.forEach(function(k) {
          deepDiff(undefined, rhs[k], changes, prefilter, currentPath, k, stack, null, inArray);
        });
      }
      stack.length = stack.length - 1;
    } else if (lhs !== rhs) {
      // lhs is contains a cycle at this element and it differs from rhs
      if (inArray){
        var i = currentPath.shift();
        changes(new DiffArray(currentPath, i, new DiffEdit(undefined, lhs, rhs)));
      }else{
        changes(new DiffEdit(currentPath, lhs, rhs));
      }
    }
  } else if (lhs !== rhs) {
    if (!(ltype === 'number' && isNaN(lhs) && isNaN(rhs))) {
      if (inArray){
        var i = currentPath.shift();
        changes(new DiffArray(currentPath, i, new DiffEdit(undefined, lhs, rhs)));
      }else{
        changes(new DiffEdit(currentPath, lhs, rhs));
      }
    }
  }
}

function accumulateDiff(lhs, rhs, prefilter, accum) {
  accum = accum || [];
  deepDiff(lhs, rhs,
    function(diff) {
      if (diff) {
        accum.push(diff);
      }
    },
    prefilter);
  return (accum.length) ? accum : undefined;
}

function applyArrayChange(arr, index, change) {
  if (change.path && change.path.length) {
    var it = arr[index],
      i, u = change.path.length - 1;
    for (i = 0; i < u; i++) {
      it = it[change.path[i]];
    }
    switch (change.kind) {
      case 'A':
        applyArrayChange(it[change.path[i]], change.index, change.item);
        break;
      case 'D':
        delete it[change.path[i]];
        break;
      case 'E':
      case 'N':
        it[change.path[i]] = change.rhs;
        break;
    }
  } else {
    switch (change.kind) {
      case 'A':
        applyArrayChange(arr[index], change.index, change.item);
        break;
      case 'D':
        arr = arrayRemove(arr, index);
        break;
      case 'E':
      case 'N':
        arr[index] = change.rhs;
        break;
    }
  }
  return arr;
}

function applyChange(target, source, change) {
  if (target && source && change && change.kind) {
    var it = target,
      i = -1,
      last = change.path ? change.path.length - 1 : 0;
    while (++i < last) {
      if (typeof it[change.path[i]] === 'undefined') {
        it[change.path[i]] = (typeof change.path[i] === 'number') ? [] : {};
      }
      it = it[change.path[i]];
    }
    switch (change.kind) {
      case 'A':
        applyArrayChange(change.path ? it[change.path[i]] : it, change.index, change.item);
        break;
      case 'D':
        delete it[change.path[i]];
        break;
      case 'E':
      case 'N':
        it[change.path[i]] = change.rhs;
        break;
    }
  }
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function extractChange(target,source, key, change){
  if (source && change && change.kind) {
    var it,
      i = -1,
      last = change.path ? change.path.length - 1 : 0,
      isArray = false,
      finalChange;
    switch (change.kind) {
      case 'A':
        isArray = true;
        break;
      case 'D':
        it = target.delete;
        finalChange = change;
        break;
      case 'E':
        it = target.update;
        finalChange = change;
        break;
      case 'N':
        it = target.insert;
        finalChange = change;
        break;
    }
    if (isArray){
      if (change.path && change.path.length > 0){
        var pk = source[change.index][key];
        for (var k = 0; k< target.update.length; k++){
          if (pk == target.update[k][key]){
            it = target.update[k];
            break;
          }
        }
        if (!it){
          it = {};
          it[key] = pk;
          it['ts'] = source[change.index]['ts'];
          target.update.push(it);
        }
        finalChange = change.item;
        finalChange.path = change.path;        
      }else if (change.item.kind == 'N'){
        it = target.insert;
        it.push(change.item.rhs);
      }else if (change.item.kind == 'D'){
        it = target.delete;
        var item = {}
        item[key] = change.item.lhs[key];
        if (change.item.lhs['ts'])
          item['ts'] = change.item.lhs['ts'];
        it.push(item);
      }else{
        console.log('TODO: 003');
      }        
    }else{
      it[key] = source[key];
      if (source['ts'])
        it.ts = source.ts;      
    }

    while (++i < last) {
      if (typeof it[change.path[i]] === 'undefined') {
        it[change.path[i]] = (typeof change.path[i] === 'number') ? [] : {};
      }
      it = it[change.path[i]];
    }

    if (finalChange){
      switch (finalChange.kind) {
      // case 'A':
      //   extractArrayChange(change.path ? it[change.path[i]] : it, change.index, change.item);
      //   break;
      case 'D':
        it[finalChange.path[i]] = finalChange.lhs;
        break;
      case 'E':
      case 'N':
        it[finalChange.path[i]] = finalChange.rhs;
        break;
      }
    } 
  }
}

/**
 * 对新增的行生成rowId
 */
function genRowId(target,key){
  target.forEach(function(item){
    if (!item[key]){
      item._rowid = guid();
    }
  })
}

/**
 * 获取差异数据
 * @param {*} lhs 源数据
 * @param {*} rhs 修改后数据
 * @param {*} key 主键字段
 */
function extractDiff(lhs, rhs, key){
  // var key = 'spk';
  // var rowId = 1;
  function bodySort(item1,item2){
    // if (!item2[key]){
    //   item2.rowId = rowId ++;
    // }
    if (!item1[key])
      return -1
    else
      return item1[key].localeCompare(item2[key]);
  }

  var target;
  if (!Array.isArray(rhs)){
    target = {
      insert:{},
      delete:{},
      update:{}
    };
  }else{
    target = {
      insert:[],
      delete:[],
      update:[]
    };
    lhs = lhs.sort(bodySort);
    rhs = rhs.sort(bodySort);
    genRowId(rhs,key);    
  }
  
  deepDiff(lhs, rhs,function(change){
    extractChange(target,lhs,key,change);
  },null,null,null,null,key);
  // console.log(target);
  return target;
}

function compareChange(target,rhs, key, change){
  if (rhs && change && change.kind) {
    var it,
      i = -1,
      last = change.path ? change.path.length - 1 : 0,
      isArray = false,
      finalChange;
    switch (change.kind) {
      case 'A':
        isArray = true;
        break;
      case 'D':
      case 'E':
      case 'N':
        it = target;
        finalChange = change;
        break;
    }
    if (isArray){
      if (change.path && change.path.length > 0){
        it = target[change.index];
        it.status = 'edit';
        finalChange = change.item;
        finalChange.path = change.path;
      }else if (change.item.kind == 'N'){
        change.item.rhs.status = 'new';
        target.push(change.item.rhs);
      }else if (change.item.kind == 'D'){
        target[change.index].status = 'del';
      }else{
        console.log('TODO: 003');
      }
    }
    while (++i < last) {
      if (typeof it[change.path[i]] === 'undefined') {
        it[change.path[i]] = (typeof change.path[i] === 'number') ? [] : {};
      }
      it = it[change.path[i]];
    }
    if (finalChange){
      switch (finalChange.kind) {
        case 'D':
          var obj = {oldValue: it[finalChange.path[i]],newValue: null};
          it[finalChange.path[i]] = obj
          // it[change.path[i]].isDelete = true;
          break;
        case 'E':
          var obj = {oldValue: it[finalChange.path[i]],newValue: finalChange.rhs};
          it[finalChange.path[i]] = obj;
          it.status = 'edit';
          break;
        case 'N':
          var obj = {oldValue: null,newValue: finalChange.rhs};
          it[finalChange.path[i]] = obj
          break;
      }
    }
  } 
  // return target; 
}

function getCompareData(lhs, rhs, key){
  function bodySort(item1,item2){
    return item1[key].localeCompare(item2[key]);
  }
  var target;
  if (Array.isArray(rhs)){
    lhs = lhs.sort(bodySort);
    rhs = rhs.sort(bodySort);
  }
  target = JSON.parse(JSON.stringify(lhs));
  deepDiff(lhs, rhs,function(change){
    compareChange(target,rhs,key,change);
  },null,null,null,null,key);
  // console.log(target);
  return target;
}



function revertArrayChange(arr, index, change) {
  if (change.path && change.path.length) {
    // the structure of the object at the index has changed...
    var it = arr[index],
      i, u = change.path.length - 1;
    for (i = 0; i < u; i++) {
      it = it[change.path[i]];
    }
    switch (change.kind) {
      case 'A':
        revertArrayChange(it[change.path[i]], change.index, change.item);
        break;
      case 'D':
        it[change.path[i]] = change.lhs;
        break;
      case 'E':
        it[change.path[i]] = change.lhs;
        break;
      case 'N':
        delete it[change.path[i]];
        break;
    }
  } else {
    // the array item is different...
    switch (change.kind) {
      case 'A':
        revertArrayChange(arr[index], change.index, change.item);
        break;
      case 'D':
        arr[index] = change.lhs;
        break;
      case 'E':
        arr[index] = change.lhs;
        break;
      case 'N':
        arr = arrayRemove(arr, index);
        break;
    }
  }
  return arr;
}

function revertChange(target, source, change) {
  if (target && source && change && change.kind) {
    var it = target,
      i, u;
    u = change.path.length - 1;
    for (i = 0; i < u; i++) {
      if (typeof it[change.path[i]] === 'undefined') {
        it[change.path[i]] = {};
      }
      it = it[change.path[i]];
    }
    switch (change.kind) {
      case 'A':
        // Array was modified...
        // it will be an array...
        revertArrayChange(it[change.path[i]], change.index, change.item);
        break;
      case 'D':
        // Item was deleted...
        it[change.path[i]] = change.lhs;
        break;
      case 'E':
        // Item was edited...
        it[change.path[i]] = change.lhs;
        break;
      case 'N':
        // Item is new...
        delete it[change.path[i]];
        break;
    }
  }
}

function applyDiff(target, source, filter) {
  if (target && source) {
    var onChange = function(change) {
      if (!filter || filter(target, source, change)) {
        applyChange(target, source, change);
      }
    };
    deepDiff(target, source, onChange);
  }
}

function mergeDiff(target, changes, key){
  if (Array.isArray(changes)){
    changes.forEach(function(changeItem){
      for (var i = 0; i < target.length; i++){
        var targetItem = target[i];
        if ((changeItem._rowid && changeItem._rowid === targetItem._rowid) || changeItem[key] === targetItem[key]){
          commonUtils.extend(targetItem, changeItem);
          break;
        }
      }
    })
  }else{
    commonUtils.extend(target, changes);
  }
  return target;
}

export default {
  diff: accumulateDiff,
  observableDiff: deepDiff,
  applyDiff: applyDiff,
  applyChange: applyChange,
  extractChange: extractChange,
  extractDiff: extractDiff,
  revertChange:revertChange,
  getCompareData:getCompareData,
  genRowId: genRowId,
  mergeDiff:mergeDiff
}