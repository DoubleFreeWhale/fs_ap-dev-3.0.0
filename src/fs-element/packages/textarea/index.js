import ElTextarea from './src/textarea';

/* istanbul ignore next */
ElTextarea.install = function(Vue) {
  Vue.component(ElTextarea.name, ElTextarea);
};

export default ElTextarea;
