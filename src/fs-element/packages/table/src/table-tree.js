// 格式化树表数据
function formatTreeData(data, parentLevel, states) {
  debugger
  data = data || [];
  let resultData = [];
  data.forEach(row => {
    if (row._showTreeIcon === false || (!isLazyTree && (!Array.isArray(row.children) || !row.children.length))) {
      row._showTreeIcon = false;
    }
    resultData.push(row);
  });
  setTreeLevel(resultData, parentLevel);
  setTreeNodeId(resultData, states);
  if (states.treeLevel || states.expandTreeAll) {
    setTreeIcon(resultData);
  }
  return resultData;
}

// 格式化展开数据
function transExpandData(data, level) {  
  data = data || [];  
  var resultData = [];
  let formatData = function(data, level) {
    data.forEach((item) => {
      resultData.push(item);
      if (item.hasOwnProperty('children') && item.children.length > 0) {      
        let temp;
        let children = setParentId(item.children, item._treeNodeId);
        if (!level) {        
          temp = formatData(children);        
        } else if (item._treeLevel < level) {
          temp = formatData(children, level);
          item._treeExpanded = true;        
        }        
      } else {
        item._treeExpanded = true; 
      }
    });
  };
  formatData(data, level);
  return resultData;
};

// 设置树表的层级, 用于空格占位符和展开 icon
function setTreeLevel(data, level) {
  let _treeLevel = typeof level === 'number' ? (level + 1) : 0;
  data.forEach(row => {
    row._treeExpanded = false;
    row._treeLevel = _treeLevel;
    if (row.children && row.children.length) {
      setTreeLevel(row.children, _treeLevel);
    }
  });
}

function setTreeNodeId(data, states) {
  let _treeNodeId = typeof states.lastTreeNodeId === 'number' ? (states.lastTreeNodeId + 1) : 0;
  let _setTreeNodeId = function(_data) {
    _data = _data || [];
    _data.forEach(row => {
      row._treeNodeId = _treeNodeId;
      _treeNodeId++;
      states.lastTreeNodeId = _treeNodeId;
      if (row.children && row.children.length) {
        _setTreeNodeId(row.children);
      }
    });
  };
  _setTreeNodeId(data);
}

function setTreeIcon(data) {
  let _setTreeIcon = function(_data) {
    _data = _data || [];
    _data.forEach(row => {
      row._isFolder = true;
      if (row.children && row.children.length) {
        _setTreeIcon(row.children);
      }
    });
  };
  _setTreeIcon(data);
}

// 展开时为子节点设置父节点 parentId
function setParentId(children, parentId) {
  children.forEach(child => {
    if (!child._treeParentNodeIds) {
      child._treeParentNodeIds = [];
    }
    if (child._treeParentNodeIds.indexOf(parentId) === -1) {
      child._treeParentNodeIds.push(parentId);
    }
    // 收起所有子节点
    child._treeExpanded = false;
    if (child.children && child.children.length) {
      setParentId(child.children, parentId);
    }
  });
  return children;
}

function transDataToTree(data, properties) {
  if (!properties.id || !properties.pid) {
    return data;
  }
  var resultData = [];
  var idField = properties.id;
  var pidField = properties.pid;

  let group = function(nodes) {
    var groups = {};
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i][pidField]) {
        if (groups[nodes[i][pidField]]) {
          groups[nodes[i][pidField]].push(nodes[i]);
        } else {
          groups[nodes[i][pidField]] = [];
          groups[nodes[i][pidField]].push(nodes[i]);
        }
      } else {
        groups['root$#@_'] = groups['root$#@_'] || [];
        groups['root$#@_'].push(nodes[i]);
      }
    }
    return groups;
  };

  var groups = group(data);
  let getChildren = function(groups, id) {
    var nowGroup = groups[id];
    var children = [];
    if (nowGroup) {
      for (var i = 0; i < nowGroup.length; i++) {
        var nowNode = nowGroup[i];
        var nowId = nowNode[idField];
        var child = JSON.parse(JSON.stringify(nowNode));
        child.children = getChildren(groups, nowId);
        children.push(child);
      }
    }
    delete groups[id];
    return children;
  };

  resultData = getChildren(groups, 'root$#@_');

  for (var key in groups) {
    resultData = resultData.concat(getChildren(groups, key));
  }

  return resultData;
}


// 渲染模式为树表时, 检查是否需要格式化树表结构
function checkIfFormatNeeded(data, treeProperties) {
  if (!treeProperties) {
    treeProperties = {
      id: 'id',
      pid: 'pid',
      children: 'children'
    };
  }
  let idLabel = treeProperties.id || 'id';
  let pidLabel = treeProperties.pid || 'pid';
  let childrenLabel = treeProperties.children || 'children';
  let needFormat = true;
  data.forEach(item => {
    if (typeof item._showTreeIcon !== 'boolean') {
      item._showTreeIcon = true;
    }
    if (item.isLeaf === true) {
      item._showTreeIcon = false;
    }
    // data 中存在 children 字段, 则不需要格式化数据
    if (item[childrenLabel]) {
      needFormat = false;
    }
    // data 中不存在 id, pid 字段, 则不进行格式化
    if (typeof item[idLabel] === 'undefined' || typeof item[pidLabel] === 'undefined') {
      needFormat = false;
    }
  });
  return needFormat;
}

export default {
  formatTreeData,
  transExpandData,
  setParentId,
  transDataToTree,
  checkIfFormatNeeded
};
