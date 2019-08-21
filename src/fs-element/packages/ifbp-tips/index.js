import IfbpTips from './src/ifbp-tips';

/* istanbul ignore next */
IfbpTips.install = function(Vue) {
  Vue.component(IfbpTips.name, IfbpTips);
};

export default IfbpTips;
