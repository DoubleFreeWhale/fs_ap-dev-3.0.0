import ElSearchForm from './src/search-form';

/* istanbul ignore next */
ElSearchForm.install = function(Vue) {
  Vue.component(ElSearchForm.name, ElSearchForm);
};

export default ElSearchForm;
