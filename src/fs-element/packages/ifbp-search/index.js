import IfbpSearch from './src/ifbp-search';

/* istanbul ignore next */
IfbpSearch.install = function(Vue) {
  Vue.component(IfbpSearch.name, IfbpSearch);
};

export default IfbpSearch;
