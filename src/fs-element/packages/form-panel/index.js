import ElFormPanel from '../form/src/form-panel';

/* istanbul ignore next */
ElFormPanel.install = function(Vue) {
  Vue.component(ElFormPanel.name, ElFormPanel);
};

export default ElFormPanel;
