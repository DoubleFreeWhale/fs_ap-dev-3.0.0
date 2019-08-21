import ElFormula from './src/formula';

/* istanbul ignore next */
ElFormula.install = function(Vue) {
  Vue.component(ElFormula.name, ElFormula);
};

export default ElFormula;
