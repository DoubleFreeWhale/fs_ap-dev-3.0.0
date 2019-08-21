import ElNumber from './src/number';

/* istanbul ignore next */
ElNumber.install = function(Vue) {
  Vue.component(ElNumber.name, ElNumber);
};

export default ElNumber;
