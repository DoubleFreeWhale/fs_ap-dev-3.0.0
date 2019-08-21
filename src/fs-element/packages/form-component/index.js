import ElFormComponent from './src/form-component';

/* istanbul ignore next */
ElFormComponent.install = function(Vue) {
  Vue.component(ElFormComponent.name, ElFormComponent);
};

export default ElFormComponent;
