import IfbpTooltip from './src/toolTip';

/* istanbul ignore next */
IfbpTooltip.install = function(Vue) {
  Vue.component(IfbpTooltip.name, IfbpTooltip);
};

export default IfbpTooltip;
