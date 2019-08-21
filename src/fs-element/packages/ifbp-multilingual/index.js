import IfbpMultilingual from './src/ifbp-multilingual';

/* istanbul ignore next */
IfbpMultilingual.install = function(Vue) {
  Vue.component(IfbpMultilingual.name, IfbpMultilingual);
};

export default IfbpMultilingual;
