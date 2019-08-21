import IfbpPanel from '../ifbp-panel-group/src/ifbp-panel';

/* istanbul ignore next */
IfbpPanel.install = function(Vue) {
  Vue.component(IfbpPanel.name, IfbpPanel);
};

export default IfbpPanel;
