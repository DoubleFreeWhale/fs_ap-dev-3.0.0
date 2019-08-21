import IfbpTemplate from './src/template';

/* istanbul ignore next */
IfbpTemplate.install = function(Vue) {
  Vue.component(IfbpTemplate.name, IfbpTemplate);
};

export default IfbpTemplate;
