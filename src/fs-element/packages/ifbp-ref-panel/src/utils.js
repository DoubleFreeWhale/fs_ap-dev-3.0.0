/**
 *
 * @param {Object} vm Vue instance
 * @return {Object} resData strFieldCode, strFieldName, frequentlyUsedRef
 */
function getFrequentlyUsedRefs(vm) {
  // init params passed in
  const refInfo = vm.refInfo;
  const templateValue = vm.templateValue;
  const refCode = refInfo.refCode;
  let queryParams = vm.queryParams;
  let lazyTree = false;
  if (refInfo.isLazyload === true) {
    lazyTree = true;
  }
  // format request data
  let requestData = {
    pageSize: 0,
    refcode: refCode
  };
  // condition
  if (templateValue && templateValue['base_doc_type']) {
    requestData.condition = templateValue['base_doc_type'];
  }
  // transmitParam
  if (queryParams && JSON.stringify(queryParams) !== '{}') {
    if (lazyTree) {
      queryParams = queryParams || {};
      queryParams.lazy_param = null;
      queryParams.lazy_object = null;
    }
    requestData.transmitParam = JSON.stringify(queryParams);
  }
  return new Promise((resolve, reject) => {
    vm.$http({
      url: '/uitemplate_web/uitemplate_ctr/mdadptor_ctr/queryRefHotspotInfo',
      method: 'post',
      data: requestData,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (!res || !res.data) {
        return resolve({
          frequentlyUsedRef: []
        });
      }
      if (!res.data.success && res.data.error) {
        return reject(res.data.error.errorMessage || '');
      }
      let resData = res.data.data;
      if (!Array.isArray(resData) || !resData.length) {
        return resolve({
          frequentlyUsedRef: []
        });
      }
      let refBeanMap = resData[0].beanMap;
      if (!refBeanMap) {
        return resolve({
          frequentlyUsedRef: []
        });
      }
      // 常用 table 的列属性和名称
      let returnData = {};
      const strFieldCode = resData[0].strFieldCode;
      const strFieldName = resData[0].strFieldName;
      if (Array.isArray(strFieldCode) && Array.isArray(strFieldName) && strFieldCode.length === strFieldName.length) {
        returnData.strFieldCode = strFieldCode;
        returnData.strFieldName = strFieldName;
      }
      let refs = refBeanMap[refCode + '_ref'];
      if (Object.prototype.toString.call(refs) === '[object Object]') {
        let refsArr = Object.values(refs) || [];
        if (refInfo.refUIType === 'RefTree') {
          refsArr.forEach(ref => {
            if (ref) {
              ref.pid = 'null'; // 全部置为根节点
              let reflabel = ref.code || ''; // show label for tree
              reflabel += ' ';
              reflabel += ref.name || '';
              ref.reflabel = reflabel;
            }
          });
        }
        returnData.frequentlyUsedRef = refsArr;
      } else {
        returnData.frequentlyUsedRef = [];
      }
      return resolve(returnData);
    }).catch(err => {
      return reject(err);
    });
  });
}

/**
 * format data for tree ref
 * @param {Array} data ref data
 * @param {Boolean} lazyTree whether for lazyload tree or not
 */
function formatTreeData(data, lazyTree) {
  var refData;
  var map = {};
  var ids = [];
  var root = [];
  data.forEach(v => {
    ids.push(v.id);
    v.reflabel = v.refcode ? v.refcode + ' ' + v.refname : v.refname;
    if (lazyTree) {
      v.fe_isLeaf = v.isLeaf === 'true';
    }
  });
  data.forEach(v => {
    if (ids.indexOf(v.pid) > -1) {
      if (map[v.pid]) {
        map[v.pid].push(v);
      } else {
        map[v.pid] = [v];
      }
    } else {
      root.push(v);
    }
  });
  var setChild = function(node) {
    var tmp = node;
    if (map[tmp.id]) {
      tmp.children = map[tmp.id];
      tmp.children.forEach(v => {
        setChild(v);
      });
    }
  };
  root.forEach(v => {
    setChild(v);
  });
  refData = root;
  return refData;
}

export default {
  getFrequentlyUsedRefs,
  formatTreeData
};
