import ElRef from './src/ref';

/* istanbul ignore next */
ElRef.install = function(Vue) {
  Vue.component(ElRef.name + '-backup', ElRef);
};

export default ElRef;
